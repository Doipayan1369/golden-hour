import { MOCK_NODES_041, MOCK_EDGES_041 } from '../../services/mockData';
import React from 'react';
import { Clock, ArrowRight, CheckCircle2, ShieldAlert, GitBranch, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TimelineView: React.FC = () => {
  const { graphEdges: rawEdges, graphNodes: rawNodes, selectedCase } = useApp();
  const graphNodes = rawNodes && rawNodes.length > 0 ? rawNodes : MOCK_NODES_041;
  const graphEdges = rawEdges && rawEdges.length > 0 ? rawEdges : MOCK_EDGES_041;

  return (
    <div className="neu-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#111317] text-[#D4FF00]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
              15-Hop Chronological Transfer Log
            </h3>
            <p className="text-[11px] text-slate-500">Every micro-transaction with exact day, time & Pune locality</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold font-mono">
          {graphEdges.length} HOPS
        </span>
      </div>

      {/* 15 Sequential Hop Rows */}
      <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
        {graphEdges.map((edge, idx) => {
          const src = graphNodes.find(n => n.node_id === edge.source_node);
          const tgt = graphNodes.find(n => n.node_id === edge.target_node);
          const isTerminal = edge.hop_order === graphEdges.length || idx === graphEdges.length - 1;

          // Parse or format time
          const timeDisplay = edge.occurred_at.includes('T')
            ? `Sat 29 Aug 2026 • ${edge.occurred_at.split('T')[1].slice(0, 8)} IST`
            : edge.occurred_at;

          return (
            <div 
              key={edge.edge_id || idx}
              className={`p-3.5 rounded-2xl border transition-all ${
                isTerminal
                  ? 'bg-rose-50/80 border-rose-300 shadow-sm'
                  : 'bg-[#F8FAFC] border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                  isTerminal ? 'bg-rose-600 text-white' : 'bg-[#111317] text-[#D4FF00]'
                }`}>
                  HOP #{edge.hop_order || idx + 1}
                </span>
                <span className="text-slate-500 font-bold">{timeDisplay}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mt-1">
                <span className="truncate max-w-[130px] sm:max-w-[170px]">{edge.source_institution}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-1" />
                <span className={`truncate max-w-[130px] sm:max-w-[170px] ${isTerminal ? 'text-rose-700' : ''}`}>
                  {edge.destination_institution}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-200/60">
                <span className="font-extrabold text-slate-900">₹{edge.amount_inr.toLocaleString('en-IN')} INR</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  +{edge.velocity_minutes_from_prior || 1.5}m velocity
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
