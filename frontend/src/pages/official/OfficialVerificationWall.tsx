import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Shield, ArrowRight, CheckCircle2, 
  Building2, BadgeAlert, AlertCircle, Key, Sparkles, UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfficialVerificationWall: React.FC = () => {
  const { verifyOfficial, currentUser, logout, setActiveTab } = useApp();
  const [badgeNumber, setBadgeNumber] = useState('MH-PUN-CYBER-7721');
  const [department, setDepartment] = useState('Pune Cyber Crime Cell / Deccan Division');
  const [station, setStation] = useState('Deccan Cyber Police Station');
  const [securityToken, setSecurityToken] = useState('SEC-2026-AUTH-9921');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeNumber || !department) {
      setError('Please provide complete official identification credentials.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      verifyOfficial(badgeNumber, department, station);
      setActiveTab('workflow');
    }, 700);
  };

  const handleQuickFill = () => {
    setBadgeNumber('MH-PUN-CYBER-7721');
    setDepartment('Pune Cyber Crime Cell / Deccan Division');
    setStation('Deccan Cyber Police Station');
    setSecurityToken('SEC-2026-AUTH-9921');
  };

  return (
    <div className="min-h-screen bg-[#0E1015] monotone-grid text-white flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#D4FF00] selection:text-[#111317]">
      <div className="bg-[#14171F] border border-white/15 rounded-3xl max-w-xl w-full p-6 sm:p-10 space-y-6 shadow-2xl animate-fadeIn relative text-slate-100">
        
        {/* Top Header */}
        <div className="border-b border-white/10 pb-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4FF00] text-[#111317] flex items-center justify-center font-black shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Official Verification
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Law Enforcement & Bank Nodal Access
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-white font-mono underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1 text-slate-200">
          <div className="flex items-center gap-2 font-bold text-[#D4FF00]">
            <Lock className="w-4 h-4" />
            <span>MHA I4C Identity Clearance</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Logged in as <b className="text-white">{currentUser?.email || 'officer@police.gov.in'}</b>. Verify officer credentials to access the command suite.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider">
              Police Badge ID / Officer Token:
            </label>
            <input
              type="text"
              required
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-xs text-[#D4FF00] font-bold focus:outline-none focus:border-[#D4FF00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold uppercase tracking-wider">
              Department & Cyber Cell Jurisdiction:
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4FF00]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold uppercase tracking-wider">
                Assigned Station / Desk:
              </label>
              <input
                type="text"
                required
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4FF00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold uppercase tracking-wider">
                2FA Hardware Token / Key:
              </label>
              <input
                type="text"
                required
                value={securityToken}
                onChange={(e) => setSecurityToken(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#D4FF00]"
              />
            </div>
          </div>

          {/* Quick Demo Pre-Fill Helper */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Official Sandbox</span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[#D4FF00] font-bold underline cursor-pointer hover:text-lime-300"
            >
              Use Demo Credentials
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neu-btn neu-btn-lime w-full py-4 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'Verify Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
          Audit Monitored under Section 65B Indian Evidence Act • IP & Biometric Hash Logged
        </div>

      </div>
    </div>
  );
};
