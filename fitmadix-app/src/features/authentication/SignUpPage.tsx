import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('Please acknowledge the medical disclaimer and terms of service to proceed.');
      return;
    }

    setLoading(true);
    const res = await signUp({ fullName, email, password });
    setLoading(false);

    if (res.success) {
      navigate('/onboarding');
    } else {
      setError(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-radial-teal flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md text-center mb-6 flex flex-col items-center">
        <Link to="/intro" className="mb-4">
          <FitmadixLogo size="md" showTagline={true} />
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-[#002B49]">Create your account</h1>
        <p className="text-xs text-slate-500 mt-1">Begin with your private health record and personalized guidance</p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        {error && (
          <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Mitchell"
            requiredIndicator
            autoComplete="name"
          />

          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            requiredIndicator
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            requiredIndicator
            autoComplete="new-password"
            helperText="Must be minimum 8 characters long."
          />

          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#00A88F] focus:ring-[#00A88F] cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 leading-relaxed cursor-pointer text-left">
              I understand that Fitmadix provides educational health guidance and does not substitute for licensed medical diagnosis or emergency care.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#002B49] hover:bg-[#001D33] active:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account & Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already registered? </span>
          <Link to="/login" className="text-[#00A88F] font-bold hover:underline">
            Sign in here
          </Link>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            Your health records are stored with Row-Level Security architecture. No health telemetry is exposed publicly.
          </p>
        </div>
      </div>
    </div>
  );
};
