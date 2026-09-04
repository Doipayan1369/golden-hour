import React, { useState, useEffect } from 'react';
import { 
  Mail, ArrowRight, CheckCircle2, Shield, ShieldCheck, 
  AlertCircle, Users, RefreshCw, Lock, Sparkles, ExternalLink,
  Landmark, KeyRound, Clock, X, ArrowLeft
} from 'lucide-react';
import { UserType } from '../../types';

interface Auth5Props {
  initialRole?: UserType;
  initialMode?: 'LOGIN' | 'SIGNUP';
  onSuccess?: (email: string, role: UserType) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const GENERIC_PUBLIC_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 
  'outlook.com', 'live.com', 'icloud.com', 'aol.com', 'msn.com',
  'mail.com', 'zoho.com', 'proton.me', 'protonmail.com', 'yandex.com', 
  'gmx.com', 'rediffmail.com', 'inbox.com', 'yopmail.com', 'tempmail.com'
];

export const Auth5: React.FC<Auth5Props> = ({
  initialRole = 'CITIZEN',
  initialMode = 'SIGNUP',
  onSuccess,
  onClose,
  isModal = false
}) => {
  const [role, setRole] = useState<UserType>(initialRole);
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<'INPUT' | 'CHECK_INBOX'>('INPUT');
  const [otpCode, setOtpCode] = useState('420193');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Sync role/mode when props change
  useEffect(() => {
    setRole(initialRole);
    setMode(initialMode);
    setErrorMsg(null);
  }, [initialRole, initialMode]);

  // Resend cooldown countdown effect
  useEffect(() => {
    let timer: any;
    if (authState === 'CHECK_INBOX' && cooldownSeconds > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authState, cooldownSeconds]);

  const validateEmail = (input: string, roleType: UserType): boolean => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }

    const domain = trimmed.split('@')[1];
    if (roleType === 'OFFICIAL') {
      const isGeneric = GENERIC_PUBLIC_DOMAINS.some(
        (d) => domain === d || domain.endsWith('.' + d)
      );
      if (isGeneric) {
        setErrorMsg(
          `Official access strictly requires authorized administrative domains (e.g. @police.gov.in, @i4c.gov.in, @mahapolice.gov.in, @sbi.co.in). Generic emails (@${domain}) are prohibited.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateEmail(email, role)) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setAuthState('CHECK_INBOX');
      setCooldownSeconds(30);
      setCanResend(false);
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCooldownSeconds(30);
      setCanResend(false);
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess(email, role);
      }
    }, 500);
  };

  const handleOAuthClick = (provider: string) => {
    setIsLoading(true);
    const mockEmail = role === 'OFFICIAL' ? 'officer.deshmukh@police.gov.in' : 'ramesh.patil@gmail.com';
    setEmail(mockEmail);
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess(mockEmail, role);
      }
    }, 600);
  };

  const getWebmailUrl = (emailInput: string) => {
    const domain = emailInput.split('@')[1]?.toLowerCase() || '';
    if (domain.includes('gmail')) return 'https://mail.google.com';
    if (domain.includes('outlook') || domain.includes('hotmail')) return 'https://outlook.live.com';
    if (domain.includes('yahoo')) return 'https://mail.yahoo.com';
    return null;
  };

  const webmailLink = getWebmailUrl(email);

  return (
    <div className={`w-full max-w-md mx-auto relative ${isModal ? '' : 'p-4'}`}>
      
      {/* Centered Glass Card Container */}
      <div className="rounded-3xl sm:rounded-[2.25rem] bg-[#12151D]/95 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100 transition-all duration-300">
        
        {/* Ambient Card Background Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-[#D4FF00]/10 blur-3xl pointer-events-none"></div>

        {/* Modal Close Button if used in Modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STATE 1: Magic Link & Email Entry State */}
        {authState === 'INPUT' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Identity */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-lg ${
                  role === 'CITIZEN' ? 'bg-[#D4FF00] text-[#111317]' : 'bg-white text-slate-950'
                }`}>
                  {role === 'CITIZEN' ? <Users className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    {mode === 'SIGNUP' ? 'Create Your Account' : 'Sign In to Golden Hour'}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {role === 'CITIZEN' ? 'Citizen Case Tracking Portal' : 'Official Police & Bank Suite'}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => {
                  setRole('CITIZEN');
                  setErrorMsg(null);
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'CITIZEN' ? 'bg-[#D4FF00] text-[#111317] shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Citizen / Public</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('OFFICIAL');
                  setErrorMsg(null);
                }}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'OFFICIAL' ? 'bg-white text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Police / Bank</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Magic Link Form */}
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-bold uppercase tracking-wider font-mono text-[11px] block">
                  {role === 'OFFICIAL' ? 'Official Institutional Email:' : 'Enter Email Address:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder={role === 'OFFICIAL' ? 'officer.deshmukh@police.gov.in' : 'ramesh.patil@gmail.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4FF00] font-mono transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {role === 'CITIZEN' 
                    ? 'We will send a passwordless magic link and instant code.' 
                    : 'Institutional .gov.in, .nic.in, or verified bank email required.'}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-full text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-[1.02] ${
                  role === 'CITIZEN' 
                    ? 'bg-[#D4FF00] text-[#111317] hover:bg-lime-400 shadow-[#D4FF00]/20' 
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
              >
                <span>{isLoading ? 'Generating Magic Link...' : 'Send Magic Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* OAuth Fallback Divider */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative px-3 bg-[#12151D] text-[10px] uppercase font-mono font-bold text-slate-400">
                Or authenticate with
              </div>
            </div>

            {/* OAuth Fallback Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuthClick('DigiLocker / MeriPehchan')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Landmark className="w-4 h-4 text-[#D4FF00]" />
                <span>DigiLocker SSO</span>
              </button>

              {role === 'CITIZEN' ? (
                <button
                  type="button"
                  onClick={() => handleOAuthClick('Google')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-sky-400" />
                  <span>Google SSO</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOAuthClick('PKI Smart Token')}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Smart Badge PKI</span>
                </button>
              )}
            </div>

            {/* Mode Toggle Footer */}
            <div className="pt-2 text-center text-xs text-slate-400 font-mono border-t border-white/10">
              {mode === 'SIGNUP' ? (
                <span>Already registered? <button type="button" onClick={() => setMode('LOGIN')} className="text-[#D4FF00] font-bold underline cursor-pointer">Sign In</button></span>
              ) : (
                <span>First time reporting? <button type="button" onClick={() => setMode('SIGNUP')} className="text-[#D4FF00] font-bold underline cursor-pointer">Create Account</button></span>
              )}
            </div>

          </div>
        )}

        {/* STATE 2: Check-Your-Inbox State with Resend Cooldown */}
        {authState === 'CHECK_INBOX' && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            {/* Animated Pulsating Mail Icon */}
            <div className="mx-auto w-16 h-16 rounded-3xl bg-[#D4FF00]/15 border border-[#D4FF00]/40 text-[#D4FF00] flex items-center justify-center shadow-lg relative">
              <div className="absolute inset-0 rounded-3xl bg-[#D4FF00]/20 animate-ping"></div>
              <Mail className="w-8 h-8 relative z-10" />
            </div>

            {/* Headings */}
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white tracking-tight">
                Check Your Inbox
              </h2>
              <p className="text-xs text-slate-300">
                We sent a secure magic link and 6-digit confirmation token to:
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 font-mono text-xs font-bold text-[#D4FF00] border border-white/15 mt-1">
                {email}
              </div>
            </div>

            {/* Direct Webmail Shortcut Button (if recognized domain) */}
            {webmailLink && (
              <div>
                <a
                  href={webmailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono transition-colors border border-white/15"
                >
                  <span>Open Email Inbox</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Quick 6-Digit OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 text-left">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-bold uppercase tracking-wider font-mono text-[11px] block text-center">
                  Or enter 6-digit code:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[0.4em] font-mono text-xl font-black bg-white/5 border border-white/20 rounded-2xl py-3.5 text-[#D4FF00] focus:outline-none focus:border-[#D4FF00]"
                />
                <span className="text-[10px] text-emerald-400 font-mono block text-center">
                  ✓ Demo code auto-filled for instant verification
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#D4FF00] text-[#111317] text-xs font-black flex items-center justify-center gap-2 cursor-pointer hover:bg-lime-400 transition-all shadow-lg hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Verifying...' : 'Verify Code & Proceed'}</span>
              </button>
            </form>

            {/* Resend Cooldown Timer & Back Action */}
            <div className="pt-2 space-y-3 border-t border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>Didn't receive email?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#D4FF00] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Magic Link</span>
                  </button>
                ) : (
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Resend in 00:{cooldownSeconds < 10 ? `0${cooldownSeconds}` : cooldownSeconds}</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setAuthState('INPUT')}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Use a different email address</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
