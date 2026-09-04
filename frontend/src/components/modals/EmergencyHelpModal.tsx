import React from 'react';
import { 
  PhoneCall, ExternalLink, ShieldAlert, X, 
  CheckCircle2, AlertTriangle, Clock, ShieldCheck, Landmark
} from 'lucide-react';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14171F] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn relative z-[1000000] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                Emergency Cyber Fraud Helpline
              </h3>
              <p className="text-xs text-rose-400 font-mono font-bold">
                National Cyber Crime Reporting Portal (1930)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1930 Number Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-[#181B24] border border-rose-500/40 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-rose-300 uppercase tracking-wider">
              24x7 NATIONAL TOLL-FREE HELPLINE
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold font-mono">
              IMMEDIATE ASSISTANCE
            </span>
          </div>

          <div className="flex items-center justify-between">
            <a 
              href="tel:1930" 
              className="text-4xl sm:text-5xl font-black font-mono text-[#D4FF00] hover:text-lime-300 tracking-wider transition-colors"
            >
              1930
            </a>
            <a
              href="tel:1930"
              className="neu-btn neu-btn-red px-5 py-2.5 text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            Dial <b>1930</b> immediately from any phone in India to report unauthorized financial transactions, online extortion, or digital arrest fraud.
          </p>
        </div>

        {/* Official Government Portal Link */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200">Official Government Cyber Crime Portal:</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">MHA / I4C Verified</span>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#11141A] hover:bg-[#161922] border border-white/15 flex items-center justify-between text-slate-200 hover:text-[#D4FF00] transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Landmark className="w-4 h-4 text-[#D4FF00]" />
              <span className="font-mono font-bold text-xs">cybercrime.gov.in</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#D4FF00] transition-colors" />
          </a>

          <p className="text-[11px] text-slate-400">
            Visit the official Government of India portal to register e-complaints, upload bank transaction proofs, or check FIR status.
          </p>
        </div>

        {/* 3 Golden Steps */}
        <div className="space-y-2 text-xs">
          <b className="text-[11px] uppercase font-mono font-bold text-slate-400 tracking-wider">
            Critical 3-Step Action Plan:
          </b>
          <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#D4FF00] text-[#111317] font-black text-[9px] flex items-center justify-center shrink-0">1</span>
              <span>Dial 1930 within the first 30-60 mins of fraud.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#D4FF00] text-[#111317] font-black text-[9px] flex items-center justify-center shrink-0">2</span>
              <span>Get your Complaint Acknowledgement Reference ID.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#D4FF00] text-[#111317] font-black text-[9px] flex items-center justify-center shrink-0">3</span>
              <span>Track money trail & print your FIR on Golden Hour.</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="neu-btn neu-btn-dark w-full py-3 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
