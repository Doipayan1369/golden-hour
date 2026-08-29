from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..schemas.models import ReplayState, ScenarioCatalogItem
from ..services.scenario_player import scenario_player
from ..services.audit_service import audit_service
from ..database import db

router = APIRouter(prefix="/api", tags=["Replay Simulator & Scenario Catalog"])

@router.get("/scenarios", response_model=List[ScenarioCatalogItem])
def list_scenarios(category: Optional[str] = None):
    if category and category != "ALL":
        return [s for s in db.scenarios if s.category == category]
    return db.scenarios

@router.get("/cases/{case_id}/replay", response_model=ReplayState)
def get_replay(case_id: str, step: Optional[int] = None):
    return scenario_player.get_replay_state(case_id, step)

@router.post("/cases/{case_id}/replay/step", response_model=ReplayState)
def advance_replay_step(case_id: str, payload: dict):
    step_idx = payload.get("step_index", 0)
    actor_id = payload.get("actor_id", "DEMO_OPERATOR")
    
    state = scenario_player.get_replay_state(case_id, step_idx)
    
    audit_service.log_event(
        case_id=case_id,
        actor_id=actor_id,
        actor_role="I4C_STATE_ANALYST",
        action=f"REPLAY_STEP_{step_idx}",
        payload={"step": step_idx, "title": state.step_title, "time": state.step_time}
    )
    return state

@router.post("/cases/{case_id}/replay/reset", response_model=ReplayState)
def reset_replay(case_id: str):
    db.replay_positions[case_id] = 0
    return scenario_player.get_replay_state(case_id, 0)
