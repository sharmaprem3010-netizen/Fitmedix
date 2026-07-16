'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';

export default function DailyCheckinPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

  const userName = session?.user?.name || t('Guest User');
  const userInitial = userName.charAt(0).toUpperCase();

  const [step, setStep] = useState(1);
  const [showSheet, setShowSheet] = useState(true);
  
  // State for selections
  const [energy, setEnergy] = useState('Okay');
  const [symptoms, setSymptoms] = useState([]);
  const [lifestyleTab, setLifestyleTab] = useState('Sleep');
  const [sleepQuality, setSleepQuality] = useState('');
  
  // State for Insights
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const symptomsList = [
    { id: 'cramps', label: 'Cramps', icon: '🔥' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'bloating', label: 'Bloating', icon: '🎈' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'back_pain', label: 'Back Pain', icon: '🦴' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' }
  ];
  
  const sleepOptions = [
    { id: 'poor', label: 'Poor', desc: 'Trouble falling/staying asleep', emoji: '🥱' },
    { id: 'fair', label: 'Fair', desc: 'Some nights are better than others', emoji: '😴' },
    { id: 'good', label: 'Good', desc: 'Consistently restful sleep', emoji: '😌' },
    { id: 'excellent', label: 'Excellent', desc: 'Woke up completely refreshed', emoji: '🤩' }
  ];

  const toggleSymptom = (id) => {
    if (symptoms.includes(id)) {
      setSymptoms(symptoms.filter(s => s !== id));
    } else {
      setSymptoms([...symptoms, id]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else saveAndFinish();
  };

  const saveAndFinish = async () => {
    setStep(4);
    setLoadingInsight(true);
    
    const payload = {
      date: new Date().toISOString().split('T')[0],
      energyLevel: energy,
      mood: 'Okay',
      symptoms,
      lifestyle: { sleep: sleepQuality, stress: '', exercise: '' }
    };

    try {
      await fetch('/api/daily-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const res = await fetch('/api/daily-checkin/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.insight) {
        setInsight(data.insight);
      } else {
        setInsight(`<p>${t('Unable to generate insight at this time.')}</p>`);
      }

    } catch (e) {
      console.error('Error finishing check-in:', e);
      setInsight(`<p>${t('There was an error saving your check-in. Please try again later.')}</p>`);
    }
    
    setLoadingInsight(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light, #F4F7FC)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '480px', height: '85vh', minHeight: '600px', background: 'var(--bg-surface)', borderRadius: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Header Background */}
        <div style={{ background: 'linear-gradient(135deg, #10B981, #047857)', color: 'white', padding: '30px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {session?.user?.image ? <img src={session.user.image} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : userInitial}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{userName}</p>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{t(new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening')}</span>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => router.push('/scan')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}>🔍</button>
              <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: 'white', cursor: 'pointer', fontSize: '1.1rem' }}>🔔</button>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{t('How are You Feeling Today?')}</h1>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#F9FAFB', position: 'relative' }}>
          
          <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
            <div style={{ fontWeight: 800, color: '#111827', marginBottom: '16px' }}>{t("Today's Log")}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: symptoms.length ? '16px' : '0' }}>
              <div style={{ fontSize: '1.5rem', background: '#ECFDF5', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>🔋</div>
              <div style={{ flex: 1, fontWeight: 600, color: '#4B5563' }}>{t('Energy')}</div>
              <div style={{ fontWeight: 700, color: '#10B981' }}>{t(energy)}</div>
            </div>
            {symptoms.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '1.5rem', background: '#FFF7ED', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>🤕</div>
                <div style={{ flex: 1, fontWeight: 600, color: '#4B5563' }}>{t('Symptoms')}</div>
                <div style={{ fontWeight: 700, color: '#F59E0B' }}>{symptoms.length} {t('selected')}</div>
              </div>
            )}
          </div>

          {/* Form Wizard */}
          <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#E5E7EB', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${(Math.min(step, 3) / 3) * 100}%`, background: '#10B981', height: '100%', transition: 'width 0.3s ease' }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', marginLeft: '16px' }}>{step > 3 ? t('Done') : `${step}/3`}</span>
            </div>

            {step === 1 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{t('Energy Level')}</h2>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '32px' }}>{t('Swipe or tap to select')}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                  {['Exhausted', 'Low', 'Okay', 'Good', 'High'].map((lvl) => (
                    <div 
                      key={lvl} 
                      onClick={() => setEnergy(lvl)}
                      style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        transform: energy === lvl ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s',
                        filter: energy === lvl ? 'grayscale(0)' : 'grayscale(1)', opacity: energy === lvl ? 1 : 0.5
                      }}
                    >
                      <div style={{ fontSize: '2rem' }}>
                        {lvl === 'Exhausted' ? '😴' : lvl === 'Low' ? '😡' : lvl === 'Okay' ? '😐' : lvl === 'Good' ? '🙂' : '🤩'}
                      </div>
                      {energy === lvl && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981' }}>{t(lvl)}</span>}
                    </div>
                  ))}
                </div>
                
                <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
                  {t('Next')} →
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{t('Any Symptoms Today?')}</h2>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>{t('Tap to add')}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                  {symptomsList.map(sym => (
                    <div 
                      key={sym.id} 
                      onClick={() => toggleSymptom(sym.id)}
                      style={{ 
                        padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                        border: symptoms.includes(sym.id) ? '2px solid #10B981' : '2px solid #E5E7EB',
                        background: symptoms.includes(sym.id) ? '#ECFDF5' : 'transparent',
                        color: symptoms.includes(sym.id) ? '#047857' : '#4B5563', transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{sym.icon}</span> {t(sym.label)}
                    </div>
                  ))}
                </div>
                
                <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
                  {t('Next')} →
                </button>
                <div onClick={handleNext} style={{ textAlign: 'center', marginTop: '16px', color: '#6B7280', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>{t('No symptoms today')}</div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{t('About Your Lifestyle')}</h2>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '24px' }}>{t('Helps us understand your patterns')}</p>
                
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
                  {['Sleep', 'Stress', 'Exercise'].map(tab => (
                    <div key={tab} onClick={() => setLifestyleTab(tab)} style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', background: lifestyleTab === tab ? 'var(--bg-surface-2)' : 'transparent', color: lifestyleTab === tab ? '#10B981' : 'var(--text-secondary)', boxShadow: lifestyleTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                      {t(tab)}
                    </div>
                  ))}
                </div>
                
                {lifestyleTab === 'Sleep' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {sleepOptions.map(opt => (
                      <div 
                        key={opt.id} 
                        onClick={() => setSleepQuality(opt.label)}
                        style={{ 
                          padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
                          border: sleepQuality === opt.label ? '2px solid #10B981' : '2px solid #E5E7EB',
                          background: sleepQuality === opt.label ? '#ECFDF5' : 'transparent', transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '1.8rem' }}>{opt.emoji}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: sleepQuality === opt.label ? '#047857' : '#111827', fontSize: '1rem' }}>{t(opt.label)}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>{t(opt.desc)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(lifestyleTab === 'Stress' || lifestyleTab === 'Exercise') && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontWeight: 600 }}>
                    {t('Options coming soon!')}
                  </div>
                )}
                
                <button onClick={handleNext} style={{ width: '100%', padding: '16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
                  {t('Finish')} →
                </button>
              </div>
            )}

            {step === 4 && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: '0 0 24px' }}>{t('Your Daily Insights')}</h2>
                
                {loadingInsight ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                      <span style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                      <span style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                    </div>
                    <p style={{ fontWeight: 600 }}>{t('Analyzing your check-in...')}</p>
                  </div>
                ) : (
                  <div style={{ background: '#F3F4F6', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', color: '#374151', lineHeight: '1.6', fontSize: '0.95rem' }}
                  dangerouslySetInnerHTML={{ __html: insight || '' }} 
                  />
                )}

                <button 
                  onClick={() => router.push('/home')} 
                  style={{ width: '100%', padding: '16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)', marginTop: '32px', opacity: loadingInsight ? 0.5 : 1 }}
                  disabled={loadingInsight}
                >
                  {t('Return Home')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
