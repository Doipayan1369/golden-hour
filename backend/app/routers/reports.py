from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from ..schemas.models import ReportRecord
from ..database import db
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/reports", tags=["Reports & Exports"])

@router.get("", response_model=List[ReportRecord])
def get_reports():
    return db.reports

@router.post("/generate", response_model=ReportRecord)
def generate_report(payload: dict):
    case_id = payload.get("case_id", "CASE-2026-041")
    report_type = payload.get("report_type", "CASE_SUMMARY")
    created_by = payload.get("created_by", "Insp. R. Sharma")
    fmt = payload.get("format", "PDF")

    rep = ReportRecord(
        report_id=f"REP-{case_id}-{len(db.reports)+1:02d}",
        case_id=case_id,
        title=payload.get("title", f"Official Investigation Summary: {case_id}"),
        report_type=report_type,
        created_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        created_by=created_by,
        format=fmt,
        status="GENERATED",
        summary_text=payload.get("summary_text", f"Validated multi-hop fraud trail for {case_id}. SHA-256 audit verified.")
    )
    db.reports.append(rep)

    audit_service.log_event(
        case_id=case_id,
        actor_id=created_by,
        actor_role="I4C_STATE_ANALYST",
        action="GENERATE_CASE_REPORT",
        payload={"report_id": rep.report_id, "type": report_type, "format": fmt}
    )
    return rep
