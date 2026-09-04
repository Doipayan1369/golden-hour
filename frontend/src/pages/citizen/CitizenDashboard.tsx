import React, { useState } from 'react';
import { 
  ShieldCheck, Printer, FileText, CheckCircle2, Clock, 
  MapPin, Landmark, ArrowRight, ShieldAlert, PhoneCall,
  Download, Eye, Sparkles, UserCheck, AlertCircle, RefreshCw,
  Navigation, User, MessageSquare, ExternalLink, HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaskedToken } from '../../components/common/MaskedToken';
import { TransactionGraph } from '../../components/workspace/TransactionGraph';
import { TimelineView } from '../../components/workspace/TimelineView';
import { MOCK_EDGES_041 } from '../../services/mockData';
import { UserProfilePage } from './UserProfilePage';
import { EmergencyHelpModal } from '../../components/modals/EmergencyHelpModal';

export const CitizenDashboard: React.FC = () => {
  const { selectedCase, citizenCaseId, setCitizenStage, logout, graphEdges } = useApp();
  const [viewMode, setViewMode] = useState<'TRACKING' | 'PROFILE'>('TRACKING');
  const [activeSubTab, setActiveSubTab] = useState<'GRAPH' | 'TIMELINE'>('GRAPH');
  const [isEmergencyHelpOpen, setIsEmergencyHelpOpen] = useState(false);

  const edges = graphEdges.length > 0 ? graphEdges : MOCK_EDGES_041;
  const stolenAmount = selectedCase?.amount_inr || 450000.0;

  if (viewMode === 'PROFILE') {
    return <UserProfilePage onBackToTracking={() => setViewMode('TRACKING')} />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Quick Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-full text-xs font-bold">
          <button
            onClick={() => setViewMode('TRACKING')}
            className="neu-btn-dark text-xs px-4 py-2 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>Live Tracker</span>
          </button>
          <button
            onClick={() => setViewMode('PROFILE')}
            className="neu-btn text-xs px-4 py-2 text-slate-700 hover:text-slate-950 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEmergencyHelpOpen(true)}
            className="neu-btn-red text-xs px-3.5 sm:px-4 py-2 flex items-center gap-1.5 shadow-md"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1930</span>
          </button>
          <button
            onClick={() => setCitizenStage('ONBOARDING_FAQ')}
            className="neu-btn px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs</span>
          </button>
        </div>
      </div>

      {/* Reassuring Hero Status Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-lg shrink-0">
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
                Complainant: <b className="text-slate-800">Ramesh Patil</b> • Station: <b className="text-slate-800">Deccan Cyber Police Station, Pune</b>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCitizenStage('FIR_VIEW')}
              className="neu-btn-lime text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View FIR</span>
            </button>
            <button
              onClick={() => setCitizenStage('CASE_LOOKUP')}
              className="neu-btn px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50"
            >
              Change Case
            </button>
          </div>
        </div>

        {/* Financial Protection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Stolen Debit Amount:</span>
            <div className="text-lg font-black text-rose-600">₹{stolenAmount.toLocaleString('en-IN')}.00</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-emerald-700 text-[10px] uppercase font-bold">Secured & Frozen:</span>
            <div className="text-lg font-black text-emerald-800">₹{stolenAmount.toLocaleString('en-IN')}.00 (100%)</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0E1118] text-white space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Interception Kiosk:</span>
            <div className="text-xs font-bold text-[#D4FF00] truncate">SBI FC Road (Goodluck Chowk)</div>
          </div>
        </div>
      </div>

      {/* AI PREDICTED POTENTIAL CASH-OUT LOCATION (Crucial User Requirement) */}
      <div className="neu-card p-6 sm:p-8 space-y-6 border-2 border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E1118] text-[#D4FF00] flex items-center justify-center font-black shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  AI Predicted Potential Cash-Out Interception Point
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0E1118] text-[#D4FF00] text-[10px] font-black font-mono">
                  94.2% AI CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Machine learning forecast based on 15-hop mule velocity and geographical withdrawal proximity
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black font-mono flex items-center gap-1.5 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>INTERCEPTED & CARD FROZEN</span>
          </div>
        </div>

        {/* Tactical ATM Details & Mini Map Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Key Metrics */}
          <div className="lg:col-span-7 space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Terminal Cash-Out Kiosk:</span>
                <span className="text-emerald-700 font-bold text-[11px]">Primary Mule Node 15</span>
              </div>
              <div className="text-base font-black text-slate-900">
                SBI ATM — FC Road (Goodluck Chowk Kiosk)
              </div>
              <div className="text-slate-600 font-sans text-xs">
                Fergusson College Road, Shivajinagar, Pune, Maharashtra 411004
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Patrol Distance</span>
                <b className="text-slate-900 text-sm">120 Meters</b>
                <span className="text-[10px] text-emerald-700 font-bold block">PCR Beat Unit 3</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Interception Time</span>
                <b className="text-slate-900 text-sm">14 Minutes</b>
                <span className="text-[10px] text-emerald-700 font-bold block">Prior to withdrawal</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] block uppercase font-bold">GPS Coordinates</span>
                <b className="text-slate-900 text-xs block truncate">18.5167° N, 73.8415° E</b>
                <span className="text-[10px] text-slate-500 block">Deccan Cyber Beat</span>
              </div>
            </div>
          </div>

          {/* Mini Tactical Radar Simulation View */}
          <div className="lg:col-span-5 h-48 sm:h-52 rounded-xl bg-[#080A0E] border border-white/15 p-4 flex flex-col justify-between relative overflow-hidden text-white shadow-xl">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#D4FF00] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping"></span>
                LIVE RADAR PERIMETER
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-white/10 px-2 py-0.5 rounded">
                Radius: 500m
              </span>
            </div>

            {/* Radar Center Pin */}
            <div className="relative z-10 my-auto text-center space-y-1">
              <div className="inline-flex p-3 rounded-full bg-rose-600/30 border border-rose-500 text-rose-400 shadow-lg animate-pulse">
                <MapPin className="w-6 h-6 text-[#D4FF00]" />
              </div>
              <b className="block font-mono text-xs text-white">SBI ATM FC Road (Locked)</b>
              <span className="text-[10px] text-emerald-400 font-mono block">PCR Beat Unit 3 On Scene</span>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/10 pt-2">
              <span>Section 91 CrPC Hold</span>
              <span className="text-[#D4FF00] font-bold">ATM Cashout Prevented</span>
            </div>
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
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono space-y-1">
              <span className="text-slate-400 text-[10px] block uppercase">Investigating Officer</span>
              <b className="text-slate-900 block">Insp. Rajeshwar Deshmukh</b>
              <span className="text-slate-600 block text-[11px]">Deccan Gymkhana Cyber Unit</span>
              <span className="text-emerald-700 block font-bold text-[11px] pt-1">PCR Beat Unit 3 Assigned</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => setCitizenStage('FIR_VIEW')}
              className="neu-btn-lime w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print FIR</span>
            </button>
            <button
              onClick={() => setViewMode('PROFILE')}
              className="neu-btn w-full py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Raise Concern</span>
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

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('GRAPH')}
              className={`neu-btn px-3.5 py-1.5 rounded-full text-xs transition-all ${
                activeSubTab === 'GRAPH' ? 'bg-[#0E1118] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setActiveSubTab('TIMELINE')}
              className={`neu-btn px-3.5 py-1.5 rounded-full text-xs transition-all ${
                activeSubTab === 'TIMELINE' ? 'bg-[#0E1118] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {activeSubTab === 'GRAPH' ? (
          <TransactionGraph />
        ) : (
          <TimelineView />
        )}
      </div>

      {/* Emergency Help Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyHelpOpen}
        onClose={() => setIsEmergencyHelpOpen(false)}
      />

    </div>
  );
};

