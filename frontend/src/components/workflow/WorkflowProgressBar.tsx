import React from 'react';
import { 
  CheckCircle2, ArrowRight, ArrowLeft, Clock, 
  ShieldAlert, GitBranch, Flame, Send, PlayCircle, FileCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface WorkflowStep {
  id: number;
  key: string;
  label: string;
  subtitle: string;
  icon: React.ElementType;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 1, key: 'intake', label: '01. Intake & Triage', subtitle: '1930 NCRP Complaint Ingestion', icon: ShieldAlert },
  { id: 2, key: 'trace', label: '02. Multi-Hop Trace', subtitle: 'Mule Account Flow Analysis', icon: GitBranch },
  { id: 3, key: 'radar', label: '03. Thermal Radar', subtitle: 'AI Cash-Out Hotspot Forecast', icon: Flame },
  { id: 4, key: 'dispatch', label: '04. Tactical Dispatch', subtitle: 'Beat Alert & DSP Authorization', icon: Send },
  { id: 5, key: 'intercept', label: '05. Live Interception', subtitle: '5-Min Replay & ATM Outcome', icon: PlayCircle },
  { id: 6, key: 'audit', label: '06. Legal Audit', subtitle: 'SHA-256 Chain & Court Export', icon: FileCheck },
];

interface Props {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const WorkflowProgressBar: React.FC<Props> = ({ currentStep, onStepChange }) => {
  const { selectedCaseId } = useApp();

  return (
    <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-lg space-y-4 mb-6">
      {/* Top Header Row: Case Pill, Clock & Quick Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#111317] text-[#D4FF00] rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse"></span>
            ACTIVE INVESTIGATION: {selectedCaseId || 'CASE-2026-041'}
          </div>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            Pune City Cyber Crime Division (Deccan Beat)
          </span>
        </div>

        {/* Global Golden Hour SLA Timer & Step Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>GOLDEN HOUR CLOCK: 14:18 REMAINING</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStepChange(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="p-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Previous Step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStepChange(Math.min(WORKFLOW_STEPS.length, currentStep + 1))}
              disabled={currentStep === WORKFLOW_STEPS.length}
              className="px-4 py-1.5 rounded-full bg-[#111317] text-[#D4FF00] hover:bg-slate-800 disabled:opacity-40 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Next Step"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sequential Steps Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {WORKFLOW_STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                isActive
                  ? 'bg-[#111317] text-white border-[#111317] shadow-md ring-2 ring-[#D4FF00]/40 scale-[1.02]'
                  : isCompleted
                  ? 'bg-emerald-50/70 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100/70'
                  : 'bg-[#F8FAFC] text-slate-600 border-slate-200/70 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-xl ${
                  isActive 
                    ? 'bg-[#D4FF00] text-[#111317]' 
                    : isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isActive && (
                  <span className="text-[10px] bg-[#D4FF00] text-[#111317] font-black px-1.5 py-0.5 rounded-md uppercase">
                    LIVE
                  </span>
                )}
              </div>
              <div>
                <p className={`text-xs font-extrabold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {step.label}
                </p>
                <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
