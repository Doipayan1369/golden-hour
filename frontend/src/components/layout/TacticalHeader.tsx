import React, { useState, useEffect } from 'react';
import { 
  Shield, RefreshCw, UserCheck, Activity, 
  HelpCircle, CheckCircle2, Clock, BookOpen, Sparkles, Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { SidebarNav } from './SidebarNav';

export const TacticalHeader: React.FC = () => {
  const { role, setRole, resetAll, auditVerification, alertBanner, selectCase, setActiveTab } = useApp();
  const [timeStr, setTimeStr] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('golden_hour_onboarded');
    if (!hasSeen) {
      setIsOnboardingOpen(true);
    }

    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="w-full pt-3 sm:pt-4 pb-2 px-3 sm:px-6 lg:px-10 sticky top-0 z-40">
        {/* Main Spacious Navbar */}
        <div className="max-w-[1540px] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 px-4 sm:px-8 py-3 sm:py-4 shadow-sm flex items-center justify-between transition-all">
          
          {/* Left: Mobile Menu Toggle & Clean Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Golden Hour
                </h1>
                <span className="hidden xs:inline px-2 sm:px-2.5 py-0.5 bg-[#111317] text-[#D4FF00] text-[9px] sm:text-[10px] font-extrabold rounded-full tracking-wider">
                  1930 RAPID
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
                Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C)
              </p>
            </div>
          </div>

          {/* Right: Helpful Actions, Role Selector & Guidance */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Guide & Onboarding Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-inner"
              title="Open Official's Walkthrough & Guide"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span className="hidden md:inline">How It Works</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F8FAFC] border border-slate-200/90 rounded-full px-2.5 sm:px-3.5 py-1.5 shadow-inner">
              <UserCheck className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="I4C_STATE_ANALYST">State Analyst</option>
                <option value="LOCAL_BEAT_OFFICER">Beat Patrol</option>
                <option value="BANK_NODAL_INVESTIGATOR">Bank Nodal</option>
              </select>
            </div>

            {/* Reset Database */}
            <button
              onClick={() => resetAll()}
              className="p-2 sm:p-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-inner"
              title="Reset System Simulation State"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

      {/* Mobile Drawer */}
      <SidebarNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

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
