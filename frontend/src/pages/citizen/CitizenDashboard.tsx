import React, { useState } from 'react';
import { 
  ShieldCheck, Printer, FileText, CheckCircle2, Clock, 
  MapPin, Landmark, ArrowRight, ShieldAlert, PhoneCall,
  Download, Eye, Sparkles, UserCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaskedToken } from '../../components/common/MaskedToken';
import { TransactionGraph } from '../../components/workspace/TransactionGraph';
import { TimelineView } from '../../components/workspace/TimelineView';
import { MOCK_EDGES_041 } from '../../services/mockData';

export const CitizenDashboard: React.FC = () => {
  const { selectedCase, citizenCaseId, setCitizenStage, logout, graphEdges } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'GRAPH' | 'TIMELINE'>('GRAPH');

  const edges = graphEdges.length > 0 ? graphEdges : MOCK_EDGES_041;
  const stolenAmount = selectedCase?.amount_inr || 450000.0;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Reassuring Hero Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                  {citizenCaseId || 'CASE-2026-041'}
                </h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
                  ✓ 100% RECOVERED & INTERCEPTED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Complainant: <b className="text-slate-800">Ramesh Patil</b> • Station: <b className="text-slate-800">Deccan Cyber Police Station</b>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCitizenStage('FIR_VIEW')}
              className="px-5 py-2.5 pill-btn-lime text-xs font-black flex items-center gap-2 cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print FIR</span>
            </button>
            <button
              onClick={() => setCitizenStage('CASE_LOOKUP')}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
            >
              Change Case
            </button>
          </div>
        </div>

        {/* Financial Protection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Stolen Debit Amount:</span>
            <div className="text-lg font-black text-rose-600">₹{stolenAmount.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-emerald-700 text-[10px] uppercase font-bold">Secured & Frozen:</span>
            <div className="text-lg font-black text-emerald-800">₹{stolenAmount.toLocaleString('en-IN')} (100%)</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111317] text-white space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Interception Kiosk:</span>
            <div className="text-xs font-bold text-[#D4FF00] truncate">SBI FC Road (Goodluck Chowk)</div>
          </div>
        </div>
      </div>

      {/* Police Beat Patrol & Next Steps Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 neu-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <b className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Investigation & Interception Timeline
            </b>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
              CASE RESOLVED
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <div>
                <b className="text-slate-900 block">09:42 IST - 1930 Cyber Fraud Helpline Ingestion</b>
                <span className="text-slate-500">Complaint registered from Pune Camp. Multi-hop switch trace initialized automatically.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <div>
                <b className="text-slate-900 block">09:55 IST - 15-Hop Multi-Bank Chain Mapped</b>
                <span className="text-slate-500">Funds tracked through 15 beneficiary accounts across ICICI, HDFC, Axis, and SBI switches.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <div>
                <b className="text-slate-900 block">10:14 IST - Beat Unit 3 Interception at FC Road</b>
                <span className="text-slate-500">Deccan Cyber Beat Patrol secured the ATM kiosk and placed Section 91 CrPC card freeze.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Investigating Beat Officer Card */}
        <div className="neu-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#111317]" />
              <b className="text-sm font-black text-slate-900">Assigned Police Officer</b>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono space-y-1">
              <span className="text-slate-400 text-[10px] block uppercase">Investigating Officer</span>
              <b className="text-slate-900 block">Insp. Rajeshwar Deshmukh</b>
              <span className="text-slate-600 block text-[11px]">Deccan Gymkhana Cyber Unit</span>
              <span className="text-emerald-700 block font-bold text-[11px] pt-1">PCR Beat Unit 3 Assigned</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCitizenStage('FIR_VIEW')}
              className="w-full py-3 pill-btn-dark text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span>Print Official FIR Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* 15-Hop Interactive Money Trail */}
      <div className="neu-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Live 15-Hop Money Trail & Switch Graph
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing how the stolen ₹4,50,000 moved between 16 bank accounts across Pune
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('GRAPH')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'GRAPH' ? 'bg-[#111317] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Graph
            </button>
            <button
              onClick={() => setActiveSubTab('TIMELINE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSubTab === 'TIMELINE' ? 'bg-[#111317] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline Log
            </button>
          </div>
        </div>

        {activeSubTab === 'GRAPH' ? (
          <TransactionGraph />
        ) : (
          <TimelineView />
        )}
      </div>

    </div>
  );
};
