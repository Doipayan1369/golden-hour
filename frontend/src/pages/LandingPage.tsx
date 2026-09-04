import React, { useState } from 'react';
import { 
  Shield, ShieldCheck, Flame, GitBranch, Send, RotateCcw, 
  FileText, ArrowRight, CheckCircle2, Lock, Users, Building2, 
  MapPin, Clock, ChevronDown, ChevronUp, Sparkles, ExternalLink,
  ShieldAlert, Activity, Award, HelpCircle, PhoneCall, Printer,
  Radio, Compass, Layers, Zap, Landmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GhostFibers from '../components/common/GhostFibers';
import { EmergencyHelpModal } from '../components/modals/EmergencyHelpModal';

export const LandingPage: React.FC = () => {
  const { openAuthModal, selectCase, setShowLandingPage, setActiveTab } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isEmergencyHelpOpen, setIsEmergencyHelpOpen] = useState(false);

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
      a: "No. The platform is completely free to use for citizen victims tracking their reported cases and for law enforcement agencies coordinating fraud interception."
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

  // Marquee Live Incident Items
  const incidentTicker = [
    "🟢 [NCRP 1930 INGESTION: CASE-2026-041 PUNE ₹4,50,000 SECURED AT FC ROAD ATM]",
    "⚡ [15-HOP MULE CHAIN TRACE COMPLETED IN 4.2 MINS ACROSS 7 BANKS]",
    "🛡️ [SECTION 91 CrPC STATUTORY HOLD DISPATCHED TO SBI & AXIS SWITCHES]",
    "📍 [KDE THERMAL RADAR LOCKED: SBI GOODLUCK CHOWK ATM • 94% CONFIDENCE]",
    "🚓 [DECCAN CYBER BEAT PATROL 3 INTERCEPTED CASHOUT ON-SCENE]",
    "📜 [SECTION 65B COURT EVIDENCE DOSSIER SEALED ON SHA-256 LEDGER]",
    "🔒 [ZERO CITIZEN LOSS CONFIRMED • 100% RECOVERY ACHIEVED]"
  ];

  // Marquee Banking & Defense Network Items
  const networkItems = [
    "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Punjab National Bank", "Kotak Mahindra Bank", "Bank of Maharashtra", 
    "NPCI UPI Switch", "IMPS Immediate Payment", "National Cybercrime Reporting Portal (1930)", 
    "Indian Cyber Crime Coordination Centre (I4C)", "Maharashtra Police Cyber Cell",
    "Section 65B Indian Evidence Act Certified", "RBI Cyber Security Framework"
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-100 font-sans selection:bg-[#D4FF00] selection:text-[#111317] relative overflow-x-hidden">
      
      {/* 1. React Bits <GhostFibers /> Dynamic WebGL Background with Consumer-Friendly SaaS Gradient */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-35">
        <GhostFibers
          lineColor="#0c3a03"
          glowColor="#088022"
          speed={0.2}
          scale={2}
          rotation={0}
          rotationSpeed={0.25}
          layers={4}
          waveAmplitude={0.015}
          waveFrequency={3}
          waveSpeed={0.15}
          layerSpeed={0.08}
          twist={0.1}
          twistFrequency={5}
          twistSpeed={1.2}
          lineFrequency={5}
          lineSpacing={2}
          lineSharpness={16}
          glowFalloff={10}
          glowIntensity={1.6}
          brightness={2}
          blueBoost={1.25}
          vignette={0.8}
          grain={0.05}
          dpr={1}
        />
      </div>

      {/* Consumer SaaS Radial Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(212,255,0,0.12)_0%,rgba(14,16,21,0.75)_50%,#0A0C10_100%)]" />

      {/* 2. Top Live Real-Time Incident Marquee Ticker */}
      <div className="relative z-30 bg-[#111317]/95 border-b border-white/10 overflow-hidden py-2 px-4 shadow-sm backdrop-blur-md">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-mono text-slate-300">
          {incidentTicker.concat(incidentTicker).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="text-[#D4FF00] font-black">•</span>
              <span className="hover:text-white transition-colors">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Sticky Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#08090C]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4FF00] text-[#0A0C10] flex items-center justify-center font-black shadow-[0_0_20px_rgba(212,255,0,0.35)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">Golden Hour</span>
                <span className="text-[10px] bg-[#D4FF00]/15 text-[#D4FF00] px-2.5 py-0.5 rounded-full font-mono font-bold border border-[#D4FF00]/30">
                  DEFENSE PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Ministry of Home Affairs • Indian Cyber Crime Coordination Centre (I4C)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsEmergencyHelpOpen(true)}
              className="neu-btn-red text-xs px-3.5 sm:px-4 py-2 flex items-center gap-1.5 shadow-md animate-pulse"
              title="Emergency 1930 Cyber Fraud Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930</span>
            </button>

            <button
              onClick={() => openAuthModal('LOGIN', 'CITIZEN')}
              className="neu-btn text-xs text-slate-300 hover:text-white px-3 py-2 transition-colors hidden md:inline-flex"
            >
              Sign In
            </button>
            <button
              onClick={handleCitizenQuickStart}
              className="neu-btn-outline text-xs px-3.5 sm:px-4 py-2"
            >
              Citizen Portal
            </button>
            <button
              onClick={handleOfficialQuickStart}
              className="neu-btn-lime text-xs px-3.5 sm:px-5 py-2 font-black"
            >
              Official Login
            </button>
          </div>
        </div>
      </header>

      {/* 4. Hero Section: 2-Column Layout (Header on Left, Live Incident Feed on Right) */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Hero Typography, Header & Tactile CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D4FF00] backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
              <span>Autonomous Real-Time Cybercrime Interception</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Intercept Stolen Cyber Funds <br className="hidden sm:block" />
              <span className="text-[#D4FF00]">
                Within The Golden Hour.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              When cyber fraud occurs, funds hop across 15+ mule banking switches in minutes. 
              Golden Hour tracks multi-hop velocity, predicts the cash-out ATM using spatial AI, and coordinates police beat patrols to secure 100% of your funds before withdrawal.
            </p>

            {/* Primary Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleCitizenQuickStart}
                className="neu-btn-lime px-7 py-3.5 text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,255,0,0.35)]"
              >
                <FileText className="w-4 h-4" />
                <span>Track Funds</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleOfficialQuickStart}
                className="neu-btn-dark px-6 py-3.5 text-xs font-bold flex items-center justify-center gap-2 border border-white/20"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4FF00]" />
                <span>Official Login</span>
              </button>

              <button
                onClick={handleExploreLiveDemo}
                className="neu-btn-white px-6 py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <span>Launch Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>

            {/* Trust Guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free for Citizens
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D4FF00]" /> Zero PII Masking
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-white" /> Section 65B Certified
              </span>
            </div>
          </div>

          {/* Right Column: LIVE INCIDENT INTERCEPTION FEED: CASE-2026-041 (PUNE) */}
          <div className="lg:col-span-6 perspective-1000">
            <div className="neu-glass-panel rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl border border-white/15 text-left transform-gpu hover:scale-[1.01] transition-transform duration-500 relative">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </div>
                  <div>
                    <b className="text-xs sm:text-sm font-black font-mono text-white tracking-wide block">
                      LIVE INCIDENT INTERCEPTION FEED
                    </b>
                    <span className="text-[11px] text-[#D4FF00] font-mono font-bold">
                      CASE-2026-041 (PUNE CITY)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
                    ✓ 100% SECURED
                  </span>
                  <span className="text-slate-400 text-[11px]">10:14 IST</span>
                </div>
              </div>

              {/* Loss vs Recovery Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Victim Loss Debited</span>
                  <b className="text-rose-400 text-base font-black">₹4,50,000</b>
                  <span className="text-[10px] text-slate-500 block">SBI Camp Branch</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-400 text-[10px] uppercase font-bold block">Secured Prior to Cashout</span>
                  <b className="text-emerald-400 text-base font-black">₹4,50,000 (100%)</b>
                  <span className="text-[10px] text-emerald-300/80 block">FC Road Goodluck Kiosk</span>
                </div>
              </div>

              {/* 3 Telemetry Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>15-Hop Trace</span>
                    <GitBranch className="w-3.5 h-3.5 text-[#D4FF00]" />
                  </div>
                  <b className="text-white text-xs block font-bold">16 Nodes • 7 Banks</b>
                  <p className="text-slate-400 text-[10px]">SBI &rarr; ICICI &rarr; HDFC &rarr; Axis</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>Thermal Radar</span>
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <b className="text-rose-400 text-xs block font-bold">FC Road (94%)</b>
                  <p className="text-slate-400 text-[10px]">Goodluck Chowk ATM</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold">
                    <span>Section 91 Hold</span>
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <b className="text-emerald-400 text-xs block font-bold">PCR Beat 3 Lock</b>
                  <p className="text-slate-400 text-[10px]">Instant statutory hold</p>
                </div>
              </div>

              {/* Live Status Bar */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
                  <span>Lead Time: <b className="text-white">15 Mins Advance Interception</b></span>
                </div>
                <button
                  onClick={handleExploreLiveDemo}
                  className="text-[#D4FF00] hover:text-lime-300 font-bold underline cursor-pointer text-[11px]"
                >
                  View Case 041 &rarr;
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. Live Metrics Ticker Bar */}
      <section className="relative z-10 border-y border-white/10 bg-[#0E1118]/90 backdrop-blur-md py-8 px-4 sm:px-8">
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
            <div className="text-2xl sm:text-4xl font-black text-[#D4FF00] font-mono">15 Hops</div>
            <div className="text-xs text-slate-400 font-medium">Multi-Bank Trace Traversal Depth</div>
          </div>
        </div>
      </section>

      {/* 7. Core Features & What We Do (3D Neumorphic Cards) */}
      <section className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-16">
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
          <div className="p-8 rounded-3xl neu-glass-panel neu-3d-card space-y-4 border border-white/10">
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
          <div className="p-8 rounded-3xl neu-glass-panel neu-3d-card space-y-4 border border-white/10">
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
          <div className="p-8 rounded-3xl neu-glass-panel neu-3d-card space-y-4 border border-white/10">
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

      {/* 8. Second Marquee: Integrated Banking & Police Network */}
      <section className="relative z-10 bg-[#0B0D13] border-y border-white/10 py-4 overflow-hidden shadow-inner">
        <div className="animate-marquee-reverse whitespace-nowrap flex items-center gap-8 text-xs font-mono text-slate-400">
          {networkItems.concat(networkItems).map((bank, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="text-[#D4FF00] font-black">✦</span>
              <span className="hover:text-white transition-colors">{bank}</span>
            </span>
          ))}
        </div>
      </section>

      {/* 9. Dual Role Portals (Citizen vs Official) */}
      <section className="relative z-10 py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
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
          <div className="p-8 sm:p-10 rounded-3xl neu-glass-panel neu-3d-card space-y-6 flex flex-col justify-between shadow-2xl border border-white/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#D4FF00] text-[#0A0C10] font-black">
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
                className="neu-btn-lime w-full py-3.5 text-xs font-black flex items-center justify-center gap-2"
              >
                <span>Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Law Enforcement Portal Box */}
          <div className="p-8 sm:p-10 rounded-3xl neu-glass-panel neu-3d-card border border-[#D4FF00]/30 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#0E1118] text-[#D4FF00] border border-[#D4FF00]/40 shadow-md">
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
                className="neu-btn-white w-full py-3.5 text-xs font-black flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#0A0C10]" />
                <span>Official Login</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 10. Frequently Asked Questions */}
      <section className="relative z-10 py-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-12">
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
                className="rounded-2xl neu-glass-panel overflow-hidden transition-all border border-white/10"
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

      {/* 11. Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#07090D] py-12 px-4 sm:px-8 text-xs text-slate-500">
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

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <button onClick={handleCitizenQuickStart} className="neu-btn-outline px-3 py-1.5 text-xs">Citizen Portal</button>
            <button onClick={handleOfficialQuickStart} className="neu-btn-outline px-3 py-1.5 text-xs">Official Login</button>
            <button onClick={handleExploreLiveDemo} className="neu-btn-lime px-3 py-1.5 text-xs text-[#0A0C10]">Demo Case 041</button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            © 2026 Golden Hour • Certified under Section 65B Indian Evidence Act
          </div>
        </div>
      </footer>

      {/* Emergency 1930 Helpline Modal */}
      <EmergencyHelpModal
        isOpen={isEmergencyHelpOpen}
        onClose={() => setIsEmergencyHelpOpen(false)}
      />

    </div>
  );
};
