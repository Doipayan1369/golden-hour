import { MOCK_NODES_041, MOCK_EDGES_041 } from '../../services/mockData';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, ArrowRight, ArrowLeft, ShieldCheck, 
  CheckCircle2, CreditCard, Building2, Play, Pause, 
  RotateCcw, Clock, MapPin, AlertTriangle, Zap, Sliders, ChevronRight, Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';
import { MaskedToken } from '../common/MaskedToken';
import { NodeType, AccountNode, TransactionEdge } from '../../types';

export const TransactionGraph: React.FC = () => {
  const { graphNodes: rawNodes, graphEdges: rawEdges, selectedCase } = useApp();
  const graphNodes = rawNodes && rawNodes.length > 0 ? rawNodes : MOCK_NODES_041;
  const graphEdges = rawEdges && rawEdges.length > 0 ? rawEdges : MOCK_EDGES_041;
  
  // 15-Hop Live Trace Playback State
  const [currentHopIndex, setCurrentHopIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const playTimerRef = useRef<any>(null);

  const totalHops = Math.max(15, graphEdges.length);

  // Auto Playback Loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentHopIndex((prev) => {
          if (prev >= graphEdges.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, graphEdges.length]);

  const activeEdge = graphEdges[currentHopIndex - 1] || graphEdges[0];
  const sourceNode = graphNodes.find(n => n.node_id === activeEdge?.source_node);
  const targetNode = graphNodes.find(n => n.node_id === activeEdge?.target_node);

  // Visible nodes up to current hop
  const visibleEdgeIds = new Set(graphEdges.slice(0, currentHopIndex).map(e => e.edge_id));
  const visibleNodeIds = new Set<string>();
  graphEdges.slice(0, currentHopIndex).forEach(e => {
    visibleNodeIds.add(e.source_node);
    visibleNodeIds.add(e.target_node);
  });

  const getNodeBadge = (type: NodeType) => {
    switch (type) {
      case 'VICTIM': return { label: 'VICTIM ANCHOR', bg: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'MULE_LAYER_1': return { label: 'MULE LAYER 1', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'MULE_LAYER_2': return { label: 'MULE LAYER 2', bg: 'bg-orange-100 text-orange-900 border-orange-300' };
      case 'CASHOUT_DEST': return { label: 'TERMINAL CASHOUT', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      default: return { label: 'INTERMEDIARY', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  return (
    <div className="neu-card p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#111317] text-[#D4FF00] shadow-md">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                Live 15-Hop Mule Trace Playback
              </h3>
              <span className="text-[10px] bg-[#111317] text-[#D4FF00] px-2.5 py-0.5 rounded-full font-black">
                {graphEdges.length >= 15 ? '15 HOPS LIVE' : `${graphEdges.length} HOPS`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Traverse sequential banking switches across Pune with exact timestamps, localities, and velocity
            </p>
          </div>
        </div>

        {/* Playback Controls & Speed Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#111317] p-1 rounded-full text-white shadow-md">
            <button
              onClick={() => {
                if (currentHopIndex === graphEdges.length) setCurrentHopIndex(1);
                setIsPlaying(!isPlaying);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black flex items-center gap-1.5 cursor-pointer hover:bg-lime-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Live Flow'}</span>
            </button>

            <button
              onClick={() => setCurrentHopIndex(Math.max(1, currentHopIndex - 1))}
              disabled={currentHopIndex <= 1}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous Hop"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-mono font-bold text-[#D4FF00]">
              Hop {currentHopIndex} / {graphEdges.length}
            </span>

            <button
              onClick={() => setCurrentHopIndex(Math.min(graphEdges.length, currentHopIndex + 1))}
              disabled={currentHopIndex >= graphEdges.length}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next Hop"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentHopIndex(1);
              }}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Restart Trace"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#F8FAFC] border border-slate-200 p-1 rounded-full text-xs font-bold shadow-inner">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  playbackSpeed === spd ? 'bg-[#111317] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrubber Progress Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Hop {currentHopIndex} of {graphEdges.length}: {activeEdge?.source_institution} → {activeEdge?.destination_institution}</span>
          </span>
          <span className="font-mono text-slate-500">{(currentHopIndex / graphEdges.length * 100).toFixed(0)}% Discovered</span>
        </div>
        <input
          type="range"
          min="1"
          max={graphEdges.length || 15}
          value={currentHopIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentHopIndex(parseInt(e.target.value));
          }}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#111317]"
        />
      </div>

      {/* Active Hop Detailed Telemetry Banner */}
      {activeEdge && (
        <div className="p-5 rounded-2xl bg-[#111317] text-white space-y-3 shadow-xl border border-white/10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-[#111317] font-black text-xs font-mono">
                HOP #{activeEdge.hop_order || currentHopIndex} OF {graphEdges.length}
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                {activeEdge.source_institution} ➔ {activeEdge.destination_institution}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-[#D4FF00] font-bold">
                {activeEdge.occurred_at.includes('T') 
                  ? `Sat 29 Aug 2026 • ${activeEdge.occurred_at.split('T')[1].slice(0, 8)} IST`
                  : activeEdge.occurred_at}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transfer Amount</span>
              <b className="text-white font-black text-sm">₹{activeEdge.amount_inr.toLocaleString('en-IN')} INR</b>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction Reference</span>
              <b className="text-slate-200 truncate block">{activeEdge.utr}</b>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Velocity Gap</span>
              <b className="text-emerald-400 font-bold">+{activeEdge.velocity_minutes_from_prior || 1.2}m pass-through</b>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Location</span>
              <b className="text-[#D4FF00] truncate block">{targetNode?.institution_name || 'Pune Sector'}</b>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Hierarchical Graph Node Canvas */}
      <div className="p-6 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Active Multi-Hop Beneficiary Flow ({visibleNodeIds.size} of {graphNodes.length} Nodes Revealed)
          </span>
          <span className="text-[11px] text-slate-400">Click any card to inspect account token</span>
        </div>

        {/* Dynamic Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {graphNodes.map((node, index) => {
            const isVisible = visibleNodeIds.has(node.node_id);
            const isSource = sourceNode?.node_id === node.node_id;
            const isTarget = targetNode?.node_id === node.node_id;
            const badge = getNodeBadge(node.node_type);

            return (
              <div 
                key={node.node_id}
                className={`p-4 rounded-2xl transition-all border ${
                  isTarget
                    ? 'bg-white border-[#111317] ring-4 ring-[#D4FF00]/60 shadow-xl scale-[1.03]'
                    : isSource
                    ? 'bg-white border-cyan-400 ring-2 ring-cyan-200 shadow-md'
                    : isVisible
                    ? 'bg-white border-slate-200/90 shadow-sm opacity-100'
                    : 'bg-slate-100/60 border-dashed border-slate-300 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-bold font-mono text-slate-700">
                    Risk: <span className={node.risk_score > 0.7 ? 'text-rose-600 font-extrabold' : 'text-emerald-600'}>
                      {(node.risk_score * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-black text-slate-900 truncate flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{node.institution_name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    <MaskedToken token={node.account_token} type="account" />
                  </div>
                </div>

                {isVisible && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Total Fwd:</span>
                    <span className="font-extrabold text-slate-900">₹{node.total_forwarded_inr.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
