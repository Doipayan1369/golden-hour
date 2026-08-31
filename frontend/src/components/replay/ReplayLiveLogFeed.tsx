import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, CheckCircle2, Activity, Play, ArrowRight, Zap, Copy } from 'lucide-react';

interface ReplayLogStep {
  stepIndex: number;
  time: string;
  category: string;
  color: string;
  badge: string;
  title: string;
  message: string;
  sha256: string;
  payload: Record<string, any>;
}

const REPLAY_LOG_EVENTS: ReplayLogStep[] = [
  {
    stepIndex: 1,
    time: "09:42:00.180 IST",
    category: "1930 INTAKE",
    color: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    title: "1930 NCRP COMPLAINT INGESTED",
    message: "Victim Ramesh Patil reported unauthorized debit of ₹4,50,000 INR. Fraud Modus: Digital Arrest / Extortion.",
    sha256: "8e92f1b0a8274d1e21b79c3f4e829a10bc931d87",
    payload: { source: "NCRP_1930", utr: "UPI202608299821", amount: 450000, branch: "SBI Pune Camp" }
  },
  {
    stepIndex: 2,
    time: "09:45:10.420 IST",
    category: "MULE TRACE",
    color: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "PRIMARY MULE LAYER 1 -> LAYER 2 FAN-OUT",
    message: "ICICI Mule 1 forwarded ₹4.5L into 2 rapid splits: HDFC FC Road (₹2.2L) and Axis JM Road (₹2.3L) in <3 mins.",
    sha256: "4c1187d90e6631b5fa890e1c2d3345f89a9101bb",
    payload: { hops: [1, 2, 3], velocity_mins: 2.9, pass_through: "100%", nodes: ["acct_mule_01", "acct_mule_02", "acct_mule_03"] }
  },
  {
    stepIndex: 3,
    time: "10:03:40.890 IST",
    category: "MICRO-LAYERING",
    color: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    title: "HOPS 4-14 MULTI-BANK DISPERSION COMPLETE",
    message: "Funds layered across 11 sub-mule accounts across Deccan, Ghole Road, Karve Road & Shivaji Nagar.",
    sha256: "91b8a3e74c5021fa9c8120e3d489b02a71f09231",
    payload: { total_discovered_hops: 14, active_banks: ["Kotak", "Canara", "BoM", "PNB", "IndusInd", "Union", "Yes", "Federal", "IDFC", "AU", "RBL"] }
  },
  {
    stepIndex: 4,
    time: "10:10:00.310 IST",
    category: "SPATIAL KDE",
    color: "text-[#D4FF00]",
    badge: "bg-[#D4FF00]/20 text-[#D4FF00] border-[#D4FF00]/30",
    title: "CONTINUOUS THERMAL RADAR HOTSPOT LOCK",
    message: "AI Kernel Density Estimation pinpoints FC Road & Goodluck Chowk Epicenter (94% Probability Match).",
    sha256: "3f901a89b01c4e782a91b2c3d4e5f60718293a4b",
    payload: { predicted_corridor: "FC Road Goodluck Chowk", top_atm: "ATM-PUN-204 (SBI)", confidence: 0.94, window: "10:20 - 10:35 IST" }
  },
  {
    stepIndex: 5,
    time: "10:14:00.670 IST",
    category: "TACTICAL DISPATCH",
    color: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    title: "BEAT UNIT 3 DISPATCH & SECTION 91 CRPC HOLD",
    message: "Action Packet signed by Duty Officer. GPS coordinates sent to Deccan Patrol 3 (PCR-PUN-03). Bank hold served.",
    sha256: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    payload: { beat_unit: "PCR-PUN-03", lead_time_mins: 13, legal_mandate: "Section 91 CrPC", bank_hold_token: "acct_cashout_terminal" }
  },
  {
    stepIndex: 6,
    time: "10:27:00.000 IST",
    category: "INTERCEPTION",
    color: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    title: "PHYSICAL ATM CASHOUT INTERCEPTED & FUNDS SECURED",
    message: "Mule operative attempted ₹50,000 withdrawal at SBI ATM-PUN-204. Intercepted by Beat Patrol 3. 100% loss recovered.",
    sha256: "0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    payload: { outcome: "SUCCESSFUL_INTERCEPTION", atm_id: "ATM-PUN-204", amount_saved_inr: 450000, arrest_ref: "DECCAN_CR_2026_982" }
  }
];

interface Props {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const ReplayLiveLogFeed: React.FC<Props> = ({ currentStep, onSelectStep }) => {
  const activeLogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeLogRef.current) {
      activeLogRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStep]);

  return (
    <div className="bg-[#0B0D11] border border-slate-800 rounded-3xl p-5 md:p-6 text-white space-y-4 shadow-2xl font-mono">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#111317] border border-slate-700 flex items-center justify-center text-[#D4FF00] shadow-inner">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-slate-200 uppercase">
                Live Replay Telemetry Stream
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Cryptographic SHA-256 Audit Log Feed • Synchronized to Scrubber Step
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-slate-400">
            STEP {currentStep + 1} OF 6 ACTIVE
          </span>
          <span className="bg-[#D4FF00]/10 border border-[#D4FF00]/30 px-2.5 py-1 rounded-full text-[#D4FF00] font-bold">
            100% REPRODUCIBLE
          </span>
        </div>
      </div>

      {/* Moving Step Log Stream */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {REPLAY_LOG_EVENTS.map((log) => {
          const isCurrent = log.stepIndex === currentStep + 1;
          const isPassed = log.stepIndex <= currentStep + 1;

          return (
            <div
              key={log.stepIndex}
              ref={isCurrent ? activeLogRef : null}
              onClick={() => onSelectStep(log.stepIndex - 1)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs ${
                isCurrent
                  ? 'bg-slate-900/90 border-[#D4FF00] ring-2 ring-[#D4FF00]/30 shadow-lg'
                  : isPassed
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-40 hover:opacity-70'
              }`}
            >
              {/* Step Title & Timestamp Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold ${log.badge}`}>
                    {log.category}
                  </span>
                  <b className={`font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                    {log.title}
                  </b>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{log.time}</span>
                  {isCurrent && (
                    <span className="bg-[#D4FF00] text-[#111317] px-2 py-0.5 rounded-full font-black text-[9px]">
                      ▶ EXECUTING
                    </span>
                  )}
                </div>
              </div>

              {/* Message Payload */}
              <p className={`text-[11px] leading-relaxed mb-2.5 ${isCurrent ? 'text-slate-200' : 'text-slate-400'}`}>
                {log.message}
              </p>

              {/* Cryptographic Hash & Payload Details */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                <span className="truncate max-w-[280px]">
                  HASH: <code className="text-slate-400">{log.sha256.slice(0, 16)}...{log.sha256.slice(-8)}</code>
                </span>
                <span className="text-slate-400">
                  {JSON.stringify(log.payload).slice(0, 45)}...
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
