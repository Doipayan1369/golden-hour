import React from 'react';
import { 
  Printer, ArrowRight, Shield, ShieldCheck, 
  CheckCircle2, X, Download, FileText, AlertTriangle, QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_FIR_041, getFIRForCase } from '../../services/mockData';

export const DigitalFIRModal: React.FC = () => {
  const { citizenStage, setCitizenStage, citizenCaseId } = useApp();

  if (citizenStage !== 'FIR_VIEW') return null;

  const fir = getFIRForCase(citizenCaseId || 'CASE-2026-041');

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-fadeIn relative z-[100000] text-slate-900">
        
        {/* Sticky Top Actions Bar */}
        <div className="p-4 sm:p-5 bg-[#111317] text-white flex items-center justify-between shrink-0 border-b border-white/10 shadow-md">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#D4FF00]" />
            <div>
              <span className="text-xs sm:text-sm font-black font-mono tracking-wide block text-white">
                OFFICIAL FIRST INFORMATION REPORT (F.I.R)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Under Section 154 of the Code of Criminal Procedure, 1973
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black flex items-center gap-2 cursor-pointer hover:bg-lime-400 transition-transform hover:scale-105 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official FIR</span>
            </button>
            <button
              onClick={() => setCitizenStage('DASHBOARD')}
              className="px-4 sm:px-5 py-2 rounded-full bg-white text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer hover:bg-slate-200 transition-colors shadow-sm"
            >
              <span>Track Funds Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Printable FIR Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 bg-white flex-1" id="printable-police-fir">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5">
            <div className="inline-block px-3 py-1 bg-slate-900 text-[#D4FF00] text-[10px] font-black font-mono rounded-full mb-1">
              GOVERNMENT OF MAHARASHTRA • POLICE DEPARTMENT
            </div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              FIRST INFORMATION REPORT (F.I.R)
            </h1>
            <p className="text-xs font-bold text-slate-700 font-mono">
              [ Under Section 154 Cr.P.C. • Cyber Crime Police Station, Pune City ]
            </p>
          </div>

          {/* FIR Reference Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">1. FIR Number</span>
              <b className="text-slate-900 font-black">{fir.fir_number}</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">2. Police Station</span>
              <b className="text-slate-900">{fir.police_station}</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">3. Date & Time</span>
              <b className="text-slate-900">{fir.reported_date_time}</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">4. Status</span>
              <b className="text-emerald-700 font-black">INTERCEPTED (100% RECOVERED)</b>
            </div>
          </div>

          {/* Applicable Acts and Sections */}
          <div className="space-y-2 text-xs">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
              Acts & Legal Penal Provisions
            </b>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fir.acts_and_sections.map((act, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-800 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center shrink-0">§</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complainant Particulars */}
          <div className="space-y-2 text-xs">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
              Complainant & Incident Details
            </b>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Complainant Name</span>
                <b>{fir.complainant_name}</b>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Contact Token</span>
                <b>{fir.complainant_phone_masked}</b>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Incident Timestamp</span>
                <b>{fir.incident_date_time}</b>
              </div>
            </div>
          </div>

          {/* Modus Operandi & Recovery Summary */}
          <div className="space-y-2 text-xs">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-200 pb-1">
              Brief Facts of the Crime & Fast-Track Interception
            </b>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
              {fir.mod_operandi}
            </p>
          </div>

          {/* Recovery Financials */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-emerald-800 font-bold uppercase font-mono text-[11px]">Financial Interception Audit</span>
              <div className="text-base sm:text-xl font-black text-emerald-950 font-mono">
                Stolen: ₹{fir.amount_defrauded.toLocaleString('en-IN')} • Secured: ₹{fir.amount_recovered.toLocaleString('en-IN')} (100%)
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-black font-mono self-start sm:self-auto">
              ✓ SECURED UNDER SEC 91 CrPC
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Investigating Officer:</span>
              <b className="text-slate-950 text-sm">{fir.investigating_officer}</b>
              <span className="text-slate-600 block text-[11px]">{fir.officer_rank}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 text-white text-right space-y-1 border border-slate-800">
              <div className="flex items-center gap-2 justify-end text-[#D4FF00] font-black text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIALLY SEALED & CERTIFIED</span>
              </div>
              <div className="text-[9px] text-slate-400">
                Seal Ref: <code className="text-slate-200">{fir.digital_seal}</code>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            Case: <b className="text-slate-800">{fir.case_id}</b>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print FIR</span>
            </button>
            <button
              onClick={() => setCitizenStage('DASHBOARD')}
              className="px-6 py-2 rounded-full bg-[#111317] text-[#D4FF00] text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
            >
              <span>Proceed to Main Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
