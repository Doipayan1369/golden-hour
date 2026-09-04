import React from 'react';
import { 
  HelpCircle, Shield, ArrowRight, CheckCircle2, 
  Clock, MapPin, GitBranch, Sparkles, X, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenOnboardingModal: React.FC = () => {
  const { citizenStage, setCitizenStage, currentUser } = useApp();

  if (citizenStage !== 'ONBOARDING_FAQ') return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14171F] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn relative z-[100000] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#D4FF00] text-[#111317] shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Welcome to Golden Hour Victim Portal
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Verified Account: <span className="text-[#D4FF00]">{currentUser?.email || 'Citizen User'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Introduction & FAQs */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-2xl bg-[#D4FF00]/10 border border-[#D4FF00]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#D4FF00] font-bold text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>How Your Case Is Being Handled in Real-Time</span>
            </div>
            <p className="text-slate-200">
              When you report a cyber fraud on 1930, your complaint is assigned a Case ID. Golden Hour tracks the stolen money across all 15 inter-bank hops and alerts nearby police patrols before the fraudster can cash out at an ATM.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <b className="text-white text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4FF00]" /> 1. Instant 15-Hop Tracing
              </b>
              <p className="text-slate-400 text-[11px]">
                Every beneficiary bank account where your money moved is mapped within seconds.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <b className="text-white text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> 2. ATM Cashout Radar
              </b>
              <p className="text-slate-400 text-[11px]">
                AI calculates the exact ATM cluster where the thief is likely to withdraw the money.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <b className="text-white text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> 3. Section 91 CrPC Hold
              </b>
              <p className="text-slate-400 text-[11px]">
                Statutory freeze orders are automatically sent to banks to stop withdrawals.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <b className="text-white text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> 4. Official Digital FIR
              </b>
              <p className="text-slate-400 text-[11px]">
                Access and print your certified police FIR with court-admissible seals.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-slate-500 font-mono text-[11px]">Next: Enter Case Reference</span>
          <button
            onClick={() => setCitizenStage('CASE_LOOKUP')}
            className="px-6 py-3 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black flex items-center gap-2 hover:bg-lime-400 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <span>Proceed to Enter Case Number</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
