import React, { useState, useEffect } from 'react';
import { 
  PlaySquare, Sparkles, RefreshCw, CheckCircle2, 
  ArrowRight, ShieldAlert, Zap, Filter 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReplayController } from '../components/replay/ReplayController';
import { TransactionGraph } from '../components/workspace/TransactionGraph';
import { ForecastCard } from '../components/workspace/ForecastCard';
import { TacticalBadge } from '../components/common/TacticalBadge';
import { api } from '../services/api';
import { ScenarioCatalogItem } from '../types';

export const ReplayPage: React.FC = () => {
  const { selectedCaseId, selectCase } = useApp();
  const [scenarios, setScenarios] = useState<ScenarioCatalogItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    api.getScenarios().then(setScenarios).catch(console.error);
  }, []);

  const handleSelectScenario = (scen: ScenarioCatalogItem) => {
    selectCase(scen.case_id);
  };

  const filtered = scenarios.filter((s) => categoryFilter === 'ALL' || s.category === categoryFilter);

  return (
    <div className="space-y-8 pb-12">
      {/* Scenario Catalog Card */}
      <div className="neu-card p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Deterministic Incident Replay Catalog
              </h2>
              <TacticalBadge label="10 Benchmark Scenarios" variant="dark" />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Evaluate system prediction accuracy, lead-time metrics, and hard negatives (Section 11.1)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 px-4 py-2 rounded-full shadow-inner">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="positive">Positive Cashout Cases</option>
                <option value="hard_negative">Hard Negatives (Controls)</option>
                <option value="incomplete_data">Incomplete Data Recovery</option>
                <option value="pending_response">Pending Timer Delay</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scenario Pills / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((scen) => {
            const isSelected = selectedCaseId === scen.case_id;
            return (
              <button
                key={scen.scenario_id}
                onClick={() => handleSelectScenario(scen)}
                className={`neu-card p-5 text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'border-[#111317] ring-2 ring-slate-900/10 shadow-lg'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-slate-900">{scen.case_id}</span>
                  <TacticalBadge 
                    label={scen.category.replace('_', ' ')} 
                    variant={scen.category === 'positive' ? 'lime' : scen.category === 'hard_negative' ? 'slate' : 'amber'} 
                  />
                </div>
                <div className="text-xs font-bold text-slate-900 mt-2">{scen.title}</div>
                <p className="text-[11px] text-slate-500 mt-1">{scen.fraud_pattern}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Events: <b>{scen.event_count}</b></span>
                  <span className="text-emerald-700 font-bold">✓ {scen.pass_fail_status}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Replay Player */}
      <ReplayController />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7">
          <TransactionGraph />
        </div>
        <div className="xl:col-span-5">
          <ForecastCard />
        </div>
      </div>
    </div>
  );
};
