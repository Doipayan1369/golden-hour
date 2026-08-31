from datetime import datetime
from typing import List, Dict, Any, Optional
from ..schemas.models import HotspotZone, FactorContribution, ForecastResponse, DataMode, AccountNode, TransactionEdge, ATM

class ForecastEngine:
    def __init__(self):
        self.model_version = "risk-v1.0-pune-spatial-kde"

    def generate_forecast(
        self,
        case_id: str,
        nodes: Optional[List[AccountNode]] = None,
        edges: Optional[List[TransactionEdge]] = None,
        all_atms: Optional[List[ATM]] = None,
        current_time_str: str = "10:12"
    ) -> ForecastResponse:
        return self.compute_cashout_hotspots(case_id, 0.94, current_time_str, 50000.0)

    def compute_cashout_hotspots(
        self,
        case_id: str,
        risk_score: float = 0.94,
        last_hop_time: str = "10:06:50",
        amount_inr: float = 50000.0
    ) -> ForecastResponse:
        zones = [
            HotspotZone(
                hotspot_id="ZONE-041-01",
                case_id=case_id,
                zone_label="FC Road & Deccan Gymkhana Commercial Strip, Pune (Epicenter)",
                center_lat=18.5175,
                center_lon=73.8415,
                radius_m=1800,
                ranking_score=0.94,
                expected_window_start="10:20",
                expected_window_end="10:35",
                factors=[
                    FactorContribution(
                        name="ATM Density & 24x7 Kiosk Concentration",
                        contribution=0.38,
                        description="Highest cluster density of 24x7 cash-out kiosks in Pune within 500m of Goodluck Chowk.",
                        source_ref="PUNE_ATM_GEO_CLUSTER"
                    ),
                    FactorContribution(
                        name="Multi-Hop Velocity Vector",
                        contribution=0.32,
                        description="15th hop terminal card token was authorized through Fergusson Gate / Deccan switch node.",
                        source_ref="HOP15_TERMINAL_CARD_TRACE"
                    ),
                    FactorContribution(
                        name="Transit & Egress Speed",
                        contribution=0.24,
                        description="Direct arterial connections to Karve Road, JM Road, and Shivaji Nagar enable rapid vehicle getaway.",
                        source_ref="PUNE_TRAFFIC_NETWORK"
                    )
                ],
                supporting_records_count=15,
                status="PREDICTED",
                nearby_atm_ids=[
                    "ATM-PUN-204", "ATM-PUN-205", "ATM-PUN-206", "ATM-PUN-207", 
                    "ATM-PUN-208", "ATM-PUN-209", "ATM-PUN-210", "ATM-PUN-211",
                    "ATM-PUN-212", "ATM-PUN-101", "ATM-PUN-102", "ATM-PUN-103",
                    "ATM-PUN-301", "ATM-PUN-302", "ATM-PUN-401"
                ],
                jurisdiction_station="PS-DECCAN (Deccan Cyber Police Station)"
            ),
            HotspotZone(
                hotspot_id="ZONE-041-02",
                case_id=case_id,
                zone_label="JM Road & Sambhaji Park Banking Corridor",
                center_lat=18.5245,
                center_lon=73.8470,
                radius_m=1200,
                ranking_score=0.78,
                expected_window_start="10:25",
                expected_window_end="10:40",
                factors=[
                    FactorContribution(
                        name="Secondary Transit Axis",
                        contribution=0.45,
                        description="Parallel major arterial road with 4 branch e-lobbies.",
                        source_ref="JM_ROAD_COMMERCIAL_FEED"
                    )
                ],
                supporting_records_count=6,
                status="PREDICTED",
                nearby_atm_ids=["ATM-PUN-207", "ATM-PUN-210", "ATM-PUN-208"],
                jurisdiction_station="PS-DECCAN"
            ),
            HotspotZone(
                hotspot_id="ZONE-041-03",
                case_id=case_id,
                zone_label="Shivaji Nagar Railway & Bus Interchange",
                center_lat=18.5320,
                center_lon=73.8450,
                radius_m=1000,
                ranking_score=0.68,
                expected_window_start="10:30",
                expected_window_end="10:45",
                factors=[
                    FactorContribution(
                        name="Transit Egress Node",
                        contribution=0.50,
                        description="State bus terminal and commuter rail interchange.",
                        source_ref="SHIVAJINAGAR_TRANSIT_FEED"
                    )
                ],
                supporting_records_count=4,
                status="PREDICTED",
                nearby_atm_ids=["ATM-PUN-209"],
                jurisdiction_station="PS-SHIVAJI"
            )
        ]

        return ForecastResponse(
            case_id=case_id,
            generated_at="2026-08-29T10:10:00+05:30",
            model_version=self.model_version,
            data_mode=DataMode.SIMULATION,
            top_zones=zones,
            suggested_interventions=[
                "Dispatch Deccan Cyber Beat Unit 3 (PCR-PUN-03) immediately to State Bank of India (FC Road Goodluck Chowk).",
                "Serve Section 91 CrPC digital hold notice to Axis Bank & SBI Nodal Desk on terminal card token acct_cashout_terminal.",
                "Alert Shivaji Nagar bus terminal kiosk operators of potential cashout attempts with card token ending in 9901."
            ],
            confidence_interval="94% (High Accuracy Cluster Match)",
            recommended_dispatch_time="10:12:00 IST (15 minutes advance warning ahead of expected 10:27 withdrawal)"
        )

forecast_engine = ForecastEngine()
