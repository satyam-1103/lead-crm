import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { redirect } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import clsx from 'clsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setError('');
      redirect('/');
    } catch {
      setError('Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-xl animate-scale-up">
        {/* Logo Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-[28px] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Activity className="w-10 h-10 text-primary-500 animate-pulse relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            LeadEstate <span className="text-primary-500">CRM</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">Next-Gen Real Estate Intelligence</p>
        </div>

        <div className="card-premium p-10 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-indigo-600"></div>
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">System Authentication</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 px-8">Access the enterprise lead management portal</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <p className="text-rose-200 text-xs font-bold uppercase tracking-wider">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within/input:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Key</label>
                <button type="button" className="text-[9px] font-black text-primary-500 hover:text-primary-400 uppercase tracking-widest transition-colors">Recover Access</button>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within/input:text-primary-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:bg-white/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary-500 hover:text-white transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 mt-10",
                loading && "animate-pulse"
              )}
            >
              {loading ? "Authenticating..." : (
                <>Authorize System <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">AES-256 Encrypted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-500" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Cloud Cluster v4.2</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mt-10">
          Professional Demo Credentials: <span className="text-slate-400">admin@example.com / password</span>
        </p>
      </div>
    </div>
  );
};

export default Login;