import { ReplayLiveLogFeed } from './ReplayLiveLogFeed';
import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, 
  Clock, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';

export const ReplayController: React.FC = () => {
  const { replayState, advanceReplay, selectedCaseId, setActiveTab } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = replayState?.current_step ?? 3;
  const totalSteps = replayState?.total_steps ?? 6;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStep < totalSteps - 1) {
          advanceReplay(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, totalSteps, advanceReplay]);

  const handleStep = (step: number) => {
    setIsPlaying(false);
    advanceReplay(step);
  };

  const handleReset = () => {
    setIsPlaying(false);
    advanceReplay(0);
  };

  return (
    <div className="neu-card p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#D4FF00] text-[#111317]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                5-Minute Golden Hour Incident Replay Simulator
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Deterministic chronological benchmark for case <span className="font-bold text-slate-800 font-mono">{selectedCaseId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            Prev Hop
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all shadow-md cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 text-white'
                : 'pill-btn-lime'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
          </button>

          <button
            onClick={() => handleStep(Math.min(totalSteps - 1, currentStep + 1))}
            disabled={currentStep >= totalSteps - 1}
            className="px-4 py-2.5 bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            Next Hop
          </button>

          <button
            onClick={handleReset}
            title="Reset to 10:02"
            className="p-2.5 bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-full cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Progression Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>PROGRESS: STEP {currentStep + 1} OF {totalSteps}</span>
          <span className="text-slate-900 font-extrabold font-mono">INCIDENT TIME: {replayState?.step_time || '10:12:00'} IST</span>
        </div>

        {/* Step Track */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['10:02 Intake', '10:04 Hop 1', '10:09 Hop 2', '10:12 Forecast', '10:15 Approved', '10:27 Cash-Out'].map((title, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <button
                key={idx}
                onClick={() => handleStep(idx)}
                className={`p-3.5 rounded-2xl text-left text-xs transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-[#111317] text-white border-[#111317] shadow-lg'
                    : isCompleted
                    ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-[#F8FAFC] border-slate-200/60 text-slate-400'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>STEP {idx + 1}</span>
                  {isCompleted && (
                    <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#D4FF00]' : 'text-emerald-600'}`} />
                  )}
                </div>
                <div className="truncate mt-1.5 font-medium">{title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Log View with Moving Steps */}
      <ReplayLiveLogFeed 
        currentStep={currentStep} 
        onSelectStep={(step) => handleStep(step)} 
      />

      {/* Current Step Focus Box */}
      <div className="bg-[#F8FAFC] border border-slate-200/90 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 bg-[#111317] text-[#D4FF00] font-black text-xs rounded-full">
              {replayState?.step_title}
            </span>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {replayState?.step_time} IST
            </span>
          </div>
          <TacticalBadge label={replayState?.status || 'ENRICHING'} variant="dark" />
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          {replayState?.step_description}
        </p>

        {/* Finale Match Comparison Banner if Step 5 */}
        {currentStep === 5 && replayState?.withdrawal_revealed && (
          <div className="neu-lime p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-[#111317] font-black text-base">
              <CheckCircle2 className="w-6 h-6 text-[#111317]" />
              <span>GROUND-TRUTH MATCH CONFIRMED: 15-MINUTE ADVANCE LEAD TIME</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="bg-white/85 p-4 rounded-2xl border border-[#111317]/10 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase font-extrabold">PREDICTED AT 10:12 IST:</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">Sector 14 Transit & Commercial Corridor</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">82% Confidence • 1800m Radius</div>
              </div>
              <div className="bg-white/85 p-4 rounded-2xl border border-[#111317]/10 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase font-extrabold">OBSERVED AT 10:27 IST:</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{replayState.withdrawal_revealed.atm_name}</div>
                <div className="text-xs text-slate-600 mt-1 font-mono">ATM-204 • ₹40,000 Withdrawn (Inside Zone #1)</div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveTab('map')}
                className="px-6 py-2.5 pill-btn-dark text-xs font-black cursor-pointer shadow-lg"
              >
                View Observed ATM on Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
