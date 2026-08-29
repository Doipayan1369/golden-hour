import React, { useState } from 'react';
import { Network, Send, X, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

interface TraceRequestModalProps {
  caseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TraceRequestModal: React.FC<TraceRequestModalProps> = ({ caseId, onClose, onSuccess }) => {
  const [targetBank, setTargetBank] = useState('Bank D (Axis Bank)');
  const [scope, setScope] = useState('Next Hop Forwarding & ATM Card Binding');
  const [timeWindow, setTimeWindow] = useState('Last 30 Minutes');
  const [reason, setReason] = useState('Urgent Golden Hour Interception of Stolen Funds');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.requestTraceHop(caseId, {
        target_institution: targetBank,
        requested_scope: scope,
        time_window: timeWindow,
        reason: reason,
        officer_id: 'Insp. R. Sharma (Duty Lead)',
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit trace request', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#111317] text-[#D4FF00]">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Request Next-Hop Bank Trace</h3>
              <p className="text-xs text-slate-400">M-05 Trace Request Modal (PRD Section 7.3)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="text-slate-600 uppercase">Target Institution:</label>
            <select
              value={targetBank}
              onChange={(e) => setTargetBank(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 text-slate-900"
            >
              <option value="Bank D (Axis Bank)">Bank D (Terminal Card Issuer)</option>
              <option value="Bank E (Canara Bank)">Bank E (Co-operative / Secondary)</option>
              <option value="Payment Gateway X">Payment Gateway / Merchant Node</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 uppercase">Requested Investigation Scope:</label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 uppercase">Investigation Justification & Statutory Reason:</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 font-medium">
            Demo Mode: Request triggers simulated bank response with SLA timer in trace rail.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 pill-btn-lime text-xs font-black shadow-md cursor-pointer"
            >
              {loading ? 'Dispatching...' : 'Dispatch Request (M-05)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
