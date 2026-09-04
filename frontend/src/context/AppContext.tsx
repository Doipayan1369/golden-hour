import { 
  MOCK_CASE_041, MOCK_NODES_041, MOCK_EDGES_041, 
  MOCK_FORECAST_041, MOCK_REPLAY_041 
} from '../services/mockData';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserRole, UserType, AuthUser, Case, ForecastResponse, ReplayState, 
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
  | 'help'
  | 'citizen_tracking'
  | 'fir_view';

export type CitizenWorkflowStage = 'ONBOARDING_FAQ' | 'CASE_LOOKUP' | 'FIR_VIEW' | 'DASHBOARD';

interface AppContextType {
  // Auth & Roles
  currentUser: AuthUser | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isOfficialVerified: boolean;
  showAuthModal: boolean;
  authModalMode: 'LOGIN' | 'SIGNUP';
  authModalRole: UserType;
  citizenStage: CitizenWorkflowStage;
  citizenCaseId: string;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  openAuthModal: (mode: 'LOGIN' | 'SIGNUP', role: UserType) => void;
  closeAuthModal: () => void;
  loginUser: (email: string, role: UserType) => void;
  signupUser: (email: string, role: UserType) => void;
  verifyEmail: (code: string) => boolean;
  verifyOfficial: (badgeNumber: string, department: string, station: string) => boolean;
  setCitizenCaseId: (caseId: string) => void;
  setCitizenStage: (stage: CitizenWorkflowStage) => void;
  logout: () => void;

  // Platform Dashboard State
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
  // Auth State (Default: starts on Landing Page for public visitors)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isOfficialVerified, setIsOfficialVerified] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'SIGNUP'>('SIGNUP');
  const [authModalRole, setAuthModalRole] = useState<UserType>('CITIZEN');

  // Citizen Workflow Stage
  const [citizenStage, setCitizenStage] = useState<CitizenWorkflowStage>('ONBOARDING_FAQ');
  const [citizenCaseId, setCitizenCaseId] = useState<string>('CASE-2026-041');

  // Operational Dashboard State
  const [role, setRole] = useState<UserRole>('I4C_STATE_ANALYST');
  const [activeTab, setActiveTab] = useState<NavTab>('workflow');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-041');
  const [selectedCase, setSelectedCase] = useState<Case | null>(MOCK_CASE_041);
  const [cases, setCases] = useState<Case[]>([MOCK_CASE_041]);
  const [replayState, setReplayState] = useState<ReplayState | null>(MOCK_REPLAY_041);
  const [forecast, setForecast] = useState<ForecastResponse | null>(MOCK_FORECAST_041);
  const [graphNodes, setGraphNodes] = useState<AccountNode[]>(MOCK_NODES_041);
  const [graphEdges, setGraphEdges] = useState<TransactionEdge[]>(MOCK_EDGES_041);
  const [graphMetrics, setGraphMetrics] = useState<any>({ total_hops: 15, layer_count: 5 });
  const [auditVerification, setAuditVerification] = useState<AuditVerification | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  const openAuthModal = useCallback((mode: 'LOGIN' | 'SIGNUP', role: UserType) => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const loginUser = useCallback((email: string, roleType: UserType) => {
    const user: AuthUser = {
      email,
      role: roleType,
      isEmailVerified: true,
      isOfficialVerified: roleType === 'OFFICIAL' ? false : undefined,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    setUserType(roleType);
    setIsAuthenticated(true);
    setIsEmailVerified(true);
    setShowLandingPage(false);
    setShowAuthModal(false);

    if (roleType === 'CITIZEN') {
      setCitizenStage('ONBOARDING_FAQ');
      setAlertBanner(`Welcome ${email}! Tracking initialized for your case.`);
    } else {
      setIsOfficialVerified(false);
      setAlertBanner(`Official login detected. Please complete police credential verification.`);
    }
  }, []);

  const signupUser = useCallback((email: string, roleType: UserType) => {
    const user: AuthUser = {
      email,
      role: roleType,
      isEmailVerified: false,
      isOfficialVerified: false,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(user);
    setUserType(roleType);
    setIsAuthenticated(true);
    // User will proceed through email verification
  }, []);

  const verifyEmail = useCallback((code: string) => {
    if (currentUser) {
      const updated = { ...currentUser, isEmailVerified: true };
      setCurrentUser(updated);
      setIsEmailVerified(true);
      setShowLandingPage(false);
      setShowAuthModal(false);

      if (updated.role === 'CITIZEN') {
        setCitizenStage('ONBOARDING_FAQ');
      }
      return true;
    }
    return false;
  }, [currentUser]);

  const verifyOfficial = useCallback((badgeNumber: string, department: string, station: string) => {
    if (currentUser && currentUser.role === 'OFFICIAL') {
      const updated: AuthUser = {
        ...currentUser,
        isOfficialVerified: true,
        badgeNumber,
        department,
        stationOrBranch: station
      };
      setCurrentUser(updated);
      setIsOfficialVerified(true);
      setRole('I4C_STATE_ANALYST');
      setAlertBanner(`Verified Official Access granted: ${badgeNumber} (${department})`);
      return true;
    }
    return false;
  }, [currentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    setIsEmailVerified(false);
    setIsOfficialVerified(false);
    setShowLandingPage(true);
    setCitizenStage('ONBOARDING_FAQ');
    setAlertBanner('Logged out successfully.');
  }, []);

  const refreshCases = useCallback(async () => {
    try {
      const data = await api.getCases();
      if (data && data.length > 0) {
        setCases(data);
        if (!selectedCase) {
          const found = data.find(c => c.case_id === selectedCaseId) || data[0];
          setSelectedCase(found);
        }
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
      setGraphNodes(graph.nodes || MOCK_NODES_041);
      setGraphEdges(graph.edges || MOCK_EDGES_041);
      setGraphMetrics(graph.metrics || { total_hops: 15, layer_count: 5 });
      setForecast(fc || MOCK_FORECAST_041);
      setReplayState(rep || MOCK_REPLAY_041);
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
      await selectCase('CASE-2026-041');
      setAlertBanner('System state reset to benchmark scenario.');
    } catch (err) {
      console.error('Failed to reset system', err);
    } finally {
      setLoading(false);
    }
  }, [selectCase]);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userType,
        isAuthenticated,
        isEmailVerified,
        isOfficialVerified,
        showAuthModal,
        authModalMode,
        authModalRole,
        citizenStage,
        citizenCaseId,
        showLandingPage,
        setShowLandingPage,
        openAuthModal,
        closeAuthModal,
        loginUser,
        signupUser,
        verifyEmail,
        verifyOfficial,
        setCitizenCaseId,
        setCitizenStage,
        logout,
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
