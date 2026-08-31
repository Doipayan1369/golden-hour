import { 
  Case, AccountNode, TransactionEdge, ATM, PoliceStation, 
  ActionPacket, AuditEvent, AuditVerification, ReplayState, 
  ScenarioCatalogItem, ReportRecord, SeverityLevel, CaseStatus, NodeType, EdgeStatus, ForecastResponse
} from '../types';

export const MOCK_ATMS: ATM[] = [
  { atm_id: "ATM-PUN-204", bank_name: "State Bank of India (FC Road Branch)", operator_id: "OP-204", latitude: 18.5175, longitude: 73.8415, locality: "FC Road Near Goodluck Chowk, Deccan", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-205", bank_name: "HDFC Bank 24x7 e-Lobby", operator_id: "OP-205", latitude: 18.5210, longitude: 73.8428, locality: "Deccan Gymkhana Commercial Complex", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-206", bank_name: "ICICI Bank Kiosk", operator_id: "OP-206", latitude: 18.5228, longitude: 73.8398, locality: "Fergusson College Main Gate, FC Road", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-207", bank_name: "Axis Bank 24x7 Lounge", operator_id: "OP-207", latitude: 18.5245, longitude: 73.8470, locality: "JM Road, Near Sambhaji Park", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-208", bank_name: "Bank of Maharashtra Main", operator_id: "OP-208", latitude: 18.5160, longitude: 73.8405, locality: "Deccan Gymkhana Post Office Chowk", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-209", bank_name: "Punjab National Bank Transit Hub", operator_id: "OP-209", latitude: 18.5320, longitude: 73.8450, locality: "Shivaji Nagar Bus Terminal Concourse", station_id: "PS-SHIVAJI", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-210", bank_name: "Kotak Mahindra Bank e-Lobby", operator_id: "OP-210", latitude: 18.5260, longitude: 73.8435, locality: "Ghole Road Commercial Plaza", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-211", bank_name: "IndusInd Bank 24x7 Kiosk", operator_id: "OP-211", latitude: 18.5242, longitude: 73.8390, locality: "Tukaram Paduka Chowk, FC Road", station_id: "PS-DECCAN", active: true, cash_out_frequency: "HIGH_CASHOUT" },
  { atm_id: "ATM-PUN-212", bank_name: "IDFC First Bank Branch ATM", operator_id: "OP-212", latitude: 18.5150, longitude: 73.8430, locality: "Garware Bridge Corner, Deccan", station_id: "PS-DECCAN", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-101", bank_name: "Canara Bank ATM Hub", operator_id: "OP-101", latitude: 18.5090, longitude: 73.8310, locality: "Karve Road Chowk, Erandwane", station_id: "PS-KOTHRUD", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-102", bank_name: "Union Bank of India Kiosk", operator_id: "OP-102", latitude: 18.5070, longitude: 73.8080, locality: "Paud Road, Near MIT College Kothrud", station_id: "PS-KOTHRUD", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-103", bank_name: "State Bank of India (Kothrud)", operator_id: "OP-103", latitude: 18.5060, longitude: 73.8120, locality: "Chandani Chowk Approach Road", station_id: "PS-KOTHRUD", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-301", bank_name: "State Bank of India Metro ATM", operator_id: "OP-301", latitude: 18.5650, longitude: 73.9130, locality: "Viman Nagar Datta Mandir Chowk", station_id: "PS-VIMAN", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-302", bank_name: "Axis Bank Lounge", operator_id: "OP-302", latitude: 18.5620, longitude: 73.9170, locality: "Phoenix Marketcity Plaza Floor 1", station_id: "PS-VIMAN", active: true, cash_out_frequency: "NORMAL" },
  { atm_id: "ATM-PUN-401", bank_name: "HDFC Bank ATM Hub", operator_id: "OP-401", latitude: 18.5480, longitude: 73.9030, locality: "Kalyani Nagar Cyber Park Main Gate", station_id: "PS-VIMAN", active: true, cash_out_frequency: "NORMAL" }
];

export const MOCK_POLICE_STATIONS: PoliceStation[] = [
  { station_id: "PS-DECCAN", name: "Deccan Gymkhana Cyber Police Station", jurisdiction: "Pune Central / FC Road Beat", latitude: 18.5190, longitude: 73.8420, contact_number: "+91-20-25671100", beat_units_available: 4 },
  { station_id: "PS-SHIVAJI", name: "Shivaji Nagar Police Station", jurisdiction: "Pune North / Shivaji Nagar", latitude: 18.5310, longitude: 73.8465, contact_number: "+91-20-25532200", beat_units_available: 3 },
  { station_id: "PS-KOTHRUD", name: "Kothrud Cyber Crime Division", jurisdiction: "Pune West / Paud Road", latitude: 18.5080, longitude: 73.8090, contact_number: "+91-20-25434400", beat_units_available: 3 },
  { station_id: "PS-VIMAN", name: "Viman Nagar Police Station", jurisdiction: "Pune East / Airport Corridor", latitude: 18.5660, longitude: 73.9120, contact_number: "+91-20-26635500", beat_units_available: 5 }
];

export const MOCK_CASE_041: Case = {
  case_id: "CASE-2026-041",
  source: "NCRP_1930",
  created_at: "2026-08-29T09:42:00+05:30",
  jurisdiction: "Pune City Cyber Crime / Deccan Gymkhana",
  severity: "CRITICAL" as SeverityLevel,
  status: "FORECAST_READY" as CaseStatus,
  fraud_type: "Digital Arrest & CBI Extortion Cyber Syndicate",
  amount_inr: 450000.0,
  utr: "UPI202608299821",
  source_institution: "State Bank of India (Pune Camp)",
  victim_account_token: "acct_victim_patil_01",
  victim_phone_token: "+91-XXXXX-44129",
  victim_name_masked: "R**** P****",
  data_freshness_minutes: 14,
  assigned_beat: "Deccan Cyber Beat Unit 3 (PCR-PUN-03)",
  assigned_bank: "Axis Bank / SBI Nodal Desk Pune",
  priority_score: 0.96,
  timeline_summary: [
    "09:42:00 - 1930 Helpline call received from victim Ramesh Patil (INR 4,50,000 fraud debit).",
    "09:42:15 - Hop 1: SBI Pune confirmed IMPS transfer to ICICI Mule Layer 1 (acct_mule_01).",
    "09:45:10 - Hops 2-3: Rapid 2-way split to HDFC FC Road (acct_mule_02) and Axis JM Road (acct_mule_03).",
    "09:51:12 - Hops 4-7: Layer 3 secondary fan-out across Kotak, Canara, BoM, and PNB Shivaji Nagar.",
    "10:01:25 - Hops 8-14: Layer 4 micro-layering across 7 branch concentrators in Deccan corridor.",
    "10:06:50 - Hop 15: Final terminal transfer to Active Cashout Debit Card (acct_cashout_terminal).",
    "10:10:00 - Thermal Forecast generated: FC Road Goodluck Chowk Epicenter (94% Probability)."
  ]
};

export const MOCK_NODES_041: AccountNode[] = [
  { node_id: "node_victim", institution_id: "SBI_CAMP", institution_name: "State Bank of India (Pune Camp)", account_token: "acct_victim_patil_01", node_type: "VICTIM" as NodeType, first_seen: "2026-08-29T09:42:00+05:30", last_seen: "2026-08-29T09:42:15+05:30", privacy_class: "MASKED_L1", risk_score: 0.05, total_received_inr: 0.0, total_forwarded_inr: 450000.0, pass_through_ratio: 0.0, flags: ["Victim Account", "Reported on 1930 Helpline", "Pune Camp Branch"], source_ref: "1930_PUNE_COMPLAINT_9821" },
  { node_id: "node_mule_01", institution_id: "ICICI_DECCAN", institution_name: "ICICI Bank (Deccan Gymkhana)", account_token: "acct_mule_01", node_type: "MULE_LAYER_1" as NodeType, first_seen: "2026-08-29T09:42:15+05:30", last_seen: "2026-08-29T09:45:10+05:30", privacy_class: "MASKED_L1", risk_score: 0.89, total_received_inr: 450000.0, total_forwarded_inr: 450000.0, pass_through_ratio: 1.0, velocity_mins: 2.9, flags: ["Layer 1 Primary Mule", "100% Pass-Through Velocity", "Deccan Commercial Strip"], source_ref: "ICICI_SWITCH_TX_01" },
  { node_id: "node_mule_02", institution_id: "HDFC_FC", institution_name: "HDFC Bank (FC Road Branch)", account_token: "acct_mule_02", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:44:30+05:30", last_seen: "2026-08-29T09:48:22+05:30", privacy_class: "MASKED_L1", risk_score: 0.91, total_received_inr: 220000.0, total_forwarded_inr: 220000.0, pass_through_ratio: 1.0, velocity_mins: 3.8, flags: ["Layer 2 Split Node A", "Sub-4m Velocity", "FC Road Axis"], source_ref: "HDFC_SWITCH_TX_02" },
  { node_id: "node_mule_03", institution_id: "AXIS_JM", institution_name: "Axis Bank (JM Road Branch)", account_token: "acct_mule_03", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:45:10+05:30", last_seen: "2026-08-29T09:51:12+05:30", privacy_class: "MASKED_L1", risk_score: 0.90, total_received_inr: 230000.0, total_forwarded_inr: 230000.0, pass_through_ratio: 1.0, velocity_mins: 6.0, flags: ["Layer 2 Split Node B", "JM Road Banking Strip"], source_ref: "AXIS_SWITCH_TX_03" },
  { node_id: "node_mule_04", institution_id: "KOTAK_GHOLE", institution_name: "Kotak Mahindra Bank (Ghole Road)", account_token: "acct_mule_04", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:47:05+05:30", last_seen: "2026-08-29T09:54:15+05:30", privacy_class: "MASKED_L1", risk_score: 0.88, total_received_inr: 110000.0, total_forwarded_inr: 110000.0, pass_through_ratio: 1.0, velocity_mins: 7.1, flags: ["Layer 3 Sub-Split Node", "Ghole Road Plaza"], source_ref: "KOTAK_SWITCH_TX_04" },
  { node_id: "node_mule_05", institution_id: "CANARA_KARVE", institution_name: "Canara Bank (Karve Road)", account_token: "acct_mule_05", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:48:22+05:30", last_seen: "2026-08-29T09:57:30+05:30", privacy_class: "MASKED_L1", risk_score: 0.87, total_received_inr: 110000.0, total_forwarded_inr: 110000.0, pass_through_ratio: 1.0, velocity_mins: 9.1, flags: ["Layer 3 Karve Corridor"], source_ref: "CANARA_SWITCH_TX_05" },
  { node_id: "node_mule_06", institution_id: "BOM_DECCAN", institution_name: "Bank of Maharashtra (Deccan Post)", account_token: "acct_mule_06", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:49:40+05:30", last_seen: "2026-08-29T10:01:25+05:30", privacy_class: "MASKED_L1", risk_score: 0.92, total_received_inr: 115000.0, total_forwarded_inr: 115000.0, pass_through_ratio: 1.0, velocity_mins: 11.7, flags: ["Layer 3 Concentrator", "Deccan Gymkhana Hub"], source_ref: "BOM_SWITCH_TX_06" },
  { node_id: "node_mule_07", institution_id: "PNB_SHIVAJI", institution_name: "Punjab National Bank (Shivaji Nagar)", account_token: "acct_mule_07", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:51:12+05:30", last_seen: "2026-08-29T10:03:40+05:30", privacy_class: "MASKED_L1", risk_score: 0.86, total_received_inr: 115000.0, total_forwarded_inr: 65000.0, pass_through_ratio: 0.56, velocity_mins: 12.4, flags: ["Layer 3 Transit Hub Node", "Shivaji Nagar Concourse"], source_ref: "PNB_SWITCH_TX_07" },
  { node_id: "node_mule_08", institution_id: "INDUSIND_FC", institution_name: "IndusInd Bank (Fergusson Gate)", account_token: "acct_mule_08", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:53:00+05:30", last_seen: "2026-08-29T10:06:50+05:30", privacy_class: "MASKED_L1", risk_score: 0.95, total_received_inr: 60000.0, total_forwarded_inr: 50000.0, pass_through_ratio: 0.83, velocity_mins: 13.8, flags: ["Layer 4 Terminal Staging Node", "Fergusson College Strip"], source_ref: "INDUS_SWITCH_TX_08" },
  { node_id: "node_mule_09", institution_id: "UNION_PAUD", institution_name: "Union Bank (Paud Road)", account_token: "acct_mule_09", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:54:15+05:30", last_seen: "2026-08-29T09:54:15+05:30", privacy_class: "MASKED_L1", risk_score: 0.74, total_received_inr: 50000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Paud Road Sector"], source_ref: "UNION_SWITCH_TX_09" },
  { node_id: "node_mule_10", institution_id: "YES_ERANDWANE", institution_name: "Yes Bank (Erandwane)", account_token: "acct_mule_10", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:56:02+05:30", last_seen: "2026-08-29T09:56:02+05:30", privacy_class: "MASKED_L1", risk_score: 0.72, total_received_inr: 60000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Erandwane Sector"], source_ref: "YES_SWITCH_TX_10" },
  { node_id: "node_mule_11", institution_id: "FEDERAL_KOTHRUD", institution_name: "Federal Bank (Kothrud)", account_token: "acct_mule_11", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:57:30+05:30", last_seen: "2026-08-29T09:57:30+05:30", privacy_class: "MASKED_L1", risk_score: 0.68, total_received_inr: 50000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Kothrud Sector"], source_ref: "FED_SWITCH_TX_11" },
  { node_id: "node_mule_12", institution_id: "IDFC_GARWARE", institution_name: "IDFC First Bank (Garware Chowk)", account_token: "acct_mule_12", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T09:59:10+05:30", last_seen: "2026-08-29T09:59:10+05:30", privacy_class: "MASKED_L1", risk_score: 0.79, total_received_inr: 65000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Garware Bridge"], source_ref: "IDFC_SWITCH_TX_12" },
  { node_id: "node_mule_13", institution_id: "AU_LAWCOLLEGE", institution_name: "AU Small Finance (Law College Road)", account_token: "acct_mule_13", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T10:01:25+05:30", last_seen: "2026-08-29T10:01:25+05:30", privacy_class: "MASKED_L1", risk_score: 0.75, total_received_inr: 50000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Law College Strip"], source_ref: "AU_SWITCH_TX_13" },
  { node_id: "node_mule_14", institution_id: "RBL_SHIVAJI", institution_name: "RBL Bank (Shivaji Nagar Station)", account_token: "acct_mule_14", node_type: "MULE_LAYER_2" as NodeType, first_seen: "2026-08-29T10:03:40+05:30", last_seen: "2026-08-29T10:03:40+05:30", privacy_class: "MASKED_L1", risk_score: 0.81, total_received_inr: 65000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Layer 4 Secondary Buffer", "Railway Station Road"], source_ref: "RBL_SWITCH_TX_14" },
  { node_id: "node_cashout_terminal", institution_id: "SBI_GOODLUCK", institution_name: "State Bank of India (FC Road / Goodluck Chowk)", account_token: "acct_cashout_terminal", node_type: "CASHOUT_DEST" as NodeType, first_seen: "2026-08-29T10:06:50+05:30", last_seen: "2026-08-29T10:06:50+05:30", privacy_class: "MASKED_L1", risk_score: 0.98, total_received_inr: 50000.0, total_forwarded_inr: 0.0, pass_through_ratio: 0.0, flags: ["Terminal ATM Cashout Target", "Active Debit Card Linked (Card #4102-XXXX-9901)", "High Immediate Withdrawal Risk at Goodluck Chowk"], source_ref: "SBI_ATM_CARD_ALERT_9901" }
];

export const MOCK_EDGES_041: TransactionEdge[] = [
  { edge_id: "hop_01", case_id: "CASE-2026-041", source_node: "node_victim", target_node: "node_mule_01", amount_inr: 450000.0, occurred_at: "2026-08-29T09:42:15+05:30", utr: "UPI202608299821", status: "CONFIRMED" as EdgeStatus, source_ref: "SBI_CAMP_TX_01", source_institution: "SBI Pune Camp", destination_institution: "ICICI Deccan", hop_order: 1, velocity_minutes_from_prior: 0.25 },
  { edge_id: "hop_02", case_id: "CASE-2026-041", source_node: "node_mule_01", target_node: "node_mule_02", amount_inr: 220000.0, occurred_at: "2026-08-29T09:44:30+05:30", utr: "IMPS202608290002", status: "CONFIRMED" as EdgeStatus, source_ref: "ICICI_DEC_TX_02", source_institution: "ICICI Deccan", destination_institution: "HDFC FC Road", hop_order: 2, velocity_minutes_from_prior: 2.25 },
  { edge_id: "hop_03", case_id: "CASE-2026-041", source_node: "node_mule_01", target_node: "node_mule_03", amount_inr: 230000.0, occurred_at: "2026-08-29T09:45:10+05:30", utr: "IMPS202608290003", status: "CONFIRMED" as EdgeStatus, source_ref: "ICICI_DEC_TX_03", source_institution: "ICICI Deccan", destination_institution: "Axis JM Road", hop_order: 3, velocity_minutes_from_prior: 0.66 },
  { edge_id: "hop_04", case_id: "CASE-2026-041", source_node: "node_mule_02", target_node: "node_mule_04", amount_inr: 110000.0, occurred_at: "2026-08-29T09:47:05+05:30", utr: "NEFT202608290004", status: "CONFIRMED" as EdgeStatus, source_ref: "HDFC_FC_TX_04", source_institution: "HDFC FC Road", destination_institution: "Kotak Ghole Road", hop_order: 4, velocity_minutes_from_prior: 1.91 },
  { edge_id: "hop_05", case_id: "CASE-2026-041", source_node: "node_mule_02", target_node: "node_mule_05", amount_inr: 110000.0, occurred_at: "2026-08-29T09:48:22+05:30", utr: "NEFT202608290005", status: "CONFIRMED" as EdgeStatus, source_ref: "HDFC_FC_TX_05", source_institution: "HDFC FC Road", destination_institution: "Canara Karve Road", hop_order: 5, velocity_minutes_from_prior: 1.28 },
  { edge_id: "hop_06", case_id: "CASE-2026-041", source_node: "node_mule_03", target_node: "node_mule_06", amount_inr: 115000.0, occurred_at: "2026-08-29T09:49:40+05:30", utr: "IMPS202608290006", status: "CONFIRMED" as EdgeStatus, source_ref: "AXIS_JM_TX_06", source_institution: "Axis JM Road", destination_institution: "BoM Deccan", hop_order: 6, velocity_minutes_from_prior: 1.30 },
  { edge_id: "hop_07", case_id: "CASE-2026-041", source_node: "node_mule_03", target_node: "node_mule_07", amount_inr: 115000.0, occurred_at: "2026-08-29T09:51:12+05:30", utr: "IMPS202608290007", status: "CONFIRMED" as EdgeStatus, source_ref: "AXIS_JM_TX_07", source_institution: "Axis JM Road", destination_institution: "PNB Shivaji Nagar", hop_order: 7, velocity_minutes_from_prior: 1.53 },
  { edge_id: "hop_08", case_id: "CASE-2026-041", source_node: "node_mule_04", target_node: "node_mule_08", amount_inr: 60000.0, occurred_at: "2026-08-29T09:53:00+05:30", utr: "UPI202608290008", status: "CONFIRMED" as EdgeStatus, source_ref: "KOTAK_GHOLE_TX_08", source_institution: "Kotak Ghole Road", destination_institution: "IndusInd FC Gate", hop_order: 8, velocity_minutes_from_prior: 1.80 },
  { edge_id: "hop_09", case_id: "CASE-2026-041", source_node: "node_mule_04", target_node: "node_mule_09", amount_inr: 50000.0, occurred_at: "2026-08-29T09:54:15+05:30", utr: "UPI202608290009", status: "CONFIRMED" as EdgeStatus, source_ref: "KOTAK_GHOLE_TX_09", source_institution: "Kotak Ghole Road", destination_institution: "Union Paud Road", hop_order: 9, velocity_minutes_from_prior: 1.25 },
  { edge_id: "hop_10", case_id: "CASE-2026-041", source_node: "node_mule_05", target_node: "node_mule_10", amount_inr: 60000.0, occurred_at: "2026-08-29T09:56:02+05:30", utr: "IMPS202608290010", status: "CONFIRMED" as EdgeStatus, source_ref: "CANARA_KARVE_TX_10", source_institution: "Canara Karve Road", destination_institution: "Yes Bank Erandwane", hop_order: 10, velocity_minutes_from_prior: 1.78 },
  { edge_id: "hop_11", case_id: "CASE-2026-041", source_node: "node_mule_05", target_node: "node_mule_11", amount_inr: 50000.0, occurred_at: "2026-08-29T09:57:30+05:30", utr: "IMPS202608290011", status: "CONFIRMED" as EdgeStatus, source_ref: "CANARA_KARVE_TX_11", source_institution: "Canara Karve Road", destination_institution: "Federal Kothrud", hop_order: 11, velocity_minutes_from_prior: 1.46 },
  { edge_id: "hop_12", case_id: "CASE-2026-041", source_node: "node_mule_06", target_node: "node_mule_12", amount_inr: 65000.0, occurred_at: "2026-08-29T09:59:10+05:30", utr: "UPI202608290012", status: "CONFIRMED" as EdgeStatus, source_ref: "BOM_DEC_TX_12", source_institution: "BoM Deccan", destination_institution: "IDFC Garware Chowk", hop_order: 12, velocity_minutes_from_prior: 1.66 },
  { edge_id: "hop_13", case_id: "CASE-2026-041", source_node: "node_mule_06", target_node: "node_mule_13", amount_inr: 50000.0, occurred_at: "2026-08-29T10:01:25+05:30", utr: "UPI202608290013", status: "CONFIRMED" as EdgeStatus, source_ref: "BOM_DEC_TX_13", source_institution: "BoM Deccan", destination_institution: "AU Law College Road", hop_order: 13, velocity_minutes_from_prior: 2.25 },
  { edge_id: "hop_14", case_id: "CASE-2026-041", source_node: "node_mule_07", target_node: "node_mule_14", amount_inr: 65000.0, occurred_at: "2026-08-29T10:03:40+05:30", utr: "IMPS202608290014", status: "CONFIRMED" as EdgeStatus, source_ref: "PNB_SHIVAJI_TX_14", source_institution: "PNB Shivaji Nagar", destination_institution: "RBL Shivaji Station", hop_order: 14, velocity_minutes_from_prior: 2.25 },
  { edge_id: "hop_15", case_id: "CASE-2026-041", source_node: "node_mule_08", target_node: "node_cashout_terminal", amount_inr: 50000.0, occurred_at: "2026-08-29T10:06:50+05:30", utr: "CARD_TOKEN_9901_AUTH", status: "CONFIRMED" as EdgeStatus, source_ref: "INDUS_FC_TERMINAL_15", source_institution: "IndusInd FC Gate", destination_institution: "SBI FC Road Goodluck", hop_order: 15, velocity_minutes_from_prior: 3.16 }
];

export const MOCK_FORECAST_041: ForecastResponse = {
  case_id: "CASE-2026-041",
  generated_at: "2026-08-29T10:10:00+05:30",
  model_version: "risk-v1.0-pune-spatial-kde",
  data_mode: "SIMULATION",
  top_zones: [
    {
      hotspot_id: "ZONE-041-01",
      case_id: "CASE-2026-041",
      zone_label: "FC Road & Deccan Gymkhana Commercial Strip, Pune (Epicenter)",
      center_lat: 18.5175,
      center_lon: 73.8415,
      radius_m: 1800,
      ranking_score: 0.94,
      expected_window_start: "10:20",
      expected_window_end: "10:35",
      factors: [
        { name: "ATM Density & 24x7 Kiosks", contribution: 0.38, description: "Highest cluster density of 24x7 cash-out kiosks in Pune within 500m of Goodluck Chowk." },
        { name: "Multi-Hop Velocity Vector", contribution: 0.32, description: "15th hop terminal card token was authorized through Fergusson Gate / Deccan switch node." },
        { name: "Transit & Egress Speed", contribution: 0.24, description: "Direct arterial connections to Karve Road, JM Road, and Shivaji Nagar enable rapid vehicle getaway." }
      ],
      supporting_records_count: 15,
      status: "PREDICTED",
      nearby_atm_ids: ["ATM-PUN-204", "ATM-PUN-205", "ATM-PUN-206", "ATM-PUN-207", "ATM-PUN-208", "ATM-PUN-209", "ATM-PUN-210", "ATM-PUN-211", "ATM-PUN-212", "ATM-PUN-101", "ATM-PUN-102", "ATM-PUN-103", "ATM-PUN-301", "ATM-PUN-302", "ATM-PUN-401"],
      jurisdiction_station: "PS-DECCAN (Deccan Cyber Police Station)"
    }
  ],
  human_review_required: true,
  overall_confidence: 0.94
};

export const MOCK_REPLAY_041: ReplayState = {
  case_id: "CASE-2026-041",
  current_step: 4,
  total_steps: 6,
  step_title: "Terminal Hop 15 & Continuous Thermal Radar Prediction",
  step_time: "10:10:00 IST (Saturday, 29 Aug 2026)",
  step_description: "Hop 15 reaches Terminal Cashout Card. AI KDE model pinpoints FC Road Goodluck Chowk Corridor with 94% confidence.",
  graph_nodes: MOCK_NODES_041,
  graph_edges: MOCK_EDGES_041,
  forecast: MOCK_FORECAST_041,
  withdrawal_revealed: {
    event_id: "WTH-PUN-041-01",
    case_id: "CASE-2026-041",
    account_node: "node_cashout_terminal",
    atm_id: "ATM-PUN-204",
    atm_name: "State Bank of India (FC Road Branch Near Goodluck Chowk)",
    amount_inr: 50000.0,
    occurred_at: "10:27:00 IST (Saturday, 29 Aug 2026)",
    source_ref: "SBI_ATM_SWITCH_LOG_204",
    latitude: 18.5175,
    longitude: 73.8415,
    observed_or_simulated: "SIMULATED"
  },
  status: "FORECAST_READY" as CaseStatus
};
