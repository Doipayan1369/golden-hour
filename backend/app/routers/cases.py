from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..schemas.models import (
    Case, SeverityLevel, CaseStatus, IntakeValidationResponse, 
    TraceRequestPayload, AccountNode, TransactionEdge, NodeType, EdgeStatus
)
from ..database import db
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/cases", tags=["Cases"])

@router.get("", response_model=List[Case])
def list_cases(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    results = list(db.cases.values())
    if severity and severity != "ALL":
        results = [c for c in results if c.severity.value == severity]
    if status and status != "ALL":
        results = [c for c in results if c.status.value == status]
    if search:
        s = search.lower()
        results = [c for c in results if s in c.case_id.lower() or s in c.utr.lower() or s in c.fraud_type.lower() or s in c.jurisdiction.lower()]
    
    severity_order = {"CRITICAL": 0, "HIGH": 1, "ELEVATED": 2, "MONITORING": 3}
    results.sort(key=lambda x: (severity_order.get(x.severity.value, 4), x.data_freshness_minutes))
    return results

@router.get("/{case_id}", response_model=Case)
def get_case(case_id: str):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return db.cases[case_id]

@router.post("/validate-intake", response_model=IntakeValidationResponse)
def validate_intake(payload: Dict[str, Any]):
    errors = []
    warnings = []
    
    utr = payload.get("utr", "").strip()
    amount = payload.get("amount_inr")
    case_id = payload.get("case_id", "").strip()
    
    if not utr:
        errors.append("UTR / Transaction Reference is required as complaint anchor.")
    if not amount or float(amount) <= 0:
        errors.append("Amount must be a positive number in INR.")
    if not payload.get("source_institution"):
        errors.append("Source Institution (Bank/Intermediary) is required.")

    # Duplicate detection (Section 5.2 / M-04)
    duplicate_case = next((c.case_id for c in db.cases.values() if c.utr.lower() == utr.lower()), None)
    if duplicate_case:
        warnings.append(f"UTR {utr} already anchored to existing case {duplicate_case}.")

    is_valid = len(errors) == 0
    return IntakeValidationResponse(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings,
        duplicate_case_id=duplicate_case,
        normalized_data=payload if is_valid else None
    )

@router.post("/intake", response_model=Case)
def create_intake(payload: dict):
    # Validate first
    validation = validate_intake(payload)
    if not validation.is_valid:
        raise HTTPException(status_code=400, detail=validation.errors[0])

    case_id = payload.get("case_id") or f"CASE-2026-{len(db.cases)+41:03d}"
    amount = float(payload.get("amount_inr", 50000.0))
    utr = payload.get("utr", f"UPI20260827{len(db.cases):04d}")
    victim_token = payload.get("victim_account_token") or f"acct_victim_{len(db.cases)+1:03d}"

    new_case = Case(
        case_id=case_id,
        source=payload.get("source", "NCRP_1930"),
        created_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        jurisdiction=payload.get("jurisdiction", "Gurugram North / Sector 14"),
        severity=SeverityLevel(payload.get("severity", "HIGH")),
        status=CaseStatus.ANCHORED,
        fraud_type=payload.get("fraud_type", "UPI Impersonation / QR Scam"),
        amount_inr=amount,
        utr=utr,
        source_institution=payload.get("source_institution", "Bank A"),
        victim_account_token=victim_token,
        victim_phone_token=payload.get("victim_phone_token", "+91-XXXXX-9900"),
        victim_name_masked=payload.get("victim_name_masked", "Citizen Complainant"),
        data_freshness_minutes=0,
        priority_score=0.78,
        timeline_summary=[f"{datetime.now().strftime('%H:%M')} - 1930 Complaint Intake Recorded (UTR: {utr})"]
    )
    db.cases[case_id] = new_case

    # Initialize victim node
    db.nodes[case_id] = [
        AccountNode(
            node_id=f"node_{case_id}_vic",
            institution_id="SRC_BANK",
            institution_name=new_case.source_institution,
            account_token=new_case.victim_account_token,
            node_type=NodeType.VICTIM,
            first_seen=new_case.created_at,
            last_seen=new_case.created_at,
            risk_score=0.05,
            total_received_inr=0.0,
            total_forwarded_inr=amount,
            flags=["Victim Anchor", "Reported via 1930"]
        )
    ]
    db.edges[case_id] = []
    
    audit_service.log_event(
        case_id=case_id,
        actor_id=payload.get("officer_id", "OFFICER-DUTY-1"),
        actor_role="I4C_STATE_ANALYST",
        action="CREATE_COMPLAINT_INTAKE",
        payload={"case_id": case_id, "utr": new_case.utr, "amount": new_case.amount_inr}
    )
    return new_case

@router.post("/{case_id}/trace/request")
def request_trace_hop(case_id: str, payload: TraceRequestPayload):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail="Case not found")

    hop_num = len(db.edges.get(case_id, [])) + 1
    # Add pending edge
    pending_edge = TransactionEdge(
        edge_id=f"edge_{case_id}_hop_{hop_num}_req",
        case_id=case_id,
        source_node=f"node_{case_id}_m{hop_num-1}" if hop_num > 1 else f"node_{case_id}_vic",
        target_node=f"node_{case_id}_m{hop_num}_pending",
        amount_inr=db.cases[case_id].amount_inr,
        occurred_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        utr=f"REQ-{payload.target_institution}-{datetime.now().strftime('%M%S')}",
        status=EdgeStatus.PENDING,
        source_ref=f"REQ_TRACE_{payload.target_institution}",
        source_institution="Prior Hop Bank",
        destination_institution=payload.target_institution,
        hop_order=hop_num,
        request_owner=payload.officer_id,
        request_timer_mins=15
    )
    if case_id not in db.edges:
        db.edges[case_id] = []
    db.edges[case_id].append(pending_edge)
    db.cases[case_id].status = CaseStatus.ENRICHING

    audit_service.log_event(
        case_id=case_id,
        actor_id=payload.officer_id,
        actor_role="I4C_STATE_ANALYST",
        action="DISPATCH_TRACE_REQUEST",
        payload={"target": payload.target_institution, "scope": payload.requested_scope, "reason": payload.reason}
    )
    return {"status": "REQUEST_DISPATCHED", "edge": pending_edge}

@router.post("/reset/database")
def reset_database():
    db.seed_all()
    return {"status": "SUCCESS", "message": "Database and scenarios reset to verified PRD seed state"}
