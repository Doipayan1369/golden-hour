import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Radar, ShieldCheck, ArrowRight, CheckCircle2, 
  Clock, MapPin, Zap, Lock, Landmark, AlertTriangle, ShieldAlert,
  Radio, Terminal, Sparkles, ChevronRight, Check
} from 'lucide-react';

interface HowItWorks8Props {
  onExploreDemo?: () => void;
  onCitizenClick?: () => void;
}

export const HowItWorks8: React.FC<HowItWorks8Props> = ({
  onExploreDemo,
  onCitizenClick
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-advance through the 3 steps smoothly if not hovered
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const steps = [
    {
      id: '01',
      timeWindow: 'MINUTES 00 – 10',
      badge: 'LAYER 1: TELEMETRY INGESTION',
      badgeColor: 'text-[#D4FF00] bg-[#D4FF00]/10 border-[#D4FF00]/30',
      title: '1930 Ingestion & 15-Hop Multi-Bank Trace',
      description: 'NCRP 1930 incident telemetry extracts the victim\'s transaction UTR, automatically recurses through 15 layers of mule accounts across banking switches, and maps money flow velocity before cash can be dispersed.',
      metric: '4.2 Mins Avg Trace Speed',
      icon: GitBranch,
      vignetteType: 'graph'
    },
    {
      id: '02',
      timeWindow: 'MINUTES 10 – 25',
      badge: 'LAYER 2: SPATIAL AI RADAR',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: 'KDE Spatial AI Radar & ATM Prediction',
      description: 'Continuous Kernel Density Estimation (KDE) and withdrawal velocity modeling track fraudster movement patterns, identifying the top 15 candidate ATM kiosks with 94.2% spatial accuracy.',
      metric: '94.2% Hotspot Accuracy',
      icon: Radar,
      vignetteType: 'radar'
    },
    {
      id: '03',
      timeWindow: 'MINUTES 25 – 45',
      badge: 'LAYER 3: TACTICAL INTERCEPTION',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: 'Section 91 CrPC Freeze & On-Scene Intercept',
      description: 'Automated statutory Section 91 CrPC hold notices lock target cards at the switch level while live GPS coordinates route the nearest Police Beat Patrol unit directly to the ATM kiosk.',
      metric: '₹4.50 Cr+ Secured Live',
      icon: ShieldCheck,
      vignetteType: 'interception'
    }
  ];

  return (
    <section 
      className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#D4FF00]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161B22] border border-[#D4FF00]/30 text-xs font-mono text-[#D4FF00] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span className="font-extrabold uppercase tracking-wider">How It Works • React Bits Pro</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Three Autonomous Steps. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4FF00] via-lime-300 to-emerald-400">
            Zero Seconds Wasted in the Golden Hour.
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          From the instant a 1930 complaint is filed to switch-level card freezes and PCR patrol interception, Golden Hour coordinates banks and police seamlessly.
        </p>
      </div>

      {/* Drawing Connector Line (Desktop SVG) */}
      <div className="hidden lg:block relative mb-8 px-12">
        <div className="relative h-12 flex items-center justify-between max-w-5xl mx-auto">
          
          {/* Animated Connecting Line SVG */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hiw-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4FF00" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Base Background Track */}
            <line 
              x1="5%" 
              y1="50%" 
              x2="95%" 
              y2="50%" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="2" 
              strokeDasharray="4 4"
            />

            {/* Active Flowing Path */}
            <line 
              x1="5%" 
              y1="50%" 
              x2="95%" 
              y2="50%" 
              stroke="url(#hiw-line-gradient)" 
              strokeWidth="3" 
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />

            {/* Moving Laser Beam Dot */}
            <circle 
              r="4" 
              fill="#D4FF00" 
              filter="url(#glow)"
              className="animate-ping"
              cx={activeStep === 0 ? "15%" : activeStep === 1 ? "50%" : "85%"}
              cy="50%"
            />
          </svg>

          {/* Step Trigger Indicators on Desktop */}
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative z-10 flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#181C26] border-[#D4FF00] shadow-[0_0_20px_rgba(212,255,0,0.25)] scale-105'
                    : 'bg-[#10131A]/90 border-white/10 hover:border-white/25 hover:bg-[#141822]'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-black transition-colors ${
                  isActive ? 'bg-[#D4FF00] text-[#111317]' : 'bg-white/10 text-slate-400'
                }`}>
                  {step.id}
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-400">{step.timeWindow}</div>
                  <div className={`text-xs font-extrabold transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {step.badge.replace(/LAYER \d: /, '')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Horizontal Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                isActive
                  ? 'bg-[#131720]/95 border-2 border-[#D4FF00]/80 shadow-[0_15px_40px_-10px_rgba(212,255,0,0.2)] neu-3d-card'
                  : 'bg-[#10131A]/80 border border-white/10 hover:border-white/20 hover:bg-[#131620]'
              }`}
            >
              {/* Subtle top indicator glow for active card */}
              {isActive && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#D4FF00]/25 blur-xl pointer-events-none" />
              )}

              {/* Step Header */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xl font-black text-slate-500 group-hover:text-slate-400 transition-colors">
                      {step.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${step.badgeColor}`}>
                      {step.timeWindow}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl transition-all ${
                    isActive ? 'bg-[#D4FF00] text-[#111317] shadow-md' : 'bg-white/5 text-slate-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#D4FF00] transition-colors leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Step UI-Primitive Vignette */}
              <div className="my-6 relative z-10">
                {step.vignetteType === 'graph' && (
                  <div className="rounded-2xl bg-[#090C10] border border-white/10 p-4 space-y-3 font-mono text-[11px] shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/5 pb-2">
                      <span className="flex items-center gap-1.5 text-[#D4FF00] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-ping" />
                        LIVE UTR: 2026041998X
                      </span>
                      <span className="text-slate-400">15 HOPS MAP</span>
                    </div>

                    {/* Simulated Node Chain Flow */}
                    <div className="flex items-center justify-between gap-1 py-1">
                      <div className="px-2 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] text-center">
                        Victim
                        <div className="text-[8px] text-slate-400 font-normal">₹4,50,000</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-[10px] text-center">
                        SBI L1
                        <div className="text-[8px] text-slate-400 font-normal">₹2.8L</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4FF00] shrink-0" />
                      <div className="px-2 py-1.5 rounded-lg bg-[#D4FF00]/15 border border-[#D4FF00]/40 text-[#D4FF00] font-bold text-[10px] text-center">
                        ICICI L4
                        <div className="text-[8px] text-slate-400 font-normal">Mule Hub</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <div className="px-2 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] text-center">
                        Axis Kiosk
                        <div className="text-[8px] text-slate-400 font-normal">Target ATM</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] bg-white/5 px-2.5 py-1.5 rounded-lg text-slate-300">
                      <span>Velocity Index:</span>
                      <span className="text-[#D4FF00] font-bold">1.8 Hops / Min (High Urgency)</span>
                    </div>
                  </div>
                )}

                {step.vignetteType === 'radar' && (
                  <div className="rounded-2xl bg-[#090C10] border border-white/10 p-4 space-y-3 font-mono text-[11px] shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/5 pb-2">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        KDE SPATIAL SWEEP
                      </span>
                      <span className="text-slate-400">18.5167° N, 73.8415° E</span>
                    </div>

                    {/* Radar Graphic Vignette */}
                    <div className="relative h-20 bg-[#06090D] rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
                      {/* Concentric Radar Rings */}
                      <div className="absolute w-16 h-16 rounded-full border border-amber-500/20"></div>
                      <div className="absolute w-28 h-28 rounded-full border border-amber-500/15"></div>
                      <div className="absolute w-40 h-40 rounded-full border border-amber-500/10"></div>
                      
                      {/* Sweeping Radar Needle */}
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400 animate-spin origin-center"></div>

                      {/* Hotspot Target Pin */}
                      <div className="absolute top-4 right-8 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/30 border border-rose-500/60 text-rose-300 text-[9px] font-bold shadow-lg animate-pulse">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>SBI ATM FC Road (94.2%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] bg-white/5 px-2.5 py-1.5 rounded-lg text-slate-300">
                      <span>Assigned Police Unit:</span>
                      <span className="text-amber-400 font-bold">PCR Beat 3 (ETA: 3.5 Mins)</span>
                    </div>
                  </div>
                )}

                {step.vignetteType === 'interception' && (
                  <div className="rounded-2xl bg-[#090C10] border border-white/10 p-4 space-y-3 font-mono text-[11px] shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-white/5 pb-2">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        STATUTORY HOLD ACTIVE
                      </span>
                      <span className="text-slate-400">SEC 91 CrPC</span>
                    </div>

                    {/* Legal Certificate / Terminal Stamp */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 font-bold">Switch Card Freeze:</span>
                        <span className="text-emerald-400 font-black">LOCKED (100%)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-300 font-bold">Sec 65B Audit Hash:</span>
                        <span className="text-slate-400 font-mono text-[9px]">e7d9...4a12</span>
                      </div>
                      <div className="text-[9px] text-emerald-300/80 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        Patrol on scene. Fraudster cash extraction prevented.
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] bg-white/5 px-2.5 py-1.5 rounded-lg text-slate-300">
                      <span>Total Recovered:</span>
                      <span className="text-emerald-400 font-black font-mono">₹4,50,000.00 (Full Amount)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer with Metric */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-1.5 text-slate-300 font-mono font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>{step.metric}</span>
                </div>

                <div className={`flex items-center gap-1 font-bold text-[11px] transition-colors ${
                  isActive ? 'text-[#D4FF00]' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  <span>Step Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Interactive CTA Strip */}
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121620] via-[#161B26] to-[#121620] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h4 className="text-base sm:text-lg font-black text-white">
              Witness the Golden Hour Interception Pipeline in Real-Time
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore active benchmark case <span className="font-mono text-[#D4FF00] font-bold">CASE-2026-041</span> with live 15-hop telemetry and KDE radar maps.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 rounded-full bg-[#D4FF00] text-[#111317] font-black text-xs hover:bg-lime-400 hover:scale-105 transition-all cursor-pointer shadow-lg shadow-[#D4FF00]/20 flex items-center gap-2"
          >
            <span>Launch Live Interception Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
};

export default HowItWorks8;
