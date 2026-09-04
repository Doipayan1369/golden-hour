import React from 'react';
import { 
  Printer, ArrowRight, Shield, ShieldCheck, 
  CheckCircle2, X, Download, FileText, AlertTriangle, QrCode, Landmark, Scale
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getFIRForCase } from '../../services/mockData';

export const DigitalFIRModal: React.FC = () => {
  const { citizenStage, setCitizenStage, citizenCaseId } = useApp();

  if (citizenStage !== 'FIR_VIEW') return null;

  const fir = getFIRForCase(citizenCaseId || 'CASE-2026-041');

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto max-h-[94vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-fadeIn relative z-[100000] text-slate-900 print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Sticky Top Actions Bar (Hidden during print) */}
        <div className="p-4 sm:p-5 bg-[#111317] text-white flex items-center justify-between shrink-0 border-b border-white/10 shadow-md print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4FF00] text-[#111317] flex items-center justify-center font-black">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black font-mono tracking-wide block text-white">
                STATUTORY FIRST INFORMATION REPORT (F.I.R)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Form No. II • Under Section 154 Cr.P.C. / Sec 173 BNSS
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

        {/* Printable Official FIR Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 bg-white flex-1 font-serif text-slate-900 print:overflow-visible print:p-4" id="printable-police-fir">
          
          {/* Official Emblem & State Header */}
          <div className="border-b-2 border-slate-950 pb-5 text-center space-y-1">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-slate-50 font-sans">
                🇮🇳
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-800 font-sans">
                  GOVERNMENT OF MAHARASHTRA • POLICE DEPARTMENT
                </p>
                <p className="text-[11px] font-sans font-semibold text-slate-600">
                  Indian Cyber Crime Coordination Centre (I4C) Integrated Network
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs bg-slate-50 font-sans">
                POLICE
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-3 py-0.5 bg-slate-900 text-[#D4FF00] text-[10px] font-bold font-mono uppercase tracking-wider rounded">
                FORM NO. II (U/S 154 Cr.P.C. / SEC 173 BNSS)
              </span>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 pt-1 font-sans">
                FIRST INFORMATION REPORT (F.I.R)
              </h1>
              <p className="text-xs font-semibold text-slate-700 font-sans">
                (Original Record: Police Station Copy & Complainant Free Copy)
              </p>
            </div>
          </div>

          {/* Section 1: Statutory Registry Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">1. District & State:</span>
              <b className="text-slate-900">Pune City, Maharashtra</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">2. Police Station:</span>
              <b className="text-slate-900">{fir.police_station}</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">3. FIR No. & Year:</span>
              <b className="text-slate-900 font-black">{fir.fir_number}</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">4. Date of FIR:</span>
              <b className="text-slate-900">{fir.reported_date_time}</b>
            </div>
          </div>

          {/* Section 2: GD Entry & Dispatch to Magistrate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-200 text-xs font-sans bg-white">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-mono">GD Entry Reference:</span>
              <b className="text-slate-900">GD-1930/2026/8892 (09:42 IST)</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-mono">Type of Information:</span>
              <b className="text-slate-900">Electronic Transfer / Multi-Mule Fraud</b>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold font-mono">Despatch to Magistrate:</span>
              <b className="text-slate-900">JMFC Cyber Court, Shivajinagar</b>
            </div>
          </div>

          {/* Section 3: Applicable Acts & Statutory Penal Sections */}
          <div className="space-y-2">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-300 pb-1 font-sans">
              Acts & Legal Penal Provisions Registered
            </b>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-[#D4FF00] text-[10px] font-bold flex items-center justify-center shrink-0">§</span>
                <span><b>Sec 419 IPC:</b> Cheating by Personation</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-[#D4FF00] text-[10px] font-bold flex items-center justify-center shrink-0">§</span>
                <span><b>Sec 420 IPC:</b> Cheating & Dishonestly Inducing Delivery</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-[#D4FF00] text-[10px] font-bold flex items-center justify-center shrink-0">§</span>
                <span><b>Sec 66C IT Act:</b> Identity Theft</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-[#D4FF00] text-[10px] font-bold flex items-center justify-center shrink-0">§</span>
                <span><b>Sec 66D IT Act:</b> Cheating by Personation via Computer</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-2 sm:col-span-2">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">✓</span>
                <span><b>Sec 91 & Sec 102 Cr.P.C.:</b> Statutory Freeze Orders & Seizure of 15 Mule Beneficiary Accounts</span>
              </div>
            </div>
          </div>

          {/* Section 4: Complainant Particulars */}
          <div className="space-y-2">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-300 pb-1 font-sans">
              Complainant / Informant Particulars
            </b>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Full Legal Name:</span>
                <b className="text-slate-950 text-sm">{fir.complainant_name}</b>
                <span className="text-slate-500 block text-[11px]">S/o Dnyaneshwar Patil (Age: 42 Yrs)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Contact & KYC Token:</span>
                <b className="text-slate-950 font-mono">{fir.complainant_phone_masked}</b>
                <span className="text-emerald-700 block text-[11px] font-bold">Aadhaar e-KYC Verified</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Permanent / Incident Address:</span>
                <span className="text-slate-800 text-[11px] font-medium leading-tight block">
                  Flat 402, Shivajinagar Heights, Pune Camp, Pune - 411001
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Occurrence of Offence & Financial Interception Breakdown */}
          <div className="space-y-2">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-300 pb-1 font-sans">
              Financial Recovery & Seizure Ledger
            </b>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Total Stolen Amount:</span>
                  <div className="text-lg font-black text-rose-600 font-mono">₹{fir.amount_defrauded.toLocaleString('en-IN')}.00</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 block text-[10px] uppercase font-mono font-bold">Secured & Frozen:</span>
                  <div className="text-lg font-black text-emerald-800 font-mono">₹{fir.amount_recovered.toLocaleString('en-IN')}.00 (100%)</div>
                </div>
                <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Interception Kiosk:</span>
                  <div className="text-xs font-bold text-[#D4FF00] font-mono">SBI FC Road (Goodluck Chowk)</div>
                </div>
              </div>
              <p className="text-[11px] text-emerald-900 font-mono font-medium">
                ✓ 100% of defrauded funds have been placed on statutory lien across 15 hops under Sec 91 CrPC and prevented from ATM cash-out.
              </p>
            </div>
          </div>

          {/* Section 6: Brief Facts / Modus Operandi Narrative */}
          <div className="space-y-2">
            <b className="text-xs font-black uppercase tracking-wider text-slate-900 block border-b border-slate-300 pb-1 font-sans">
              Brief Facts of Offence & Automated Golden Hour Interception
            </b>
            <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
              {fir.mod_operandi}
            </p>
          </div>

          {/* Section 7: Digital Certification, QR Code & Police Station Seal */}
          <div className="pt-6 border-t-2 border-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Investigating Officer:</span>
              <b className="text-slate-950 text-sm font-sans">{fir.investigating_officer}</b>
              <span className="text-slate-600 block text-[11px]">{fir.officer_rank}</span>
              <span className="text-slate-500 block text-[10px] pt-1">Station House Officer, Cyber PS Pune</span>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="w-12 h-12 bg-white text-slate-950 rounded-lg flex items-center justify-center p-1 shrink-0">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#D4FF00] font-black text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIGITALLY SIGNED & VERIFIED</span>
                </div>
                <div className="text-[9px] text-slate-300 font-mono">
                  SHA-256: <code className="text-slate-100">{fir.digital_seal}</code>
                </div>
                <div className="text-[9px] text-slate-400">
                  Court Reference: NCRP-I4C-2026-MH-041
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Footer (Hidden during print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden font-sans">
          <span className="text-xs text-slate-600 font-mono">
            Case: <b className="text-slate-900">{fir.case_id}</b>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Legal FIR</span>
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
