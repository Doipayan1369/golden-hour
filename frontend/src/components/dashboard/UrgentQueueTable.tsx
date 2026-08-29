import React, { useState } from 'react';
import { 
  Search, Filter, Clock, ArrowUpRight, 
  ShieldAlert, ChevronRight, RefreshCw 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TacticalBadge } from '../common/TacticalBadge';
import { MaskedToken } from '../common/MaskedToken';

interface Props {
  onSelectCase?: (caseId: string) => void;
}

export const UrgentQueueTable: React.FC<Props> = ({ onSelectCase }) => {
  const { cases, selectedCaseId, selectCase, setActiveTab, refreshCases } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.utr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fraud_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || c.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleOpenCase = (caseId: string) => {
    selectCase(caseId);
    if (onSelectCase) {
      onSelectCase(caseId);
    } else {
      setActiveTab('workspace');
    }
  };

  return (
    <div className="neu-card p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              1930 / NCRP Incident Triage Matrix
            </h2>
            <TacticalBadge label={`${filteredCases.length} Active`} variant="dark" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Prioritized by transaction velocity, pass-through ratio, and cash-out window urgency in Pune
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Case, UTR, Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-800 pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:border-slate-400 w-56 lg:w-72 shadow-inner"
            />
          </div>

          {/* Severity Dropdown Pill */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-2.5 rounded-full focus:outline-none cursor-pointer shadow-inner"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical (&lt;30m)</option>
            <option value="HIGH">High (&lt;45m)</option>
            <option value="ELEVATED">Elevated</option>
            <option value="MONITORING">Monitoring</option>
          </select>

          <button
            onClick={() => refreshCases()}
            className="p-2.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-inner"
            title="Refresh Complaints Queue"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Case ID & Anchor</th>
              <th className="py-3 px-4">Modus Operandi</th>
              <th className="py-3 px-4">Victim Loss</th>
              <th className="py-3 px-4">Jurisdiction</th>
              <th className="py-3 px-4">Urgency Level</th>
              <th className="py-3 px-4">SLA Freshness</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredCases.map((c) => {
              const isSelected = c.case_id === selectedCaseId;
              const isCritical = c.severity === 'CRITICAL';
              return (
                <tr
                  key={c.case_id}
                  className={`transition-colors cursor-pointer group ${
                    isSelected ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'
                  }`}
                  onClick={() => handleOpenCase(c.case_id)}
                >
                  <td className="py-4 px-4 font-mono font-bold text-slate-900 flex flex-col">
                    <span className="flex items-center gap-1.5">
                      {isCritical && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      )}
                      {c.case_id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      UTR: {c.utr}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-semibold max-w-xs truncate">
                    {c.fraud_type}
                  </td>
                  <td className="py-4 px-4 font-mono font-extrabold text-slate-900">
                    ₹{c.amount_inr.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {c.jurisdiction}
                  </td>
                  <td className="py-4 px-4">
                    <TacticalBadge
                      label={c.severity}
                      variant={
                        c.severity === 'CRITICAL' ? 'crimson' :
                        c.severity === 'HIGH' ? 'amber' :
                        c.severity === 'ELEVATED' ? 'cyan' : 'slate'
                      }
                    />
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-500">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.data_freshness_minutes}m ago</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCase(c.case_id);
                      }}
                      className="pill-btn-dark py-1 px-4 text-xs font-semibold inline-flex items-center gap-1.5 group-hover:bg-[#111317] group-hover:text-[#D4FF00] transition-all"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
