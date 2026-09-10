import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CoderArmyLogo } from '../components/CoderArmyLogo';
import { api } from '../api';

interface Props {
  onSuccess: () => void;
}

export const AuthView: React.FC<Props> = ({ onSuccess }) => {
  const { login, register, switchRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [college, setCollege] = useState('PICT Pune');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          branch,
          college,
        });
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'student' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      await switchRole(role);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotMsg(res.message);
    } catch (err: any) {
      setForgotMsg(err.message || 'Request failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 text-white p-6 border-b border-slate-800 text-center">
          <div className="flex justify-center mb-3">
            <CoderArmyLogo size={64} variant="badge" className="rounded-2xl border-slate-700 shadow-xl" />
          </div>
          <h2 className="text-xl font-black tracking-wider text-white flex items-center justify-center gap-2">
            <span>CODER ARMY</span>
            <span className="text-xs font-bold text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded-full bg-sky-500/10">
              CAPACITY CONNECT
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Code • Build • Impact — Smart Skill Gap & Placement Engine
          </p>

          {/* Quick Demo Shortcuts for SIH Judges */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-2">
              Instant Hackathon Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-xl text-xs font-bold text-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!showForgot ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Branch
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                        placeholder="CSE"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        College
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={e => setCollege(e.target.value)}
                        placeholder="College Name"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isRegister ? 'Create Student Account' : 'Sign In'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
                {isRegister ? (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(false)}
                      className="font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    New student?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </span>
                )}
              </div>
            </form>
          ) : (
            /* Forgot password view */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Reset Account Password</h3>
              <p className="text-xs text-slate-500">
                Enter your registered college email and we will simulate password dispatch.
              </p>

              {forgotMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                  {forgotMsg}
                </div>
              )}

              <input
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
