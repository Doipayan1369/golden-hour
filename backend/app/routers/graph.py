from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..schemas.models import AccountNode, TransactionEdge, EdgeStatus
from ..database import db
from ..services.graph_engine import graph_engine
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/cases", tags=["Graph"])

@router.get("/{case_id}/graph")
def get_case_graph(case_id: str):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail="Case not found")
    
    nodes = db.nodes.get(case_id, [])
    edges = db.edges.get(case_id, [])
    scored_nodes, metrics = graph_engine.analyze_mule_behavior(nodes, edges)

    return {
        "case_id": case_id,
        "nodes": scored_nodes,
        "edges": edges,
        "metrics": metrics
    }

@router.post("/{case_id}/hops/reveal")
def reveal_next_hop(case_id: str, payload: dict):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail="Case not found")

    hop_order = payload.get("hop_order", 1)
    # Log audit
    audit_service.log_event(
        case_id=case_id,
        actor_id=payload.get("actor_id", "BANK_GATEWAY"),
        actor_role="BANK_NODAL_INVESTIGATOR",
        action="REVEAL_TRANSACTION_HOP",
        payload={"hop_order": hop_order, "status": "CONFIRMED"}
    )
    return {"status": "HOP_REVEALED", "case_id": case_id, "hop_order": hop_order}
