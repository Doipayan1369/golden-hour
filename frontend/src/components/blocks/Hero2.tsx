import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, ArrowRight, Sparkles, MapPin, CheckCircle2, 
  Clock, GitBranch, Lock, ShieldCheck, Activity, 
  Radio, PhoneCall, Scale, Landmark, ChevronRight, Zap
} from 'lucide-react';

interface Hero2Props {
  onCitizenClick?: () => void;
  onOfficialClick?: () => void;
  onDemoClick?: () => void;
  onEmergencyClick?: () => void;
}

export const Hero2: React.FC<Hero2Props> = ({
  onCitizenClick,
  onOfficialClick,
  onDemoClick,
  onEmergencyClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move handler for cursor spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 px-3 sm:px-6 lg:px-8 max-w-[1440px] mx-auto z-10 transition-colors duration-300"
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 hidden sm:block"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 255, 0, 0.12), transparent 80%)`,
        }}
      />

      {/* Main Curved Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 relative z-10">
        
        {/* Bento Card 1: Main High-Conversion Hero Core (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 rounded-[2rem] sm:rounded-[2.75rem] bg-[#12151D]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 md:p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all duration-300">
          
          {/* Subtle Ambient Card Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#D4FF00]/10 blur-3xl pointer-events-none group-hover:bg-[#D4FF00]/15 transition-all"></div>
          
          <div className="space-y-6 relative z-10">
            
            {/* Top Eyebrow Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#D4FF00] shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span className="font-bold">I4C & MHA COMPLIANT CYBER DEFENSE</span>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LIVE 1930 DISPATCH READY</span>
              </span>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Intercept Stolen Funds <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4FF00] via-lime-300 to-emerald-400">
                  Within The Golden Hour.
                </span>
              </h1>
              <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal pt-1">
                When cyber fraud strikes, money hops through 15+ mule banking switches in minutes. 
                Golden Hour maps multi-bank telemetry, forecasts the cash-out ATM using spatial AI, and dispatches police beat patrols to secure 100% of your assets before withdrawal.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-xl">
              <button
                onClick={onCitizenClick}
                className="px-7 py-4 rounded-full bg-[#D4FF00] text-[#111317] text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 shadow-[0_0_28px_rgba(212,255,0,0.35)] hover:bg-lime-400 hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>Track Stolen Case & FIR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOfficialClick}
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-black border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-white/30"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4FF00]" />
                <span>Police / Bank Officer Portal</span>
              </button>
              <button
                onClick={onDemoClick}
                className="px-5 py-4 rounded-full text-slate-400 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Demo Case 041</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Bottom Live Protection Assurance */}
          <div className="pt-8 mt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono relative z-10 text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Interception Speed</span>
              <b className="text-white text-sm">32 Minutes</b>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Mule Chain Depth</span>
              <b className="text-[#D4FF00] text-sm">15 Inter-Bank Hops</b>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Legal Authority</span>
              <b className="text-white text-sm">Sec 91 / 102 CrPC</b>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-bold">Court Compliance</span>
              <b className="text-emerald-400 text-sm">Sec 65B Certified</b>
            </div>
          </div>

        </div>

        {/* Bento Card 2: AI Predicted Cash-Out Radar (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-[2rem] sm:rounded-[2.75rem] bg-[#12151D]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all duration-300">
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4FF00]">
                <Radio className="w-4 h-4 animate-pulse" />
                <span>SPATIAL RADAR PREDICTION</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                94.2% AI PROBABILITY
              </span>
            </div>

            {/* Radar Animation Box */}
            <div className="h-44 sm:h-48 rounded-2xl bg-[#090C11] border border-white/10 relative flex items-center justify-center overflow-hidden">
              {/* Radar Rings */}
              <div className="absolute w-36 h-36 rounded-full border border-[#D4FF00]/20 animate-ping opacity-30"></div>
              <div className="absolute w-28 h-28 rounded-full border border-emerald-500/25"></div>
              <div className="absolute w-16 h-16 rounded-full border border-[#D4FF00]/40"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>

              {/* Pin Center */}
              <div className="relative z-10 text-center space-y-1">
                <div className="p-3 rounded-full bg-rose-600/30 border border-rose-500 text-[#D4FF00] inline-block shadow-lg animate-bounce">
                  <MapPin className="w-5 h-5 text-[#D4FF00]" />
                </div>
                <b className="block text-xs font-mono text-white">SBI ATM FC Road</b>
                <span className="text-[10px] font-mono text-emerald-400 block">PCR Beat Unit 3 En Route (120m)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target ATM Kiosk:</span>
                <b className="text-white">Goodluck Chowk, Pune</b>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Interception Lead Time:</span>
                <b className="text-emerald-400 font-bold">14 Mins Before Cashout</b>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Terminal Mule Node 15</span>
            <span className="text-[#D4FF00] font-bold">LOCKED & SECURED</span>
          </div>

        </div>

        {/* Bento Card 3: 15-Hop Multi-Bank Graph Pipeline (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-[2rem] sm:rounded-[2.75rem] bg-[#12151D]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all duration-300">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
              <GitBranch className="w-4 h-4 text-[#D4FF00]" />
              <span>15-HOP MULE CHAIN TELEMETRY</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Autonomous switch mapping across 7 banking networks in 4.2 minutes.
            </p>

            {/* Mini Multi-Hop Step Pipeline */}
            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-rose-400 font-bold">Layer 1: Victim Account</span>
                <span className="text-slate-300">SBI &rarr; ICICI</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-amber-400 font-bold">Layer 2-4: 14 Mule Hops</span>
                <span className="text-slate-300">HDFC • Axis • PNB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">Layer 5: ATM Terminal</span>
                <span className="text-[#D4FF00] font-bold">✓ 100% Frozen</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Hops Mapped:</span>
            <b className="text-white font-mono">15 of 15 Verified</b>
          </div>
        </div>

        {/* Bento Card 4: Financial Recovery & Section 91 CrPC Hold (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-[2rem] sm:rounded-[2.75rem] bg-[#12151D]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all duration-300">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>STATUTORY RECOVERY METRICS</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono font-bold block">Defrauded vs Secured</span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                ₹4,50,000.00
              </div>
              <span className="text-[11px] font-mono text-slate-300 font-bold block">
                100.00% Defrauded Amount Frozen in Banks
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-relaxed font-sans">
              Statutory Section 91 & 102 Cr.P.C. orders automatically dispatched to bank switches to prevent cash dispersal.
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Citizen Financial Loss:</span>
            <b className="text-[#D4FF00]">₹0.00 (Zero Loss)</b>
          </div>
        </div>

        {/* Bento Card 5: Cryptographic 65B Court Dossier & 1930 Emergency (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 rounded-[2rem] sm:rounded-[2.75rem] bg-[#12151D]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-[#D4FF00]/40 transition-all duration-300">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <Scale className="w-4 h-4 text-[#D4FF00]" />
                <span>SEC 65B EVIDENCE DOSSIER</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-mono font-bold">
                SHA-256 SEALED
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Every audit packet, telemetric timestamp, and officer action is anchored on a tamper-evident Merkle hash chain admissible in High Courts.
            </p>

            <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/70 to-slate-900 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-rose-300">24x7 TOLL-FREE HELPLINE</span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500 text-white font-bold">DIAL 1930</span>
              </div>
              <button
                onClick={onEmergencyClick}
                className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Emergency 1930 Helpline Desk</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Jurisdiction Court:</span>
            <b className="text-white">JMFC Cyber Court Pune</b>
          </div>
        </div>

      </div>
    </section>
  );
};
