import React, { useState } from 'react';
import { 
  FileText, Search, ShieldAlert, ArrowRight, 
  CheckCircle2, Sparkles, Building2, MapPin, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenCaseLookupModal: React.FC = () => {
  const { citizenStage, setCitizenStage, citizenCaseId, setCitizenCaseId, selectCase } = useApp();
  const [inputCaseId, setInputCaseId] = useState(citizenCaseId || 'CASE-2026-041');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (citizenStage !== 'CASE_LOOKUP') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCaseId.trim()) {
      setError('Please enter a valid Case ID or Acknowledgement Number.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCitizenCaseId(inputCaseId.trim().toUpperCase());
      selectCase(inputCaseId.trim().toUpperCase());
      setCitizenStage('FIR_VIEW');
    }, 600);
  };

  const handleQuickSelect = (cid: string) => {
    setInputCaseId(cid);
    setCitizenCaseId(cid);
    selectCase(cid);
    setCitizenStage('FIR_VIEW');
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14171F] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn relative z-[100000] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="p-3 rounded-2xl bg-[#D4FF00] text-[#111317] shadow-md">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Enter Your Cybercrime Case Number
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              National Cybercrime Reporting Portal (1930) Reference
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-300 font-bold uppercase tracking-wider font-mono">
              Case / Complaint Acknowledgement ID:
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. CASE-2026-041 or NCRP-992144"
                value={inputCaseId}
                onChange={(e) => setInputCaseId(e.target.value)}
                className="w-full uppercase font-mono font-bold bg-white/5 border border-white/15 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-[#D4FF00] placeholder-slate-500 focus:outline-none focus:border-[#D4FF00]"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Found in the SMS/Email confirmation sent by 1930 helpline.
            </p>
          </div>

          {/* Privacy & Demo Notice */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Personalized Victim Privacy Vault</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Your case details are strictly isolated and never exposed to other users. To test the live 15-hop trace and Section 91 CrPC recovery in this demonstration, enter <code className="text-[#D4FF00] font-mono font-bold bg-black/40 px-1.5 py-0.5 rounded">CASE-2026-041</code> above.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-lime-400 transition-all shadow-lg hover:scale-105"
          >
            <span>{loading ? 'Retrieving Case Record...' : 'View Digital FIR & Recovery Status'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
