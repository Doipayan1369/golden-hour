from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from ..schemas.models import ActionPacket, CaseStatus
from ..database import db
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api", tags=["Actions & Interventions"])

@router.get("/interventions", response_model=List[ActionPacket])
def list_interventions(
    status: Optional[str] = Query(None),
    case_id: Optional[str] = Query(None)
):
    all_actions = []
    for cid, packets in db.actions.items():
        all_actions.extend(packets)

    if status and status != "ALL":
        all_actions = [a for a in all_actions if a.status.upper() == status.upper()]
    if case_id:
        all_actions = [a for a in all_actions if a.case_id == case_id]

    all_actions.sort(key=lambda x: x.created_at, reverse=True)
    return all_actions

@router.get("/cases/{case_id}/actions", response_model=List[ActionPacket])
def get_case_actions(case_id: str):
    return db.actions.get(case_id, [])

@router.post("/cases/{case_id}/actions", response_model=ActionPacket)
def create_action(case_id: str, payload: dict):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail="Case not found")

    action_id = f"ACT-{case_id}-{len(db.actions.get(case_id, []))+1:02d}"
    packet = ActionPacket(
        action_id=action_id,
        case_id=case_id,
        action_type=payload.get("action_type", "BEAT_PATROL_ALERT"),
        target_recipients=payload.get("target_recipients", ["Sector 14 Beat Units", "Bank D Nodal Officer"]),
        suggested_action=payload.get("suggested_action", "Deploy visual patrol to Sector 14 ATM cluster & trigger emergency ATM fraud hold at Bank D switch"),
        priority_zone=payload.get("priority_zone", "Sector 14 Transit & Commercial Corridor"),
        expected_window=payload.get("expected_window", "10:25 - 10:40"),
        created_by=payload.get("created_by", "Insp. R. Sharma (I4C Analyst)"),
        created_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        status="DRAFT"
    )

    if case_id not in db.actions:
        db.actions[case_id] = []
    db.actions[case_id].append(packet)

    audit_service.log_event(
        case_id=case_id,
        actor_id=packet.created_by,
        actor_role="I4C_STATE_ANALYST",
        action="DRAFT_ACTION_PACKET",
        payload={"action_id": action_id, "type": packet.action_type, "zone": packet.priority_zone}
    )
    return packet

@router.post("/actions/{action_id}/approve", response_model=ActionPacket)
def approve_action(action_id: str, payload: dict):
    found_packet = None
    target_case_id = None
    for cid, packets in db.actions.items():
        for p in packets:
            if p.action_id == action_id:
                found_packet = p
                target_case_id = cid
                break

    if not found_packet:
        target_case_id = "CASE-2026-041"
        found_packet = ActionPacket(
            action_id=action_id,
            case_id=target_case_id,
            action_type="BEAT_PATROL_ALERT",
            target_recipients=["Sector 14 Beat Units", "Bank D Nodal Officer"],
            suggested_action="Emergency Beat Patrol Dispatch to Sector 14 ATMs & Bank D debit card freeze",
            priority_zone="Sector 14 Transit Corridor",
            expected_window="10:25 - 10:40",
            created_by="Insp. R. Sharma",
            created_at=datetime.now().isoformat(),
            status="DRAFT"
        )
        if target_case_id not in db.actions:
            db.actions[target_case_id] = []
        db.actions[target_case_id].append(found_packet)

    approver = payload.get("approved_by", "DSP A. Verma (Duty Lead)")
    found_packet.approved_by = approver
    found_packet.approved_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30")
    found_packet.status = "APPROVED"

    if target_case_id and target_case_id in db.cases:
        db.cases[target_case_id].status = CaseStatus.ACTION_APPROVED

    audit_service.log_event(
        case_id=target_case_id or "CASE-2026-041",
        actor_id=approver,
        actor_role="LOCAL_BEAT_OFFICER",
        action="APPROVE_TACTICAL_DISPATCH",
        payload={"action_id": action_id, "approver": approver, "status": "APPROVED"}
    )
    return found_packet

@router.post("/actions/{action_id}/acknowledge", response_model=ActionPacket)
def acknowledge_action(action_id: str, payload: dict):
    for cid, packets in db.actions.items():
        for p in packets:
            if p.action_id == action_id:
                p.status = "ACKNOWLEDGED"
                p.acknowledgement_ref = payload.get("ref", f"ACK-UNIT-{datetime.now().strftime('%M%S')}")
                p.acknowledgement_by = payload.get("actor_id", "SI Vikram Singh (Patrol Lead)")
                p.acknowledgement_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30")
                if cid in db.cases:
                    db.cases[cid].status = CaseStatus.ACTION_ACKNOWLEDGED
                
                audit_service.log_event(
                    case_id=cid,
                    actor_id=p.acknowledgement_by,
                    actor_role="LOCAL_BEAT_OFFICER",
                    action="ACKNOWLEDGE_TACTICAL_ACTION",
                    payload={"action_id": action_id, "ref": p.acknowledgement_ref}
                )
                return p
    raise HTTPException(status_code=404, detail="Action packet not found")

@router.post("/actions/{action_id}/cancel", response_model=ActionPacket)
def cancel_action(action_id: str, payload: dict):
    reason = payload.get("reason", "Cancelled by duty officer after visual inspection")
    actor = payload.get("actor_id", "OFFICER-DUTY-1")
    for cid, packets in db.actions.items():
        for p in packets:
            if p.action_id == action_id:
                p.status = "REJECTED"
                p.cancellation_reason = reason
                
                audit_service.log_event(
                    case_id=cid,
                    actor_id=actor,
                    actor_role="LOCAL_BEAT_OFFICER",
                    action="CANCEL_TACTICAL_ACTION",
                    payload={"action_id": action_id, "reason": reason}
                )
                return p
    raise HTTPException(status_code=404, detail="Action packet not found")
