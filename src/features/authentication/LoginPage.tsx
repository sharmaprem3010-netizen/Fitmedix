import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Read any redirect notice passed by route guard
  const redirectNotice = (location.state as any)?.message;
  const targetDestination = (location.state as any)?.from?.pathname || '/home';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      navigate(targetDestination, { replace: true });
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    const res = await login({
      email: 'alex.morgan@fitmadix.health',
      password: 'ClinicalPassword123!',
    });
    setLoading(false);
    if (res.success) {
      navigate(targetDestination, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-radial-teal flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md text-center mb-6 flex flex-col items-center">
        <Link to="/intro" className="mb-4">
          <FitmadixLogo size="md" showTagline={true} />
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-[#002B49]">Sign in to your account</h1>
        <p className="text-xs text-slate-500 mt-1">Access your private health records and personalized wellness</p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        {redirectNotice && (
          <div role="status" className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium flex items-start gap-2">
            <span className="text-amber-600 font-bold text-sm leading-none mt-0.5">🔒</span>
            <div>
              <p className="font-bold">Authentication Required</p>
              <p className="text-amber-800 mt-0.5">{redirectNotice}</p>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* 1-Tap Quick Demo Sign In for Easy Mobile & Device Testing */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full py-3 px-4 text-xs font-bold text-[#002B49] bg-[#F0FDF9] hover:bg-[#E0FBF4] border border-[#00A88F]/40 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
        >
          <Sparkles className="w-4 h-4 text-[#00A88F] group-hover:scale-110 transition-transform" />
          <span>Quick Demo Sign In (1-Tap Instant Access)</span>
        </button>

        <div className="relative flex items-center justify-center text-xs text-slate-400">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Or sign in with email</span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            requiredIndicator
            autoComplete="email"
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#00A88F] font-bold hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              requiredIndicator
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#002B49] hover:bg-[#001D33] active:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Health Vault'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-[#00A88F] font-bold hover:underline">
            Create an account
          </Link>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Supabase Auth ready architecture. Records remain private under individual authenticated user tokens.
          </p>
        </div>
      </div>
    </div>
  );
};
