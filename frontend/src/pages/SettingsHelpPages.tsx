import React, { useState, useEffect } from 'react';
import { 
  Settings, Shield, UserCheck, HelpCircle, 
  BookOpen, Key, RefreshCw, Database, 
  CheckCircle2, AlertCircle, ExternalLink, Sparkles,
  ChevronDown, ChevronUp, Search, Clock, Send, Flame, GitBranch, ShieldAlert,
  PlayCircle, FileText, ArrowRight, RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { api } from '../services/api';
import { InstructionPopupModal, SOPInstruction } from '../components/modals/InstructionPopupModal';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';

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
      <div className="neu-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Console Settings & Database Engine</h2>
              <p className="text-xs text-slate-500">Supabase PostgreSQL Schema & System Configuration</p>
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

// 4 Complete Standard Operating Procedures (SOPs) for Pop-Up Display
const SOPS: SOPInstruction[] = [
  {
    id: 'sop-1',
    stageNum: 1,
    title: 'Incident Intake & UTR Anchor Verification',
    category: 'Stage 1 • Triage Protocol',
    duration: '2 Minutes',
    summary: 'Protocol for ingesting 1930 cyber fraud complaints, validating beneficiary UTR anchors, and prioritizing cases by cash-out urgency.',
    steps: [
      { title: 'Check Victim Transaction Freshness', desc: 'Identify if the transaction occurred within the last 60 minutes (the critical Golden Hour).' },
      { title: 'Anchor Unique Transaction Reference (UTR)', desc: 'Extract and lock the 12-digit IMPS/UPI/NEFT UTR anchor to query national banking switches.' },
      { title: 'Evaluate Severity Metric', desc: 'Prioritize CRITICAL severity incidents with losses > ₹1,00,000 INR and active pass-through speed.' }
    ],
    legalBasis: 'Indian Cyber Crime Coordination Centre (I4C) NCRP Standard Operating Procedure Section 4.1.',
    proTips: [
      'Always confirm beneficiary IFSC code matches authorized clearing houses.',
      'Check for duplicate complaint IDs before initiating multi-hop bank traces.'
    ]
  },
  {
    id: 'sop-2',
    stageNum: 2,
    title: 'Multi-Hop Beneficiary Mule Trace',
    category: 'Stage 2 • Banking Switch Protocol',
    duration: '3 Minutes',
    summary: 'How to traverse layer-1 and layer-2 mule accounts, evaluate velocity pass-through ratios, and pinpoint terminal cashout cards.',
    steps: [
      { title: 'Traverse Beneficiary Nodes', desc: 'Map money forwarding from victim account through intermediary shell/mule bank accounts.' },
      { title: 'Inspect Pass-Through Ratios', desc: 'Flag accounts where >90% of incoming funds are forwarded within 15 minutes.' },
      { title: 'Identify Terminal Cashout Node', desc: 'Isolate the final account linked to physical debit cards or micro-ATM withdrawal tokens.' }
    ],
    legalBasis: 'Reserve Bank of India (RBI) Master Circular on Fraud Monitoring & Account Freezing Framework.',
    proTips: [
      'Mule accounts frequently originate from dormant student or low-income bank accounts.',
      'Pass-through velocity under 10 minutes indicates automated bot or organized syndicate operations.'
    ]
  },
  {
    id: 'sop-3',
    stageNum: 3,
    title: 'Thermal Cash-Out Radar & Corridor Prediction',
    category: 'Stage 3 • Geospatial Analysis',
    duration: '2 Minutes',
    summary: 'Interpreting the continuous Kernel Density Estimation (KDE) thermal heatmap to identify candidate ATM kiosks in Pune City.',
    steps: [
      { title: 'Analyze Heatmap Density Centers', desc: 'Review the high-intensity golden/crimson corridors (e.g. FC Road & Goodluck Chowk).' },
      { title: 'Cross-Reference 24x7 ATM Kiosks', desc: 'Identify high-risk ATMs located within 1,800m of the mule card issuance cluster.' },
      { title: 'Verify Expected Withdrawal Window', desc: 'Check the predicted 15-minute time window (e.g. 10:25 - 10:40 IST) before dispatching field units.' }
    ],
    legalBasis: 'Ministry of Home Affairs Guidelines on Geospatial Cybercrime Intelligence (2026).',
    proTips: [
      'Use the Heat Radius slider to isolate individual high-density commercial strips.',
      'Corridors with public transit hubs (e.g. Shivaji Nagar) carry higher getaway risk.'
    ]
  },
  {
    id: 'sop-4',
    stageNum: 4,
    title: 'Tactical Dispatch & Emergency Card Freeze',
    category: 'Stage 4 • Interception Protocol',
    duration: '2 Minutes',
    summary: 'Transmitting encrypted GPS packets to local Beat Patrol Units and serving emergency Section 91 CrPC card hold orders.',
    steps: [
      { title: 'Select Sector Beat Unit', desc: 'Assign the nearest police patrol unit (e.g. Deccan Cyber Beat Unit 3).' },
      { title: 'Generate Action Packet', desc: 'Bundle ATM coordinates, target photos, and suspect card token into an encrypted tactical dispatch.' },
      { title: 'Issue DSP Digital Sign-Off', desc: 'Authorize emergency bank account/card freeze order under Section 91 CrPC.' }
    ],
    legalBasis: 'Code of Criminal Procedure (CrPC) Section 91 & Information Technology Act Section 69B.',
    proTips: [
      'Verify beat officer acknowledgment on field mobile terminal within 3 minutes.',
      'Ensure bank nodal officer receives automated webhook payload to place card hold.'
    ]
  }
];

// 6 Frequently Asked Questions (FAQs)
const FAQS = [
  {
    q: 'What is the "Golden Hour" and why is it critical?',
    a: 'The "Golden Hour" is the initial 60-minute window after a cyber fraud occurs. Fraudsters rapidly layer stolen funds through mule bank accounts before withdrawing physical cash at an ATM or micro-ATM. Once physical cash is withdrawn, fund recovery drops below 5%. Golden Hour enables real-time interception before the withdrawal happens.'
  },
  {
    q: 'How does the AI model predict the cash-out ATM corridor in Pune?',
    a: 'The engine correlates multiple real-time and historical signals: mule account branch geography, recent pass-through velocity vectors, 24x7 ATM kiosk density, CCTV coverage, and road transit times from the last known node to predict the most probable ATM cluster (e.g. FC Road & Goodluck Chowk) with 80%+ accuracy.'
  },
  {
    q: 'What legal authority allows emergency bank account and card holds?',
    a: 'Emergency freezes are authorized under Section 91 of the Code of Criminal Procedure (CrPC) and the Ministry of Home Affairs 1930 / NCRP framework. Golden Hour generates pre-formatted, DSP-authorized digital hold notices directly transmitted to bank nodal officers.'
  },
  {
    q: 'How do police beat patrol officers receive tactical dispatch alerts?',
    a: 'When an analyst approves an Action Packet, Golden Hour transmits a real-time encrypted dispatch packet to the local Police Control Room (PCR) and field officers on patrol in the sector (e.g. Deccan Beat Unit 3), providing exact ATM GPS coordinates and suspect card details.'
  },
  {
    q: 'How does the SHA-256 cryptographic audit ledger protect court evidence?',
    a: 'Every analyst query, dispatch authorization, and banking response is timestamped and hashed into an append-only cryptographic Merkle hash chain. This ensures non-repudiation and provides a tamper-proof certificate admissible in court under Section 65B of the Indian Evidence Act.'
  },
  {
    q: 'Can I restart the interactive guided tour if I need a refresher?',
    a: 'Yes! Click the "↺ Restart Quick Start Tour" button at the top of this page or click "How It Works" in the top navigation bar at any time to replay the visual 4-step onboarding walkthrough.'
  }
];

export const HelpPage: React.FC = () => {
  const { selectCase, setActiveTab } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeSOP, setActiveSOP] = useState<SOPInstruction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  const filteredFAQs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      
      {/* 1. Hero Onboarding Replay Banner */}
      <div className="bg-[#111317] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4FF00] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICER ASSISTANCE & GUIDANCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Need a Quick Refresher on How Golden Hour Works?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Replay the visual 60-second guided onboarding walkthrough anytime to review the 3-step investigative workflow and case simulation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="w-full sm:w-auto pill-btn-lime px-6 py-3 text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Onboarding Tour</span>
          </button>
        </div>
      </div>

      {/* 2. Standard Operating Procedures (SOPs) Pop-up Section */}
      <div className="neu-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Standard Operating Procedures (SOPs)</h3>
              <p className="text-xs text-slate-500">Click any procedure below to view the official step-by-step instruction pop-up</p>
            </div>
          </div>
        </div>

        {/* 4 Interactive SOP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOPS.map((sop) => (
            <div
              key={sop.id}
              onClick={() => setActiveSOP(sop)}
              className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-400 hover:bg-white transition-all cursor-pointer space-y-3 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2.5 py-0.5 rounded-full font-bold font-mono">
                  SOP #{sop.stageNum}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {sop.duration}
                </span>
              </div>
              <div>
                <b className="text-sm text-slate-900 group-hover:text-black font-extrabold block">{sop.title}</b>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{sop.summary}</p>
              </div>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-[#111317] group-hover:translate-x-1 transition-transform">
                <span>Open Instruction Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Frequently Asked Questions (FAQ) Section */}
      <div className="neu-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Common questions from Cyber Crime Officers & Nodal Investigators</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 text-xs text-slate-800 pl-9 pr-3 py-2 rounded-full focus:outline-none focus:border-slate-400 shadow-inner"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.map((faq, idx) => {
            const isOpen = openFAQIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F8FAFC]/50">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFAQs.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No matching questions found for "{searchQuery}".</p>
          )}
        </div>
      </div>

      {/* 4. Ready to Investigate Footer Callout */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <b className="text-sm font-black text-slate-900 block">Ready to Begin Investigation?</b>
          <p className="text-xs text-slate-500 mt-0.5">Jump directly into Case CASE-2026-041 in the 6-stage guided workflow.</p>
        </div>
        <button
          onClick={() => {
            selectCase('CASE-2026-041');
            setActiveTab('workflow');
          }}
          className="pill-btn-dark px-6 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Open Case CASE-2026-041</span>
          <ArrowRight className="w-4 h-4 text-[#D4FF00]" />
        </button>
      </div>

      {/* Onboarding Modal Popup */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartCase={(cid) => {
          selectCase(cid);
          setActiveTab('workflow');
        }}
      />

      {/* SOP Pop-up Instruction Sheet Modal */}
      <InstructionPopupModal
        instruction={activeSOP}
        onClose={() => setActiveSOP(null)}
      />
    </div>
  );
};
