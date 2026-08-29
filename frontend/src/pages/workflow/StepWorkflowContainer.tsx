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
  Send, PlayCircle, FileCheck, CheckCircle2, AlertTriangle, Sparkles, 
  Info, HelpCircle, MapPin, Check 
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
    <div className="space-y-10 animate-fadeIn">
      {/* 1. Global Step Progression Navigation Bar */}
      <WorkflowProgressBar 
        currentStep={currentStep} 
        onStepChange={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* 2. Step 1: Intake & Triage */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Stage 1 of 6 • Incident Triage</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Review & Select High-Priority 1930 Cyber Fraud
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cases are automatically ranked by <b>freshness</b> and <b>loss urgency</b>. Select preloaded case <b>CASE-2026-041</b> (₹4,50,000 fraud in Pune) or pick any complaint from the triage matrix below.
              </p>
            </div>
            <button
              onClick={() => {
                selectCase('CASE-2026-041');
                handleNext();
              }}
              className="pill-btn-dark px-8 py-4 text-xs font-extrabold flex items-center justify-center gap-3 shrink-0 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
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
              className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer"
            >
              <span>Proceed to Step 2: Multi-Hop Mule Trace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Step 2: Multi-Hop Mule Trace */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <GitBranch className="w-3.5 h-3.5 text-cyan-600" />
                <span>Stage 2 of 6 • Banking Switch Trace</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Trace Banking Switches & Mule Accounts
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                See exactly where the victim's money hopped across beneficiary accounts. Identify rapid pass-through velocity and find the terminal ATM card account.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                ← Back
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-6 py-3 text-xs font-extrabold shadow-md cursor-pointer">
                <span>View Cash-Out Radar</span>
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

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Intake & Triage</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer">
              <span>Proceed to Step 3: Geospatial Thermal Radar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Step 3: Geospatial Thermal Radar */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Stage 3 of 6 • Spatial Cash-Out Radar</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Locate Predicted ATM Cash-Out Hotspots in Pune
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The AI model correlates mule card issuance, transit speed, and 24x7 ATM density to pinpoint the exact withdrawal corridor (<b>FC Road Goodluck Chowk</b>).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                ← Back
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-6 py-3 text-xs font-extrabold shadow-md cursor-pointer">
                <span>Compose Action Order</span>
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

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Multi-Hop Trace</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer">
              <span>Proceed to Step 4: Dispatch Tactical Action</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Step 4: Tactical Action & Dispatch */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stage 4 of 6 • Tactical Interception Dispatch</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Authorize Police Alert & Bank Account Hold
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transmit real-time GPS dispatch packet to <b>Deccan Beat Patrol Unit 3</b> and place an immediate Section 91 CrPC hold request with the nodal bank.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                ← Back
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-6 py-3 text-xs font-extrabold shadow-md cursor-pointer">
                <span>Start Live Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <InterventionsPage />

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Thermal Radar</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer">
              <span>Proceed to Step 5: Live Interception Replay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Step 5: Live Interception & Replay */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Stage 5 of 6 • 5-Minute Incident Simulator</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Simulate Ground-Truth Withdrawal Interception
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Step through the chronological event timeline to confirm that police beat patrols arrived at the FC Road ATM <b>15 minutes before the mule attempted withdrawal</b>.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                ← Back
              </button>
              <button onClick={handleNext} className="pill-btn-lime flex items-center gap-2 px-6 py-3 text-xs font-extrabold shadow-md cursor-pointer">
                <span>View Legal Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ReplayPage />

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Tactical Dispatch</span>
            </button>
            <button onClick={handleNext} className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer">
              <span>Proceed to Step 6: Evidentiary Audit & Export</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Step 6: Legal Audit & Case Export */}
      {currentStep === 6 && (
        <div className="space-y-8 animate-slideUp">
          {/* Officer's Clear Mission Briefing Card */}
          <div className="bg-white border border-slate-200/90 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stage 6 of 6 • Court-Admissible Evidence</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Cryptographic SHA-256 Audit Trail & 1-Click Export
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Verify the tamper-evident hash ledger, submit officer feedback, and export certified PDF evidence for court prosecution.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
                ← Back
              </button>
              <button 
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="pill-btn-dark flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <span>Start New Case ↺</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <HashChainViewer />
            <ReportsPage />
          </div>

          <div className="flex justify-between pt-6 border-t border-slate-200">
            <button onClick={handlePrev} className="pill-btn border border-slate-200 text-xs font-bold text-slate-700 bg-white flex items-center gap-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Live Simulator</span>
            </button>
            <button 
              onClick={() => {
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="pill-btn-lime flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Investigation Complete • Start Next Case</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
