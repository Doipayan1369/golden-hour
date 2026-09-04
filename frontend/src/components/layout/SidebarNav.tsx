import React from 'react';
import { 
  FolderGit2, MapPin, 
  PlaySquare, ShieldCheck, ListOrdered, Send, FileText, Settings, HelpCircle, Flame, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SidebarNav: React.FC<Props> = ({ isOpen, onClose }) => {
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

  const handleNavClick = (id: any) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const navContent = (
    <div className="neu-card p-4 sm:p-5 flex flex-col justify-between h-full space-y-4 shadow-sm border border-slate-200/90 rounded-3xl">
      {/* Top: Header & Main Navigation Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 pt-1 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#111317] inline-block" />
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-extrabold font-mono">
              Command Modules
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            LIVE
          </span>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Navigation List */}
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'dashboard' && item.id === 'workflow');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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
      </div>

      {/* Bottom: Settings, Help & System Identity */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('settings')}
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
            onClick={() => handleNavClick('help')}
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

        {/* Minimal System Telemetry Footer */}
        <div className="bg-[#F8FAFC] border border-slate-200/80 p-3 rounded-2xl flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700">1930 INGESTION</span>
          </div>
          <span className="text-slate-400">SEC-65B</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0 self-start sticky top-24">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-80 max-w-[85vw] bg-[#F0F2F6] h-full p-4 overflow-y-auto z-10 shadow-2xl animate-fadeIn">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
