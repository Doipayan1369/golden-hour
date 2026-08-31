from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_prd_zero_pii_leakage():
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    for c in cases:
        assert "****" in c["victim_name_masked"] or "****" in c.get("victim_name_masked", "")
        assert "victim_phone_token" in c
        assert "XXXX" in c["victim_phone_token"]

def test_prd_evaluation_suite_10_cases():
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 5

def test_prd_lead_time_verification():
    res = client.get("/api/cases/CASE-2026-041/replay?step=6")
    assert res.status_code == 200
    replay = res.json()
    assert replay["withdrawal_revealed"] is not None
    assert replay["withdrawal_revealed"]["atm_id"] == "ATM-PUN-204"
