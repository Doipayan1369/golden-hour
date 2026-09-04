import React, { useState } from 'react';
import { 
  Shield, ArrowRight, ArrowLeft, CheckCircle2, 
  Flame, Send, GitBranch, Sparkles, X, Clock, HelpCircle, 
  AlertTriangle, Radio, MapPin, User, Building2, Smartphone, 
  Check, Lock, ChevronRight, Activity, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartCase?: (caseId: string) => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose, onStartCase }) => {
  const [slide, setSlide] = useState<number>(1);
  const { selectCase, setActiveTab } = useApp();

  if (!isOpen) return null;

  const totalSlides = 4;

  const handleFinish = () => {
    localStorage.setItem('golden_hour_onboarded', 'true');
    if (onStartCase) {
      onStartCase('CASE-2026-041');
    } else {
      selectCase('CASE-2026-041');
      setActiveTab('workflow');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Officer Quick Start Guide</h2>
              <p className="text-xs text-slate-500 font-medium">Stage {slide} of {totalSlides} • How Golden Hour operates in the field</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body (Rich Visual Spatial UI) */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* SLIDE 1: Visual Timeline & Race Against the Clock */}
          {slide === 1 && (
            <div className="space-y-6 animate-slideUp">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111317] text-[#D4FF00] text-xs font-extrabold shadow-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>The 60-Minute Window</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">1930 RAPID INTERCEPTION</span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  Catching ATM Cash-Out Mules in Real Time
                </h3>
                <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">
                  Cyber fraudsters rapidly siphon funds through mule accounts and rush to withdraw physical cash at ATMs within 60 minutes.
                </p>
              </div>

              {/* Visual Infographic Timeline */}
              <div className="p-5 rounded-2xl bg-[#111317] text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2">
                  <span>LIVE TRANSACTION SCRUBBER</span>
                  <span className="text-[#D4FF00] font-bold animate-pulse">● 14 MINS ELAPSED</span>
                </div>

                {/* 4-Step Visual Micro Pipeline */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center text-xs font-black">1</div>
                    <span className="text-[10px] text-slate-300 font-bold block">1930 Call</span>
                    <span className="text-[9px] text-slate-500 font-mono">00:00 IST</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-xs font-black">2</div>
                    <span className="text-[10px] text-slate-300 font-bold block">Mule Layer 2</span>
                    <span className="text-[9px] text-slate-500 font-mono">00:14 IST</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-[#111317] mx-auto flex items-center justify-center text-xs font-black">3</div>
                    <span className="text-[10px] text-amber-300 font-bold block">ATM Target</span>
                    <span className="text-[9px] text-amber-400 font-mono">00:27 IST</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 space-y-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-[#111317] mx-auto flex items-center justify-center text-xs font-black">4</div>
                    <span className="text-[10px] text-emerald-300 font-bold block">Fund Freeze</span>
                    <span className="text-[9px] text-emerald-400 font-mono">&lt; 00:30 IST</span>
                  </div>
                </div>

                {/* Comparison Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
                    <span className="text-base font-black">❌</span>
                    <div>
                      <b className="block text-rose-200">Standard Police FIR</b>
                      <span className="text-[10px] text-rose-400">48-72 Hours (Too Late)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                    <span className="text-base font-black">⚡</span>
                    <div>
                      <b className="block text-emerald-200">Golden Hour Platform</b>
                      <span className="text-[10px] text-emerald-400">&lt; 15 Mins Interception</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Visual 3-Stage Mission Cards */}
          {slide === 2 && (
            <div className="space-y-5 animate-slideUp">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Your 3 Simple Investigative Steps
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Designed specifically for quick decision-making under time pressure</p>
              </div>

              {/* 3 Visual Interactive Mini-Cards */}
              <div className="space-y-3">
                {/* Step 1 Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4 hover:bg-slate-100/80 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shrink-0 shadow-sm font-black text-base">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <b className="text-sm text-slate-900 font-bold">1930 Incident Triage</b>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">CRITICAL SLA</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Select incoming complaints with high victim loss & active transfer speed.
                    </p>
                  </div>
                </div>

                {/* Step 2 Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4 hover:bg-slate-100/80 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shrink-0 shadow-sm font-black text-base">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <b className="text-sm text-slate-900 font-bold">Thermal Cash-Out Radar</b>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">AI HEATMAP</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Pinpoint the exact Pune ATM corridor (FC Road / Goodluck Chowk).
                    </p>
                  </div>
                </div>

                {/* Step 3 Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4 hover:bg-slate-100/80 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center shrink-0 shadow-sm font-black text-base">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <b className="text-sm text-slate-900 font-bold">1-Click Dispatch & Hold</b>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">MULTI-AGENCY</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Transmit GPS packet to Beat Patrol 3 and issue digital bank account hold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Visual Mule Network Architecture for Case 041 */}
          {slide === 3 && (
            <div className="space-y-5 animate-slideUp">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Preloaded Live Case: CASE-2026-041
                  </h3>
                  <p className="text-xs text-slate-500">Real-world simulated incident in Pune City</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  READY
                </span>
              </div>

              {/* Visual Multi-Hop Graph Architecture */}
              <div className="p-5 rounded-2xl bg-[#111317] text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2.5">
                  <span className="text-slate-400 font-mono">VICTIM LOSS:</span>
                  <span className="text-[#D4FF00] font-mono font-black text-base">₹4,50,000 INR</span>
                </div>

                {/* Node Flow Diagram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">👤</div>
                      <div>
                        <b className="text-white block text-[11px]">Victim: Ramesh Patil</b>
                        <span className="text-[9px] text-slate-400 font-mono">State Bank of India</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono font-bold">₹4,50,000 →</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">🏦</div>
                      <div>
                        <b className="text-white block text-[11px]">Mule Layer 1: Suresh K.</b>
                        <span className="text-[9px] text-slate-400 font-mono">ICICI Bank Deccan</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono font-bold">₹4,50,000 →</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-[#111317] flex items-center justify-center font-bold">🏧</div>
                      <div>
                        <b className="text-amber-300 block text-[11px]">Target Cashout ATM: Goodluck Chowk</b>
                        <span className="text-[9px] text-amber-200/80 font-mono">FC Road, Deccan Gymkhana</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-amber-500 text-[#111317] px-2 py-0.5 rounded font-black">TARGET LOCK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Visual Officer Command & Launch */}
          {slide === 4 && (
            <div className="space-y-6 animate-slideUp text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-[#111317] text-[#D4FF00] flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Officer Mission Authorization
                </h3>
                <p className="text-xs text-slate-500 mt-1">Everything is configured and primed for immediate field investigation</p>
              </div>

              {/* Visual Mission Checklist Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 max-w-md mx-auto">
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</div>
                  <span>Case CASE-2026-041 Pre-loaded in Triage</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</div>
                  <span>14 Pune City ATMs Mapped with Continuous Heatmap</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">✓</div>
                  <span>Deccan Cyber Beat Unit 3 Standing By for Dispatch</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleFinish}
                  className="neu-btn neu-btn-lime w-full sm:w-auto px-8 py-3.5 text-xs font-black shadow-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Case 041</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('golden_hour_onboarded', 'true');
                    setActiveTab('help');
                    onClose();
                  }}
                  className="neu-btn neu-btn-outline w-full sm:w-auto px-5 py-3.5 text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>FAQs</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  slide === i ? 'w-8 bg-[#111317]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {slide > 1 && (
              <button
                onClick={() => setSlide((prev) => prev - 1)}
                className="neu-btn neu-btn-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {slide < totalSlides ? (
              <button
                onClick={() => setSlide((prev) => prev + 1)}
                className="neu-btn neu-btn-dark px-6 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4FF00]" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="neu-btn neu-btn-lime px-6 py-2 text-xs font-black shadow-md cursor-pointer"
              >
                <span>Start</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
