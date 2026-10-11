import React, { useState } from 'react';
import { X, Building2, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { loginRecruiter, registerRecruiter } from '../services/api.ts';
import { RecruiterSession } from '../types/index.ts';

interface RecruiterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: RecruiterSession) => void;
}

const DEMO_RECRUITERS = [
  {
    company: 'Razorpay',
    name: 'Pooja Iyer (TA Lead)',
    email: 'pooja@razorpay.com',
    password: 'razorpay123',
    color: 'bg-blue-600',
  },
  {
    company: 'Zepto',
    name: 'Rohit Verma (Ops HR)',
    email: 'rohit@zepto.com',
    password: 'zepto123',
    color: 'bg-purple-600',
  },
  {
    company: 'Swiggy',
    name: 'Ananya Roy (Tech Hiring)',
    email: 'ananya@swiggy.com',
    password: 'swiggy123',
    color: 'bg-orange-500',
  },
];

export const RecruiterAuthModal: React.FC<RecruiterAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const session = await loginRecruiter(email, password);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const session = await registerRecruiter({
        name: regName,
        company_name: regCompany,
        email: regEmail,
        password: regPassword,
      });
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const session = await loginRecruiter(demoEmail, demoPass);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recruiter Studio Access</h3>
              <p className="text-[10px] text-slate-500">Authorized corporate hiring teams only</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security badge notice */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 text-[11px] text-blue-900 flex items-start space-x-2">
          <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Job seekers do not have access to this portal. Please sign in with your company credentials to manage drives and applicant queues.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Company
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-2.5 text-xs flex items-start space-x-2">
            <span className="text-rose-600 font-bold shrink-0">✕</span>
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form: Sign In */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. recruiter@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              <span>{isLoading ? 'Verifying...' : 'Authenticate & Open Studio'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>

            {/* Quick 1-Tap Demo Logins */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick 1-Tap Demo Accounts:
              </span>
              <div className="space-y-1">
                {DEMO_RECRUITERS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleQuickDemoLogin(demo.email, demo.password)}
                    className="w-full bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-md ${demo.color} text-white font-bold text-[10px] flex items-center justify-center`}>
                        {demo.company[0]}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 text-[11px] block">{demo.company}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{demo.email}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-white border border-blue-200 px-2 py-0.5 rounded-md">
                      Log In →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Form: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Siddharth Menon"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
                placeholder="e.g. Atlassian, Microsoft, CRED"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="siddharth@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 disabled:opacity-60 mt-1"
            >
              <span>{isLoading ? 'Creating Studio...' : 'Register & Enter Studio'}</span>
              <UserCheck className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
