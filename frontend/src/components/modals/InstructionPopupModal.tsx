import React from 'react';
import { X, BookOpen, CheckCircle2, Shield, AlertTriangle, ArrowRight, Clock, FileText } from 'lucide-react';

export interface SOPInstruction {
  id: string;
  title: string;
  category: string;
  stageNum: number;
  duration: string;
  summary: string;
  steps: Array<{ title: string; desc: string }>;
  legalBasis?: string;
  proTips: string[];
}

interface Props {
  instruction: SOPInstruction | null;
  onClose: () => void;
}

export const InstructionPopupModal: React.FC<Props> = ({ instruction, onClose }) => {
  if (!instruction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2 py-0.5 rounded-full font-bold">
                  SOP #{instruction.stageNum}
                </span>
                <span className="text-xs font-bold text-slate-500">{instruction.category}</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">{instruction.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <b className="text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Standard Execution Time: {instruction.duration}
            </b>
            <p className="text-slate-600 leading-relaxed">{instruction.summary}</p>
          </div>

          {/* Sequential Step-by-Step Instructions */}
          <div className="space-y-3">
            <b className="text-sm font-black text-slate-900 block">Operational Step-by-Step Guidance</b>
            <div className="space-y-2.5">
              {instruction.steps.map((s, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-[#111317] text-[#D4FF00] flex items-center justify-center font-mono font-black text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <b className="text-slate-900 text-xs block">{s.title}</b>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Authority Basis */}
          {instruction.legalBasis && (
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Statutory Authority & Compliance</span>
              </div>
              <p className="text-blue-800 text-[11px] leading-relaxed font-medium">{instruction.legalBasis}</p>
            </div>
          )}

          {/* Pro Investigator Tips */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
            <b className="text-amber-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Duty Officer Field Advice
            </b>
            <ul className="space-y-1.5 text-amber-900 text-[11px]">
              {instruction.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-black">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">I4C STANDARD OPERATING PROCEDURE (v1.0)</span>
          <button
            onClick={onClose}
            className="neu-btn neu-btn-dark px-6 py-2 text-xs font-bold cursor-pointer"
          >
            Acknowledge
          </button>
        </div>

      </div>
    </div>
  );
};
