import React, { useState } from 'react';
import { 
  Shield, ShieldCheck, Flame, GitBranch, Send, RotateCcw, 
  FileText, ArrowRight, CheckCircle2, Lock, Users, Building2, 
  MapPin, Clock, ChevronDown, ChevronUp, Sparkles, ExternalLink,
  ShieldAlert, Activity, Award, HelpCircle, PhoneCall, Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { openAuthModal, selectCase, setShowLandingPage, setActiveTab, setCitizenStage } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the 'Golden Hour' in cyber fraud recovery?",
      a: "The first 30 to 60 minutes after a cyber fraud occurs is the 'Golden Hour'. During this window, stolen funds hop through mule accounts before criminals attempt physical ATM cashouts. Golden Hour uses spatial AI to predict the cashout ATM and coordinates emergency police beat patrol dispatch to intercept the withdrawal."
    },
    {
      q: "How can citizens track their stolen funds and view their FIR?",
      a: "Citizens sign up with their email address, enter their 1930 NCRP complaint / case number, and immediately access their authenticated digital FIR (First Information Report) with official police seals, live 15-hop fund tracking, and printable court documents."
    },
    {
      q: "How are police officers and bank nodal officers verified?",
      a: "Law enforcement officers and bank nodal investigators authenticate via their official credentials, police badge ID, department station code, and a secure 2FA token before being granted access to the tactical command suite."
    },
    {
      q: "Is Golden Hour admissible in Indian Courts?",
      a: "Yes. Every transaction telemetry packet, spatial forecast, and beat officer action is cryptographically sealed into a tamper-evident SHA-256 Merkle Hash Chain, fully compliant with Section 65B of the Indian Evidence Act."
    },
    {
      q: "Is there any fee or paywall to use the platform?",
      a: "No. The platform is free to use for citizen victims tracking their reported cases and for law enforcement agencies coordinating fraud interception."
    }
  ];

  const handleCitizenQuickStart = () => {
    openAuthModal('SIGNUP', 'CITIZEN');
  };

  const handleOfficialQuickStart = () => {
    openAuthModal('LOGIN', 'OFFICIAL');
  };

  const handleExploreLiveDemo = () => {
    selectCase('CASE-2026-041');
    setShowLandingPage(false);
    setActiveTab('workflow');
  };

  return (
    <div className="min-h-screen bg-[#0E1015] text-slate-100 font-sans selection:bg-[#D4FF00] selection:text-[#111317]">
      
      {/* 1. Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0E1015]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4FF00] text-[#111317] flex items-center justify-center font-black shadow-[0_0_20px_rgba(212,255,0,0.35)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Golden Hour</span>
                <span className="text-[10px] bg-[#D4FF00]/15 text-[#D4FF00] px-2 py-0.5 rounded-full font-mono font-bold border border-[#D4FF00]/30">
                  NATIONAL CYBER DEFENSE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C) Compliant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => openAuthModal('LOGIN', 'CITIZEN')}
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors cursor-pointer hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={handleCitizenQuickStart}
              className="px-4 py-2 rounded-full border border-[#D4FF00]/40 text-[#D4FF00] hover:bg-[#D4FF00]/10 text-xs font-bold transition-all cursor-pointer"
            >
              Citizen Portal
            </button>
            <button
              onClick={handleOfficialQuickStart}
              className="px-4 sm:px-5 py-2 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black transition-all hover:bg-lime-400 hover:scale-105 cursor-pointer shadow-lg shadow-[#D4FF00]/20"
            >
              Official Access
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: High-Converting Headline & Dual CTA */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4FF00]/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-rose-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D4FF00] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Real-Time Cyber Fraud Recovery System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Intercept Stolen Cyber Funds <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4FF00] via-lime-300 to-emerald-400">
              Within The Golden Hour.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            When cyber fraud strikes, funds hop across 15+ mule banking switches in minutes. 
            Golden Hour correlates multi-hop velocity, predicts the cash-out ATM using spatial AI, and dispatches police beat patrols to secure 100% of your funds before withdrawal.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
            <button
              onClick={handleCitizenQuickStart}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D4FF00] text-[#111317] text-sm font-black flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,255,0,0.35)] hover:bg-lime-400 hover:scale-105 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Track Stolen Funds & View FIR</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleOfficialQuickStart}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4FF00]" />
              <span>Law Enforcement Portal</span>
            </button>

            <button
              onClick={handleExploreLiveDemo}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-transparent hover:bg-white/5 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Explore Live Pune Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free for Citizen Victims
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D4FF00]" /> Zero PII Data Masking
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" /> Section 65B Evidence Certified
            </span>
          </div>
        </div>
      </section>

      {/* 3. Live Metrics Ticker Bar */}
      <section className="border-y border-white/10 bg-[#12141A] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-[#D4FF00] font-mono">₹4.50 Cr+</div>
            <div className="text-xs text-slate-400 font-medium">Funds Intercepted Prior to Cash-Out</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white font-mono">&lt; 15 Mins</div>
            <div className="text-xs text-slate-400 font-medium">Average Mule Chain Lead Time</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">94.2%</div>
            <div className="text-xs text-slate-400 font-medium">Spatial Hotspot Prediction Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-sky-400 font-mono">15 Hops</div>
            <div className="text-xs text-slate-400 font-medium">Multi-Bank Trace Traversal Depth</div>
          </div>
        </div>
      </section>

      {/* 4. Core Features & What We Do */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase font-mono font-extrabold text-[#D4FF00] tracking-wider">
            Autonomous Cyber Defense Capabilities
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Golden Hour Outsmarts Cyber Syndicates
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Standard cyber helplines take 24–48 hours. Golden Hour automates banking switch tracing and tactical patrol deployment in under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#14171F] border border-white/10 space-y-4 hover:border-[#D4FF00]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#D4FF00]/10 text-[#D4FF00] flex items-center justify-center font-black">
              <GitBranch className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">15-Hop Multi-Bank Trace</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly correlates IMPS, NEFT, and UPI switch logs across ICICI, HDFC, SBI, Axis, Kotak, and 10+ regional banks to expose rapid mule money fan-outs.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#D4FF00]">
              <span>Real-Time Velocity Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#14171F] border border-white/10 space-y-4 hover:border-[#D4FF00]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-black">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Continuous Thermal Radar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spatial AI Kernel Density Estimation (KDE) maps candidate ATM withdrawal clusters and pinpoints the highest-probability kiosks with 94% precision.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-rose-400">
              <span>Top 15 Candidate ATMs Ranked</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#14171F] border border-white/10 space-y-4 hover:border-[#D4FF00]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black">
              <Send className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Section 91 CrPC Freezing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              1-click statutory hold orders dispatched directly to bank nodal desks and GPS intercept coordinates routed to the nearest PCR Beat Patrol unit.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span>Instant Legal Action Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dual Role Portals (Citizen vs Official) */}
      <section className="py-16 px-4 sm:px-8 bg-[#111317] border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs uppercase font-mono font-extrabold text-[#D4FF00] tracking-wider">
              Tailored User Portals
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Choose Your Platform Experience
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Whether you are a citizen tracking your reported incident or an authorized officer solving cases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Citizen Portal Box */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#181B24] border border-white/10 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#D4FF00] text-[#111317]">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 text-slate-300 px-3 py-1 rounded-full font-bold">
                    PUBLIC / CITIZEN
                  </span>
                </div>

                <h4 className="text-2xl font-black text-white">Citizen & Victim Portal</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up with email to monitor the recovery progress of your defrauded funds in real time without confusing jargon.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>View & Download Official Digital FIR (Section 154 CrPC)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Print Court Evidence Dossier with Official Seals</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Track Money Movement Across 15 Banking Hops</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct Contact with Assigned Cyber Beat Officer</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCitizenQuickStart}
                  className="w-full py-3.5 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black hover:bg-lime-400 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Law Enforcement Portal Box */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#181B24] border border-[#D4FF00]/30 space-y-6 flex flex-col justify-between hover:border-[#D4FF00]/50 transition-all shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#D4FF00]/10 rounded-full blur-2xl" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#111317] text-[#D4FF00] border border-[#D4FF00]/40">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono bg-[#D4FF00]/20 text-[#D4FF00] px-3 py-1 rounded-full font-bold border border-[#D4FF00]/30">
                    LAW ENFORCEMENT & BANKS
                  </span>
                </div>

                <h4 className="text-2xl font-black text-white">Officer Tactical Command Suite</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verified access for Police Cyber Cells, I4C Analysts, and Bank Nodal Officers to execute fast-track fund recovery operations.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0" />
                    <span>Real-Time 15-Hop Banking Switch Telemetry & Velocity</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0" />
                    <span>Dynamic Thermal KDE Radar with Top 15 ATM Pins</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0" />
                    <span>1-Click Police Beat Interception & Section 91 CrPC Hold</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF00] shrink-0" />
                    <span>Cryptographic Merkle Hash Chain Audit Ledger</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 relative z-10">
                <button
                  onClick={handleOfficialQuickStart}
                  className="w-full py-3.5 rounded-full bg-white text-slate-950 text-xs font-black hover:bg-slate-200 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#111317]" />
                  <span>Verify Credentials & Sign In</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs uppercase font-mono font-extrabold text-[#D4FF00] tracking-wider">
            Clear Answers
          </h2>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-[#14171F] border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5"
                >
                  <span className="text-sm font-extrabold text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#D4FF00] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-white/10 bg-[#0A0C0F] py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D4FF00] text-[#111317] flex items-center justify-center font-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <b className="text-white font-mono">Golden Hour Cyber Defense</b>
              <p className="text-[11px] text-slate-400">National Cybercrime Reporting Portal • 1930 Incident Response</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <button onClick={handleCitizenQuickStart} className="hover:text-white cursor-pointer">Citizen Tracking</button>
            <button onClick={handleOfficialQuickStart} className="hover:text-white cursor-pointer">Officer Login</button>
            <button onClick={handleExploreLiveDemo} className="hover:text-white cursor-pointer">Demo Case 041</button>
          </div>

          <div className="text-[11px] text-slate-500">
            © 2026 Golden Hour. Certified under Section 65B Indian Evidence Act.
          </div>
        </div>
      </footer>

    </div>
  );
};
