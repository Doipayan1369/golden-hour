import React, { useState, useEffect } from 'react';
import { 
  Shield, RefreshCw, UserCheck, Activity, 
  HelpCircle, CheckCircle2, Clock, BookOpen, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { OnboardingModal } from '../onboarding/OnboardingModal';

export const TacticalHeader: React.FC = () => {
  const { role, setRole, resetAll, auditVerification, alertBanner, selectCase, setActiveTab } = useApp();
  const [timeStr, setTimeStr] = useState('');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // Open onboarding automatically on first visit
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
      <header className="w-full pt-4 pb-2 px-6 lg:px-10 sticky top-0 z-40">
        {/* Main Spacious Navbar */}
        <div className="max-w-[1540px] mx-auto bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 px-8 py-4 shadow-sm flex items-center justify-between transition-all">
          
          {/* Left: Clean Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Golden Hour
                </h1>
                <span className="px-2.5 py-0.5 bg-[#111317] text-[#D4FF00] text-[10px] font-extrabold rounded-full tracking-wider">
                  1930 RAPID INTERCEPTION
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C)
              </p>
            </div>
          </div>

          {/* Right: Helpful Actions, Role Selector & Guidance */}
          <div className="flex items-center gap-3">
            
            {/* Guide & Onboarding Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-4 py-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-inner"
              title="Open Official's Walkthrough & Guide"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">How It Works (Guide)</span>
            </button>

            {/* Live Clock */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-full text-xs font-mono font-semibold text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeStr}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-inner">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="I4C_STATE_ANALYST">State Cyber Analyst</option>
                <option value="LOCAL_BEAT_OFFICER">Local Beat Patrol Officer</option>
                <option value="BANK_NODAL_INVESTIGATOR">Bank Nodal Officer</option>
              </select>
            </div>

            {/* Reset Database */}
            <button
              onClick={() => resetAll()}
              className="p-2.5 rounded-full bg-[#F8FAFC] border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-inner"
              title="Reset System Simulation State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Alert Notification Banner */}
        {alertBanner && (
          <div className="max-w-[1540px] mx-auto mt-3 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-xs font-semibold text-center shadow-lg flex items-center justify-center gap-2 animate-slideUp">
            <CheckCircle2 className="w-4 h-4" />
            <span>{alertBanner}</span>
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
