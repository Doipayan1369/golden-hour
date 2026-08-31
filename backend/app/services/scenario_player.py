from datetime import datetime
from typing import List, Dict, Any, Optional
from ..schemas.models import ReplayState, CaseStatus, AccountNode, TransactionEdge, ForecastResponse
from ..database import db

class ScenarioPlayer:
    def __init__(self):
        self.steps_catalog: Dict[str, List[Dict[str, Any]]] = {
            "CASE-2026-041": [
                {
                    "step_index": 1,
                    "title": "1930 Incident Intake & Initial UTR Anchor",
                    "time": "09:42:00 IST (Saturday, 29 Aug 2026)",
                    "description": "Victim Ramesh Patil files emergency 1930 cyber fraud complaint. Initial INR 4,50,000 debit detected via fake CBI Digital Arrest extortion call.",
                    "reveals_nodes": ["node_victim", "node_mule_01"],
                    "reveals_edges": ["hop_01"],
                    "include_forecast": False,
                    "reveal_withdrawal": False,
                    "status": CaseStatus.ANCHORED
                },
                {
                    "step_index": 2,
                    "title": "Layer 1 to Layer 2 Primary Mule Splitting (Hops 1-3)",
                    "time": "09:45:10 IST (Saturday, 29 Aug 2026)",
                    "description": "ICICI Mule 1 forwards INR 4,50,000 in two rapid splits to HDFC FC Road (Hop 2: INR 2.2L) and Axis JM Road (Hop 3: INR 2.3L).",
                    "reveals_nodes": ["node_victim", "node_mule_01", "node_mule_02", "node_mule_03"],
                    "reveals_edges": ["hop_01", "hop_02", "hop_03"],
                    "include_forecast": False,
                    "reveal_withdrawal": False,
                    "status": CaseStatus.ENRICHING
                },
                {
                    "step_index": 3,
                    "title": "Layer 3 & Layer 4 Rapid Micro-Layering (Hops 4-14)",
                    "time": "10:03:40 IST (Saturday, 29 Aug 2026)",
                    "description": "Funds fan out across 11 sub-mule accounts across Deccan, Ghole Road, Karve Road, and Shivaji Nagar in under 18 minutes.",
                    "reveals_nodes": [
                        "node_victim", "node_mule_01", "node_mule_02", "node_mule_03", "node_mule_04", 
                        "node_mule_05", "node_mule_06", "node_mule_07", "node_mule_08", "node_mule_09",
                        "node_mule_10", "node_mule_11", "node_mule_12", "node_mule_13", "node_mule_14"
                    ],
                    "reveals_edges": [
                        "hop_01", "hop_02", "hop_03", "hop_04", "hop_05", "hop_06", "hop_07", 
                        "hop_08", "hop_09", "hop_10", "hop_11", "hop_12", "hop_13", "hop_14"
                    ],
                    "include_forecast": False,
                    "reveal_withdrawal": False,
                    "status": CaseStatus.GRAPH_READY
                },
                {
                    "step_index": 4,
                    "title": "Terminal Hop 15 & Continuous Thermal Radar Prediction",
                    "time": "10:10:00 IST (Saturday, 29 Aug 2026)",
                    "description": "Hop 15 reaches Terminal Cashout Card. AI KDE model pinpoints FC Road Goodluck Chowk Corridor with 94% confidence.",
                    "reveals_nodes": [
                        "node_victim", "node_mule_01", "node_mule_02", "node_mule_03", "node_mule_04", 
                        "node_mule_05", "node_mule_06", "node_mule_07", "node_mule_08", "node_mule_09",
                        "node_mule_10", "node_mule_11", "node_mule_12", "node_mule_13", "node_mule_14", 
                        "node_cashout_terminal"
                    ],
                    "reveals_edges": [
                        "hop_01", "hop_02", "hop_03", "hop_04", "hop_05", "hop_06", "hop_07", 
                        "hop_08", "hop_09", "hop_10", "hop_11", "hop_12", "hop_13", "hop_14", "hop_15"
                    ],
                    "include_forecast": True,
                    "reveal_withdrawal": False,
                    "status": CaseStatus.FORECAST_READY
                },
                {
                    "step_index": 5,
                    "title": "Deccan Beat Unit 3 Dispatch & Section 91 CrPC Hold",
                    "time": "10:14:00 IST (Saturday, 29 Aug 2026)",
                    "description": "Duty Officer signs digital action packet. Patrol Unit PCR-PUN-03 dispatched to SBI ATM Goodluck Chowk (13 minutes lead time).",
                    "reveals_nodes": [
                        "node_victim", "node_mule_01", "node_mule_02", "node_mule_03", "node_mule_04", 
                        "node_mule_05", "node_mule_06", "node_mule_07", "node_mule_08", "node_mule_09",
                        "node_mule_10", "node_mule_11", "node_mule_12", "node_mule_13", "node_mule_14", 
                        "node_cashout_terminal"
                    ],
                    "reveals_edges": [
                        "hop_01", "hop_02", "hop_03", "hop_04", "hop_05", "hop_06", "hop_07", 
                        "hop_08", "hop_09", "hop_10", "hop_11", "hop_12", "hop_13", "hop_14", "hop_15"
                    ],
                    "include_forecast": True,
                    "reveal_withdrawal": False,
                    "status": CaseStatus.ACTION_APPROVED
                },
                {
                    "step_index": 6,
                    "title": "Ground-Truth Withdrawal Blocked at SBI FC Road (10:27 IST)",
                    "time": "10:27:00 IST (Saturday, 29 Aug 2026)",
                    "description": "Mule attempts INR 50,000 cash withdrawal at SBI ATM-PUN-204 Goodluck Chowk. Intercepted by Beat Patrol 3. 100% Funds Secured.",
                    "reveals_nodes": [
                        "node_victim", "node_mule_01", "node_mule_02", "node_mule_03", "node_mule_04", 
                        "node_mule_05", "node_mule_06", "node_mule_07", "node_mule_08", "node_mule_09",
                        "node_mule_10", "node_mule_11", "node_mule_12", "node_mule_13", "node_mule_14", 
                        "node_cashout_terminal"
                    ],
                    "reveals_edges": [
                        "hop_01", "hop_02", "hop_03", "hop_04", "hop_05", "hop_06", "hop_07", 
                        "hop_08", "hop_09", "hop_10", "hop_11", "hop_12", "hop_13", "hop_14", "hop_15"
                    ],
                    "include_forecast": True,
                    "reveal_withdrawal": True,
                    "status": CaseStatus.OUTCOME_RECORDED
                }
            ]
        }

    def get_replay_state(self, case_id: str, step_index: Optional[int] = None) -> ReplayState:
        catalog = self.steps_catalog.get(case_id, self.steps_catalog["CASE-2026-041"])
        total_steps = len(catalog)
        step_idx = 1 if step_index is None or step_index == 0 else max(1, min(total_steps, step_index))
        step_def = catalog[step_idx - 1]

        all_nodes = db.nodes.get(case_id, db.nodes.get("CASE-2026-041", []))
        all_edges = db.edges.get(case_id, db.edges.get("CASE-2026-041", []))

        active_nodes = [n for n in all_nodes if n.node_id in step_def["reveals_nodes"]]
        active_edges = [e for e in all_edges if e.edge_id in step_def["reveals_edges"]]

        forecast = None
        if step_def["include_forecast"]:
            from .forecast_engine import forecast_engine
            forecast = forecast_engine.generate_forecast(case_id)

        withdrawal = None
        if step_def["reveal_withdrawal"]:
            withdrawal = db.withdrawals.get(case_id)

        return ReplayState(
            case_id=case_id,
            current_step=step_idx,
            total_steps=total_steps,
            step_title=step_def["title"],
            step_time=step_def["time"],
            step_description=step_def["description"],
            graph_nodes=active_nodes,
            graph_edges=active_edges,
            forecast=forecast,
            withdrawal_revealed=withdrawal,
            status=step_def["status"]
        )

scenario_player = ScenarioPlayer()
