from datetime import datetime
from typing import Dict, List, Optional
from ..schemas.models import ReplayState, CaseStatus, AccountNode, TransactionEdge, NodeType, EdgeStatus, ForecastResponse, DataMode, HotspotZone, FactorContribution, WithdrawalEvent
from ..database import db

class ScenarioPlayer:
    def __init__(self):
        self.case_id = "CASE-2026-041"
        self.total_steps = 6

    def get_replay_state(self, case_id: str, step_index: Optional[int] = None) -> ReplayState:
        if step_index is None:
            step_index = db.replay_positions.get(case_id, 3) # default to step 3 (forecast ready)

        step_index = max(0, min(step_index, self.total_steps - 1))
        db.replay_positions[case_id] = step_index

        # Scenario Step Definitions for Pune Case
        steps_meta = [
            {
                "time": "10:02:00 IST",
                "title": "Step 1: Citizen 1930 Intake",
                "desc": "Victim in Pune reports INR 75,000 fraudulent debit following a fake MSEDCL electricity bill SMS. Anchor UTR: UPI202608280001.",
                "status": CaseStatus.ANCHORED,
                "nodes_count": 1,
                "edges_count": 0,
                "show_forecast": False,
                "show_withdrawal": False
            },
            {
                "time": "10:04:30 IST",
                "title": "Step 2: Layer 1 Mule Hop Ingested",
                "desc": "Bank A automated switch confirms INR 75,000 pushed to Bank B (HDFC Pune mule account: acct_mule_782). Risk score: 88%.",
                "status": CaseStatus.ENRICHING,
                "nodes_count": 2,
                "edges_count": 1,
                "show_forecast": False,
                "show_withdrawal": False
            },
            {
                "time": "10:09:45 IST",
                "title": "Step 3: Layer 2 Concentrator Mule Hop",
                "desc": "Bank B confirms 100% pass-through within 7 mins: INR 58,000 sent to Bank C (ICICI Pune concentrator: acct_mule_991).",
                "status": CaseStatus.ENRICHING,
                "nodes_count": 3,
                "edges_count": 2,
                "show_forecast": False,
                "show_withdrawal": False
            },
            {
                "time": "10:12:45 IST",
                "title": "Step 4: Terminal Card Hop & Spatial Forecast",
                "desc": "Bank C confirms INR 40,000 sent to Bank D (Axis Bank ATM cashout card: acct_cashout_110). AI Engine generates Pune FC Road corridor forecast (82% Conf).",
                "status": CaseStatus.FORECAST_READY,
                "nodes_count": 4,
                "edges_count": 3,
                "show_forecast": True,
                "show_withdrawal": False
            },
            {
                "time": "10:15:00 IST",
                "title": "Step 5: Duty Officer Human Sign-Off & Dispatch",
                "desc": "DSP R. Patil approves Action Packet ACT-CASE-2026-041-01. High-priority dispatch sent to Deccan Cyber Beat Unit 3 & Bank D card hold.",
                "status": CaseStatus.ACTION_APPROVED,
                "nodes_count": 4,
                "edges_count": 3,
                "show_forecast": True,
                "show_withdrawal": False
            },
            {
                "time": "10:27:00 IST",
                "title": "Step 6: Ground-Truth Cash-Out Interception",
                "desc": "Syndicate runner attempts cash-out at SBI ATM (ATM-PUN-204) on FC Road Near Goodluck Chowk. Intercepted inside Rank #1 Zone with 15min advance lead time!",
                "status": CaseStatus.OUTCOME_RECORDED,
                "nodes_count": 4,
                "edges_count": 3,
                "show_forecast": True,
                "show_withdrawal": True
            }
        ]

        current_meta = steps_meta[step_index]
        all_nodes = db.nodes.get(case_id, [])
        all_edges = db.edges.get(case_id, [])

        active_nodes = all_nodes[:current_meta["nodes_count"]]
        active_edges = all_edges[:current_meta["edges_count"]]

        # Forecast Object if step >= 3
        forecast_obj = None
        if current_meta["show_forecast"]:
            from .forecast_engine import forecast_engine
            forecast_obj = forecast_engine.compute_cashout_hotspots(case_id, 0.94, "10:12:00", 40000.0)

        # Ground Truth Withdrawal if step == 5
        withdrawal_obj = None
        if current_meta["show_withdrawal"]:
            withdrawal_obj = db.withdrawals.get(case_id)

        return ReplayState(
            case_id=case_id,
            current_step=step_index,
            total_steps=self.total_steps,
            step_title=current_meta["title"],
            step_time=current_meta["time"],
            step_description=current_meta["desc"],
            graph_nodes=active_nodes,
            graph_edges=active_edges,
            forecast=forecast_obj,
            withdrawal_revealed=withdrawal_obj,
            status=current_meta["status"]
        )

scenario_player = ScenarioPlayer()
