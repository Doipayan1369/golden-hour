import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'lime' | 'dark' | 'white';
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'white',
  badgeText
}) => {
  if (variant === 'dark') {
    return (
      <div className="neu-dark rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight font-mono-data">{value}</h3>
          </div>
          <div className="p-2.5 rounded-full bg-white/10 text-[#D4FF00] border border-white/10">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400">{subtitle}</span>
          {badgeText && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-[#111317] font-bold text-[10px]">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'lime') {
    return (
      <div className="neu-lime rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#111317]/80 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-[#111317] mt-1 tracking-tight font-mono-data">{value}</h3>
          </div>
          <div className="p-2.5 rounded-full bg-[#111317] text-[#D4FF00]">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#111317]/15 flex items-center justify-between text-xs font-medium text-[#111317]/90">
          <span>{subtitle}</span>
          {badgeText && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#111317] text-white font-bold text-[10px]">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="neu-card p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight font-mono-data">{value}</h3>
        </div>
        <div className="p-2.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtitle}</span>
        {badgeText && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
