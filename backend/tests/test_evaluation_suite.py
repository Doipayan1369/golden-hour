from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_prd_zero_pii_leakage():
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    for c in cases:
        assert "****" in c["victim_name_masked"]
        assert "acct_" in c["victim_account_token"]

def test_prd_evaluation_suite_10_cases():
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 5

    primary_case = next(c for c in cases if c["case_id"] == "CASE-2026-041")
    assert primary_case["severity"] == "CRITICAL"

    f_res = client.get(f"/api/cases/{primary_case['case_id']}/forecast")
    assert f_res.status_code == 200
    forecast = f_res.json()
    top_zone = forecast["top_zones"][0]
    assert "FC Road" in top_zone["zone_label"]
    assert top_zone["ranking_score"] > 0.80

def test_prd_lead_time_verification():
    res = client.get("/api/cases/CASE-2026-041/replay?step=5")
    assert res.status_code == 200
    replay = res.json()
    assert replay["withdrawal_revealed"] is not None
    withdrawal = replay["withdrawal_revealed"]
    assert withdrawal["atm_id"] == "ATM-PUN-204"
