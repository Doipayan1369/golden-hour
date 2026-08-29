from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import datetime
from ..schemas.models import AuditEvent, AuditVerification, Feedback
from ..services.audit_service import audit_service
from ..database import db

router = APIRouter(prefix="/api/audit", tags=["Audit & Feedback"])

@router.get("", response_model=List[AuditEvent])
def get_audit_trail(case_id: Optional[str] = Query(None)):
    return audit_service.get_events(case_id)

@router.get("/verify", response_model=AuditVerification)
def verify_hash_chain():
    return audit_service.verify_chain()

@router.post("/feedback", response_model=Feedback)
def submit_feedback(payload: dict):
    case_id = payload.get("case_id", "CASE-2026-041")
    fb = Feedback(
        feedback_id=f"FB-{len(db.feedback.get(case_id, []))+1:03d}",
        case_id=case_id,
        officer_id=payload.get("officer_id", "OFFICER-774"),
        officer_role=payload.get("officer_role", "LOCAL_BEAT_OFFICER"),
        rating=payload.get("rating", "USEFUL"),
        comment=payload.get("comment", "Sector 14 ATM cluster matched physical withdrawal location with 15min advance alert."),
        submitted_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30")
    )
    if case_id not in db.feedback:
        db.feedback[case_id] = []
    db.feedback[case_id].append(fb)

    audit_service.log_event(
        case_id=case_id,
        actor_id=fb.officer_id,
        actor_role=fb.officer_role,
        action="SUBMIT_OFFICER_FEEDBACK",
        payload={"feedback_id": fb.feedback_id, "rating": fb.rating, "comment": fb.comment}
    )
    return fb
