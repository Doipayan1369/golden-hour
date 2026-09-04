import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertTriangle, 
  ArrowRight, ArrowLeft, ShieldCheck, Plus, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface NewCasePageProps {
  onComplete: (caseId: string) => void;
  onCancel: () => void;
}

export const NewCasePage: React.FC<NewCasePageProps> = ({ onComplete, onCancel }) => {
  const { refreshCases, setAlertBanner } = useApp();
  const [step, setStep] = useState<'SOURCE' | 'ANCHOR' | 'ATTACH' | 'REVIEW' | 'ENRICH'>('SOURCE');
  const [intakeSource, setIntakeSource] = useState<'MANUAL' | 'CSV'>('MANUAL');
  
  const [caseId, setCaseId] = useState(`CASE-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [utr, setUtr] = useState(`UPI20260827${Math.floor(1000 + Math.random() * 9000)}`);
  const [amountInr, setAmountInr] = useState('85000');
  const [sourceInstitution, setSourceInstitution] = useState('Bank A (State Bank of India)');
  const [fraudType, setFraudType] = useState('Electricity Bill Disconnection / APK Impersonation');
  const [victimAccount, setVictimAccount] = useState('acct_victim_9912');
  const [jurisdiction, setJurisdiction] = useState('Gurugram North / Sector 14');
  const [severity, setSeverity] = useState('CRITICAL');
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleValidateAndReview = async () => {
    try {
      setLoading(true);
      const res = await api.validateIntake({
        case_id: caseId,
        utr: utr,
        amount_inr: parseFloat(amountInr),
        source_institution: sourceInstitution
      });

      if (!res.is_valid) {
        setValidationErrors(res.errors);
        return;
      }

      setValidationErrors([]);
      setValidationWarnings(res.warnings);
      setStep('REVIEW');
    } catch (err: any) {
      setValidationErrors([err.message || 'Validation failed']);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    try {
      setLoading(true);
      setStep('ENRICH');
      const created = await api.createIntake({
        case_id: caseId,
        utr: utr,
        amount_inr: parseFloat(amountInr),
        source_institution: sourceInstitution,
        fraud_type: fraudType,
        victim_account_token: victimAccount,
        jurisdiction: jurisdiction,
        severity: severity as any
      });

      await refreshCases();
      setAlertBanner(`Case ${created.case_id} anchored successfully. Initial bank enrichment in progress.`);
      setTimeout(() => {
        onComplete(created.case_id);
      }, 1200);
    } catch (err: any) {
      setValidationErrors([err.message || 'Creation failed']);
      setStep('REVIEW');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="neu-card p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              1930 / NCRP Complaint Intake Wizard
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step verification according to PRD Section 5.1 & MHA SOP
            </p>
          </div>
          <button
            onClick={onCancel}
            className="neu-btn neu-btn-outline px-5 py-2 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-100 text-xs font-bold font-mono">
          {[
            { id: 'SOURCE', label: '1. Source' },
            { id: 'ANCHOR', label: '2. Anchor' },
            { id: 'ATTACH', label: '3. Evidence' },
            { id: 'REVIEW', label: '4. Review' },
            { id: 'ENRICH', label: '5. Enrich' },
          ].map((s) => (
            <div
              key={s.id}
              className={`p-2.5 rounded-xl text-center transition-all ${
                step === s.id
                  ? 'bg-[#111317] text-[#D4FF00] shadow-md'
                  : 'bg-[#F8FAFC] text-slate-400'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {step === 'SOURCE' && (
        <div className="neu-card p-8 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">
            Select Complaint Ingestion Source
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setIntakeSource('MANUAL')}
              className={`p-6 rounded-3xl text-left border transition-all cursor-pointer ${
                intakeSource === 'MANUAL'
                  ? 'bg-[#111317] text-white border-[#111317] shadow-xl'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <FileText className={`w-8 h-8 ${intakeSource === 'MANUAL' ? 'text-[#D4FF00]' : 'text-slate-700'}`} />
              <h4 className="text-base font-bold mt-4">Manual 1930 Anchor Entry</h4>
              <p className="text-xs text-slate-400 mt-1">
                Enter single complaint reference, UTR anchor, victim account, and stolen amount.
              </p>
            </button>

            <button
              onClick={() => setIntakeSource('CSV')}
              className={`p-6 rounded-3xl text-left border transition-all cursor-pointer ${
                intakeSource === 'CSV'
                  ? 'bg-[#111317] text-white border-[#111317] shadow-xl'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Upload className={`w-8 h-8 ${intakeSource === 'CSV' ? 'text-[#D4FF00]' : 'text-slate-700'}`} />
              <h4 className="text-base font-bold mt-4">Batch CSV / JSON Upload</h4>
              <p className="text-xs text-slate-400 mt-1">
                Import structured batch file with automated column mapping & schema validation.
              </p>
            </button>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep('ANCHOR')}
              className="neu-btn neu-btn-lime px-6 py-3 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'ANCHOR' && (
        <div className="neu-card p-8 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">
            Step 2: Complaint Transaction Anchor Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            <div className="space-y-2">
              <label className="text-slate-600 uppercase">Case Identifier:</label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-mono shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 uppercase">12-Digit UTR / Transaction Reference (Anchor):</label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-mono shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 uppercase">Stolen Fraud Amount (INR):</label>
              <input
                type="number"
                value={amountInr}
                onChange={(e) => setAmountInr(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 font-mono shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 uppercase">Source Institution (Victim's Bank):</label>
              <input
                type="text"
                value={sourceInstitution}
                onChange={(e) => setSourceInstitution(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 uppercase">Fraud Modus Operandi:</label>
              <input
                type="text"
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 shadow-inner focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 uppercase">Assigned Cyber Jurisdiction:</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 shadow-inner focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep('SOURCE')}
              className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep('ATTACH')}
              className="neu-btn neu-btn-lime px-6 py-3 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'ATTACH' && (
        <div className="neu-card p-8 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">
            Step 3: Attach Supporting Evidence References
          </h3>

          <div className="p-6 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Evidence Tokenization & Verification</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-medium">
              Optional for hackathon MVP. In production, digital bank logs, 1930 audio transcripts, and SMS header payloads are hashed into the case ledger.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm font-mono text-slate-700">
                <span>NCRP_1930_LOG_REF_0827.json</span>
                <span className="text-emerald-600 font-bold">✓ VERIFIED</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm font-mono text-slate-700">
                <span>BANK_A_UPI_PUSH_ACK.xml</span>
                <span className="text-emerald-600 font-bold">✓ ATTACHED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep('ANCHOR')}
              className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleValidateAndReview}
              disabled={loading}
              className="neu-btn neu-btn-lime px-6 py-3 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>{loading ? 'Validating...' : 'Review Case'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'REVIEW' && (
        <div className="neu-card p-8 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900">
            Step 4: Review Case Facts & Schema Validation
          </h3>

          {validationWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Duplicate / Historical Warnings:</span>
              </div>
              {validationWarnings.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 space-y-1">
              <div className="font-bold">Validation Errors Found:</div>
              {validationErrors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}

          <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 rounded-2xl text-xs space-y-3 font-semibold">
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Case ID:</span>
              <span className="font-mono text-slate-900">{caseId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Anchor UTR:</span>
              <span className="font-mono text-slate-900">{utr}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Fraud Amount:</span>
              <span className="text-emerald-700 font-mono text-sm font-bold">₹{parseFloat(amountInr).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Modus Operandi:</span>
              <span className="text-slate-900">{fraudType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Victim Institution:</span>
              <span className="text-slate-900">{sourceInstitution}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep('ATTACH')}
              className="neu-btn neu-btn-outline px-5 py-2.5 text-xs font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleCreateCase}
              disabled={loading}
              className="neu-btn neu-btn-lime px-8 py-3 text-xs font-black shadow-lg cursor-pointer"
            >
              {loading ? 'Creating...' : 'Anchor Case'}
            </button>
          </div>
        </div>
      )}

      {step === 'ENRICH' && (
        <div className="neu-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#111317] text-[#D4FF00] flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Anchoring Case & Triggering Initial Bank Traces...
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Connecting initial UTR to verified banking exchange feeds. Opening case workspace shortly.
          </p>
        </div>
      )}
    </div>
  );
};
