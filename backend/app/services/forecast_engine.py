from datetime import datetime
from typing import List, Dict, Any, Optional
from ..schemas.models import HotspotZone, FactorContribution, ForecastResponse, DataMode, AccountNode, TransactionEdge, ATM

class ForecastEngine:
    def __init__(self):
        self.model_version = "risk-v0.1-pune-dbscan"

    def generate_forecast(
        self,
        case_id: str,
        nodes: Optional[List[AccountNode]] = None,
        edges: Optional[List[TransactionEdge]] = None,
        all_atms: Optional[List[ATM]] = None,
        current_time_str: str = "10:12"
    ) -> ForecastResponse:
        return self.compute_cashout_hotspots(case_id, 0.82, current_time_str, 40000.0)

    def compute_cashout_hotspots(
        self,
        case_id: str,
        risk_score: float = 0.82,
        last_hop_time: str = "10:12:00",
        amount_inr: float = 40000.0
    ) -> ForecastResponse:
        zones = [
            HotspotZone(
                hotspot_id="ZONE-041-01",
                case_id=case_id,
                zone_label="FC Road & Deccan Gymkhana Commercial Corridor, Pune",
                center_lat=18.5204,
                center_lon=73.8400,
                radius_m=1800,
                ranking_score=0.82,
                expected_window_start="10:25",
                expected_window_end="10:40",
                factors=[
                    FactorContribution(
                        name="ATM Proximity & Density",
                        contribution=0.35,
                        description="High density of 24x7 off-site bank ATM kiosks clustered along FC Road and Deccan Gymkhana commercial strip.",
                        source_ref="PUNE_ATM_GEO_CLUSTER"
                    ),
                    FactorContribution(
                        name="Historical Mule Velocity",
                        contribution=0.28,
                        description="Prior cash-out incidents from the same syndicate occurred within 18 minutes of Hop 3 in Deccan sector.",
                        source_ref="I4C_MODUS_OPERANDI_PUNE"
                    ),
                    FactorContribution(
                        name="Transit Access Velocity",
                        contribution=0.20,
                        description="Arterial connection along JM Road and Karve Road enables rapid getaway vehicle egress.",
                        source_ref="PUNE_TRAFFIC_CORRIDOR_GRAPH"
                    )
                ],
                supporting_records_count=7,
                status="PREDICTED",
                nearby_atm_ids=["ATM-PUN-204", "ATM-PUN-205", "ATM-PUN-206", "ATM-PUN-207", "ATM-PUN-208", "ATM-PUN-210"],
                jurisdiction_station="PS-DECCAN (Deccan Cyber Police)"
            ),
            HotspotZone(
                hotspot_id="ZONE-041-02",
                case_id=case_id,
                zone_label="Shivaji Nagar Transit Terminal & Bus Hub",
                center_lat=18.5320,
                center_lon=73.8450,
                radius_m=1200,
                ranking_score=0.58,
                expected_window_start="10:30",
                expected_window_end="10:50",
                factors=[
                    FactorContribution(
                        name="Transit Egress Node",
                        contribution=0.32,
                        description="High-frequency railway & state transport interchange with dense commuter kiosks.",
                        source_ref="SHIVAJINAGAR_TRANSIT_FEED"
                    ),
                    FactorContribution(
                        name="ATM Density",
                        contribution=0.26,
                        description="Multiple nationalized bank kiosks along Congress Bhavan road.",
                        source_ref="PUNE_MUNICIPAL_CORP_ATM"
                    )
                ],
                supporting_records_count=4,
                status="PREDICTED",
                nearby_atm_ids=["ATM-PUN-209"],
                jurisdiction_station="PS-SHIVAJI (Shivaji Nagar Police Station)"
            ),
            HotspotZone(
                hotspot_id="ZONE-041-03",
                case_id=case_id,
                zone_label="Kothrud / Paud Road Commercial Strip",
                center_lat=18.5080,
                center_lon=73.8090,
                radius_m=1500,
                ranking_score=0.44,
                expected_window_start="10:35",
                expected_window_end="10:55",
                factors=[
                    FactorContribution(
                        name="Residential Outskirt Route",
                        contribution=0.25,
                        description="Western Pune bypass route towards Chandani Chowk and Mumbai-Bangalore highway.",
                        source_ref="WEST_PUNE_HIGHWAY_FEED"
                    ),
                    FactorContribution(
                        name="ATM Availability",
                        contribution=0.19,
                        description="Commercial retail ATMs along Karve Road Paud Road axis.",
                        source_ref="BANK_DIRECTORY_PUNE"
                    )
                ],
                supporting_records_count=3,
                status="PREDICTED",
                nearby_atm_ids=["ATM-PUN-101", "ATM-PUN-102", "ATM-PUN-103"],
                jurisdiction_station="PS-KOTHRUD (Kothrud Cyber Division)"
            )
        ]

        return ForecastResponse(
            case_id=case_id,
            model_version=self.model_version,
            data_mode=DataMode.SIMULATION,
            top_zones=zones,
            human_review_required=True,
            overall_confidence=0.82,
            generated_at=datetime.now().strftime("%Y-%m-%dT%H:%M:%S+05:30")
        )

forecast_engine = ForecastEngine()
