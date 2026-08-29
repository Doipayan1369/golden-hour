-- ==============================================================================
-- GOLDEN HOUR - CYBERCRIME CASH-OUT INTELLIGENCE CONSOLE (SIH26184)
-- SUPABASE POSTGRESQL SCHEMA & BENCHMARK SEED DATA
-- Version: v1.0 | 28 August 2026
-- ==============================================================================

-- Enable UUID & Crypto extensions if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS report_records CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS audit_events CASCADE;
DROP TABLE IF EXISTS action_packets CASCADE;
DROP TABLE IF EXISTS hotspot_zones CASCADE;
DROP TABLE IF EXISTS transaction_edges CASCADE;
DROP TABLE IF EXISTS account_nodes CASCADE;
DROP TABLE IF EXISTS cases CASCADE;
DROP TABLE IF EXISTS atms CASCADE;
DROP TABLE IF EXISTS police_stations CASCADE;
DROP TABLE IF EXISTS scenario_catalog CASCADE;

-- ------------------------------------------------------------------------------
-- 1. POLICE STATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE police_stations (
    station_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    contact_number VARCHAR(64) NOT NULL,
    beat_units_available INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. ATMS TABLE (HIGH CASHOUT & NORMAL KIOSKS)
-- ------------------------------------------------------------------------------
CREATE TABLE atms (
    atm_id VARCHAR(64) PRIMARY KEY,
    bank_name VARCHAR(255) NOT NULL,
    operator_id VARCHAR(64) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    station_id VARCHAR(64) REFERENCES police_stations(station_id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    cash_out_frequency VARCHAR(64) DEFAULT 'NORMAL', -- 'HIGH_CASHOUT' or 'NORMAL'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_atms_geo ON atms(latitude, longitude);
CREATE INDEX idx_atms_station ON atms(station_id);

-- ------------------------------------------------------------------------------
-- 3. CASES TABLE (NCRP 1930 INGESTION MATRIX)
-- ------------------------------------------------------------------------------
CREATE TABLE cases (
    case_id VARCHAR(64) PRIMARY KEY,
    source VARCHAR(64) DEFAULT 'NCRP_1930',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    jurisdiction VARCHAR(255) NOT NULL,
    severity VARCHAR(32) NOT NULL, -- 'CRITICAL', 'HIGH', 'ELEVATED', 'MONITORING'
    status VARCHAR(64) NOT NULL,   -- 'ANCHORED', 'ENRICHING', 'FORECAST_READY', 'ACTION_APPROVED', etc.
    fraud_type VARCHAR(255) NOT NULL,
    amount_inr NUMERIC(14, 2) NOT NULL,
    utr VARCHAR(64) UNIQUE NOT NULL, -- Anchor reference
    source_institution VARCHAR(255) NOT NULL,
    victim_account_token VARCHAR(64) NOT NULL,
    victim_phone_token VARCHAR(64) NOT NULL,
    victim_name_masked VARCHAR(64) NOT NULL,
    data_freshness_minutes INT DEFAULT 0,
    assigned_beat VARCHAR(128),
    assigned_bank VARCHAR(128),
    priority_score NUMERIC(5, 4) DEFAULT 0.8500,
    timeline_summary JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_utr ON cases(utr);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_severity ON cases(severity);

-- ------------------------------------------------------------------------------
-- 4. ACCOUNT NODES TABLE (GRAPH NODES)
-- ------------------------------------------------------------------------------
CREATE TABLE account_nodes (
    node_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    institution_id VARCHAR(64) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    account_token VARCHAR(64) NOT NULL,
    node_type VARCHAR(64) NOT NULL, -- 'VICTIM', 'MULE_LAYER_1', 'MULE_LAYER_2', 'CASHOUT_DEST'
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    privacy_class VARCHAR(64) DEFAULT 'CONFIDENTIAL_TOKENIZED',
    risk_score NUMERIC(5, 4) DEFAULT 0.0000,
    total_received_inr NUMERIC(14, 2) DEFAULT 0.00,
    total_forwarded_inr NUMERIC(14, 2) DEFAULT 0.00,
    pass_through_ratio NUMERIC(5, 4) DEFAULT 0.0000,
    velocity_mins NUMERIC(8, 2),
    flags JSONB DEFAULT '[]'::jsonb,
    source_ref VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nodes_case ON account_nodes(case_id);

-- ------------------------------------------------------------------------------
-- 5. TRANSACTION EDGES TABLE (MULTI-HOP FLOWS)
-- ------------------------------------------------------------------------------
CREATE TABLE transaction_edges (
    edge_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    source_node VARCHAR(64) REFERENCES account_nodes(node_id) ON DELETE CASCADE,
    target_node VARCHAR(64) REFERENCES account_nodes(node_id) ON DELETE CASCADE,
    amount_inr NUMERIC(14, 2) NOT NULL,
    occurred_at TIMESTAMPTZ DEFAULT NOW(),
    utr VARCHAR(64) NOT NULL,
    status VARCHAR(64) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'PENDING', 'UNAVAILABLE'
    source_ref VARCHAR(255) NOT NULL,
    source_institution VARCHAR(255) NOT NULL,
    destination_institution VARCHAR(255) NOT NULL,
    hop_order INT NOT NULL,
    velocity_minutes_from_prior NUMERIC(8, 2),
    request_owner VARCHAR(128),
    request_timer_mins INT,
    gap_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_edges_case ON transaction_edges(case_id);

-- ------------------------------------------------------------------------------
-- 6. HOTSPOT ZONES TABLE (SPATIAL FORECAST)
-- ------------------------------------------------------------------------------
CREATE TABLE hotspot_zones (
    hotspot_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    zone_label VARCHAR(255) NOT NULL,
    center_lat NUMERIC(10, 6) NOT NULL,
    center_lon NUMERIC(10, 6) NOT NULL,
    radius_m INT NOT NULL,
    ranking_score NUMERIC(5, 4) NOT NULL,
    expected_window_start VARCHAR(32) NOT NULL,
    expected_window_end VARCHAR(32) NOT NULL,
    factors JSONB DEFAULT '[]'::jsonb,
    supporting_records_count INT DEFAULT 1,
    status VARCHAR(64) DEFAULT 'PREDICTED',
    nearby_atm_ids JSONB DEFAULT '[]'::jsonb,
    jurisdiction_station VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zones_case ON hotspot_zones(case_id);

-- ------------------------------------------------------------------------------
-- 7. ACTION PACKETS TABLE (HUMAN-IN-THE-LOOP INTERVENTIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE action_packets (
    action_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    action_type VARCHAR(64) NOT NULL,
    target_recipients JSONB DEFAULT '[]'::jsonb,
    suggested_action TEXT NOT NULL,
    priority_zone VARCHAR(255) NOT NULL,
    expected_window VARCHAR(64) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by VARCHAR(255),
    approved_at TIMESTAMPTZ,
    status VARCHAR(64) DEFAULT 'DRAFT', -- 'DRAFT', 'APPROVED', 'ACKNOWLEDGED', 'REJECTED'
    acknowledgement_ref VARCHAR(128),
    acknowledgement_by VARCHAR(255),
    acknowledgement_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    clarification_note TEXT,
    disclaimer TEXT DEFAULT 'DECISION SUPPORT ONLY: Action packet subject to officer validation and standard operating procedure.'
);

CREATE INDEX idx_actions_case ON action_packets(case_id);
CREATE INDEX idx_actions_status ON action_packets(status);

-- ------------------------------------------------------------------------------
-- 8. AUDIT EVENTS TABLE (SHA-256 HASH CHAIN LEDGER)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_events (
    audit_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL,
    actor_id VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    payload_summary JSONB DEFAULT '{}'::jsonb,
    payload_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    event_hash VARCHAR(64) NOT NULL,
    source_mode VARCHAR(64) DEFAULT 'SIMULATION'
);

CREATE INDEX idx_audit_case ON audit_events(case_id);
CREATE INDEX idx_audit_time ON audit_events(timestamp);

-- ------------------------------------------------------------------------------
-- 9. FEEDBACK TABLE (OFFICER MODEL VALIDATION)
-- ------------------------------------------------------------------------------
CREATE TABLE feedback (
    feedback_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    officer_id VARCHAR(255) NOT NULL,
    officer_role VARCHAR(64) NOT NULL,
    rating VARCHAR(64) NOT NULL,
    comment TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. SCENARIO CATALOG TABLE (BENCHMARK SUITE)
-- ------------------------------------------------------------------------------
CREATE TABLE scenario_catalog (
    scenario_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    fraud_pattern VARCHAR(255) NOT NULL,
    event_count INT NOT NULL,
    expected_zone VARCHAR(255) NOT NULL,
    ground_truth_atm VARCHAR(64) NOT NULL,
    difficulty VARCHAR(64) NOT NULL,
    pass_fail_status VARCHAR(64) DEFAULT 'PASSED'
);

-- ------------------------------------------------------------------------------
-- 11. REPORT RECORDS TABLE (EXPORT ARCHIVE)
-- ------------------------------------------------------------------------------
CREATE TABLE report_records (
    report_id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    format VARCHAR(32) DEFAULT 'PDF',
    status VARCHAR(64) DEFAULT 'GENERATED',
    summary_text TEXT
);

-- ==============================================================================
-- BENCHMARK SEED DATA (SIH26184)
-- ==============================================================================

-- Police Stations
INSERT INTO police_stations (station_id, name, jurisdiction, latitude, longitude, contact_number, beat_units_available)
VALUES 
('PS-SEC-14', 'Sector 14 Cyber Crime Police Station', 'Gurugram North / Sector 14', 28.4735, 77.0430, '+91-124-2321414', 4),
('PS-CITY-N', 'City Police Station North (Old Railway)', 'Gurugram Central', 28.4610, 77.0260, '+91-124-2320100', 2),
('PS-METRO-C', 'Metro Central Police Post (IFFCO)', 'Transit / Metro Beat', 28.4700, 77.0700, '+91-124-2399881', 3),
('PS-CYBER-HUB', 'Cyber City Police Station', 'Cyber Hub / DLF Phase 2', 28.4910, 77.0910, '+91-124-2355440', 5)
ON CONFLICT (station_id) DO NOTHING;

-- ATMs
INSERT INTO atms (atm_id, bank_name, operator_id, latitude, longitude, locality, station_id, active, cash_out_frequency)
VALUES
('ATM-204', 'State Bank of India', 'OP-ATM-204', 28.4718, 77.0452, 'Main Market Sector 14, Near Post Office', 'PS-SEC-14', true, 'HIGH_CASHOUT'),
('ATM-205', 'HDFC Bank 24x7', 'OP-ATM-205', 28.4725, 77.0445, 'Sector 14 Commercial Complex', 'PS-SEC-14', true, 'HIGH_CASHOUT'),
('ATM-206', 'ICICI Bank ATM', 'OP-ATM-206', 28.4710, 77.0460, 'Opposite Civil Hospital Gate 2', 'PS-SEC-14', true, 'NORMAL'),
('ATM-207', 'Axis Bank e-Lobby', 'OP-ATM-207', 28.4732, 77.0438, 'Sector 14 HUDA Complex', 'PS-SEC-14', true, 'NORMAL'),
('ATM-208', 'Punjab National Bank', 'OP-ATM-208', 28.4702, 77.0475, 'Old Delhi Road Crossing', 'PS-SEC-14', true, 'NORMAL'),
('ATM-209', 'Bank of Baroda', 'OP-ATM-209', 28.4740, 77.0420, 'Sector 14 Bus Stand Terminal', 'PS-SEC-14', true, 'HIGH_CASHOUT'),
('ATM-210', 'Kotak Mahindra Bank', 'OP-ATM-210', 28.4715, 77.0482, 'Sector 14 SCO 42', 'PS-SEC-14', true, 'NORMAL'),
('ATM-101', 'Canara Bank', 'OP-ATM-101', 28.4628, 77.0275, 'Railway Road Bazaar', 'PS-CITY-N', true, 'NORMAL'),
('ATM-102', 'State Bank of India', 'OP-ATM-102', 28.4635, 77.0288, 'Near Clock Tower Chowk', 'PS-CITY-N', true, 'NORMAL'),
('ATM-103', 'Union Bank of India', 'OP-ATM-103', 28.4618, 77.0265, 'Old Subzi Mandi', 'PS-CITY-N', true, 'NORMAL'),
('ATM-301', 'State Bank of India Metro ATM', 'OP-ATM-301', 28.4712, 77.0718, 'IFFCO Chowk Metro Concourse', 'PS-METRO-C', true, 'HIGH_CASHOUT'),
('ATM-302', 'Axis Bank', 'OP-ATM-302', 28.4722, 77.0730, 'ABW Tower Ground Floor', 'PS-METRO-C', true, 'NORMAL'),
('ATM-401', 'Citibank ATM Lounge', 'OP-ATM-401', 28.4905, 77.0905, 'Building 10 Cyber City', 'PS-CYBER-HUB', true, 'NORMAL'),
('ATM-402', 'HDFC Bank ATM', 'OP-ATM-402', 28.4918, 77.0922, 'Cyber Hub Plaza Level 1', 'PS-CYBER-HUB', true, 'NORMAL')
ON CONFLICT (atm_id) DO NOTHING;

-- Primary Case: CASE-2026-041
INSERT INTO cases (
    case_id, source, created_at, jurisdiction, severity, status, 
    fraud_type, amount_inr, utr, source_institution, victim_account_token, 
    victim_phone_token, victim_name_masked, data_freshness_minutes, 
    assigned_beat, assigned_bank, priority_score, timeline_summary
)
VALUES (
    'CASE-2026-041', 'NCRP_1930', '2026-08-27T10:02:00+05:30', 'Gurugram North / Sector 14',
    'CRITICAL', 'FORECAST_READY', 'Electricity Bill Disconnection / APK Impersonation',
    75000.00, 'UPI202608270001', 'Bank A (State Bank)', 'acct_victim_001',
    '+91-XXXXX-9102', 'R**** K****', 11, 'Sector 14 Beat 3', 'Bank D (Terminal Card Issuer)',
    0.9400, '["10:02:00 - 1930 Complaint filed by victim (INR 75,000 debit)", "10:02:15 - Bank A confirmed UPI push to Bank B", "10:09:30 - Bank B forwarded INR 58,000 to Bank C", "10:12:00 - Bank C forwarded INR 40,000 to Bank D ATM Card", "10:12:45 - Cash-out forecast generated (82% Confidence)"]'::jsonb
)
ON CONFLICT (case_id) DO NOTHING;

-- Primary Nodes
INSERT INTO account_nodes (node_id, case_id, institution_id, institution_name, account_token, node_type, risk_score, total_received_inr, total_forwarded_inr, pass_through_ratio, flags, source_ref)
VALUES
('node_victim', 'CASE-2026-041', 'BANK_A', 'Bank A (Victim Bank)', 'acct_victim_001', 'VICTIM', 0.05, 0.00, 75000.00, 0.00, '["Victim Anchor", "Reported 1930"]'::jsonb, '1930_REPORT_041'),
('node_mule_1', 'CASE-2026-041', 'BANK_B', 'Bank B (HDFC)', 'acct_mule_782', 'MULE_LAYER_1', 0.88, 75000.00, 75000.00, 1.00, '["Layer 1 Intermediary Mule", "100% rapid pass-through"]'::jsonb, 'BANK_B_RESPONSE_782'),
('node_mule_2', 'CASE-2026-041', 'BANK_C', 'Bank C (ICICI)', 'acct_mule_991', 'MULE_LAYER_2', 0.91, 58000.00, 40000.00, 0.69, '["Layer 2 Concentrator Mule", "Rapid split pass-through"]'::jsonb, 'BANK_C_RESPONSE_991'),
('node_cashout', 'CASE-2026-041', 'BANK_D', 'Bank D (Axis Bank)', 'acct_cashout_110', 'CASHOUT_DEST', 0.96, 40000.00, 0.00, 0.00, '["Terminal Cash-Out Target", "Active Debit Card Linked"]'::jsonb, 'BANK_D_RESPONSE_110')
ON CONFLICT (node_id) DO NOTHING;

-- Primary Edges
INSERT INTO transaction_edges (edge_id, case_id, source_node, target_node, amount_inr, occurred_at, utr, status, source_ref, source_institution, destination_institution, hop_order, velocity_minutes_from_prior)
VALUES
('edge_01', 'CASE-2026-041', 'node_victim', 'node_mule_1', 75000.00, '2026-08-27T10:02:15+05:30', 'UPI202608270001', 'CONFIRMED', 'BANK_A_TX_9011', 'Bank A', 'Bank B', 1, 0.2),
('edge_02', 'CASE-2026-041', 'node_mule_1', 'node_mule_2', 58000.00, '2026-08-27T10:09:30+05:30', 'IMPS202608279821', 'CONFIRMED', 'BANK_B_TX_4412', 'Bank B', 'Bank C', 2, 7.2),
('edge_03', 'CASE-2026-041', 'node_mule_2', 'node_cashout', 40000.00, '2026-08-27T10:12:00+05:30', 'IMPS202608277732', 'CONFIRMED', 'BANK_C_TX_8819', 'Bank C', 'Bank D', 3, 2.5)
ON CONFLICT (edge_id) DO NOTHING;

-- Primary Hotspot Zones
INSERT INTO hotspot_zones (hotspot_id, case_id, zone_label, center_lat, center_lon, radius_m, ranking_score, expected_window_start, expected_window_end, factors, supporting_records_count, status, jurisdiction_station)
VALUES
('ZONE-041-01', 'CASE-2026-041', 'Sector 14 Transit & Commercial Corridor', 28.4720, 77.0450, 1800, 0.8200, '10:25', '10:40', '[{"name": "ATM Proximity & Density", "contribution": 0.35, "description": "High concentration of 24x7 off-site bank kiosks along Sector 14 market."}, {"name": "Historical Mule Velocity", "contribution": 0.28, "description": "Prior incidents from same syndicate cashed out within 18 minutes of Hop 3."}, {"name": "Transit Access Velocity", "contribution": 0.20, "description": "Old Delhi Road junction enables rapid arterial egress."}]'::jsonb, 7, 'PREDICTED', 'PS-SEC-14'),
('ZONE-041-02', 'CASE-2026-041', 'Old Railway Road Commercial Hub', 28.4620, 77.0280, 1200, 0.5800, '10:30', '10:50', '[{"name": "ATM Cluster", "contribution": 0.25, "description": "Dense retail ATM strip"}]'::jsonb, 4, 'PREDICTED', 'PS-CITY-N'),
('ZONE-041-03', 'CASE-2026-041', 'IFFCO Chowk Metro Transit Node', 28.4710, 77.0720, 1500, 0.4400, '10:35', '10:55', '[{"name": "Transit Hub", "contribution": 0.20, "description": "High-speed metro connection"}]'::jsonb, 3, 'PREDICTED', 'PS-METRO-C')
ON CONFLICT (hotspot_id) DO NOTHING;

-- Action Packet
INSERT INTO action_packets (action_id, case_id, action_type, target_recipients, suggested_action, priority_zone, expected_window, created_by, created_at, approved_by, approved_at, status, acknowledgement_ref, acknowledgement_by, acknowledgement_at)
VALUES (
    'ACT-CASE-2026-041-01', 'CASE-2026-041', 'BEAT_PATROL_ALERT',
    '["Sector 14 Beat Patrol Unit 3", "Bank D Cyber Nodal Desk"]'::jsonb,
    'Deploy visual patrol to Sector 14 ATM cluster & trigger emergency ATM fraud hold at Bank D switch',
    'Sector 14 Transit & Commercial Corridor', '10:25 - 10:40',
    'Insp. R. Sharma (I4C Analyst)', '2026-08-27T10:13:00+05:30',
    'DSP A. Verma (Command Duty Lead)', '2026-08-27T10:15:00+05:30',
    'APPROVED', 'ACK-SEC14-BEAT3-0827', 'SI Vikram Singh (Patrol Lead)', '2026-08-27T10:17:00+05:30'
)
ON CONFLICT (action_id) DO NOTHING;

-- Scenario Catalog (10 Benchmark Cases)
INSERT INTO scenario_catalog (scenario_id, case_id, title, category, fraud_pattern, event_count, expected_zone, ground_truth_atm, difficulty, pass_fail_status)
VALUES
('SCEN-041-PRIMARY', 'CASE-2026-041', 'Primary Showcase: Rapid 3-Hop APK Fraud to Sector 14 Cashout', 'positive', 'APK Impersonation + 3 Mule Hops', 6, 'Sector 14 Corridor', 'ATM-204', 'Standard Benchmark', 'PASSED'),
('SCEN-042-NEGATIVE', 'CASE-2026-042', 'Hard Negative: Business Vendor Payment Clearance', 'hard_negative', 'Legitimate Commercial Invoice', 3, 'No Cashout Forecast', 'N/A', 'Negative Control', 'PASSED'),
('SCEN-043-INCOMPLETE', 'CASE-2026-043', 'Missing Hop Recovery: Co-operative Bank API Timeout', 'incomplete_data', 'Telegram Task Scam + Timeout', 4, 'Reduced Confidence Zone', 'ATM-301', 'Data Recovery Test', 'PASSED'),
('SCEN-044-FANOUT', 'CASE-2026-044', 'Layered Multi-Wallet Fan-Out (INR 2,40,000)', 'cross_jurisdiction', 'Phishing + 3 Wallets', 5, 'DLF Cyber Hub Grid', 'ATM-401', 'High Volume', 'PASSED'),
('SCEN-045-PENDING', 'CASE-2026-045', 'Staged Response Delay: Active Timer Tracking', 'pending_response', 'Job Advance Fee Scam', 3, 'Old Railway Road', 'ATM-102', 'Timer SLA Test', 'PASSED')
ON CONFLICT (scenario_id) DO NOTHING;
