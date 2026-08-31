import React, { useState } from 'react';
import { Shield, ArrowRight, ShieldCheck, Lock, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onEnter: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onEnter }) => {
  const { role, setRole, setAlertBanner } = useApp();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [organization, setOrganization] = useState('I4C - Ministry of Home Affairs');

  const handleEnterDemo = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setAlertBanner('Welcome to Golden Hour Console. Synthetic dataset active.');
    onEnter();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="max-w-xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#111317] text-[#D4FF00] flex items-center justify-center mx-auto shadow-2xl">
            <Shield className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Golden Hour
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Cybercrime Cash-Out Intelligence Console (SIH26184)
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 bg-[#111317] text-[#D4FF00] rounded-full text-xs font-bold font-mono shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>DECISION SUPPORT LAYER</span>
            </div>
          </div>
        </div>

        <div className="neu-card p-8 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Institutional Organization:
              </label>
              <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400 shadow-inner"
              >
                <option value="I4C - Ministry of Home Affairs">Ministry of Home Affairs - I4C CIS Division</option>
                <option value="Haryana State Cyber Crime Police">Haryana State Cyber Crime Police Station</option>
                <option value="Bank D Nodal Fraud Desk">Bank D Financial Fraud Monitoring Desk</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Operational User Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400 shadow-inner"
              >
                <option value="LOCAL_BEAT_OFFICER">Local Patrol (Dispatch & Acknowledge)</option>
                <option value="BANK_NODAL_INVESTIGATOR">Bank Official (Trace & Hold Responses)</option>
                <option value="I4C_STATE_ANALYST">Cyber Cell (Full Triage & Forecast)</option>
              </select>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200/80 p-4 rounded-2xl text-xs text-slate-600 space-y-1 font-medium">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <Lock className="w-3.5 h-3.5 text-slate-700" />
                <span>Zero Live PII Guarantee</span>
              </div>
              <p>Demo mode uses synthetic seeded complaints, tokenized account numbers, and simulated bank response hops.</p>
            </div>
          </div>

          <button
            onClick={handleEnterDemo}
            className="w-full py-4 pill-btn-lime flex items-center justify-center gap-2 text-sm font-black shadow-xl cursor-pointer"
          >
            <span>Enter Intelligence Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                Demo Workspace Confirmation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                You are entering the <b>Golden Hour</b> operations prototype. All records, transaction flows, and ATM coordinates are <b>synthetic demonstration data</b> adhering to SIH26184 requirements.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 pill-btn-lime text-xs font-bold cursor-pointer"
              >
                Proceed to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
