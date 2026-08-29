import React, { useState, useEffect } from 'react';
import { 
  Settings, Shield, UserCheck, HelpCircle, 
  BookOpen, Key, RefreshCw, Database, 
  CheckCircle2, AlertCircle, ExternalLink, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { role, resetAll } = useApp();
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDb = async () => {
    try {
      setLoading(true);
      const res = await api.getDatabaseStatus();
      setDbStatus(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDb();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="neu-card p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Console Settings & Database Engine</h2>
              <p className="text-xs text-slate-500">Supabase PostgreSQL Schema & System Configuration (Section 12.4)</p>
            </div>
          </div>
          <TacticalBadge label={dbStatus?.engine || 'Supabase Schema Active'} variant="dark" />
        </div>

        <div className="space-y-6 text-xs font-medium">
          {/* Supabase Database Connection Card */}
          <div className="neu-card p-6 bg-[#F8FAFC] space-y-4 border border-slate-200/90 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Supabase PostgreSQL Database</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Schema file: <span className="font-mono font-bold text-slate-800">supabase_schema.sql</span></p>
                </div>
              </div>

              <button
                onClick={checkDb}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold shadow-inner cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Check Status</span>
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-bold text-slate-900">{dbStatus?.engine || 'Supabase PostgreSQL'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supabase Cloud Connection:</span>
                {dbStatus?.supabase?.connected ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> In-Memory Mode (Schema Ready)
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Seed Cases:</span>
                <span className="font-mono font-bold text-slate-900">{dbStatus?.total_cases_in_memory || 5} Cases Loaded</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Indexed ATMs & Stations:</span>
                <span className="font-mono font-bold text-slate-900">{dbStatus?.total_atms || 14} ATMs • {dbStatus?.total_police_stations || 4} Police Posts</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-[11px] text-emerald-800 leading-relaxed font-medium">
              💡 <b>To connect to your own Supabase project:</b>
              <ol className="list-decimal pl-4 mt-1 space-y-1">
                <li>Run <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">supabase_schema.sql</code> in your Supabase SQL Editor.</li>
                <li>Add <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">SUPABASE_URL</code> and <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">SUPABASE_KEY</code> in <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">.env</code>.</li>
                <li>Run <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">python backend/database/seed_supabase.py</code> to sync all records.</li>
              </ol>
            </div>
          </div>

          <div className="p-6 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Model Scoring Parameters (v0.1)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-slate-700 font-mono">
              <div className="bg-white p-3 rounded-xl border border-slate-200">Amount Risk: <b>0.25</b></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">Velocity Risk: <b>0.20</b></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">Network Risk: <b>0.20</b></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">Cashout Urgency: <b>0.15</b></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">Historical Link: <b>0.10</b></div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">Data Confidence: <b>0.10</b></div>
            </div>
          </div>

          <div className="p-6 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Reset System Database</h3>
            <p className="text-slate-600">
              Restore the entire database, case registry, and replay timeline back to the initial PRD seed state.
            </p>
            <button
              onClick={resetAll}
              className="px-6 py-2.5 pill-btn-dark text-xs font-bold cursor-pointer"
            >
              Reset Seed Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="neu-card p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Workflow Guidance & Glossary</h2>
            <p className="text-xs text-slate-500">Definitions, SOP Guidance, and Limitations (Section 12.4)</p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-medium">
          <div className="p-5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Observed vs Predicted Distinctions</h4>
            <p className="text-slate-600 leading-relaxed">
              <b>Observed:</b> Verified transaction or physical ATM withdrawal records returned by authorized banking/switch APIs.<br/>
              <b>Predicted:</b> Probabilistic spatial clustering rankings output by the forecasting model indicating candidate cash-out sectors.
            </p>
          </div>

          <div className="p-5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Human-in-the-Loop Interventions</h4>
            <p className="text-slate-600 leading-relaxed">
              Golden Hour does not autonomously freeze accounts or dispatch police cars. All generated Action Packets require explicit digital sign-off by a duty officer.
            </p>
          </div>

          <div className="p-5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-slate-700 pt-1">
              <div>[1-5] Switch Command Tabs</div>
              <div>[Space] Play/Pause Replay</div>
              <div>[R] Reset Seed Scenario</div>
              <div>[Esc] Close Open Modals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
