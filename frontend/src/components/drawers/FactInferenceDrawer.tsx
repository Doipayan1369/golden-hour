import React from 'react';
import { X, Info, ShieldCheck, HelpCircle, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FactInferenceDrawerProps {
  onClose: () => void;
}

export const FactInferenceDrawer: React.FC<FactInferenceDrawerProps> = ({ onClose }) => {
  const { selectedCase } = useApp();

  if (!selectedCase) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between font-sans animate-in slide-in-from-right duration-200 overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#111317] text-[#D4FF00]">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Fact vs Inference Audit</h3>
              <p className="text-xs text-slate-400">D-02 Fact/Inference Breakdown (PRD Section 6.3)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Reported Facts */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] uppercase font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full w-fit">
            1. REPORTED BY COMPLAINANT
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl space-y-1 text-slate-700">
            <div>• Stolen Amount: <b>₹{selectedCase.amount_inr.toLocaleString('en-IN')}</b></div>
            <div>• Anchor UTR: <span className="font-mono">{selectedCase.utr}</span></div>
            <div>• Fraud Modus Operandi: <b>{selectedCase.fraud_type}</b></div>
            <div>• Reported Time: <span className="font-mono">{selectedCase.created_at}</span></div>
          </div>
        </div>

        {/* 2. Confirmed Bank Facts */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit">
            2. CONFIRMED BY BANKING AUTHORITIES
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl space-y-1 text-slate-700">
            <div>• Bank A → Bank B (Hop 1): <b>INR 75,000 Verified</b> (10:02 IST)</div>
            <div>• Bank B → Bank C (Hop 2): <b>INR 58,000 Verified</b> (10:09 IST)</div>
            <div>• Bank C → Bank D (Hop 3): <b>INR 40,000 Verified</b> (10:12 IST)</div>
          </div>
        </div>

        {/* 3. Model Inference */}
        <div className="space-y-2 text-xs">
          <div className="text-[11px] uppercase font-bold text-[#111317] bg-[#D4FF00] px-3 py-1 rounded-full w-fit">
            3. STATISTICAL MODEL INFERENCE
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl space-y-1 text-slate-700">
            <div>• Predicted Corridor: <b>Sector 14 Transit & Commercial Corridor</b></div>
            <div>• Estimated Cash-Out Window: <b>10:25 - 10:40 IST</b></div>
            <div>• Algorithmic Confidence: <b>82% (Weighted Heuristic Model v0.1)</b></div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
