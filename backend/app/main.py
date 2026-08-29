from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import cases, graph, forecast, actions, replay, audit, reports
from .services.supabase_service import supabase_service
from .database import db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Cybercrime Cash-Out Intelligence Console for I4C & Law Enforcement Agencies"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cases.router)
app.include_router(graph.router)
app.include_router(forecast.router)
app.include_router(actions.router)
app.include_router(replay.router)
app.include_router(audit.router)
app.include_router(reports.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "OPERATIONAL",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "data_mode": settings.DATA_MODE,
        "organization": settings.MHA_ORGANIZATION,
        "cases_count": len(db.cases),
        "atms_count": len(db.atms),
        "scenarios_count": len(db.scenarios)
    }

@app.get("/api/database/status")
def database_status():
    supabase_info = supabase_service.test_connection()
    return {
        "engine": "Supabase PostgreSQL" if supabase_service.is_connected() else "Local Resilient In-Memory + Supabase Schema",
        "supabase": supabase_info,
        "schema_file": "supabase_schema.sql",
        "total_cases_in_memory": len(db.cases),
        "total_atms": len(db.atms),
        "total_police_stations": len(db.police_stations)
    }
