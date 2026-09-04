import React, { useState } from 'react';
import { 
  User, ShieldCheck, Mail, Phone, MapPin, Calendar, 
  CheckCircle2, Clock, AlertTriangle, Send, FileText, 
  MessageSquare, ChevronRight, ShieldAlert, Sparkles, ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserConcern } from '../../types';

export const UserProfilePage: React.FC<{ onBackToTracking?: () => void }> = ({ onBackToTracking }) => {
  const { currentUser, citizenCaseId, setAlertBanner } = useApp();

  const [profile] = useState<UserProfile>({
    name: 'Ramesh Patil',
    email: currentUser?.email || 'ramesh.patil@gmail.com',
    age: 42,
    phone_masked: '+91 98*** **420',
    city: 'Pune',
    state: 'Maharashtra',
    aadhaar_last_four: '9102',
    registered_at: '2026-08-28T09:42:00Z'
  });

  const [concerns, setConcerns] = useState<UserConcern[]>([
    {
      ticket_id: 'GRV-2026-4419',
      case_id: citizenCaseId || 'CASE-2026-041',
      category: 'Fund Release / Bank Account Credit',
      subject: 'Request for formal NOC to release frozen funds from Axis Bank branch',
      message: 'Police beat patrol has successfully placed the freeze on beneficiary account. Please advise on obtaining the Section 457 CrPC court release order.',
      submitted_at: '28 Aug 2026, 11:15 IST',
      status: 'OFFICER_ASSIGNED',
      officer_response: 'Insp. Deshmukh has forwarded the certified Section 91 CrPC notice to Axis Bank Nodal Officer. Bank will process release upon judicial confirmation.'
    }
  ]);

  const [category, setCategory] = useState('Fund Release / Bank Account Credit');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitConcern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newTicket: UserConcern = {
        ticket_id: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        case_id: citizenCaseId || 'CASE-2026-041',
        category,
        subject,
        message,
        submitted_at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST (Today)',
        status: 'PENDING_REVIEW'
      };

      setConcerns(prev => [newTicket, ...prev]);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setSubject('');
      setMessage('');
      setAlertBanner(`Grievance ticket ${newTicket.ticket_id} submitted to Cyber Crime Department.`);

      setTimeout(() => setSubmittedSuccess(false), 5000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#111317] text-[#D4FF00] flex items-center justify-center font-black shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Victim Account Profile & Grievance Desk
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              National Cyber Crime Reporting Portal (1930) Verified Citizen Record
            </p>
          </div>
        </div>

        {onBackToTracking && (
          <button
            onClick={onBackToTracking}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Live Case Tracker</span>
          </button>
        )}
      </div>

      {/* Account Info & Case Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Account Info Card */}
        <div className="neu-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <b className="text-sm font-black text-slate-900 uppercase tracking-tight">
              Personal Information
            </b>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              e-KYC VERIFIED
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <b className="text-slate-900 font-bold">{profile.name}</b>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Age:</span>
              <b className="text-slate-900 font-bold">{profile.age} Years</b>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Email ID:</span>
              <b className="text-slate-900 font-mono">{profile.email}</b>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Registered Phone:</span>
              <b className="text-slate-900 font-mono">{profile.phone_masked}</b>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Aadhaar Token:</span>
              <b className="text-slate-900 font-mono">XXXX-XXXX-{profile.aadhaar_last_four}</b>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Jurisdiction City:</span>
              <b className="text-slate-900">{profile.city}, {profile.state}</b>
            </div>
          </div>

          <div className="pt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 font-mono space-y-1">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Privacy & Encryption</span>
            <span>Zero raw banking credentials stored. All communication secured under 256-bit SHA-2 hash chain.</span>
          </div>
        </div>

        {/* Case History Breakdown Cards */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase font-mono">Total Cases Filed</span>
                <span className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <FileText className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">1</div>
              <span className="text-[11px] text-slate-500">Registered on 1930 Portal</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold uppercase font-mono">Active Losses</span>
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-rose-600 font-mono">0</div>
              <span className="text-[11px] text-slate-500">No pending unrecovered amounts</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-2 bg-emerald-50/40">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 text-xs font-bold uppercase font-mono">Resolved & Intercepted</span>
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-800 font-mono">1</div>
              <span className="text-[11px] text-emerald-700 font-bold">100% Funds Frozen & Secured</span>
            </div>

          </div>

          {/* Active Case Reference Card */}
          <div className="p-5 rounded-3xl bg-[#111317] text-white border border-white/10 space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] animate-pulse"></span>
                <b className="font-mono text-sm text-[#D4FF00]">Primary Registered Case: {citizenCaseId || 'CASE-2026-041'}</b>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                ✓ 100% RECOVERED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Incident Amount</span>
                <b className="text-white text-sm">₹4,50,000.00</b>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Secured by Police</span>
                <b className="text-emerald-400 text-sm">₹4,50,000.00</b>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Police Station</span>
                <b className="text-slate-200">Deccan Cyber PS</b>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Beat Patrol Unit</span>
                <b className="text-slate-200">PCR Unit 3</b>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Raise a Concern to Cyber Crime Department */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Grievance Submission Form */}
        <div className="lg:col-span-6 neu-card p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <MessageSquare className="w-5 h-5 text-slate-900" />
              <span>Raise a Concern to Cyber Crime Department</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submit official queries, evidence submissions, or fund release status requests directly to the investigating officer.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <b className="block">Grievance Ticket Registered Successfully</b>
                <span className="text-emerald-700">The assigned Cyber Cell officer has been notified. You can track progress below.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitConcern} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                  Associated Case ID:
                </label>
                <input
                  type="text"
                  disabled
                  value={citizenCaseId || 'CASE-2026-041'}
                  className="w-full font-mono font-bold bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                  Urgency Level:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'NORMAL' | 'URGENT')}
                  className="w-full font-bold bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="NORMAL">Standard Query</option>
                  <option value="URGENT">High Priority / Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                Grievance / Request Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full font-bold bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-slate-900"
              >
                <option value="Fund Release / Bank Account Credit">Request for Frozen Fund Credit (Sec 457 CrPC)</option>
                <option value="Police Investigation & Charge Sheet">Query Regarding Investigation Status & Charge Sheet</option>
                <option value="Additional Evidence Submission">Submit Additional Transaction Proofs / Screenshots</option>
                <option value="Update Contact / Address Particulars">Update Contact Details / Change Address</option>
                <option value="Officer Callback Request">Request Telephonic Callback from Investigating Officer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                Subject Summary:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inquiring about timeline for fund reversal into my SBI account"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider font-mono text-[11px]">
                Detailed Statement / Query:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide specific details, bank branch name, or questions for the cyber crime unit..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#111317] text-[#D4FF00] text-xs font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Grievance Ticket...' : 'Submit Official Concern to Cyber Crime Unit'}</span>
            </button>
          </form>
        </div>

        {/* Existing Grievance Tickets Ledger */}
        <div className="lg:col-span-6 neu-card p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <b className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Submitted Grievance Tickets ({concerns.length})
              </b>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Live Police Response Tracker
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[480px]">
              {concerns.map((c) => (
                <div key={c.ticket_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs bg-white px-2 py-0.5 rounded border border-slate-200">
                      {c.ticket_id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      c.status === 'OFFICER_ASSIGNED' 
                        ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                        : c.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {c.status === 'OFFICER_ASSIGNED' ? 'OFFICER REVIEWING' : c.status}
                    </span>
                  </div>

                  <b className="text-slate-900 block font-bold">{c.subject}</b>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{c.message}</p>

                  {c.officer_response && (
                    <div className="p-3 rounded-xl bg-white border border-sky-200 space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-sky-800 font-bold font-mono text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>CYBER CRIME DEPT OFFICIAL REPLY:</span>
                      </div>
                      <p className="text-slate-700">{c.officer_response}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Category: {c.category}</span>
                    <span>{c.submitted_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Standard response SLA for Cyber Crime Grievance Desk: &lt; 2 hours</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
