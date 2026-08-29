import React, { useState, useEffect } from 'react';
import { 
  Shield, RefreshCw, UserCheck, Activity, 
  Radio, CheckCircle2, Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const TacticalHeader: React.FC = () => {
  const { role, setRole, resetAll, auditVerification, alertBanner } = useApp();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full pt-5 pb-3 px-6 lg:px-10 sticky top-0 z-50">
      {/* Top Banner Notice */}
      <div className="max-w-[1540px] mx-auto mb-4 bg-[#111317] text-slate-300 rounded-full px-6 py-2 flex items-center justify-between text-xs font-mono shadow-md border border-white/10">
        <div className="flex items-center gap-2.5 text-white font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] animate-pulse"></span>
          <span className="tracking-wide">SIH26184 / I4C CIS DIVISION — SYNTHETIC DEMONSTRATION & REPLAY MODE (ZERO REAL PII)</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-400">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#D4FF00]" />
            8,000+ COMPLAINTS/DAY SIMULATOR
          </span>
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#D4FF00]" />
            {timeStr}
          </span>
        </div>
      </div>

      {alertBanner && (
        <div className="max-w-[1540px] mx-auto mb-4 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-semibold text-center shadow-lg flex items-center justify-center gap-2.5">
          <CheckCircle2 className="w-4 h-4" />
          {alertBanner}
        </div>
      )}

      {/* Main SaaS Navbar */}
      <div className="max-w-[1540px] mx-auto bg-white/95 backdrop-blur-lg rounded-3xl border border-slate-200/90 px-7 py-4 shadow-sm flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shadow-md shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Golden Hour
              </h1>
              <span className="px-2.5 py-0.5 bg-[#D4FF00] text-[#111317] text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-sm">
                INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C)
            </p>
          </div>
        </div>

        {/* Right: Role, Hash Verification, Reset */}
        <div className="flex items-center gap-4">
          {/* Audit Verification */}
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 bg-[#F8FAFC] border border-slate-200/90 rounded-full text-xs font-medium text-slate-600 shadow-inner">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Audit Ledger:</span>
            {auditVerification?.chain_valid ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {auditVerification.total_events} Blocks
              </span>
            ) : (
              <span className="text-amber-600 font-bold">Validating...</span>
            )}
          </div>

          {/* Role Selector Pill */}
          <div className="flex items-center gap-2.5 bg-[#F8FAFC] border border-slate-200/90 px-4 py-2 rounded-full shadow-inner">
            <UserCheck className="w-4 h-4 text-slate-700 shrink-0" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="I4C_STATE_ANALYST">I4C State Cyber Analyst</option>
              <option value="LOCAL_BEAT_OFFICER">Local Beat Officer (Gurugram)</option>
              <option value="BANK_NODAL_INVESTIGATOR">Bank D Nodal Officer</option>
            </select>
          </div>

          {/* Reset Seed Button */}
          <button
            onClick={resetAll}
            title="Reset to PRD Benchmark Seed"
            className="flex items-center gap-2 px-5 py-2 bg-[#111317] hover:bg-[#23272F] text-white rounded-full text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>
    </header>
  );
};
