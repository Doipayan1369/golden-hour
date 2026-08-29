export type DataMode = 'SIMULATION' | 'UPLOADED' | 'CONNECTED';

export type CaseStatus = 
  | 'NEW' 
  | 'ANCHORED' 
  | 'ENRICHING' 
  | 'GRAPH_READY' 
  | 'FORECAST_READY' 
  | 'AWAITING_REVIEW' 
  | 'ACTION_APPROVED' 
  | 'ACTION_ACKNOWLEDGED' 
  | 'OUTCOME_RECORDED' 
  | 'NEEDS_DATA' 
  | 'CLOSED'
  | 'DEFERRED'
  | 'REJECTED';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MONITORING';

export type EdgeStatus = 'CONFIRMED' | 'PENDING' | 'UNAVAILABLE' | 'REJECTED';

export type NodeType = 
  | 'VICTIM' 
  | 'MULE_LAYER_1' 
  | 'MULE_LAYER_2' 
  | 'CASHOUT_DEST' 
  | 'WALLET' 
  | 'MERCHANT';

export type UserRole = 
  | 'I4C_STATE_ANALYST' 
  | 'LOCAL_BEAT_OFFICER' 
  | 'BANK_NODAL_INVESTIGATOR';

export interface AccountNode {
  node_id: string;
  institution_id: string;
  institution_name: string;
  account_token: string;
  node_type: NodeType;
  first_seen: string;
  last_seen: string;
  privacy_class: string;
  risk_score: number;
  total_received_inr: number;
  total_forwarded_inr: number;
  pass_through_ratio: number;
  velocity_mins?: number | null;
  flags: string[];
  source_ref?: string | null;
}

export interface TransactionEdge {
  edge_id: string;
  case_id: string;
  source_node: string;
  target_node: string;
  amount_inr: number;
  occurred_at: string;
  utr: string;
  status: EdgeStatus;
  source_ref: string;
  source_institution: string;
  destination_institution: string;
  hop_order: number;
  velocity_minutes_from_prior?: number | null;
  request_owner?: string | null;
  request_timer_mins?: number | null;
  gap_reason?: string | null;
}

export interface ATM {
  atm_id: string;
  bank_name: string;
  operator_id: string;
  latitude: number;
  longitude: number;
  locality: string;
  station_id: string;
  active: boolean;
  cash_out_frequency: string;
}

export interface PoliceStation {
  station_id: string;
  name: string;
  jurisdiction: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  beat_units_available: number;
}

export interface FactorContribution {
  name: string;
  contribution: number;
  description: string;
  source_ref?: string | null;
}

export interface HotspotZone {
  hotspot_id: string;
  case_id: string;
  zone_label: string;
  center_lat: number;
  center_lon: number;
  radius_m: number;
  ranking_score: number;
  expected_window_start: string;
  expected_window_end: string;
  factors: FactorContribution[];
  supporting_records_count: number;
  status: string;
  nearby_atm_ids: string[];
  jurisdiction_station: string;
}

export interface ForecastResponse {
  case_id: string;
  model_version: string;
  data_mode: DataMode;
  top_zones: HotspotZone[];
  human_review_required: boolean;
  overall_confidence: number;
  generated_at: string;
}

export interface WithdrawalEvent {
  event_id: string;
  case_id: string;
  account_node: string;
  atm_id: string;
  atm_name: string;
  amount_inr: number;
  occurred_at: string;
  source_ref: string;
  latitude: number;
  longitude: number;
  observed_or_simulated: string;
}

export interface Case {
  case_id: string;
  source: string;
  created_at: string;
  jurisdiction: string;
  severity: SeverityLevel;
  status: CaseStatus;
  fraud_type: string;
  amount_inr: number;
  utr: string;
  source_institution: string;
  victim_account_token: string;
  victim_phone_token: string;
  victim_name_masked: string;
  data_freshness_minutes: number;
  assigned_beat?: string | null;
  assigned_bank?: string | null;
  priority_score: number;
  timeline_summary: string[];
}

export interface ActionPacket {
  action_id: string;
  case_id: string;
  action_type: string;
  target_recipients: string[];
  suggested_action: string;
  priority_zone: string;
  expected_window: string;
  created_by: string;
  created_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
  status: 'DRAFT' | 'APPROVED' | 'ACKNOWLEDGED' | 'REJECTED';
  acknowledgement_ref?: string | null;
  acknowledgement_by?: string | null;
  acknowledgement_at?: string | null;
  cancellation_reason?: string | null;
  clarification_note?: string | null;
  disclaimer: string;
}

export interface AuditEvent {
  audit_id: string;
  case_id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  timestamp: string;
  payload_summary: Record<string, any>;
  payload_hash: string;
  previous_hash: string;
  event_hash: string;
  source_mode: string;
}

export interface AuditVerification {
  total_events: number;
  chain_valid: boolean;
  genesis_hash: string;
  latest_hash: string;
  verified_at: string;
}

export interface Feedback {
  feedback_id: string;
  case_id: string;
  officer_id: string;
  officer_role: string;
  rating: string;
  comment: string;
  submitted_at: string;
}

export interface ScenarioCatalogItem {
  scenario_id: string;
  case_id: string;
  title: string;
  category: string;
  fraud_pattern: string;
  event_count: number;
  expected_zone: string;
  ground_truth_atm: string;
  difficulty: string;
  pass_fail_status: string;
}

export interface ReportRecord {
  report_id: string;
  case_id: string;
  title: string;
  report_type: string;
  created_at: string;
  created_by: string;
  format: string;
  status: string;
  summary_text: string;
}

export interface ReplayState {
  case_id: string;
  current_step: number;
  total_steps: number;
  step_title: string;
  step_time: string;
  step_description: string;
  graph_nodes: AccountNode[];
  graph_edges: TransactionEdge[];
  forecast?: ForecastResponse | null;
  withdrawal_revealed?: WithdrawalEvent | null;
  status: CaseStatus;
}
