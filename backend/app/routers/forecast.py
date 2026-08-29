from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.models import ForecastResponse, ATM, PoliceStation
from ..database import db
from ..services.graph_engine import graph_engine
from ..services.forecast_engine import forecast_engine
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api", tags=["Forecast & Geospatial"])

@router.get("/cases/{case_id}/forecast", response_model=ForecastResponse)
def get_case_forecast(case_id: str):
    if case_id not in db.cases:
        raise HTTPException(status_code=404, detail="Case not found")

    nodes = db.nodes.get(case_id, [])
    edges = db.edges.get(case_id, [])
    scored_nodes, _ = graph_engine.analyze_mule_behavior(nodes, edges)

    forecast = forecast_engine.generate_forecast(
        case_id=case_id,
        nodes=scored_nodes,
        edges=edges,
        all_atms=db.atms,
        current_time_str="10:12"
    )
    return forecast

@router.get("/atms", response_model=List[ATM])
def get_all_atms():
    return db.atms

@router.get("/police-stations", response_model=List[PoliceStation])
def get_all_police_stations():
    return db.police_stations
