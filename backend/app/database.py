import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from .schemas.models import (
    Case, AccountNode, TransactionEdge, ATM, PoliceStation, 
    ActionPacket, WithdrawalEvent, Feedback, SeverityLevel, 
    CaseStatus, NodeType, EdgeStatus, ReplayState, ForecastResponse,
    ScenarioCatalogItem, ReportRecord
)
from .services.audit_service import audit_service
from .services.graph_engine import graph_engine
from .services.forecast_engine import forecast_engine

class Database:
    def __init__(self):
        self.cases: Dict[str, Case] = {}
        self.nodes: Dict[str, List[AccountNode]] = {}
        self.edges: Dict[str, List[TransactionEdge]] = {}
        self.atms: List[ATM] = []
        self.police_stations: List[PoliceStation] = []
        self.actions: Dict[str, List[ActionPacket]] = {}
        self.withdrawals: Dict[str, WithdrawalEvent] = {}
        self.feedback: Dict[str, List[Feedback]] = {}
        self.replay_positions: Dict[str, int] = {}
        self.scenarios: List[ScenarioCatalogItem] = []
        self.reports: List[ReportRecord] = []
        self.seed_all()

    def seed_all(self):
        self.cases.clear()
        self.nodes.clear()
        self.edges.clear()
        self.atms.clear()
        self.police_stations.clear()
        self.actions.clear()
        self.withdrawals.clear()
        self.feedback.clear()
        self.replay_positions.clear()
        self.scenarios.clear()
        self.reports.clear()

        # Pune Police Stations
        stations = [
            PoliceStation(station_id="PS-DECCAN", name="Deccan Gymkhana Cyber Police Station", jurisdiction="Pune Central / FC Road Beat", latitude=18.5190, longitude=73.8420, contact_number="+91-20-25671100", beat_units_available=4),
            PoliceStation(station_id="PS-SHIVAJI", name="Shivaji Nagar Police Station", jurisdiction="Pune North / Shivaji Nagar", latitude=18.5310, longitude=73.8465, contact_number="+91-20-25532200", beat_units_available=3),
            PoliceStation(station_id="PS-KOTHRUD", name="Kothrud Cyber Crime Division", jurisdiction="Pune West / Paud Road", latitude=18.5080, longitude=73.8090, contact_number="+91-20-25434400", beat_units_available=3),
            PoliceStation(station_id="PS-VIMAN", name="Viman Nagar Police Station", jurisdiction="Pune East / Airport Corridor", latitude=18.5660, longitude=73.9120, contact_number="+91-20-26635500", beat_units_available=5),
        ]
        self.police_stations = stations

        # Pune ATMs (FC Road, Deccan, JM Road, Kothrud, Viman Nagar)
        atms_data = [
            {"id": "ATM-PUN-204", "bank": "State Bank of India (FC Road Branch)", "lat": 18.5175, "lon": 73.8415, "loc": "FC Road Near Goodluck Chowk, Deccan", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-205", "bank": "HDFC Bank 24x7 e-Lobby", "lat": 18.5210, "lon": 73.8428, "loc": "Deccan Gymkhana Commercial Complex", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-206", "bank": "ICICI Bank Kiosk", "lat": 18.5228, "lon": 73.8398, "loc": "Fergusson College Main Gate, FC Road", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-207", "bank": "Axis Bank ATM", "lat": 18.5245, "lon": 73.8470, "loc": "JM Road, Near Sambhaji Park", "station": "PS-DECCAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-208", "bank": "Bank of Maharashtra", "lat": 18.5160, "lon": 73.8405, "loc": "Deccan Gymkhana Post Office Chowk", "station": "PS-DECCAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-209", "bank": "Punjab National Bank", "lat": 18.5320, "lon": 73.8450, "loc": "Shivaji Nagar Bus Terminal Concourse", "station": "PS-SHIVAJI", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-210", "bank": "Kotak Mahindra Bank", "lat": 18.5260, "lon": 73.8435, "loc": "Ghole Road Commercial Plaza", "station": "PS-DECCAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-101", "bank": "Canara Bank", "lat": 18.5090, "lon": 73.8310, "loc": "Karve Road Chowk, Erandwane", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-102", "bank": "Union Bank of India", "lat": 18.5070, "lon": 73.8080, "loc": "Paud Road, Near MIT College Kothrud", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-103", "bank": "State Bank of India (Kothrud)", "lat": 18.5060, "lon": 73.8120, "loc": "Chandani Chowk Approach Road", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-301", "bank": "State Bank of India Metro ATM", "lat": 18.5650, "lon": 73.9130, "loc": "Viman Nagar Datta Mandir Chowk", "station": "PS-VIMAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-302", "bank": "Axis Bank Lounge", "lat": 18.5620, "lon": 73.9170, "loc": "Phoenix Marketcity Plaza Floor 1", "station": "PS-VIMAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-401", "bank": "HDFC Bank ATM Hub", "lat": 18.5480, "lon": 73.9030, "loc": "Kalyani Nagar Cyber Park Main Gate", "station": "PS-VIMAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-402", "bank": "ICICI Bank Kiosk", "lat": 18.5140, "lon": 73.9280, "loc": "Magarpatta Cybercity Tower 4", "station": "PS-VIMAN", "freq": "NORMAL"}
        ]
        self.atms = [ATM(
            atm_id=d["id"],
            bank_name=d["bank"],
            operator_id=f"OP-{d['id']}",
            latitude=d["lat"],
            longitude=d["lon"],
            locality=d["loc"],
            station_id=d["station"],
            cash_out_frequency=d["freq"]
        ) for d in atms_data]

        # Primary Case CASE-2026-041 in Pune
        c1 = Case(
            case_id="CASE-2026-041",
            source="NCRP_1930",
            created_at="2026-08-28T10:02:00+05:30",
            jurisdiction="Pune City Cyber Crime / Deccan Gymkhana",
            severity=SeverityLevel.CRITICAL,
            status=CaseStatus.FORECAST_READY,
            fraud_type="MSEDCL Electricity Bill / Malicious APK Fraud",
            amount_inr=75000.0,
            utr="UPI202608280001",
            source_institution="Bank A (Bank of Maharashtra)",
            victim_account_token="acct_victim_pune_01",
            victim_phone_token="+91-XXXXX-9823",
            victim_name_masked="A**** D****",
            data_freshness_minutes=11,
            assigned_beat="Deccan Beat Unit 3",
            assigned_bank="Bank D (Axis Bank Pune)",
            priority_score=0.94,
            timeline_summary=[
                "10:02:00 - 1930 Helpline complaint filed by citizen in Pune (INR 75,000 fraud debit).",
                "10:02:15 - Bank A confirmed immediate UPI transfer to Bank B (HDFC Pune).",
                "10:09:30 - Bank B returned Hop 1 response (INR 58,000 sent to Bank C concentrator).",
                "10:12:00 - Bank C returned Hop 2 response (INR 40,000 sent to Bank D ATM Cash-Out Card).",
                "10:12:45 - Thermal Forecast generated: FC Road & Deccan Gymkhana Corridor (82% Confidence)."
            ]
        )
        self.cases[c1.case_id] = c1

        # Primary Case Nodes
        c1_nodes = [
            AccountNode(node_id="node_victim", institution_id="BANK_A", institution_name="Bank A (Bank of Maharashtra)", account_token="acct_victim_pune_01", node_type=NodeType.VICTIM, first_seen="2026-08-28T10:02:00+05:30", last_seen="2026-08-28T10:02:00+05:30", risk_score=0.05, total_received_inr=0.0, total_forwarded_inr=75000.0, pass_through_ratio=0.0, flags=["Victim Anchor", "Reported 1930 Pune"], source_ref="1930_PUNE_REPORT_041"),
            AccountNode(node_id="node_mule_1", institution_id="BANK_B", institution_name="Bank B (HDFC Pune)", account_token="acct_mule_782", node_type=NodeType.MULE_LAYER_1, first_seen="2026-08-28T10:02:15+05:30", last_seen="2026-08-28T10:09:30+05:30", risk_score=0.88, total_received_inr=75000.0, total_forwarded_inr=75000.0, pass_through_ratio=1.0, velocity_mins=7.0, flags=["Layer 1 Intermediary Mule", "100% rapid pass-through", "Sub-10m velocity"], source_ref="BANK_B_RESPONSE_782"),
            AccountNode(node_id="node_mule_2", institution_id="BANK_C", institution_name="Bank C (ICICI Pune)", account_token="acct_mule_991", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-28T10:09:30+05:30", last_seen="2026-08-28T10:12:00+05:30", risk_score=0.91, total_received_inr=58000.0, total_forwarded_inr=40000.0, pass_through_ratio=0.69, velocity_mins=2.5, flags=["Layer 2 Concentrator Mule", "Rapid split pass-through", "Sub-5m velocity"], source_ref="BANK_C_RESPONSE_991"),
            AccountNode(node_id="node_cashout", institution_id="BANK_D", institution_name="Bank D (Axis Bank Pune)", account_token="acct_cashout_110", node_type=NodeType.CASHOUT_DEST, first_seen="2026-08-28T10:12:00+05:30", last_seen="2026-08-28T10:12:00+05:30", risk_score=0.96, total_received_inr=40000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Terminal Cash-Out Target", "Active Debit Card Linked", "High Immediate ATM Risk"], source_ref="BANK_D_RESPONSE_110")
        ]
        self.nodes[c1.case_id] = c1_nodes

        # Primary Case Edges
        c1_edges = [
            TransactionEdge(edge_id="edge_01", case_id=c1.case_id, source_node="node_victim", target_node="node_mule_1", amount_inr=75000.0, occurred_at="2026-08-28T10:02:15+05:30", utr="UPI202608280001", status=EdgeStatus.CONFIRMED, source_ref="BANK_A_TX_9011", source_institution="Bank A", destination_institution="Bank B", hop_order=1, velocity_minutes_from_prior=0.2),
            TransactionEdge(edge_id="edge_02", case_id=c1.case_id, source_node="node_mule_1", target_node="node_mule_2", amount_inr=58000.0, occurred_at="2026-08-28T10:09:30+05:30", utr="IMPS202608289821", status=EdgeStatus.CONFIRMED, source_ref="BANK_B_TX_4412", source_institution="Bank B", destination_institution="Bank C", hop_order=2, velocity_minutes_from_prior=7.2),
            TransactionEdge(edge_id="edge_03", case_id=c1.case_id, source_node="node_mule_2", target_node="node_cashout", amount_inr=40000.0, occurred_at="2026-08-28T10:12:00+05:30", utr="IMPS202608287732", status=EdgeStatus.CONFIRMED, source_ref="BANK_C_TX_8819", source_institution="Bank C", destination_institution="Bank D", hop_order=3, velocity_minutes_from_prior=2.5)
        ]
        self.edges[c1.case_id] = c1_edges

        # Ground truth simulated withdrawal in Pune (FC Road SBI ATM) at 10:27
        self.withdrawals[c1.case_id] = WithdrawalEvent(
            event_id="WITHDRAW-041-PUN",
            case_id=c1.case_id,
            account_node="node_cashout",
            atm_id="ATM-PUN-204",
            atm_name="State Bank of India (FC Road Near Goodluck Chowk)",
            amount_inr=40000.0,
            occurred_at="2026-08-28T10:27:00+05:30",
            source_ref="ATM_SWITCH_LOG_PUN_204_0828",
            latitude=18.5175,
            longitude=73.8415,
            observed_or_simulated="SIMULATED"
        )

        # Seed Primary Action Packet for Pune
        act1 = ActionPacket(
            action_id="ACT-CASE-2026-041-01",
            case_id="CASE-2026-041",
            action_type="BEAT_PATROL_ALERT",
            target_recipients=["Deccan Beat Patrol Unit 3", "Bank D Cyber Nodal Desk Pune"],
            suggested_action="Deploy visual patrol to FC Road & Deccan Gymkhana ATM cluster & trigger emergency ATM fraud hold at Bank D switch",
            priority_zone="FC Road & Deccan Gymkhana Commercial Corridor",
            expected_window="10:25 - 10:40",
            created_by="Insp. S. Kulkarni (I4C Analyst)",
            created_at="2026-08-28T10:13:00+05:30",
            approved_by="DSP R. Patil (Pune Cyber Crime Duty Lead)",
            approved_at="2026-08-28T10:15:00+05:30",
            status="APPROVED",
            acknowledgement_ref="ACK-PUN-DECCAN3-0828",
            acknowledgement_by="PSI Mahesh Shinde (Patrol Lead)",
            acknowledgement_at="2026-08-28T10:17:00+05:30"
        )
        self.actions[c1.case_id] = [act1]

        # Seed Secondary Cases in Pune
        secondary_cases = [
            Case(case_id="CASE-2026-042", source="NCRP_1930", created_at="2026-08-28T09:45:00+05:30", jurisdiction="Pune Central / Shivaji Nagar", severity=SeverityLevel.MONITORING, status=CaseStatus.NEEDS_DATA, fraud_type="Commercial Invoice Dispute (Hard Negative)", amount_inr=120000.0, utr="NEFT202608288811", source_institution="Bank B", victim_account_token="acct_victim_002", victim_phone_token="+91-XXXXX-1122", victim_name_masked="S**** M****", data_freshness_minutes=42, priority_score=0.32, timeline_summary=["09:45 - 1930 Complaint filed", "09:55 - Verified registered vendor account in Pune (low risk)"]),
            Case(case_id="CASE-2026-043", source="NCRP_1930", created_at="2026-08-28T09:50:00+05:30", jurisdiction="Pune West / Kothrud", severity=SeverityLevel.HIGH, status=CaseStatus.NEEDS_DATA, fraud_type="Investment Scheme / Telegram Task Fraud", amount_inr=180000.0, utr="UPI202608285543", source_institution="Bank A", victim_account_token="acct_victim_003", victim_phone_token="+91-XXXXX-3344", victim_name_masked="A**** T****", data_freshness_minutes=25, priority_score=0.79, timeline_summary=["09:50 - 1930 Complaint logged", "09:58 - Hop 1 to Co-op Bank returned UNAVAILABLE (API Timeout)"]),
            Case(case_id="CASE-2026-044", source="NCRP_1930", created_at="2026-08-28T10:05:00+05:30", jurisdiction="Pune East / Viman Nagar", severity=SeverityLevel.CRITICAL, status=CaseStatus.ENRICHING, fraud_type="SIM Swap / Banking Phishing", amount_inr=240000.0, utr="UPI202608289901", source_institution="Bank C", victim_account_token="acct_victim_004", victim_phone_token="+91-XXXXX-7788", victim_name_masked="V**** S****", data_freshness_minutes=8, priority_score=0.91, timeline_summary=["10:05 - Critical complaint intake", "10:07 - Fan-out into 3 parallel wallets detected"]),
            Case(case_id="CASE-2026-045", source="NCRP_1930", created_at="2026-08-28T10:08:00+05:30", jurisdiction="Pune South / Swargate", severity=SeverityLevel.ELEVATED, status=CaseStatus.ENRICHING, fraud_type="Job Offer / Advance Fee Fraud", amount_inr=45000.0, utr="UPI202608282219", source_institution="Bank A", victim_account_token="acct_victim_005", victim_phone_token="+91-XXXXX-5566", victim_name_masked="P**** N****", data_freshness_minutes=5, priority_score=0.68, timeline_summary=["10:08 - Intake logged", "10:10 - Query dispatched to Bank F (PENDING response)"]),
        ]
        for c in secondary_cases:
            self.cases[c.case_id] = c
            self.nodes[c.case_id] = [
                AccountNode(node_id=f"node_{c.case_id}_vic", institution_id="BANK_A", institution_name="Bank A", account_token=c.victim_account_token, node_type=NodeType.VICTIM, first_seen=c.created_at, last_seen=c.created_at, risk_score=0.05, total_received_inr=0.0, total_forwarded_inr=c.amount_inr, flags=["Victim"]),
                AccountNode(node_id=f"node_{c.case_id}_m1", institution_id="BANK_B", institution_name="Bank B", account_token=f"acct_mule_{c.case_id[-2:]}1", node_type=NodeType.MULE_LAYER_1, first_seen=c.created_at, last_seen=c.created_at, risk_score=0.75, total_received_inr=c.amount_inr, total_forwarded_inr=c.amount_inr*0.8, flags=["Layer 1 Intermediary"])
            ]
            self.edges[c.case_id] = [
                TransactionEdge(edge_id=f"edge_{c.case_id}_01", case_id=c.case_id, source_node=f"node_{c.case_id}_vic", target_node=f"node_{c.case_id}_m1", amount_inr=c.amount_inr, occurred_at=c.created_at, utr=c.utr, status=EdgeStatus.CONFIRMED, source_ref=f"REF_{c.case_id}_1", source_institution="Bank A", destination_institution="Bank B", hop_order=1, velocity_minutes_from_prior=1.0)
            ]

        # Seed Scenario Catalog (Pune Scenarios)
        self.scenarios = [
            ScenarioCatalogItem(scenario_id="SCEN-041-PRIMARY", case_id="CASE-2026-041", title="Primary Showcase: Rapid 3-Hop APK Fraud to FC Road Pune Cashout", category="positive", fraud_pattern="MSEDCL APK Scam + 3 Mule Hops", event_count=6, expected_zone="FC Road Deccan Corridor", ground_truth_atm="ATM-PUN-204", difficulty="Standard Benchmark", pass_fail_status="PASSED"),
            ScenarioCatalogItem(scenario_id="SCEN-042-NEGATIVE", case_id="CASE-2026-042", title="Hard Negative: Business Vendor Payment Clearance", category="hard_negative", fraud_pattern="Legitimate Commercial Invoice", event_count=3, expected_zone="No Cashout Forecast", ground_truth_atm="N/A", difficulty="Negative Control", pass_fail_status="PASSED"),
            ScenarioCatalogItem(scenario_id="SCEN-043-INCOMPLETE", case_id="CASE-2026-043", title="Missing Hop Recovery: Co-operative Bank API Timeout", category="incomplete_data", fraud_pattern="Telegram Task Scam + Timeout", event_count=4, expected_zone="Reduced Confidence Zone", ground_truth_atm="ATM-PUN-301", difficulty="Data Recovery Test", pass_fail_status="PASSED"),
            ScenarioCatalogItem(scenario_id="SCEN-044-FANOUT", case_id="CASE-2026-044", title="Layered Multi-Wallet Fan-Out (INR 2,40,000)", category="cross_jurisdiction", fraud_pattern="Phishing + 3 Wallets", event_count=5, expected_zone="Viman Nagar Cyber Park", ground_truth_atm="ATM-PUN-401", difficulty="High Volume", pass_fail_status="PASSED"),
            ScenarioCatalogItem(scenario_id="SCEN-045-PENDING", case_id="CASE-2026-045", title="Staged Response Delay: Active Timer Tracking", category="pending_response", fraud_pattern="Job Advance Fee Scam", event_count=3, expected_zone="Shivaji Nagar Terminal", ground_truth_atm="ATM-PUN-102", difficulty="Timer SLA Test", pass_fail_status="PASSED"),
        ]

        # Seed Reports Catalog
        self.reports = [
            ReportRecord(report_id="REP-2026-041", case_id="CASE-2026-041", title="Executive Incident Summary: CASE-2026-041 (Pune City)", report_type="CASE_SUMMARY", created_at="2026-08-28T10:30:00+05:30", created_by="Insp. S. Kulkarni", format="PDF", status="GENERATED", summary_text="Multi-hop transaction trail successfully intercepted. Cash-out forecasted in FC Road Deccan Corridor with 15min advance warning."),
            ReportRecord(report_id="REP-2026-041-ACT", case_id="CASE-2026-041", title="Formal Beat Dispatch & Bank Freeze Order", report_type="ACTION_PACKET", created_at="2026-08-28T10:15:00+05:30", created_by="DSP R. Patil", format="PDF", status="SIGNED", summary_text="Signed authorization for Deccan Beat Unit 3 and Bank D emergency debit card freeze in Pune."),
            ReportRecord(report_id="REP-2026-EVAL", case_id="GLOBAL", title="SIH26184 10-Case Benchmark Evaluation Report", report_type="EVALUATION_REPORT", created_at="2026-08-28T10:35:00+05:30", created_by="I4C AI Evaluation Engine", format="JSON", status="VERIFIED", summary_text="100% Top-3 Hit Rate on positive synthetic cases across Pune jurisdiction. Zero PII exposure verified.")
        ]

        # Audit events
        audit_service.log_event(
            case_id="CASE-2026-041",
            actor_id="NCRP_PUNE_GATEWAY",
            actor_role="SYSTEM",
            action="INGEST_1930_COMPLAINT",
            payload={"case_id": "CASE-2026-041", "utr": "UPI202608280001", "amount": 75000, "jurisdiction": "Pune Central"},
            custom_ts="2026-08-28T10:02:00+05:30"
        )
        audit_service.log_event(
            case_id="CASE-2026-041",
            actor_id="BANK_B_PUNE_SWITCH",
            actor_role="SYSTEM",
            action="BANK_RESPONSE_CONFIRMED",
            payload={"hop": 1, "source_ref": "BANK_B_RESPONSE_782", "destination": "acct_mule_782"},
            custom_ts="2026-08-28T10:02:15+05:30"
        )
        audit_service.log_event(
            case_id="CASE-2026-041",
            actor_id="FORECAST_ENGINE_PUNE",
            actor_role="SYSTEM",
            action="GENERATE_CASH_OUT_FORECAST",
            payload={"top_zone": "FC Road & Deccan Gymkhana Commercial Corridor", "confidence": 0.82, "expected_window": "10:25 - 10:40"},
            custom_ts="2026-08-28T10:12:45+05:30"
        )

db = Database()
