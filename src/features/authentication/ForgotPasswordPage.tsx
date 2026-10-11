import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authentication/authService.ts';
import { Input } from '../../components/ui/Input.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    const res = await authService.resetPassword(email);
    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setMessage(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-radial-teal flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md text-center mb-6 flex flex-col items-center">
        <Link to="/intro" className="mb-4">
          <FitmadixLogo size="md" showTagline={true} />
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-[#002B49]">Reset your password</h1>
        <p className="text-xs text-slate-500 mt-1">We'll dispatch secure recovery instructions to your email</p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Check your inbox</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#00A88F] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <Input
              label="Account email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              requiredIndicator
              helperText="Enter the email address registered with your Fitmadix account."
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#002B49] hover:bg-[#001D33] active:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Recovery Email'}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
