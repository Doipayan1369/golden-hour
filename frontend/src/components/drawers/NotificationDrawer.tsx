import React from 'react';
import { X, Bell, AlertTriangle, Radio, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const { cases, alertBanner } = useApp();

  const notifications = [
    {
      id: 'notif-1',
      title: 'Hop 2 Bank Response Received',
      time: '2m ago',
      desc: 'Bank C confirmed INR 40,000 sent to Bank D (acct_cashout_110).',
      type: 'INFO',
    },
    {
      id: 'notif-2',
      title: 'High-Risk Spatial Cash-Out Alert',
      time: '6m ago',
      desc: 'Sector 14 Corridor calculated as Rank #1 priority zone (82% confidence).',
      type: 'ALERT',
    },
    {
      id: 'notif-3',
      title: 'Beat Unit 3 Acknowledged Dispatch',
      time: '12m ago',
      desc: 'SI Vikram Singh confirmed visual monitoring at Sector 14 market ATMs.',
      type: 'SUCCESS',
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between font-sans animate-in slide-in-from-right duration-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#111317] text-[#D4FF00]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Live System Notifications</h3>
              <p className="text-xs text-slate-400">D-01 Notification Drawer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alertBanner && (
          <div className="p-4 bg-[#F4FCE3] border border-[#D4FF00] rounded-2xl text-xs font-semibold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
            <span>{alertBanner}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Recent Broadcasts</div>
          {notifications.map((n) => (
            <div key={n.id} className="p-4 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{n.title}</span>
                <span className="text-slate-400 font-mono text-[10px]">{n.time}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full text-xs font-bold cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
