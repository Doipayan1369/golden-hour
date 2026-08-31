from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.audit_service import audit_service

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
    assert primary["amount_inr"] == 450000.0
    assert "Pune" in primary["jurisdiction"]

def test_graph_and_mule_scoring():
    res = client.get("/api/cases/CASE-2026-041/graph")
    assert res.status_code == 200
    graph_data = res.json()
    assert "nodes" in graph_data
    assert "edges" in graph_data
    nodes = graph_data["nodes"]
    edges = graph_data["edges"]
    assert len(nodes) >= 15
    assert len(edges) >= 15
    
    # Check mule classifications
    mule_nodes = [n for n in nodes if "MULE" in n["node_type"] or n["node_type"] == "CASHOUT_DEST"]
    assert len(mule_nodes) >= 10
    terminal_node = next(n for n in nodes if n["node_type"] == "CASHOUT_DEST")
    assert terminal_node["risk_score"] >= 0.90

def test_spatial_forecast_and_factors():
    res = client.get("/api/cases/CASE-2026-041/forecast")
    assert res.status_code == 200
    forecast = res.json()
    assert "top_zones" in forecast
    assert len(forecast["top_zones"]) >= 1
    top_zone = forecast["top_zones"][0]
    assert "FC Road" in top_zone["zone_label"]
    assert top_zone["ranking_score"] >= 0.80
    assert len(top_zone["factors"]) >= 3
    assert len(top_zone["nearby_atm_ids"]) >= 10

def test_audit_hash_chain_integrity():
    # Log sample events
    audit_service.log_event(
        case_id="CASE-2026-041",
        actor_id="TEST_ANALYST",
        actor_role="I4C_STATE_ANALYST",
        action="INSPECT_GRAPH",
        payload={"query": "hop_trace"}
    )
    res = client.get("/api/audit/verify")
    assert res.status_code == 200
    verify_data = res.json()
    assert verify_data["chain_valid"] is True
    assert verify_data["total_events"] >= 2

def test_scenario_replay_progression():
    res = client.get("/api/cases/CASE-2026-041/replay?step=1")
    assert res.status_code == 200
    step1 = res.json()
    assert step1["current_step"] == 1
    assert len(step1["graph_nodes"]) >= 2

    # Step 6 final outcome
    res_final = client.get("/api/cases/CASE-2026-041/replay?step=6")
    assert res_final.status_code == 200
    step6 = res_final.json()
    assert step6["current_step"] == 6
    assert step6["withdrawal_revealed"] is not None
    assert "ATM-PUN-204" in step6["withdrawal_revealed"]["atm_id"]

def test_action_approval_workflow():
    res = client.get("/api/cases/CASE-2026-041/actions")
    assert res.status_code == 200
    actions = res.json()
    assert len(actions) > 0
    assert actions[0]["status"] in ["APPROVED", "ACKNOWLEDGED", "DISPATCHED"]
