import React from 'react';
import { 
  GitBranch, FolderGit2, MapPin, 
  PlaySquare, ShieldCheck, ListOrdered, Send, FileText, Settings, HelpCircle, Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SidebarNav: React.FC = () => {
  const { activeTab, setActiveTab, cases, selectedCaseId } = useApp();

  const navItems = [
    { id: 'workflow', label: 'Guided Workflow', icon: ListOrdered, badge: '6-Step' },
    { id: 'cases', label: 'Case Registry', icon: FolderGit2, badge: `${cases.length}` },
    { id: 'map', label: 'Thermal Radar', icon: Flame, badge: 'Pune' },
    { id: 'interventions', label: 'Action Queue', icon: Send, badge: 'Live' },
    { id: 'replay', label: 'Replay Simulator', icon: PlaySquare, badge: '5-Min' },
    { id: 'reports', label: 'Court Reports', icon: FileText, badge: 'PDF' },
    { id: 'audit', label: 'Audit Ledger', icon: ShieldCheck, badge: 'SHA-256' },
  ];

  return (
    <aside className="w-72 flex flex-col justify-between shrink-0 space-y-6">
      {/* Navigation Card */}
      <div className="neu-card p-4 space-y-2">
        <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
          Command Modules
        </div>
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'dashboard' && item.id === 'workflow');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#111317] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4FF00]' : 'text-slate-400'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#D4FF00] text-[#111317]' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Links: Settings & Help */}
        <div className="pt-2 border-t border-slate-100 space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#111317] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-3.5 h-3.5" />
              <span>Console Settings</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
              activeTab === 'help' ? 'bg-[#111317] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SOP & Guidance</span>
            </div>
          </button>
        </div>
      </div>

      {/* Active Case Hero Card */}
      <div className="neu-dark p-6 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Active Priority Case</span>
          <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-bold">
            CRITICAL
          </span>
        </div>
        <div className="text-lg font-extrabold text-white font-mono">{selectedCaseId}</div>
        <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-white/10">
          <span className="text-slate-400">Target Window:</span>
          <span className="text-[#D4FF00] font-bold font-mono">10:25 - 10:40 IST</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-[#D4FF00] h-full w-4/5 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
};
