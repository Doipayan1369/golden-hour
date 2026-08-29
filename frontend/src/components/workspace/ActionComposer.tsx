import React, { useState } from 'react';
import { 
  Send, ShieldCheck, X, CheckCircle2, 
  UserCheck, AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HotspotZone } from '../../types';
import { api } from '../../services/api';

interface ActionComposerProps {
  zone: HotspotZone;
  onClose: () => void;
}

export const ActionComposer: React.FC<ActionComposerProps> = ({ zone, onClose }) => {
  const { selectedCase, refreshCases } = useApp();
  const [targetUnits] = useState(['Sector 14 Beat Patrol Unit 3', 'Bank D Cyber Nodal Desk']);
  const [approverName, setApproverName] = useState('DSP A. Verma (Command Duty Lead)');
  const [isApproved, setIsApproved] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApproveAndDispatch = async () => {
    if (!selectedCase) return;
    try {
      setLoading(true);
      const act = await api.createAction(selectedCase.case_id, {
        action_type: 'BEAT_PATROL_ALERT',
        target_recipients: targetUnits,
        suggested_action: `Emergency patrol dispatch to ${zone.zone_label} ATMs & emergency card hold at Bank D switch`,
        priority_zone: zone.zone_label,
        expected_window: `${zone.expected_window_start} - ${zone.expected_window_end}`,
        created_by: 'Insp. R. Sharma (I4C Analyst)',
      });

      const approved = await api.approveAction(act.action_id, approverName);
      setActionId(approved.action_id);
      setIsApproved(true);
      await refreshCases();
    } catch (err) {
      console.error('Failed to dispatch action', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#111317] text-[#D4FF00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tactical Intervention Dispatch
              </h3>
              <p className="text-xs text-slate-500">MHA / I4C Authorized Coordination Packet</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isApproved ? (
          <div className="space-y-4 text-xs">
            <div className="bg-[#F8FAFC] border border-slate-200/80 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Case Reference:</span>
                <span className="text-slate-900 font-bold font-mono">{selectedCase?.case_id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Target Corridor:</span>
                <span className="text-slate-900 font-bold">{zone.zone_label}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Expected Window:</span>
                <span className="text-emerald-700 font-bold font-mono">{zone.expected_window_start} - {zone.expected_window_end}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Uncertainty Radius:</span>
                <span className="text-slate-900 font-medium">{zone.radius_m} meters</span>
              </div>
            </div>

            {/* Recipient Checkboxes */}
            <div className="space-y-2">
              <label className="text-[11px] text-slate-500 uppercase font-bold">
                Designated Field Recipient Units:
              </label>
              <div className="space-y-2">
                {['Sector 14 Beat Patrol Unit 3 (Physical Surveillance)', 'Bank D Cyber Nodal Desk (Debit Card Emergency Freeze)', 'Gurugram Central Police Dispatch'].map((rec, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 text-slate-800 cursor-pointer bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 font-medium">
                    <input type="checkbox" defaultChecked className="accent-[#111317] rounded" />
                    <span>{rec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Approver Identity */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-700" />
                Authorized Duty Approver Identity:
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-slate-400 shadow-inner"
              />
            </div>

            {/* PRD Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                DECISION SUPPORT NOTICE: Automated recommendations require officer review and SOP authorization before field execution.
              </span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveAndDispatch}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 pill-btn-lime text-xs font-bold shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Digitally Signing...' : 'Authorize & Dispatch'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Action Packet Dispatched & Signed</h4>
              <p className="text-xs text-slate-500 mt-1">
                Ref ID: <span className="font-bold text-slate-800 font-mono">{actionId}</span> • Signed by {approverName}
              </p>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-xs text-slate-700 text-left space-y-1.5 font-medium">
              <div>✓ Broadcast alert transmitted to Sector 14 Beat Unit 3</div>
              <div>✓ Direct freeze advisory sent to Bank D Nodal Switch</div>
              <div>✓ Immutable record appended to SHA-256 Audit Chain</div>
            </div>
            <div className="flex justify-center pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 pill-btn-dark text-xs font-bold shadow-md"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
