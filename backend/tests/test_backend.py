from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.audit_service import audit_service
from backend.app.database import db

client = TestClient(app)

def test_health_and_cases():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert data["data_mode"] == "SIMULATION"

    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 5
    primary = next(c for c in cases if c["case_id"] == "CASE-2026-041")
    assert primary["amount_inr"] == 75000.0
    assert primary["utr"] == "UPI202608280001"

def test_graph_and_mule_scoring():
    res = client.get("/api/cases/CASE-2026-041/graph")
    assert res.status_code == 200
    graph_data = res.json()
    assert "nodes" in graph_data
    assert "edges" in graph_data
    nodes = graph_data["nodes"]
    assert len(nodes) == 4
    
    cashout_node = next(n for n in nodes if n["node_id"] == "node_cashout")
    assert cashout_node["risk_score"] > 0.90
    assert "Terminal Cash-Out Target" in cashout_node["flags"]

def test_spatial_forecast_and_factors():
    res = client.get("/api/cases/CASE-2026-041/forecast")
    assert res.status_code == 200
    forecast = res.json()
    assert forecast["case_id"] == "CASE-2026-041"
    assert len(forecast["top_zones"]) == 3
    
    top_zone = forecast["top_zones"][0]
    assert "FC Road" in top_zone["zone_label"]
    assert top_zone["ranking_score"] >= 0.80
    assert len(top_zone["factors"]) >= 3
    assert top_zone["radius_m"] > 1000

def test_audit_hash_chain_integrity():
    res = client.get("/api/audit/verify")
    assert res.status_code == 200
    verify_data = res.json()
    assert verify_data["chain_valid"] is True
    assert verify_data["total_events"] >= 3

def test_scenario_replay_progression():
    res = client.get("/api/cases/CASE-2026-041/replay?step=0")
    assert res.status_code == 200
    step0 = res.json()
    assert step0["current_step"] == 0
    assert len(step0["graph_nodes"]) == 1
    assert step0["forecast"] is None
    
    res = client.get("/api/cases/CASE-2026-041/replay?step=3")
    assert res.status_code == 200
    step3 = res.json()
    assert step3["current_step"] == 3
    assert len(step3["graph_nodes"]) == 4
    assert step3["forecast"] is not None

    res = client.get("/api/cases/CASE-2026-041/replay?step=5")
    assert res.status_code == 200
    step5 = res.json()
    assert step5["withdrawal_revealed"] is not None
    assert step5["withdrawal_revealed"]["atm_id"] == "ATM-PUN-204"

def test_action_approval_workflow():
    res = client.get("/api/cases/CASE-2026-041/actions")
    assert res.status_code == 200
    actions = res.json()
    assert len(actions) > 0
    assert actions[0]["status"] in ["APPROVED", "ACKNOWLEDGED"]
