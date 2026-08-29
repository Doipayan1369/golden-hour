import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowProgressBar, WORKFLOW_STEPS } from '../../components/workflow/WorkflowProgressBar';
import { LiveTelemetryBar } from '../../components/dashboard/LiveTelemetryBar';
import { UrgentQueueTable } from '../../components/dashboard/UrgentQueueTable';
import { CaseHeader } from '../../components/workspace/CaseHeader';
import { TransactionGraph } from '../../components/workspace/TransactionGraph';
import { TimelineView } from '../../components/workspace/TimelineView';
import { ForecastCard } from '../../components/workspace/ForecastCard';
import { TacticalMap } from '../../components/map/TacticalMap';
import { HashChainViewer } from '../../components/audit/HashChainViewer';
import { InterventionsPage } from '../InterventionsPage';
import { ReplayPage } from '../ReplayPage';
import { ReportsPage } from '../ReportsPage';
import { 
  ArrowRight, ArrowLeft, ShieldAlert, GitBranch, Flame, 
  Send, PlayCircle, FileCheck, CheckCircle2, AlertTriangle, Sparkles 
} from 'lucide-react';

export const StepWorkflowContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { selectedCaseId, selectCase } = useApp();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(WORKFLOW_STEPS.length, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Global Step Progression Navigation Bar */}
      <WorkflowProgressBar 
        currentStep={currentStep} 
        onStepChange={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* 2. Step 1 View: Intake & Triage */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 1: Incident Intake & Triage Matrix</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a live 1930 cyber fraud complaint or verify UTR anchor to initiate the Golden Hour workflow
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                selectCase('CASE-2026-041');
                handleNext();
              }}
              className="pill-btn-dark flex items-center gap-2 text-xs font-bold"
            >
              <span>Investigate Case CASE-2026-041</span>
              <ArrowRight className="w-4 h-4 text-[#D4FF00]" />
            </button>
          </div>

          <LiveTelemetryBar />
          <UrgentQueueTable onSelectCase={(cid: string) => {
            selectCase(cid);
            handleNext();
          }} />

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg"
            >
              <span>Proceed to Step 2: Multi-Hop Mule Trace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Step 2 View: Multi-Hop Mule Trace */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <GitBranch className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 2: Multi-Hop Mule Flow & Network Graph</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify banking switches, account pass-through velocities, and terminal cash-out ATM card node
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs text-slate-700 bg-white">
                ← Back to Intake
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 text-xs font-bold">
                <span>Analyze Spatial Cash-Out Risk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <CaseHeader />
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              <TransactionGraph />
            </div>
            <div className="xl:col-span-4 space-y-8">
              <TimelineView />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Intake & Triage</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg">
              <span>Proceed to Step 3: Geospatial Thermal Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Step 3 View: Geospatial Thermal Radar */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 3: Geospatial Thermal Radar & Factor Attribution</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI-predicted cash-out corridor in Pune with explainable ATM density and velocity vectors
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs text-slate-700 bg-white">
                ← Back to Mule Trace
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 text-xs font-bold">
                <span>Compose Tactical Response</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              <TacticalMap />
            </div>
            <div className="xl:col-span-4 space-y-8">
              <ForecastCard />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Multi-Hop Trace</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg">
              <span>Proceed to Step 4: Dispatch Tactical Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Step 4 View: Tactical Action & Dispatch */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 4: Tactical Action Dispatch & DSP Authorization</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Route real-time alerts to Deccan Cyber Beat Unit 3 and place emergency card hold at Bank D
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs text-slate-700 bg-white">
                ← Back to Thermal Radar
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 text-xs font-bold">
                <span>Launch Live Interception</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <InterventionsPage />

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Thermal Radar</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg">
              <span>Proceed to Step 5: Live Interception Replay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Step 5 View: Live Interception & Replay */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 5: Live Interception & 5-Minute Incident Simulator</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological incident scrubber verifying 15-minute advance warning lead time at SBI ATM FC Road
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs text-slate-700 bg-white">
                ← Back to Dispatch
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 text-xs font-bold">
                <span>Finalize Legal Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ReplayPage />

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Tactical Dispatch</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg">
              <span>Proceed to Step 6: Evidentiary Audit & Export</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Step 6 View: Legal Audit & Case Export */}
      {currentStep === 6 && (
        <div className="space-y-8 animate-slideUp">
          <div className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#111317] text-[#D4FF00] rounded-2xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Stage 6: Legal Audit Trail & Court-Admissible Export</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify cryptographic SHA-256 non-repudiation ledger and download court-ready evidence package
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs text-slate-700 bg-white">
                ← Back to Replay
              </button>
              <button 
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="pill-btn-dark flex items-center gap-2 text-xs font-bold"
              >
                <span>Complete Investigation ↺</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <HashChainViewer />
            <ReportsPage />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Live Interception</span>
            </button>
            <button 
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="pill-btn-lime flex items-center gap-2 px-8 py-3 text-sm font-extrabold shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Investigation Finalized - Start Next Case</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
