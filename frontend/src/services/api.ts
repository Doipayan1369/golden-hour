import { 
  Case, ForecastResponse, ATM, PoliceStation, 
  ActionPacket, AuditEvent, AuditVerification, 
  Feedback, ReplayState, ScenarioCatalogItem, ReportRecord 
} from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error [${res.status}]: ${errText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Cases
  async getCases(params?: { severity?: string; status?: string; search?: string }): Promise<Case[]> {
    const query = new URLSearchParams();
    if (params?.severity) query.append('severity', params.severity);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJSON<Case[]>(`/cases${qs}`);
  },

  async getCase(caseId: string): Promise<Case> {
    return fetchJSON<Case>(`/cases/${caseId}`);
  },

  async validateIntake(payload: any): Promise<{ is_valid: boolean; errors: string[]; warnings: string[]; duplicate_case_id?: string }> {
    return fetchJSON(`/cases/validate-intake`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createIntake(payload: Partial<Case>): Promise<Case> {
    return fetchJSON<Case>(`/cases/intake`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async resetDatabase(): Promise<{ status: string; message: string }> {
    return fetchJSON<{ status: string; message: string }>(`/cases/reset/database`, {
      method: 'POST',
    });
  },

  // Trace & Graph
  async getCaseGraph(caseId: string): Promise<{ case_id: string; nodes: any[]; edges: any[]; metrics: any }> {
    return fetchJSON(`/cases/${caseId}/graph`);
  },

  async requestTraceHop(caseId: string, payload: { target_institution: string; requested_scope: string; time_window: string; reason: string; officer_id: string }): Promise<any> {
    return fetchJSON(`/cases/${caseId}/trace/request`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async revealNextHop(caseId: string, hopOrder: number): Promise<any> {
    return fetchJSON(`/cases/${caseId}/hops/reveal`, {
      method: 'POST',
      body: JSON.stringify({ hop_order: hopOrder }),
    });
  },

  // Forecast & Geospatial
  async getCaseForecast(caseId: string): Promise<ForecastResponse> {
    return fetchJSON<ForecastResponse>(`/cases/${caseId}/forecast`);
  },

  async getATMs(): Promise<ATM[]> {
    return fetchJSON<ATM[]>(`/atms`);
  },

  async getPoliceStations(): Promise<PoliceStation[]> {
    return fetchJSON<PoliceStation[]>(`/police-stations`);
  },

  // Interventions & Actions
  async getInterventions(status?: string): Promise<ActionPacket[]> {
    const qs = status && status !== 'ALL' ? `?status=${status}` : '';
    return fetchJSON<ActionPacket[]>(`/interventions${qs}`);
  },

  async getCaseActions(caseId: string): Promise<ActionPacket[]> {
    return fetchJSON<ActionPacket[]>(`/cases/${caseId}/actions`);
  },

  async createAction(caseId: string, payload: Partial<ActionPacket>): Promise<ActionPacket> {
    return fetchJSON<ActionPacket>(`/cases/${caseId}/actions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async approveAction(actionId: string, approvedBy: string): Promise<ActionPacket> {
    return fetchJSON<ActionPacket>(`/actions/${actionId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved_by: approvedBy }),
    });
  },

  async acknowledgeAction(actionId: string, ref: string, actorId?: string): Promise<ActionPacket> {
    return fetchJSON<ActionPacket>(`/actions/${actionId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ ref, actor_id: actorId || 'SI Vikram Singh' }),
    });
  },

  async cancelAction(actionId: string, reason: string, actorId?: string): Promise<ActionPacket> {
    return fetchJSON<ActionPacket>(`/actions/${actionId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason, actor_id: actorId || 'DUTY_OFFICER' }),
    });
  },

  // Replay Simulator & Scenarios Catalog
  async getScenarios(category?: string): Promise<ScenarioCatalogItem[]> {
    const qs = category && category !== 'ALL' ? `?category=${category}` : '';
    return fetchJSON<ScenarioCatalogItem[]>(`/scenarios${qs}`);
  },

  async getReplay(caseId: string, step?: number): Promise<ReplayState> {
    const qs = step !== undefined ? `?step=${step}` : '';
    return fetchJSON<ReplayState>(`/cases/${caseId}/replay${qs}`);
  },

  async advanceReplayStep(caseId: string, stepIndex: number, actorId?: string): Promise<ReplayState> {
    return fetchJSON<ReplayState>(`/cases/${caseId}/replay/step`, {
      method: 'POST',
      body: JSON.stringify({ step_index: stepIndex, actor_id: actorId || 'DEMO_OPERATOR' }),
    });
  },

  async resetReplay(caseId: string): Promise<ReplayState> {
    return fetchJSON<ReplayState>(`/cases/${caseId}/replay/reset`, {
      method: 'POST',
    });
  },

  // Audit
  async getAuditTrail(caseId?: string): Promise<AuditEvent[]> {
    const qs = caseId ? `?case_id=${caseId}` : '';
    return fetchJSON<AuditEvent[]>(`/audit${qs}`);
  },

  async verifyAuditChain(): Promise<AuditVerification> {
    return fetchJSON<AuditVerification>(`/audit/verify`);
  },

  async submitFeedback(payload: { case_id: string; officer_id: string; officer_role: string; rating: string; comment: string }): Promise<Feedback> {
    return fetchJSON<Feedback>(`/audit/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Reports
  async getReports(): Promise<ReportRecord[]> {
    return fetchJSON<ReportRecord[]>(`/reports`);
  },

  async generateReport(payload: { case_id: string; title: string; report_type: string; created_by: string; format: string; summary_text: string }): Promise<ReportRecord> {
    return fetchJSON<ReportRecord>(`/reports/generate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getDatabaseStatus(): Promise<any> {
    return fetchJSON(`/database/status`);
  },

};
