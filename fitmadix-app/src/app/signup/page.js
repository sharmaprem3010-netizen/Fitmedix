'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/components/LanguageContext';

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    height: '',
    weight: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          gender: formData.gender,
          height: formData.height,
          weight: formData.weight,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        // After successful registration, redirect to login
        router.push('/login');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  if (status === 'authenticated') {
    router.push('/home');
    return null;
  }

  return (
    <div className="sage-auth-container" style={{ paddingBottom: '40px' }}>
      {/* 3D Doctor Image */}
      <img src="/doctor_3d.png" alt="Doctor" className="sage-doctor-img" />

      <div className="sage-auth-header">
        <h1 className="sage-title">{t('Create Account')}</h1>
        
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

        <p style={{ marginBottom: '20px', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
          Please provide your details for your first entry
        </p>

        <form onSubmit={handleFormSignUp}>
          <div className="sage-form-group">
            <input type="text" name="name" className="sage-input" placeholder={t('Full Name')} value={formData.name} onChange={handleChange} required />
          </div>

          <div className="sage-form-group">
            <input type="email" name="email" className="sage-input" placeholder={t('Email address')} value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="sage-form-group">
            <input type="password" name="password" className="sage-input" placeholder={t('Password')} value={formData.password} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div className="sage-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input type="date" name="dob" className="sage-input" placeholder={t('Date of Birth')} value={formData.dob} onChange={handleChange} required />
            </div>
            <div className="sage-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <select name="gender" className="sage-input" value={formData.gender} onChange={handleChange} required style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-surface)' }}>
                <option value="" disabled>{t('Gender')}</option>
                <option value="male" style={{ color: 'var(--text-primary)' }}>{t('Male')}</option>
                <option value="female" style={{ color: 'var(--text-primary)' }}>{t('Female')}</option>
                <option value="other" style={{ color: 'var(--text-primary)' }}>{t('Other')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div className="sage-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input type="number" name="height" className="sage-input" placeholder={t('Height (cm)')} value={formData.height} onChange={handleChange} required />
            </div>
            <div className="sage-form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input type="number" name="weight" className="sage-input" placeholder={t('Weight (kg)')} value={formData.weight} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" className="sage-btn-primary" disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? t('Creating Account...') : t('Sign Up')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: '#333' }}>
          {t("Already have an account?")} <a href="/login" className="sage-link" style={{ textDecoration: 'underline' }}>{t('Log in')}</a>
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
    </div>
  );
}
