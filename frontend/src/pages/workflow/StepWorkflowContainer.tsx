import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, ShieldAlert, GitBranch, Flame, 
  Send, RotateCcw, FileText, CheckCircle2, ChevronRight,
  Sparkles, Radio, Eye, Clock, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UrgentQueueTable } from '../../components/dashboard/UrgentQueueTable';
import { LiveTelemetryBar } from '../../components/dashboard/LiveTelemetryBar';
import { CaseHeader } from '../../components/workspace/CaseHeader';
import { TransactionGraph } from '../../components/workspace/TransactionGraph';
import { TimelineView } from '../../components/workspace/TimelineView';
import { TacticalMap } from '../../components/map/TacticalMap';
import { ForecastCard } from '../../components/workspace/ForecastCard';
import { InterventionsPage } from '../InterventionsPage';
import { ReplayPage } from '../ReplayPage';
import { ReportsPage } from '../ReportsPage';

interface StepWorkflowContainerProps {
  initialStep?: number;
}

export const StepWorkflowContainer: React.FC<StepWorkflowContainerProps> = ({ initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const { selectedCaseId, selectedCase, selectCase } = useApp();

  const steps = [
    { num: 1, label: '01. Intake', title: 'Incident Intake & Triage', icon: ShieldAlert },
    { num: 2, label: '02. Mule Trace', title: '15-Hop Multi-Bank Trace', icon: GitBranch },
    { num: 3, label: '03. Thermal Radar', title: 'Cash-Out Radar & ATMs', icon: Flame },
    { num: 4, label: '04. Dispatch', title: 'Authorize Police Dispatch', icon: Send },
    { num: 5, label: '05. Live Replay', title: '5-Minute Replay Simulator', icon: RotateCcw },
    { num: 6, label: '06. Legal Audit', title: 'Certified Evidentiary PDF', icon: FileText },
  ];

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Global Tactical Workflow Progress Navigation */}
      <div className="neu-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-800">
              ACTIVE CASE: <span className="text-slate-900 font-black">{selectedCaseId || 'CASE-2026-041'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`p-2 rounded-full border text-xs font-bold transition-all ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200' : 'hover:bg-slate-100 text-slate-700 border-slate-200 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-black text-slate-700 px-1">
              Step {currentStep} of 6
            </span>
            <button
              onClick={handleNext}
              disabled={currentStep === 6}
              className={`p-2 rounded-full border text-xs font-bold transition-all ${
                currentStep === 6 ? 'opacity-40 cursor-not-allowed text-slate-400 border-slate-200' : 'bg-[#111317] text-[#D4FF00] border-[#111317] hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Step Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((s) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            const Icon = s.icon;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-3 px-3.5 rounded-2xl text-left transition-all border cursor-pointer flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-[#111317] text-white border-[#111317] shadow-md ring-2 ring-[#D4FF00]/40'
                    : isCompleted
                    ? 'bg-white border-emerald-300 text-slate-800 hover:bg-emerald-50/40 shadow-sm'
                    : 'bg-white/80 border-slate-200/80 text-slate-600 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrent 
                      ? 'bg-white/15 text-[#D4FF00]' 
                      : isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-black font-mono tracking-tight truncate ${
                    isCurrent ? 'text-white' : isCompleted ? 'text-slate-900' : 'text-slate-700'
                  }`}>
                    {s.label}
                  </span>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] inline-block animate-pulse" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Step 1: Intake & Triage */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="neu-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Review & Select Active Cyber Fraud Case
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Priority-ranked complaints ingested via 1930 National Helpline.
              </p>
            </div>
            <button
              onClick={() => {
                selectCase('CASE-2026-041');
                handleNext();
              }}
              className="neu-btn neu-btn-lime px-6 py-2.5 text-xs font-black flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer"
            >
              <span>Investigate Case 041</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <LiveTelemetryBar />
          <UrgentQueueTable onSelectCase={(cid: string) => {
            selectCase(cid);
            handleNext();
          }} />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="neu-btn neu-btn-lime flex items-center gap-2 px-7 py-3 text-xs font-black shadow-md cursor-pointer"
            >
              <span>Proceed to Mule Trace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Step 2: Multi-Hop Mule Trace */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <CaseHeader />

          <div className="space-y-6">
            <TransactionGraph />
            <TimelineView />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="neu-btn neu-btn-lime flex items-center gap-2 px-7 py-3 text-xs font-black shadow-md cursor-pointer">
              <span>Proceed to Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Step 3: Geospatial Thermal Radar & Forecast */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <TacticalMap />
          <ForecastCard />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="neu-btn neu-btn-lime flex items-center gap-2 px-7 py-3 text-xs font-black shadow-md cursor-pointer">
              <span>Proceed to Dispatch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Step 4: Tactical Action & Dispatch */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <InterventionsPage />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="neu-btn neu-btn-lime flex items-center gap-2 px-7 py-3 text-xs font-black shadow-md cursor-pointer">
              <span>Proceed to Replay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Step 5: Incident Replay Simulator */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-fadeIn">
          <ReplayPage />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button onClick={handleNext} className="neu-btn neu-btn-lime flex items-center gap-2 px-7 py-3 text-xs font-black shadow-md cursor-pointer">
              <span>Proceed to Legal PDF</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Step 6: Legal Evidence Dossier & Reports */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-fadeIn">
          <ReportsPage />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(1)}
              className="neu-btn neu-btn-dark px-6 py-2.5 text-xs font-black cursor-pointer shadow-md"
            >
              New Investigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
