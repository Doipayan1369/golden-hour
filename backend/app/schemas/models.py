from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class DataMode(str, Enum):
    SIMULATION = "SIMULATION"
    UPLOADED = "UPLOADED"
    CONNECTED = "CONNECTED"

class CaseStatus(str, Enum):
    NEW = "NEW"
    ANCHORED = "ANCHORED"
    ENRICHING = "ENRICHING"
    GRAPH_READY = "GRAPH_READY"
    FORECAST_READY = "FORECAST_READY"
    AWAITING_REVIEW = "AWAITING_REVIEW"
    ACTION_APPROVED = "ACTION_APPROVED"
    ACTION_ACKNOWLEDGED = "ACTION_ACKNOWLEDGED"
    OUTCOME_RECORDED = "OUTCOME_RECORDED"
    NEEDS_DATA = "NEEDS_DATA"
    CLOSED = "CLOSED"
    DEFERRED = "DEFERRED"
    REJECTED = "REJECTED"

class SeverityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    ELEVATED = "ELEVATED"
    MONITORING = "MONITORING"

class EdgeStatus(str, Enum):
    CONFIRMED = "CONFIRMED"
    PENDING = "PENDING"
    UNAVAILABLE = "UNAVAILABLE"
    REJECTED = "REJECTED"

class NodeType(str, Enum):
    VICTIM = "VICTIM"
    MULE_LAYER_1 = "MULE_LAYER_1"
    MULE_LAYER_2 = "MULE_LAYER_2"
    CASHOUT_DEST = "CASHOUT_DEST"
    WALLET = "WALLET"
    MERCHANT = "MERCHANT"

class UserRole(str, Enum):
    ANALYST = "I4C_STATE_ANALYST"
    POLICE_OFFICER = "LOCAL_BEAT_OFFICER"
    BANK_INVESTIGATOR = "BANK_NODAL_INVESTIGATOR"

class AccountNode(BaseModel):
    node_id: str
    institution_id: str
    institution_name: str
    account_token: str
    node_type: NodeType
    first_seen: str
    last_seen: str
    privacy_class: str = "CONFIDENTIAL_TOKENIZED"
    risk_score: float = 0.0
    total_received_inr: float = 0.0
    total_forwarded_inr: float = 0.0
    pass_through_ratio: float = 0.0
    velocity_mins: Optional[float] = None
    flags: List[str] = []
    source_ref: Optional[str] = None

class TransactionEdge(BaseModel):
    edge_id: str
    case_id: str
    source_node: str
    target_node: str
    amount_inr: float
    occurred_at: str
    utr: str
    status: EdgeStatus
    source_ref: str
    source_institution: str
    destination_institution: str
    hop_order: int
    velocity_minutes_from_prior: Optional[float] = None
    request_owner: Optional[str] = None
    request_timer_mins: Optional[int] = None
    gap_reason: Optional[str] = None

class ATM(BaseModel):
    atm_id: str
    bank_name: str
    operator_id: str
    latitude: float
    longitude: float
    locality: str
    station_id: str
    active: bool = True
    cash_out_frequency: str = "NORMAL"

class PoliceStation(BaseModel):
    station_id: str
    name: str
    jurisdiction: str
    latitude: float
    longitude: float
    contact_number: str
    beat_units_available: int = 3

class FactorContribution(BaseModel):
    name: str
    contribution: float
    description: str
    source_ref: Optional[str] = "BANK_SWITCH_TELEMETRY"

class HotspotZone(BaseModel):
    hotspot_id: str
    case_id: str
    zone_label: str
    center_lat: float
    center_lon: float
    radius_m: int
    ranking_score: float
    expected_window_start: str
    expected_window_end: str
    factors: List[FactorContribution]
    supporting_records_count: int
    status: str = "PREDICTED"
    nearby_atm_ids: List[str] = []
    jurisdiction_station: str = ""

class ForecastResponse(BaseModel):
    case_id: str
    model_version: str = "risk-v0.1"
    data_mode: str = "SIMULATION"
    top_zones: List[HotspotZone]
    human_review_required: bool = True
    overall_confidence: float = 0.82
    generated_at: str

class WithdrawalEvent(BaseModel):
    event_id: str
    case_id: str
    account_node: str
    atm_id: str
    atm_name: str
    amount_inr: float
    occurred_at: str
    source_ref: str
    latitude: float
    longitude: float
    observed_or_simulated: str = "SIMULATED"

class Case(BaseModel):
    case_id: str
    source: str = "NCRP_1930"
    created_at: str
    jurisdiction: str
    severity: SeverityLevel
    status: CaseStatus
    fraud_type: str = "UPI Impersonation / QR Scam"
    amount_inr: float
    utr: str
    source_institution: str
    victim_account_token: str
    victim_phone_token: str
    victim_name_masked: str
    data_freshness_minutes: int
    assigned_beat: Optional[str] = None
    assigned_bank: Optional[str] = None
    priority_score: float = 0.85
    timeline_summary: List[str] = []

class ActionPacket(BaseModel):
    action_id: str
    case_id: str
    action_type: str
    target_recipients: List[str]
    suggested_action: str
    priority_zone: str
    expected_window: str
    created_by: str
    created_at: str
    approved_by: Optional[str] = None
    approved_at: Optional[str] = None
    status: str = "DRAFT"
    acknowledgement_ref: Optional[str] = None
    acknowledgement_by: Optional[str] = None
    acknowledgement_at: Optional[str] = None
    cancellation_reason: Optional[str] = None
    clarification_note: Optional[str] = None
    disclaimer: str = "DECISION SUPPORT ONLY: Action packet subject to officer validation and standard operating procedure."

class AuditEvent(BaseModel):
    audit_id: str
    case_id: str
    actor_id: str
    actor_role: str
    action: str
    timestamp: str
    payload_summary: Dict[str, Any]
    payload_hash: str
    previous_hash: str
    event_hash: str
    source_mode: str = "SIMULATION"

class AuditVerification(BaseModel):
    total_events: int
    chain_valid: bool
    genesis_hash: str
    latest_hash: str
    verified_at: str

class Feedback(BaseModel):
    feedback_id: str
    case_id: str
    officer_id: str
    officer_role: str
    rating: str
    comment: str
    submitted_at: str

class ScenarioCatalogItem(BaseModel):
    scenario_id: str
    case_id: str
    title: str
    category: str
    fraud_pattern: str
    event_count: int
    expected_zone: str
    ground_truth_atm: str
    difficulty: str
    pass_fail_status: str = "PASSED"

class ReportRecord(BaseModel):
    report_id: str
    case_id: str
    title: str
    report_type: str
    created_at: str
    created_by: str
    format: str = "PDF"
    status: str = "GENERATED"
    summary_text: str

class TraceRequestPayload(BaseModel):
    case_id: str
    target_institution: str
    requested_scope: str
    time_window: str
    reason: str
    officer_id: str

class IntakeValidationResponse(BaseModel):
    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    duplicate_case_id: Optional[str] = None
    normalized_data: Optional[Dict[str, Any]] = None

class ReplayState(BaseModel):
    case_id: str
    current_step: int
    total_steps: int
    step_title: str
    step_time: str
    step_description: str
    graph_nodes: List[AccountNode]
    graph_edges: List[TransactionEdge]
    forecast: Optional[ForecastResponse]
    withdrawal_revealed: Optional[WithdrawalEvent] = None
    status: CaseStatus
