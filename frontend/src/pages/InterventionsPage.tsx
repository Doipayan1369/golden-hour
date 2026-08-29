import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle2, Clock, AlertTriangle, 
  XCircle, MessageSquare, RefreshCw, Send, ArrowUpRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { api } from '../services/api';
import { ActionPacket } from '../types';

export const InterventionsPage: React.FC = () => {
  const { role, refreshCases } = useApp();
  const [actions, setActions] = useState<ActionPacket[]>([]);
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'DRAFT' | 'APPROVED' | 'ACKNOWLEDGED' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchActions = async () => {
    try {
      setLoading(true);
      const data = await api.getInterventions();
      setActions(data);
    } catch (err) {
      console.error('Failed to load interventions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleAcknowledge = async (actionId: string) => {
    try {
      await api.acknowledgeAction(actionId, `ACK-BEAT3-${Date.now().toString().slice(-4)}`, 'SI Vikram Singh');
      await fetchActions();
      await refreshCases();
    } catch (err) {
      console.error('Failed to acknowledge', err);
    }
  };

  const handleOpenCancel = (actionId: string) => {
    setActiveActionId(actionId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!activeActionId) return;
    try {
      await api.cancelAction(activeActionId, cancelReason || 'Duty officer stood down unit after visual verification');
      setShowCancelModal(false);
      setCancelReason('');
      await fetchActions();
      await refreshCases();
    } catch (err) {
      console.error('Failed to cancel', err);
    }
  };

  const filtered = actions.filter((a) => selectedTab === 'ALL' || a.status === selectedTab);

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="neu-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Intervention & Response Queue
              </h2>
              <TacticalBadge label={`${actions.length} Action Packets`} variant="dark" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Human-in-the-Loop Coordination across Local Beat Units and Bank Nodal Officers (PRD Section 10)
            </p>
          </div>

          <button
            onClick={fetchActions}
            className="p-3 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          {[
            { id: 'ALL', label: 'All Interventions' },
            { id: 'APPROVED', label: 'Active Dispatches' },
            { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
            { id: 'DRAFT', label: 'Awaiting Review' },
            { id: 'REJECTED', label: 'Cancelled / Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedTab === tab.id
                  ? 'bg-[#111317] text-white border-[#111317] shadow-md'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="neu-card p-12 text-center text-slate-400 font-medium text-xs">
            No action packets found for this queue filter.
          </div>
        ) : (
          filtered.map((act) => (
            <div key={act.action_id} className="neu-card p-6 space-y-4 hover:shadow-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 font-mono text-sm">{act.action_id}</span>
                      <TacticalBadge 
                        label={act.status} 
                        variant={act.status === 'APPROVED' ? 'lime' : act.status === 'ACKNOWLEDGED' ? 'emerald' : 'slate'} 
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Target Corridor: <span className="text-slate-800 font-bold">{act.priority_zone}</span> (Case: <span className="font-mono text-slate-700">{act.case_id}</span>)
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400">Created: </span>
                  <span className="font-mono text-slate-700 font-semibold">{act.created_at}</span>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border border-slate-200/80 p-4 rounded-2xl text-xs space-y-2">
                <div className="font-semibold text-slate-800">{act.suggested_action}</div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
                  <span>Window: <b className="text-slate-800 font-mono">{act.expected_window}</b></span>
                  <span>Approver: <b className="text-slate-800">{act.approved_by || 'Awaiting Authorization'}</b></span>
                  {act.acknowledgement_by && (
                    <span className="text-emerald-700 font-bold">Acknowledged by: {act.acknowledgement_by}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 font-medium">
                  {act.disclaimer}
                </div>

                <div className="flex items-center gap-2.5">
                  {act.status === 'APPROVED' && (
                    <>
                      <button
                        onClick={() => handleOpenCancel(act.action_id)}
                        className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold hover:bg-rose-100 cursor-pointer"
                      >
                        Cancel Dispatch
                      </button>
                      <button
                        onClick={() => handleAcknowledge(act.action_id)}
                        className="px-5 py-2 pill-btn-lime text-xs font-bold cursor-pointer"
                      >
                        Acknowledge Receipt
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* M-09 Cancel Action Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Cancel Active Intervention</h3>
                <p className="text-xs text-slate-500">M-09 Cancel Action Audit Requirement</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Reason for Cancellation:</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter field justification for standing down units..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
