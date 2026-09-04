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
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './components/modals/AuthModal';
import { CitizenOnboardingModal } from './pages/citizen/CitizenOnboardingModal';
import { CitizenCaseLookupModal } from './pages/citizen/CitizenCaseLookupModal';
import { DigitalFIRModal } from './pages/citizen/DigitalFIRModal';
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { OfficialVerificationWall } from './pages/official/OfficialVerificationWall';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectCase } = useApp();

  return (
    <main className="flex-1 space-y-6 min-w-0 pb-12">
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
        <div className="space-y-6 animate-fadeIn">
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
        <div className="space-y-6 animate-fadeIn">
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

export const AppContent: React.FC = () => {
  const { 
    showLandingPage, userType, 
    isOfficialVerified, citizenStage 
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. If on Marketing / Public Landing Page
  if (showLandingPage) {
    return (
      <>
        <LandingPage />
        <AuthModal />
      </>
    );
  }

  // 2. If signed up / logged in as Citizen / Victim
  if (userType === 'CITIZEN') {
    return (
      <div className="min-h-screen bg-[#F0F2F6] text-slate-800 flex flex-col font-sans selection:bg-[#D4FF00] selection:text-[#111317]">
        <TacticalHeader onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />
        <div className="max-w-7xl w-full mx-auto flex-1 px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
          <CitizenDashboard />
        </div>

        {/* Citizen Step Modals */}
        <CitizenOnboardingModal />
        <CitizenCaseLookupModal />
        <DigitalFIRModal />
        <AuthModal />
      </div>
    );
  }

  // 3. If signed up as Police / Bank Official but NOT YET Verified -> Verification Wall
  if (userType === 'OFFICIAL' && !isOfficialVerified) {
    return (
      <>
        <OfficialVerificationWall />
        <AuthModal />
      </>
    );
  }

  // 4. If Verified Law Enforcement Officer / Bank Nodal Official -> Full Advanced Tactical Command Suite
  return (
    <div className="min-h-screen bg-[#F0F2F6] text-slate-800 flex flex-col font-sans selection:bg-[#D4FF00] selection:text-[#111317]">
      <TacticalHeader onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
        <SidebarNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <MainContent />
      </div>

      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
