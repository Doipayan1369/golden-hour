import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';

interface MaskedTokenProps {
  token: string;
  type?: 'account' | 'phone' | 'utr' | 'hash';
  copyable?: boolean;
}

export const MaskedToken: React.FC<MaskedTokenProps> = ({ 
  token, 
  type = 'account',
  copyable = true 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs bg-[#F8FAFC] border border-slate-200/90 px-2.5 py-1 rounded-full text-slate-700 shadow-sm group hover:border-slate-300 transition-colors">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span className="tracking-wide font-medium">{token}</span>
      {copyable && (
        <button 
          onClick={handleCopy}
          title="Copy token"
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 ml-0.5"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
};
