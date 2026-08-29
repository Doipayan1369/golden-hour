import React, { useState } from 'react';
import { 
  Shield, ArrowRight, ArrowLeft, CheckCircle2, 
  Flame, Send, GitBranch, Sparkles, X, Clock, HelpCircle, AlertTriangle 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center font-bold shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Officer Quick Start Guide</h2>
              <p className="text-xs text-slate-500">Step {slide} of {totalSlides}: How Golden Hour works in 60 seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content (Spacious & Clean Spatial UI) */}
        <div className="p-8 md:p-10 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Slide 1: The Core Mission */}
          {slide === 1 && (
            <div className="space-y-6 animate-slideUp">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111317] text-[#D4FF00] text-xs font-extrabold">
                <Clock className="w-3.5 h-3.5" />
                <span>The 60-Minute Interception Window</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-snug">
                Welcome to Golden Hour. Catch fraudsters before they cash out.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When a citizen calls <b>1930</b> to report a cyber scam, fraudsters rapidly move money through 2 to 4 mule bank accounts before withdrawing physical cash at an ATM.
              </p>
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>The Real-World Problem</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Traditional police FIRs take days. By then, the cash is gone. <b>Golden Hour</b> uses automated banking tracing + AI spatial prediction to pinpoint the exact ATM corridor in <b>minutes</b>.
                </p>
              </div>
            </div>
          )}

          {/* Slide 2: The 3 Simple Steps */}
          {slide === 2 && (
            <div className="space-y-6 animate-slideUp">
              <h3 className="text-2xl font-extrabold text-slate-900">
                Your 3 Core Actions as an Officer
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                    1
                  </div>
                  <div>
                    <b className="text-sm text-slate-900 block">Spot High-Priority Incident</b>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Open incoming 1930 alerts with fresh transactions (&lt;60 mins old) and critical victim losses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#D4FF00] flex items-center justify-center text-xs font-black shrink-0">
                    2
                  </div>
                  <div>
                    <b className="text-sm text-slate-900 block">Check Thermal Cash-Out Radar</b>
                    <p className="text-xs text-slate-500 mt-0.5">
                      See the AI-predicted ATM hotspot in Pune (e.g. FC Road / Deccan Gymkhana) where the mule will pull cash.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                    3
                  </div>
                  <div>
                    <b className="text-sm text-slate-900 block">1-Click Dispatch & Freeze</b>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Send instant GPS alert to local Cyber Beat Patrol + emergency hold request to the nodal bank.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 3: Live Pune Simulation Case */}
          {slide === 3 && (
            <div className="space-y-6 animate-slideUp">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Preloaded Demonstration Case</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Ready-to-Investigate: Case CASE-2026-041
              </h3>
              <div className="p-6 rounded-2xl bg-[#111317] text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="text-slate-400">Victim Loss:</span>
                  <span className="text-[#D4FF00] font-mono font-extrabold text-base">₹4,50,000 INR</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="text-slate-400">Modus Operandi:</span>
                  <span className="text-white font-medium">Digital Arrest / Fake CBI Threat</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
                  <span className="text-slate-400">Mule Path:</span>
                  <span className="text-slate-200">Victim → Layer 1 → Layer 2 → Terminal ATM</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Target Cashout Hotspot:</span>
                  <span className="text-[#D4FF00] font-bold">FC Road Goodluck Chowk, Pune</span>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Start Investigation */}
          {slide === 4 && (
            <div className="space-y-6 animate-slideUp text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-[#111317] text-[#D4FF00] flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  You are ready to begin.
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We'll guide you through the 6 simple stages step-by-step. You can reopen this guide anytime from the top bar.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleFinish}
                  className="w-full sm:w-auto pill-btn-lime px-8 py-3.5 text-sm font-extrabold shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Guided Investigation (Case 041)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  slide === i ? 'w-8 bg-[#111317]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {slide > 1 && (
              <button
                onClick={() => setSlide((prev) => prev - 1)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {slide < totalSlides ? (
              <button
                onClick={() => setSlide((prev) => prev + 1)}
                className="pill-btn-dark px-6 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4FF00]" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="pill-btn-lime px-6 py-2 text-xs font-extrabold shadow-md"
              >
                <span>Start Now</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
