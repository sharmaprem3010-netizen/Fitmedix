'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useLanguage } from '@/components/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Use global language context
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl: '/home' });
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/home');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data.error || 'Failed to send reset link');
      } else {
        setForgotSuccess(true);
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="auth-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="splash-loader"><span></span><span></span><span></span></div>
      </div>
    );
  }

  return (
    <div className="sage-auth-container">
      {/* 3D Doctor Image */}
      <img src="/doctor_3d.png" alt="Doctor" className="sage-doctor-img" />

      <div className="sage-auth-header">
        <h1 className="sage-title">{t('Sign in')}</h1>
        
        <button 
          className="sage-lang-btn"
          onClick={() => setShowLanguageModal(true)}
        >
          🌐 {language}
        </button>
      </div>
      
      <div className="sage-auth-body">
        {error && (
          <div style={{ padding: '10px', background: '#ffcccc', color: 'red', borderRadius: '8px', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleFormLogin}>
          <div className="sage-form-group">
            <svg className="sage-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <input type="email" className="sage-input" placeholder={t('Email address')} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          
          <div className="sage-form-group">
            <svg className="sage-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" className="sage-input" placeholder={t('Enter password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="sage-btn-primary" disabled={loading}>
            {loading ? t('Signing in...') : t('Log in')}
          </button>

          <div style={{ marginTop: 15, fontSize: '0.85rem' }}>
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setShowForgotModal(true); setForgotSuccess(false); setForgotEmail(''); }}
              className="sage-link" 
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              {t('Forget password?')}
            </button>
          </div>
        </form>
        
        <div className="sage-divider">{t('or continue with')}</div>
        
        <div className="sage-social-buttons">
          <button className="sage-btn-social" onClick={handleGoogleLogin} disabled={loading}>
            <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t('Google')}
          </button>
          <button className="sage-btn-social" disabled>
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.54.04 2.87.72 3.61 1.83-3.14 1.88-2.65 6.03.35 7.28-.7 1.76-1.55 3.36-2.63 4.82zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            {t('Apple')}
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t("Don't have an account?")} <a href="/signup" className="sage-link" style={{ textDecoration: 'underline' }}>{t('Sign Up')}</a>
        </div>
      </div>

      {showLanguageModal && (
        <div className="premium-modal-overlay" onClick={() => setShowLanguageModal(false)} style={{ zIndex: 9999 }}>
          <div className="premium-modal" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            <h2 style={{ color: '#2b4c6a' }}>{t('Select Language')}</h2>
            <div className="premium-modal-grid">
              {supportedLanguages.map(lang => (
                <button 
                  key={lang} 
                  className={`premium-modal-btn ${lang === language ? 'active' : ''}`}
                  onClick={() => { changeLanguage(lang); setShowLanguageModal(false); }}
                  style={{ 
                    background: lang === language ? '#2a8785' : 'white', 
                    color: lang === language ? 'white' : '#333',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showForgotModal && (
        <div className="premium-modal-overlay" onClick={() => setShowForgotModal(false)} style={{ zIndex: 9999 }}>
          <div className="premium-modal" onClick={e => e.stopPropagation()} style={{ background: '#e4eed7', color: '#333' }}>
            <h2 style={{ color: '#2b4c6a' }}>{t('Forget password?')}</h2>
            
            {forgotSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '15px' }}>
                  Password reset link sent to {forgotEmail}!
                </div>
                <button onClick={() => setShowForgotModal(false)} className="sage-btn-primary" style={{ marginTop: '10px' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#555' }}>
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
                <div className="sage-form-group">
                  <svg className="sage-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input 
                    type="email" 
                    className="sage-input" 
                    placeholder={t('Email address')} 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required 
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowForgotModal(false)} className="sage-btn-social" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="sage-btn-primary" style={{ flex: 1, marginTop: 0 }} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
