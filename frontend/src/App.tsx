import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TacticalHeader } from './components/layout/TacticalHeader';
import { SidebarNav } from './components/layout/SidebarNav';
import { StepWorkflowContainer } from './pages/workflow/StepWorkflowContainer';
import { CaseListPage } from './pages/CaseListPage';
import { NewCasePage } from './pages/NewCasePage';
import { TacticalMap } from './components/map/TacticalMap';
import { InterventionsPage } from './pages/InterventionsPage';
import { ReplayPage } from './pages/ReplayPage';
import { ReportsPage } from './pages/ReportsPage';
import { HashChainViewer } from './components/audit/HashChainViewer';
import { SettingsPage, HelpPage } from './pages/SettingsHelpPages';
import { LoginPage } from './pages/LoginPage';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectCase } = useApp();

  return (
    <main className="flex-1 space-y-8 min-w-0 pb-12">
      {/* 1. Guided Step-by-Step Workflow Pipeline (Master Experience) */}
      {(activeTab === 'workflow' || activeTab === 'dashboard' || activeTab === 'workspace') && (
        <StepWorkflowContainer />
      )}

      {/* 2. Standalone Case Registry */}
      {activeTab === 'cases' && (
        <CaseListPage onNewCase={() => setActiveTab('new_case')} />
      )}

      {/* 3. New Case Intake Wizard */}
      {activeTab === 'new_case' && (
        <NewCasePage 
          onComplete={(cid) => {
            selectCase(cid);
            setActiveTab('workflow');
          }}
          onCancel={() => setActiveTab('cases')}
        />
      )}

      {/* 4. Standalone Geospatial Thermal Radar Map */}
      {activeTab === 'map' && (
        <div className="space-y-8 animate-fadeIn">
          <TacticalMap />
        </div>
      )}

      {/* 5. Standalone Interventions Queue */}
      {activeTab === 'interventions' && (
        <div className="animate-fadeIn">
          <InterventionsPage />
        </div>
      )}

      {/* 6. Standalone Scenario Replay Simulator */}
      {activeTab === 'replay' && (
        <div className="animate-fadeIn">
          <ReplayPage />
        </div>
      )}

      {/* 7. Standalone Reports Archive */}
      {activeTab === 'reports' && (
        <div className="animate-fadeIn">
          <ReportsPage />
        </div>
      )}

      {/* 8. Standalone Cryptographic Audit Ledger */}
      {activeTab === 'audit' && (
        <div className="space-y-8 animate-fadeIn">
          <HashChainViewer />
        </div>
      )}

      {/* 9. Console Settings Page */}
      {activeTab === 'settings' && (
        <div className="animate-fadeIn">
          <SettingsPage />
        </div>
      )}

      {/* 10. SOP & Guidance Page */}
      {activeTab === 'help' && (
        <div className="animate-fadeIn">
          <HelpPage />
        </div>
      )}
    </main>
  );
};

export const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(true);

  if (!authenticated) {
    return (
      <AppProvider>
        <LoginPage onEnter={() => setAuthenticated(true)} />
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#F0F2F6] text-slate-800 flex flex-col font-sans selection:bg-[#D4FF00] selection:text-[#111317]">
        <TacticalHeader />
        <div className="max-w-[1540px] w-full mx-auto flex-1 flex gap-8 px-6 lg:px-10 py-4">
          <SidebarNav />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
