import React, { useState, useEffect } from 'react';
import { 
  Shield, RefreshCw, UserCheck, Activity, 
  HelpCircle, CheckCircle2, Clock, BookOpen, Sparkles, Menu, LogOut, Home, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { OnboardingModal } from '../onboarding/OnboardingModal';

export const TacticalHeader: React.FC<{ onToggleMobileMenu?: () => void }> = ({ onToggleMobileMenu }) => {
  const { 
    role, setRole, resetAll, alertBanner, selectCase, 
    setActiveTab, currentUser, logout, setShowLandingPage, userType, setCitizenStage 
  } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <>
      <header className="w-full pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-10 sticky top-0 z-40">
        {/* Main Spacious Navbar */}
        <div className="max-w-[1540px] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 px-4 sm:px-8 py-3 sm:py-4 shadow-sm flex items-center justify-between transition-all">
          
          {/* Left: Mobile Menu Toggle & Clean Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Button for Mobile */}
            {onToggleMobileMenu && (
              <button
                onClick={() => onToggleMobileMenu()}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => setShowLandingPage(true)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
              title="Return to Golden Hour Homepage"
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowLandingPage(true)}
                  className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight hover:text-slate-700 cursor-pointer text-left"
                >
                  Golden Hour
                </button>
                <span className="hidden xs:inline px-2 sm:px-2.5 py-0.5 bg-[#111317] text-[#D4FF00] text-[9px] sm:text-[10px] font-extrabold rounded-full tracking-wider">
                  {userType === 'CITIZEN' ? 'CITIZEN PORTAL' : 'OFFICIAL SUITE'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
                Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C)
              </p>
            </div>
          </div>

          {/* Right: Helpful Actions, Role Indicator & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Citizen FIR Shortcut (if citizen) */}
            {userType === 'CITIZEN' && (
              <button
                onClick={() => setCitizenStage('FIR_VIEW')}
                className="px-3 sm:px-4 py-2 rounded-full bg-[#111317] text-[#D4FF00] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-slate-800"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">My Digital FIR</span>
              </button>
            )}

            {/* Quick Tour Guide */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-inner"
              title="Open Official's Walkthrough & Guide"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span className="hidden md:inline">Quick Tour</span>
            </button>

            {/* Help & FAQ Button */}
            <button
              onClick={() => setActiveTab('help')}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-inner"
              title="Open Help Center, FAQs & SOPs"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span className="hidden md:inline">Help & FAQs</span>
            </button>

            {/* Officer Role Indicator (if official) */}
            {userType !== 'CITIZEN' && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F8FAFC] border border-slate-200/90 rounded-full px-2.5 sm:px-3.5 py-1.5 shadow-inner">
                <UserCheck className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="LOCAL_BEAT_OFFICER">Local Patrol</option>
                  <option value="BANK_NODAL_INVESTIGATOR">Bank Official</option>
                  <option value="I4C_STATE_ANALYST">Cyber Cell</option>
                </select>
              </div>
            )}

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-2 sm:p-2.5 rounded-full bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shadow-inner"
              title="Sign Out to Public Homepage"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Global Alert Notification Banner */}
        {alertBanner && (
          <div className="max-w-[1540px] mx-auto mt-2.5 bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold text-center shadow-lg flex items-center justify-center gap-2 animate-slideUp">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{alertBanner}</span>
          </div>
        )}
      </header>

      {/* Interactive Modal Guide */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartCase={(cid) => {
          selectCase(cid);
          setActiveTab('workflow');
        }}
      />
    </>
  );
};
