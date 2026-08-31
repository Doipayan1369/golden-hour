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

        # Top 15 Potential Cash-Out ATMs across Pune City
        atms_data = [
            {"id": "ATM-PUN-204", "bank": "State Bank of India (FC Road Branch)", "lat": 18.5175, "lon": 73.8415, "loc": "FC Road Near Goodluck Chowk, Deccan", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-205", "bank": "HDFC Bank 24x7 e-Lobby", "lat": 18.5210, "lon": 73.8428, "loc": "Deccan Gymkhana Commercial Complex", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-206", "bank": "ICICI Bank Kiosk", "lat": 18.5228, "lon": 73.8398, "loc": "Fergusson College Main Gate, FC Road", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-207", "bank": "Axis Bank 24x7 Lounge", "lat": 18.5245, "lon": 73.8470, "loc": "JM Road, Near Sambhaji Park", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-208", "bank": "Bank of Maharashtra Main", "lat": 18.5160, "lon": 73.8405, "loc": "Deccan Gymkhana Post Office Chowk", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-209", "bank": "Punjab National Bank Transit Hub", "lat": 18.5320, "lon": 73.8450, "loc": "Shivaji Nagar Bus Terminal Concourse", "station": "PS-SHIVAJI", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-210", "bank": "Kotak Mahindra Bank e-Lobby", "lat": 18.5260, "lon": 73.8435, "loc": "Ghole Road Commercial Plaza", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-211", "bank": "IndusInd Bank 24x7 Kiosk", "lat": 18.5242, "lon": 73.8390, "loc": "Tukaram Paduka Chowk, FC Road", "station": "PS-DECCAN", "freq": "HIGH_CASHOUT"},
            {"id": "ATM-PUN-212", "bank": "IDFC First Bank Branch ATM", "lat": 18.5150, "lon": 73.8430, "loc": "Garware Bridge Corner, Deccan", "station": "PS-DECCAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-101", "bank": "Canara Bank ATM Hub", "lat": 18.5090, "lon": 73.8310, "loc": "Karve Road Chowk, Erandwane", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-102", "bank": "Union Bank of India Kiosk", "lat": 18.5070, "lon": 73.8080, "loc": "Paud Road, Near MIT College Kothrud", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-103", "bank": "State Bank of India (Kothrud)", "lat": 18.5060, "lon": 73.8120, "loc": "Chandani Chowk Approach Road", "station": "PS-KOTHRUD", "freq": "NORMAL"},
            {"id": "ATM-PUN-301", "bank": "State Bank of India Metro ATM", "lat": 18.5650, "lon": 73.9130, "loc": "Viman Nagar Datta Mandir Chowk", "station": "PS-VIMAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-302", "bank": "Axis Bank Lounge", "lat": 18.5620, "lon": 73.9170, "loc": "Phoenix Marketcity Plaza Floor 1", "station": "PS-VIMAN", "freq": "NORMAL"},
            {"id": "ATM-PUN-401", "bank": "HDFC Bank ATM Hub", "lat": 18.5480, "lon": 73.9030, "loc": "Kalyani Nagar Cyber Park Main Gate", "station": "PS-VIMAN", "freq": "NORMAL"}
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

        # Primary Case CASE-2026-041 in Pune (Total Loss INR 4,50,000)
        c1 = Case(
            case_id="CASE-2026-041",
            source="NCRP_1930",
            created_at="2026-08-29T09:42:00+05:30",
            jurisdiction="Pune City Cyber Crime / Deccan Gymkhana",
            severity=SeverityLevel.CRITICAL,
            status=CaseStatus.FORECAST_READY,
            fraud_type="Digital Arrest & CBI Extortion Cyber Syndicate",
            amount_inr=450000.0,
            utr="UPI202608299821",
            source_institution="State Bank of India (Pune Camp)",
            victim_account_token="acct_victim_patil_01",
            victim_phone_token="+91-XXXXX-44129",
            victim_name_masked="R**** P****",
            data_freshness_minutes=14,
            assigned_beat="Deccan Cyber Beat Unit 3 (PCR-PUN-03)",
            assigned_bank="Axis Bank / SBI Nodal Desk Pune",
            priority_score=0.96,
            timeline_summary=[
                "09:42:00 - 1930 Helpline call received from victim Ramesh Patil (INR 4,50,000 fraud debit).",
                "09:42:15 - Hop 1: SBI Pune confirmed IMPS transfer to ICICI Mule Layer 1 (acct_mule_01).",
                "09:45:10 - Hops 2-3: Rapid 2-way split to HDFC FC Road (acct_mule_02) and Axis JM Road (acct_mule_03).",
                "09:51:12 - Hops 4-7: Layer 3 secondary fan-out across Kotak, Canara, BoM, and PNB Shivaji Nagar.",
                "10:01:25 - Hops 8-14: Layer 4 micro-layering across 7 branch concentrators in Deccan corridor.",
                "10:06:50 - Hop 15: Final terminal transfer to Active Cashout Debit Card (acct_cashout_terminal).",
                "10:10:00 - Thermal Forecast generated: FC Road Goodluck Chowk Epicenter (94% Probability)."
            ]
        )
        self.cases[c1.case_id] = c1
        # Additional Seed Cases for Pune Jurisdiction (Evaluation Suite)
        cases_data = [
            ("CASE-2026-042", "Fake Investment Telegram Scam", 180000.0, "UPI202608290042", SeverityLevel.HIGH, "Kothrud / Paud Road", "node_victim_42", "node_mule_42"),
            ("CASE-2026-043", "Customs Parcel & Courier Fraud", 95000.0, "UPI202608290043", SeverityLevel.ELEVATED, "Shivaji Nagar", "node_victim_43", "node_mule_43"),
            ("CASE-2026-044", "Credit Card Reward Points Phishing", 120000.0, "UPI202608290044", SeverityLevel.HIGH, "Viman Nagar / Airport", "node_victim_44", "node_mule_44"),
            ("CASE-2026-045", "KYC Update / Bank Impersonation", 65000.0, "UPI202608290045", SeverityLevel.MONITORING, "Deccan Gymkhana", "node_victim_45", "node_mule_45"),
        ]
        for cid, ftype, amt, utr, sev, juris, vnode, mnode in cases_data:
            c = Case(
                case_id=cid,
                source="NCRP_1930",
                created_at="2026-08-29T09:50:00+05:30",
                jurisdiction=f"Pune City Cyber Crime / {juris}",
                severity=sev,
                status=CaseStatus.FORECAST_READY,
                fraud_type=ftype,
                amount_inr=amt,
                utr=utr,
                source_institution="State Bank of India",
                victim_account_token=f"acct_{vnode}",
                victim_phone_token="+91-98XXX-XXXXX",
                victim_name_masked="C**** N****",
                data_freshness_minutes=18,
                priority_score=0.85
            )
            self.cases[cid] = c
            self.nodes[cid] = [
                AccountNode(node_id=vnode, institution_id="BANK_A", institution_name="SBI Pune", account_token=f"acct_{vnode}", node_type=NodeType.VICTIM, first_seen="2026-08-29T09:50:00+05:30", last_seen="2026-08-29T09:50:00+05:30", risk_score=0.05, total_received_inr=0.0, total_forwarded_inr=amt, pass_through_ratio=0.0, flags=["Victim"]),
                AccountNode(node_id=mnode, institution_id="BANK_B", institution_name="HDFC Pune", account_token=f"acct_{mnode}", node_type=NodeType.CASHOUT_DEST, first_seen="2026-08-29T09:51:00+05:30", last_seen="2026-08-29T09:51:00+05:30", risk_score=0.88, total_received_inr=amt, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Terminal Target"])
            ]
            self.edges[cid] = [
                TransactionEdge(edge_id=f"edge_{cid}_1", case_id=cid, source_node=vnode, target_node=mnode, amount_inr=amt, occurred_at="2026-08-29T09:51:00+05:30", utr=utr, status=EdgeStatus.CONFIRMED, source_ref="BANK_TX_01", source_institution="SBI", destination_institution="HDFC", hop_order=1, velocity_minutes_from_prior=1.0)
            ]
            self.actions[cid] = [
                ActionPacket(
                    action_id=f"ACT-{cid}",
                    case_id=cid,
                    action_type="EMERGENCY_DISPATCH_AND_HOLD",
                    target_recipients=["Deccan Beat 3"],
                    suggested_action="Alert field patrol",
                    priority_zone="Pune Sector",
                    expected_window="10:30 - 10:45 IST",
                    created_by="DUTY_OFFICER",
                    created_at="2026-08-29T10:00:00+05:30",
                    status="APPROVED"
                )
            ]


        # 16 Graph Nodes across 15 Hops in Pune
        c1_nodes = [
            AccountNode(node_id="node_victim", institution_id="SBI_CAMP", institution_name="State Bank of India (Pune Camp)", account_token="acct_victim_patil_01", node_type=NodeType.VICTIM, first_seen="2026-08-29T09:42:00+05:30", last_seen="2026-08-29T09:42:15+05:30", risk_score=0.05, total_received_inr=0.0, total_forwarded_inr=450000.0, pass_through_ratio=0.0, flags=["Victim Account", "Reported on 1930 Helpline", "Pune Camp Branch"], source_ref="1930_PUNE_COMPLAINT_9821"),
            AccountNode(node_id="node_mule_01", institution_id="ICICI_DECCAN", institution_name="ICICI Bank (Deccan Gymkhana)", account_token="acct_mule_01", node_type=NodeType.MULE_LAYER_1, first_seen="2026-08-29T09:42:15+05:30", last_seen="2026-08-29T09:45:10+05:30", risk_score=0.89, total_received_inr=450000.0, total_forwarded_inr=450000.0, pass_through_ratio=1.0, velocity_mins=2.9, flags=["Layer 1 Primary Mule", "100% Pass-Through Velocity", "Deccan Commercial Strip"], source_ref="ICICI_SWITCH_TX_01"),
            AccountNode(node_id="node_mule_02", institution_id="HDFC_FC", institution_name="HDFC Bank (FC Road Branch)", account_token="acct_mule_02", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:44:30+05:30", last_seen="2026-08-29T09:48:22+05:30", risk_score=0.91, total_received_inr=220000.0, total_forwarded_inr=220000.0, pass_through_ratio=1.0, velocity_mins=3.8, flags=["Layer 2 Split Node A", "Sub-4m Velocity", "FC Road Axis"], source_ref="HDFC_SWITCH_TX_02"),
            AccountNode(node_id="node_mule_03", institution_id="AXIS_JM", institution_name="Axis Bank (JM Road Branch)", account_token="acct_mule_03", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:45:10+05:30", last_seen="2026-08-29T09:51:12+05:30", risk_score=0.90, total_received_inr=230000.0, total_forwarded_inr=230000.0, pass_through_ratio=1.0, velocity_mins=6.0, flags=["Layer 2 Split Node B", "JM Road Banking Strip"], source_ref="AXIS_SWITCH_TX_03"),
            AccountNode(node_id="node_mule_04", institution_id="KOTAK_GHOLE", institution_name="Kotak Mahindra Bank (Ghole Road)", account_token="acct_mule_04", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:47:05+05:30", last_seen="2026-08-29T09:54:15+05:30", risk_score=0.88, total_received_inr=110000.0, total_forwarded_inr=110000.0, pass_through_ratio=1.0, velocity_mins=7.1, flags=["Layer 3 Sub-Split Node", "Ghole Road Plaza"], source_ref="KOTAK_SWITCH_TX_04"),
            AccountNode(node_id="node_mule_05", institution_id="CANARA_KARVE", institution_name="Canara Bank (Karve Road)", account_token="acct_mule_05", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:48:22+05:30", last_seen="2026-08-29T09:57:30+05:30", risk_score=0.87, total_received_inr=110000.0, total_forwarded_inr=110000.0, pass_through_ratio=1.0, velocity_mins=9.1, flags=["Layer 3 Karve Corridor"], source_ref="CANARA_SWITCH_TX_05"),
            AccountNode(node_id="node_mule_06", institution_id="BOM_DECCAN", institution_name="Bank of Maharashtra (Deccan Post Office)", account_token="acct_mule_06", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:49:40+05:30", last_seen="2026-08-29T10:01:25+05:30", risk_score=0.92, total_received_inr=115000.0, total_forwarded_inr=115000.0, pass_through_ratio=1.0, velocity_mins=11.7, flags=["Layer 3 Concentrator", "Deccan Gymkhana Hub"], source_ref="BOM_SWITCH_TX_06"),
            AccountNode(node_id="node_mule_07", institution_id="PNB_SHIVAJI", institution_name="Punjab National Bank (Shivaji Nagar)", account_token="acct_mule_07", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:51:12+05:30", last_seen="2026-08-29T10:03:40+05:30", risk_score=0.86, total_received_inr=115000.0, total_forwarded_inr=65000.0, pass_through_ratio=0.56, velocity_mins=12.4, flags=["Layer 3 Transit Hub Node", "Shivaji Nagar Concourse"], source_ref="PNB_SWITCH_TX_07"),
            AccountNode(node_id="node_mule_08", institution_id="INDUSIND_FC", institution_name="IndusInd Bank (Fergusson Gate)", account_token="acct_mule_08", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:53:00+05:30", last_seen="2026-08-29T10:06:50+05:30", risk_score=0.95, total_received_inr=60000.0, total_forwarded_inr=50000.0, pass_through_ratio=0.83, velocity_mins=13.8, flags=["Layer 4 Terminal Staging Node", "Fergusson College Strip"], source_ref="INDUS_SWITCH_TX_08"),
            AccountNode(node_id="node_mule_09", institution_id="UNION_PAUD", institution_name="Union Bank (Paud Road)", account_token="acct_mule_09", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:54:15+05:30", last_seen="2026-08-29T09:54:15+05:30", risk_score=0.74, total_received_inr=50000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Paud Road Sector"], source_ref="UNION_SWITCH_TX_09"),
            AccountNode(node_id="node_mule_10", institution_id="YES_ERANDWANE", institution_name="Yes Bank (Erandwane)", account_token="acct_mule_10", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:56:02+05:30", last_seen="2026-08-29T09:56:02+05:30", risk_score=0.72, total_received_inr=60000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Erandwane Sector"], source_ref="YES_SWITCH_TX_10"),
            AccountNode(node_id="node_mule_11", institution_id="FEDERAL_KOTHRUD", institution_name="Federal Bank (Kothrud)", account_token="acct_mule_11", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:57:30+05:30", last_seen="2026-08-29T09:57:30+05:30", risk_score=0.68, total_received_inr=50000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Kothrud Sector"], source_ref="FED_SWITCH_TX_11"),
            AccountNode(node_id="node_mule_12", institution_id="IDFC_GARWARE", institution_name="IDFC First Bank (Garware Chowk)", account_token="acct_mule_12", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T09:59:10+05:30", last_seen="2026-08-29T09:59:10+05:30", risk_score=0.79, total_received_inr=65000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Garware Bridge"], source_ref="IDFC_SWITCH_TX_12"),
            AccountNode(node_id="node_mule_13", institution_id="AU_LAWCOLLEGE", institution_name="AU Small Finance (Law College Road)", account_token="acct_mule_13", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T10:01:25+05:30", last_seen="2026-08-29T10:01:25+05:30", risk_score=0.75, total_received_inr=50000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Law College Strip"], source_ref="AU_SWITCH_TX_13"),
            AccountNode(node_id="node_mule_14", institution_id="RBL_SHIVAJI", institution_name="RBL Bank (Shivaji Nagar Station)", account_token="acct_mule_14", node_type=NodeType.MULE_LAYER_2, first_seen="2026-08-29T10:03:40+05:30", last_seen="2026-08-29T10:03:40+05:30", risk_score=0.81, total_received_inr=65000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Layer 4 Secondary Buffer", "Railway Station Road"], source_ref="RBL_SWITCH_TX_14"),
            AccountNode(node_id="node_cashout_terminal", institution_id="SBI_GOODLUCK", institution_name="State Bank of India (FC Road / Goodluck Chowk)", account_token="acct_cashout_terminal", node_type=NodeType.CASHOUT_DEST, first_seen="2026-08-29T10:06:50+05:30", last_seen="2026-08-29T10:06:50+05:30", risk_score=0.98, total_received_inr=50000.0, total_forwarded_inr=0.0, pass_through_ratio=0.0, flags=["Terminal ATM Cashout Target", "Active Debit Card Linked (Card #4102-XXXX-9901)", "High Immediate Withdrawal Risk at Goodluck Chowk"], source_ref="SBI_ATM_CARD_ALERT_9901")
        ]
        self.nodes[c1.case_id] = c1_nodes

        # 15 Sequential Transaction Edges (Hops 1 to 15) with Exact Day, Time, Locality & Amounts
        c1_edges = [
            TransactionEdge(edge_id="hop_01", case_id=c1.case_id, source_node="node_victim", target_node="node_mule_01", amount_inr=450000.0, occurred_at="2026-08-29T09:42:15+05:30", utr="UPI202608299821", status=EdgeStatus.CONFIRMED, source_ref="SBI_CAMP_TX_01", source_institution="SBI Pune Camp", destination_institution="ICICI Deccan", hop_order=1, velocity_minutes_from_prior=0.25),
            TransactionEdge(edge_id="hop_02", case_id=c1.case_id, source_node="node_mule_01", target_node="node_mule_02", amount_inr=220000.0, occurred_at="2026-08-29T09:44:30+05:30", utr="IMPS202608290002", status=EdgeStatus.CONFIRMED, source_ref="ICICI_DEC_TX_02", source_institution="ICICI Deccan", destination_institution="HDFC FC Road", hop_order=2, velocity_minutes_from_prior=2.25),
            TransactionEdge(edge_id="hop_03", case_id=c1.case_id, source_node="node_mule_01", target_node="node_mule_03", amount_inr=230000.0, occurred_at="2026-08-29T09:45:10+05:30", utr="IMPS202608290003", status=EdgeStatus.CONFIRMED, source_ref="ICICI_DEC_TX_03", source_institution="ICICI Deccan", destination_institution="Axis JM Road", hop_order=3, velocity_minutes_from_prior=0.66),
            TransactionEdge(edge_id="hop_04", case_id=c1.case_id, source_node="node_mule_02", target_node="node_mule_04", amount_inr=110000.0, occurred_at="2026-08-29T09:47:05+05:30", utr="NEFT202608290004", status=EdgeStatus.CONFIRMED, source_ref="HDFC_FC_TX_04", source_institution="HDFC FC Road", destination_institution="Kotak Ghole Road", hop_order=4, velocity_minutes_from_prior=1.91),
            TransactionEdge(edge_id="hop_05", case_id=c1.case_id, source_node="node_mule_02", target_node="node_mule_05", amount_inr=110000.0, occurred_at="2026-08-29T09:48:22+05:30", utr="NEFT202608290005", status=EdgeStatus.CONFIRMED, source_ref="HDFC_FC_TX_05", source_institution="HDFC FC Road", destination_institution="Canara Karve Road", hop_order=5, velocity_minutes_from_prior=1.28),
            TransactionEdge(edge_id="hop_06", case_id=c1.case_id, source_node="node_mule_03", target_node="node_mule_06", amount_inr=115000.0, occurred_at="2026-08-29T09:49:40+05:30", utr="IMPS202608290006", status=EdgeStatus.CONFIRMED, source_ref="AXIS_JM_TX_06", source_institution="Axis JM Road", destination_institution="BoM Deccan", hop_order=6, velocity_minutes_from_prior=1.30),
            TransactionEdge(edge_id="hop_07", case_id=c1.case_id, source_node="node_mule_03", target_node="node_mule_07", amount_inr=115000.0, occurred_at="2026-08-29T09:51:12+05:30", utr="IMPS202608290007", status=EdgeStatus.CONFIRMED, source_ref="AXIS_JM_TX_07", source_institution="Axis JM Road", destination_institution="PNB Shivaji Nagar", hop_order=7, velocity_minutes_from_prior=1.53),
            TransactionEdge(edge_id="hop_08", case_id=c1.case_id, source_node="node_mule_04", target_node="node_mule_08", amount_inr=60000.0, occurred_at="2026-08-29T09:53:00+05:30", utr="UPI202608290008", status=EdgeStatus.CONFIRMED, source_ref="KOTAK_GHOLE_TX_08", source_institution="Kotak Ghole Road", destination_institution="IndusInd FC Gate", hop_order=8, velocity_minutes_from_prior=1.80),
            TransactionEdge(edge_id="hop_09", case_id=c1.case_id, source_node="node_mule_04", target_node="node_mule_09", amount_inr=50000.0, occurred_at="2026-08-29T09:54:15+05:30", utr="UPI202608290009", status=EdgeStatus.CONFIRMED, source_ref="KOTAK_GHOLE_TX_09", source_institution="Kotak Ghole Road", destination_institution="Union Paud Road", hop_order=9, velocity_minutes_from_prior=1.25),
            TransactionEdge(edge_id="hop_10", case_id=c1.case_id, source_node="node_mule_05", target_node="node_mule_10", amount_inr=60000.0, occurred_at="2026-08-29T09:56:02+05:30", utr="IMPS202608290010", status=EdgeStatus.CONFIRMED, source_ref="CANARA_KARVE_TX_10", source_institution="Canara Karve Road", destination_institution="Yes Bank Erandwane", hop_order=10, velocity_minutes_from_prior=1.78),
            TransactionEdge(edge_id="hop_11", case_id=c1.case_id, source_node="node_mule_05", target_node="node_mule_11", amount_inr=50000.0, occurred_at="2026-08-29T09:57:30+05:30", utr="IMPS202608290011", status=EdgeStatus.CONFIRMED, source_ref="CANARA_KARVE_TX_11", source_institution="Canara Karve Road", destination_institution="Federal Kothrud", hop_order=11, velocity_minutes_from_prior=1.46),
            TransactionEdge(edge_id="hop_12", case_id=c1.case_id, source_node="node_mule_06", target_node="node_mule_12", amount_inr=65000.0, occurred_at="2026-08-29T09:59:10+05:30", utr="UPI202608290012", status=EdgeStatus.CONFIRMED, source_ref="BOM_DEC_TX_12", source_institution="BoM Deccan", destination_institution="IDFC Garware Chowk", hop_order=12, velocity_minutes_from_prior=1.66),
            TransactionEdge(edge_id="hop_13", case_id=c1.case_id, source_node="node_mule_06", target_node="node_mule_13", amount_inr=50000.0, occurred_at="2026-08-29T10:01:25+05:30", utr="UPI202608290013", status=EdgeStatus.CONFIRMED, source_ref="BOM_DEC_TX_13", source_institution="BoM Deccan", destination_institution="AU Law College Road", hop_order=13, velocity_minutes_from_prior=2.25),
            TransactionEdge(edge_id="hop_14", case_id=c1.case_id, source_node="node_mule_07", target_node="node_mule_14", amount_inr=65000.0, occurred_at="2026-08-29T10:03:40+05:30", utr="IMPS202608290014", status=EdgeStatus.CONFIRMED, source_ref="PNB_SHIVAJI_TX_14", source_institution="PNB Shivaji Nagar", destination_institution="RBL Shivaji Station", hop_order=14, velocity_minutes_from_prior=2.25),
            TransactionEdge(edge_id="hop_15", case_id=c1.case_id, source_node="node_mule_08", target_node="node_cashout_terminal", amount_inr=50000.0, occurred_at="2026-08-29T10:06:50+05:30", utr="CARD_TOKEN_9901_AUTH", status=EdgeStatus.CONFIRMED, source_ref="INDUS_FC_TERMINAL_15", source_institution="IndusInd FC Gate", destination_institution="SBI FC Road Goodluck", hop_order=15, velocity_minutes_from_prior=3.16)
        ]
        self.edges[c1.case_id] = c1_edges

        # Ground Truth Interception Match in Pune at SBI FC Road
        self.withdrawals[c1.case_id] = WithdrawalEvent(
            event_id="WTH-PUN-041-01",
            case_id=c1.case_id,
            account_node="node_cashout_terminal",
            atm_id="ATM-PUN-204",
            atm_name="State Bank of India (FC Road Branch Near Goodluck Chowk)",
            amount_inr=50000.0,
            occurred_at="10:27:00 IST (Saturday, 29 Aug 2026)",
            source_ref="SBI_ATM_SWITCH_LOG_204",
            latitude=18.5175,
            longitude=73.8415,
            observed_or_simulated="SIMULATED"
        )

        # Preloaded Action Packets
        self.actions[c1.case_id] = [
            ActionPacket(
                action_id="ACT-PUN-041-01",
                case_id=c1.case_id,
                action_type="EMERGENCY_DISPATCH_AND_HOLD",
                target_recipients=["Deccan Cyber Beat Unit 3 (PCR-PUN-03)", "Axis Bank & SBI Nodal Desk"],
                suggested_action="Dispatch Beat Patrol 3 to secure SBI ATM Goodluck Chowk & place immediate Section 91 CrPC card hold on card token acct_cashout_terminal.",
                priority_zone="FC Road & Deccan Gymkhana Commercial Strip",
                expected_window="10:20 - 10:35 IST",
                created_by="POLICE_INSPECTOR_DESHMUKH",
                created_at="2026-08-29T10:14:00+05:30",
                status="APPROVED"
            )
        ]

        # Scenario Catalog
        self.scenarios = [
            ScenarioCatalogItem(
                scenario_id="SCENARIO-041",
                case_id="CASE-2026-041",
                title="Pune FC Road Rapid 15-Hop ATM Cashout Syndicate",
                category="SYNTHETIC_EVALUATION",
                fraud_pattern="Digital Arrest / Multi-Hop Beneficiary Layering across Deccan Corridor",
                event_count=15,
                expected_zone="FC Road & Deccan Gymkhana Commercial Strip",
                ground_truth_atm="ATM-PUN-204 (SBI Goodluck Chowk)",
                difficulty="HARD",
                pass_fail_status="PASSED (15-min advance lead time)"
            )
        ]

        # Audit Genesis Chain
        audit_service.log_event(
            case_id="CASE-2026-041",
            actor_id="I4C_PUNE_DISPATCHER",
            actor_role="I4C_STATE_ANALYST",
            action="INITIALIZE_PUNE_JURISDICTION",
            payload={"jurisdiction": "Pune City", "active_atms": 15, "active_stations": 4, "total_hops": 15}
        )

db = Database()
