import React from 'react';

interface TacticalBadgeProps {
  label: string;
  variant?: 'lime' | 'dark' | 'emerald' | 'crimson' | 'cyan' | 'slate' | 'amber';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const TacticalBadge: React.FC<TacticalBadgeProps> = ({ 
  label, 
  variant = 'lime', 
  size = 'sm',
  pulse = false 
}) => {
  const variantStyles = {
    lime: 'bg-[#D4FF00] text-[#111317] border border-[#C2EC00] shadow-sm font-bold',
    dark: 'bg-[#111317] text-white border border-slate-800 shadow-sm font-medium',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold',
    crimson: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold',
    cyan: 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            variant === 'crimson' ? 'bg-rose-400' : variant === 'emerald' ? 'bg-emerald-400' : 'bg-lime-500'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            variant === 'crimson' ? 'bg-rose-500' : variant === 'emerald' ? 'bg-emerald-500' : 'bg-[#111317]'
          }`}></span>
        </span>
      )}
      {label}
    </span>
  );
};
