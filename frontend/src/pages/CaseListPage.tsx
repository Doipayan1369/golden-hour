import React, { useState } from 'react';
import { 
  Search, Filter, Plus, FileDown, 
  Clock, ShieldAlert, ArrowUpRight, RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { MaskedToken } from '../components/common/MaskedToken';

interface CaseListPageProps {
  onNewCase: () => void;
}

export const CaseListPage: React.FC<CaseListPageProps> = ({ onNewCase }) => {
  const { cases, selectedCaseId, selectCase, setActiveTab, refreshCases } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fraud_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleOpen = (caseId: string) => {
    selectCase(caseId);
    setActiveTab('workspace');
  };

  return (
    <div className="space-y-8">
      <div className="neu-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Case Management Registry
              </h2>
              <TacticalBadge label={`${filteredCases.length} Cases`} variant="dark" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Authorized NCRP / 1930 Cyber-Financial Fraud Case Records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewCase}
              className="flex items-center gap-2 px-6 py-3 pill-btn-lime text-xs font-black shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create / Ingest Case</span>
            </button>

            <button
              onClick={refreshCases}
              title="Refresh case registry"
              className="p-3 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-full cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search Case ID, UTR, Modus Operandi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-slate-800 pl-11 pr-4 py-3 rounded-full focus:outline-none focus:border-slate-400 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-full shadow-inner">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical (&lt;30m)</option>
              <option value="HIGH">High (&lt;60m)</option>
              <option value="ELEVATED">Elevated</option>
              <option value="MONITORING">Monitoring</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-4 py-2.5 rounded-full shadow-inner">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Case Statuses</option>
              <option value="FORECAST_READY">Forecast Ready</option>
              <option value="ENRICHING">Enriching (Bank Tracing)</option>
              <option value="ACTION_APPROVED">Action Approved</option>
              <option value="ACTION_ACKNOWLEDGED">Action Acknowledged</option>
              <option value="NEEDS_DATA">Needs Data</option>
            </select>
          </div>
        </div>
      </div>

      <div className="neu-card p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">Case Identifier</th>
                <th className="py-4 px-5">Fraud Type & Jurisdiction</th>
                <th className="py-4 px-5">Stolen Amount</th>
                <th className="py-4 px-5">Severity</th>
                <th className="py-4 px-5">Freshness</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => {
                const isSelected = c.case_id === selectedCaseId;
                const severityVariant = 
                  c.severity === 'CRITICAL' ? 'crimson' : 
                  c.severity === 'HIGH' ? 'amber' : 
                  c.severity === 'ELEVATED' ? 'cyan' : 'slate';

                return (
                  <tr 
                    key={c.case_id}
                    onClick={() => handleOpen(c.case_id)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F4FCE3]/40' : ''
                    }`}
                  >
                    <td className="py-4.5 px-5">
                      <div className="font-bold text-slate-900 font-mono text-sm flex items-center gap-2">
                        {c.case_id}
                        {c.case_id === 'CASE-2026-041' && (
                          <span className="text-[10px] px-2.5 py-0.5 bg-[#D4FF00] text-[#111317] rounded-full font-extrabold shadow-sm">
                            PRIMARY SHOWCASE
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5">
                        <MaskedToken token={c.utr} type="utr" />
                      </div>
                    </td>
                    <td className="py-4.5 px-5">
                      <div className="text-slate-900 font-bold text-sm">{c.fraud_type}</div>
                      <div className="text-xs text-slate-500 mt-1">{c.jurisdiction}</div>
                    </td>
                    <td className="py-4.5 px-5 font-extrabold text-slate-900 font-mono text-sm">
                      ₹{c.amount_inr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4.5 px-5">
                      <TacticalBadge 
                        label={c.severity} 
                        variant={severityVariant} 
                        pulse={c.severity === 'CRITICAL'} 
                      />
                    </td>
                    <td className="py-4.5 px-5 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{c.data_freshness_minutes}m ago</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-5">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full">
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4.5 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(c.case_id);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111317] hover:bg-[#23272F] text-white rounded-full font-bold transition-all shadow-md text-xs cursor-pointer"
                      >
                        <span>Open Workspace</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#D4FF00]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
