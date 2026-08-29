import React from 'react';
import { 
  Network, ArrowRight, ShieldCheck, 
  CheckCircle2, CreditCard, Building2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';
import { MaskedToken } from '../common/MaskedToken';
import { NodeType } from '../../types';

export const TransactionGraph: React.FC = () => {
  const { graphNodes, graphEdges } = useApp();

  const getNodeBadge = (type: NodeType) => {
    switch (type) {
      case 'VICTIM': return { label: 'VICTIM ANCHOR', bg: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'MULE_LAYER_1': return { label: 'MULE LAYER 1', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'MULE_LAYER_2': return { label: 'MULE LAYER 2', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
      case 'CASHOUT_DEST': return { label: 'CASHOUT DEST', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default: return { label: 'INTERMEDIARY', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="neu-card p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-800">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
              Temporal Multi-Hop Transaction Graph
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized bank responses linked into a verified pass-through flow
            </p>
          </div>
        </div>
        <TacticalBadge label={`${graphNodes.length} Nodes • ${graphEdges.length} Hops`} variant="dark" />
      </div>

      {/* Modern Card Node Flow */}
      <div className="p-6 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {graphNodes.map((node, index) => {
            const outEdge = graphEdges.find(e => e.source_node === node.node_id);
            const badge = getNodeBadge(node.node_type);

            return (
              <div key={node.node_id} className="relative">
                {/* Node Box */}
                <div className={`neu-card p-5 space-y-3 ${node.node_type === 'CASHOUT_DEST' ? 'border-rose-300 ring-4 ring-rose-100/80 shadow-lg' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-700">
                      Risk: <span className={node.risk_score > 0.7 ? 'text-rose-600 font-extrabold' : 'text-emerald-600'}>
                        {(node.risk_score * 100).toFixed(0)}%
                      </span>
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      {node.institution_name}
                    </div>
                    <div className="mt-2">
                      <MaskedToken token={node.account_token} type="account" />
                    </div>
                  </div>

                  {/* Node Risk Flags */}
                  {node.flags && node.flags.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                      {node.flags.slice(0, 2).map((flag, idx) => (
                        <div key={idx} className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111317]"></span> {flag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow to Next Node on Desktop */}
                {index < graphNodes.length - 1 && outEdge && (
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 bg-[#111317] text-[#D4FF00] rounded-full p-1.5 shadow-md">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transaction Edge Details Bar */}
        {graphEdges.length > 0 && (
          <div className="pt-4 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700 uppercase text-[11px]">Verified Hops:</span>
              {graphEdges.map((e, idx) => (
                <div key={e.edge_id} className="flex items-center gap-1.5 text-slate-800 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-sm font-mono text-xs">
                  <span className="text-slate-400 font-bold">Hop {e.hop_order}:</span>
                  <span className="font-extrabold text-emerald-700">₹{e.amount_inr.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-slate-400 font-sans">({e.source_institution} → {e.destination_institution})</span>
                </div>
              ))}
            </div>
            <div className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Staged Bank Feeds Confirmed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
