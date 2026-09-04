import React, { useState } from 'react';
import { 
  X, Mail, Lock, Shield, ArrowRight, 
  CheckCircle2, Users, ShieldCheck, AlertCircle, Sparkles, Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserType } from '../../types';

const GENERIC_PUBLIC_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 
  'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'msn.com',
  'mail.com', 'zoho.com', 'proton.me', 'protonmail.com', 'yandex.com', 
  'gmx.com', 'rediffmail.com', 'inbox.com', 'yopmail.com', 'tempmail.com'
];

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, closeAuthModal, authModalMode, 
    authModalRole, loginUser, signupUser, verifyEmail 
  } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(authModalMode);
  const [role, setRole] = useState<UserType>(authModalRole);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'EMAIL_ENTRY' | 'OTP_VERIFICATION'>('EMAIL_ENTRY');
  const [otpCode, setOtpCode] = useState('420193');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Synchronize internal state with AppContext whenever modal opens
  React.useEffect(() => {
    if (showAuthModal) {
      setMode(authModalMode);
      setRole(authModalRole);
      setErrorMsg(null);
      setStep('EMAIL_ENTRY');
    }
  }, [showAuthModal, authModalMode, authModalRole]);

  const validateEmailForRole = (emailInput: string, roleType: UserType): boolean => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    const domain = trimmed.split('@')[1];
    if (roleType === 'OFFICIAL') {
      const isGeneric = GENERIC_PUBLIC_DOMAINS.some(
        d => domain === d || domain.endsWith('.' + d)
      );
      if (isGeneric) {
        setErrorMsg(
          'Official law enforcement and banking access strictly prohibits public email domains (@' + domain + '). Please use your authorized administrative email (e.g. @police.gov.in, @i4c.gov.in, @mahapolice.gov.in, @sbi.co.in, @hdfcbank.com).'
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateEmailForRole(email, role)) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'SIGNUP') {
        signupUser(email, role);
        setStep('OTP_VERIFICATION');
      } else {
        loginUser(email, role);
      }
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      verifyEmail(otpCode);
    }, 400);
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14171F] border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn relative z-[100000] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${role === 'CITIZEN' ? 'bg-[#D4FF00] text-[#111317]' : 'bg-sky-500 text-white'}`}>
              {role === 'CITIZEN' ? <Users className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {step === 'OTP_VERIFICATION' ? 'Verify Your Email' : mode === 'LOGIN' ? 'Sign In to Golden Hour' : 'Create Account'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {role === 'CITIZEN' ? 'Citizen Victim Portal' : 'Law Enforcement & Bank Portal'}
              </p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal} 
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Pill */}
        {step === 'EMAIL_ENTRY' && (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRole('CITIZEN');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                role === 'CITIZEN' ? 'neu-btn neu-btn-lime' : 'neu-btn-dark opacity-70 hover:opacity-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('OFFICIAL');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                role === 'OFFICIAL' ? 'neu-btn neu-btn-white' : 'neu-btn-dark opacity-70 hover:opacity-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official</span>
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'EMAIL_ENTRY' && (
          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold uppercase tracking-wider font-mono">
                {role === 'OFFICIAL' ? 'Official Institutional Email:' : 'Your Email Address:'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={role === 'OFFICIAL' ? 'officer.deshmukh@police.gov.in' : 'ramesh.patil@gmail.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF00]"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {role === 'CITIZEN' 
                  ? 'Citizens can use any personal email address. Zero PII stored.' 
                  : 'Official government (@gov.in, @nic.in, @police.gov.in) or nodal bank email required.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                role === 'CITIZEN' ? 'neu-btn neu-btn-lime' : 'neu-btn neu-btn-white'
              }`}
            >
              <span>{loading ? 'Validating...' : mode === 'SIGNUP' ? 'Continue' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-400 font-mono">
              {mode === 'SIGNUP' ? (
                <span>Already have an account? <button type="button" onClick={() => setMode('LOGIN')} className="text-[#D4FF00] font-bold underline cursor-pointer">Sign In</button></span>
              ) : (
                <span>First time tracking? <button type="button" onClick={() => setMode('SIGNUP')} className="text-[#D4FF00] font-bold underline cursor-pointer">Create Account</button></span>
              )}
            </div>
          </form>
        )}

        {/* Step 2: Verification Code Form */}
        {step === 'OTP_VERIFICATION' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1 text-slate-300">
              <span className="text-[11px] text-slate-400 font-mono block">We sent a 6-digit code to:</span>
              <b className="text-white font-mono">{email}</b>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-bold uppercase tracking-wider font-mono">Enter 6-Digit Code:</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.5em] font-mono text-lg font-black bg-white/5 border border-white/15 rounded-2xl py-3 text-[#D4FF00] focus:outline-none focus:border-[#D4FF00]"
              />
              <span className="text-[10px] text-emerald-400 font-mono block">✓ Auto-filled instant verification code for preview</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neu-btn neu-btn-lime w-full py-3.5 text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
