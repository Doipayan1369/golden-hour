import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole, Case, ForecastResponse, ReplayState, 
  AccountNode, TransactionEdge, AuditVerification 
} from '../types';
import { api } from '../services/api';

export type NavTab = 
  | 'workflow'
  | 'dashboard' 
  | 'cases' 
  | 'new_case' 
  | 'workspace' 
  | 'map' 
  | 'interventions' 
  | 'replay' 
  | 'reports' 
  | 'audit' 
  | 'settings' 
  | 'help';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  selectedCase: Case | null;
  cases: Case[];
  replayState: ReplayState | null;
  forecast: ForecastResponse | null;
  graphNodes: AccountNode[];
  graphEdges: TransactionEdge[];
  graphMetrics: any;
  auditVerification: AuditVerification | null;
  loading: boolean;
  alertBanner: string | null;
  setAlertBanner: (msg: string | null) => void;
  refreshCases: () => Promise<void>;
  selectCase: (caseId: string) => Promise<void>;
  advanceReplay: (step: number) => Promise<void>;
  resetAll: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('I4C_STATE_ANALYST');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-041');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [replayState, setReplayState] = useState<ReplayState | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [graphNodes, setGraphNodes] = useState<AccountNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<TransactionEdge[]>([]);
  const [graphMetrics, setGraphMetrics] = useState<any>(null);
  const [auditVerification, setAuditVerification] = useState<AuditVerification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  const refreshCases = useCallback(async () => {
    try {
      const data = await api.getCases();
      setCases(data);
      if (data.length > 0 && !selectedCase) {
        const found = data.find(c => c.case_id === selectedCaseId) || data[0];
        setSelectedCase(found);
      }
    } catch (err) {
      console.error('Failed to load cases', err);
    }
  }, [selectedCaseId, selectedCase]);

  const selectCase = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setSelectedCaseId(caseId);
      const [c, graph, fc, rep, v] = await Promise.all([
        api.getCase(caseId),
        api.getCaseGraph(caseId),
        api.getCaseForecast(caseId).catch(() => null),
        api.getReplay(caseId).catch(() => null),
        api.verifyAuditChain().catch(() => null)
      ]);
      setSelectedCase(c);
      setGraphNodes(graph.nodes || []);
      setGraphEdges(graph.edges || []);
      setGraphMetrics(graph.metrics || {});
      setForecast(fc);
      setReplayState(rep);
      setAuditVerification(v);
    } catch (err) {
      console.error(`Failed to select case ${caseId}`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const advanceReplay = useCallback(async (step: number) => {
    try {
      setLoading(true);
      const rep = await api.advanceReplayStep(selectedCaseId, step, role);
      setReplayState(rep);
      setGraphNodes(rep.graph_nodes);
      setGraphEdges(rep.graph_edges);
      if (rep.forecast) {
        setForecast(rep.forecast);
      }
      const v = await api.verifyAuditChain();
      setAuditVerification(v);
    } catch (err) {
      console.error('Failed to advance replay', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCaseId, role]);

  const resetAll = useCallback(async () => {
    try {
      setLoading(true);
      await api.resetDatabase();
      await refreshCases();
      await selectCase('CASE-2026-041');
      setAlertBanner('System state restored to verified PRD benchmark scenario.');
      setTimeout(() => setAlertBanner(null), 4000);
    } catch (err) {
      console.error('Failed to reset', err);
    } finally {
      setLoading(false);
    }
  }, [refreshCases, selectCase]);

  useEffect(() => {
    refreshCases().then(() => {
      selectCase('CASE-2026-041');
    });
  }, [refreshCases, selectCase]);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        selectedCase,
        cases,
        replayState,
        forecast,
        graphNodes,
        graphEdges,
        graphMetrics,
        auditVerification,
        loading,
        alertBanner,
        setAlertBanner,
        refreshCases,
        selectCase,
        advanceReplay,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
