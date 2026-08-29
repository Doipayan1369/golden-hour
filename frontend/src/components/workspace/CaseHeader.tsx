import React from 'react';
import { 
  ShieldAlert, Clock, Landmark, 
  ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';
import { MaskedToken } from '../common/MaskedToken';

export const CaseHeader: React.FC = () => {
  const { selectedCase } = useApp();

  if (!selectedCase) return null;

  const severityVariant = 
    selectedCase.severity === 'CRITICAL' ? 'crimson' : 
    selectedCase.severity === 'HIGH' ? 'amber' : 
    selectedCase.severity === 'ELEVATED' ? 'cyan' : 'slate';

  return (
    <div className="neu-card p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shadow-lg shrink-0">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 font-mono">{selectedCase.case_id}</h2>
              <TacticalBadge label={selectedCase.severity} variant={severityVariant} pulse={selectedCase.severity === 'CRITICAL'} />
              <span className="px-3.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                {selectedCase.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1.5">
              Modus Operandi: <span className="text-slate-800 font-bold">{selectedCase.fraud_type}</span>
            </p>
          </div>
        </div>

        {/* Telemetry Hero Pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="bg-[#F8FAFC] border border-slate-200/90 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-slate-500 font-medium">Last Hop Velocity:</span>
            <span className="text-slate-900 font-bold font-mono text-sm">{selectedCase.data_freshness_minutes}m ago</span>
          </div>
          <div className="bg-[#111317] text-white px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <Landmark className="w-4 h-4 text-[#D4FF00]" />
            <span className="text-slate-300 font-medium">Stolen Amount:</span>
            <span className="text-[#D4FF00] font-black font-mono text-base">₹{selectedCase.amount_inr.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Anchor & Tokenized References (Zero PII Guarantee) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs pt-1">
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">ANCHOR UTR REFERENCE</div>
          <MaskedToken token={selectedCase.utr} type="utr" />
        </div>
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">VICTIM MASKED ACCOUNT</div>
          <MaskedToken token={selectedCase.victim_account_token} type="account" />
        </div>
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">VICTIM PHONE TOKEN</div>
          <MaskedToken token={selectedCase.victim_phone_token} type="phone" />
        </div>
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">ASSIGNED JURISDICTION</div>
          <div className="text-slate-800 font-semibold truncate bg-[#F8FAFC] px-4 py-2 rounded-full border border-slate-200/90 shadow-sm">
            {selectedCase.jurisdiction}
          </div>
        </div>
      </div>
    </div>
  );
};
