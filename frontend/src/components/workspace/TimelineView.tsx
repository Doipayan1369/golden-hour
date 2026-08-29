import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimelineView: React.FC = () => {
  const { selectedCase } = useApp();

  if (!selectedCase || !selectedCase.timeline_summary) return null;

  return (
    <div className="neu-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-700" />
          Chronological Audit & Incident Trail
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 uppercase">Real-Time Ingestion</span>
      </div>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {selectedCase.timeline_summary.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-[#111317] mt-1.5 shrink-0"></span>
            <div className="text-slate-700 font-medium leading-relaxed font-mono">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
