'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import { useLanguage } from '@/components/LanguageContext';

export default function MedicinePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const res = await fetch('/api/medicines');
        const data = await res.json();
        setMedicines(data.medicines || []);
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, []);

  const filteredMeds = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.generic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || med.tags?.some(tag => tag.text === activeCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Painkillers', 'Antibiotics', 'Diabetes', 'Heart'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light, #F4F7FC)', padding: '24px', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/home" style={{ 
            background: 'var(--bg-surface)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)', color: 'var(--text-primary)', textDecoration: 'none'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>{t('Medicine Database')}</h2>
        </div>
        <NotificationBell />
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder={t("Search medicines...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '16px 16px 16px 48px', borderRadius: '20px', border: '1px solid #E5E7EB',
              fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(0,0,0,0.04)', outline: 'none', color: '#111827'
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px', borderRadius: '24px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                border: activeCategory === cat ? 'none' : '1px solid #E5E7EB',
                background: activeCategory === cat ? '#00B4D8' : 'white',
                color: activeCategory === cat ? 'white' : '#4B5563',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(0, 180, 216, 0.3)' : '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s'
              }}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '12px', height: '12px', background: '#00B4D8', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
              <span style={{ width: '12px', height: '12px', background: '#00B4D8', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
              <span style={{ width: '12px', height: '12px', background: '#00B4D8', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
            </div>
            <p style={{ fontWeight: 600 }}>{t('Loading medicines...')}</p>
          </div>
        )}

        {/* List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredMeds.map((med, idx) => (
              <div key={med._id || idx} style={{
                background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>{med.name}</h3>
                  <div style={{ color: '#00B4D8', fontSize: '0.9rem', fontWeight: 600 }}>{med.generic}</div>
                </div>
                
                <div style={{ display: 'grid', gap: '8px', color: '#4B5563', fontSize: '0.95rem' }}>
                  <div>
                    <strong style={{ color: '#111827' }}>{t('Usage')}:</strong> {t(med.usage)}
                  </div>
                  <div>
                    <strong style={{ color: '#111827' }}>{t('Dosage')}:</strong> {t(med.dosage)}
                  </div>
                  {med.sideEffects && (
                    <div>
                      <strong style={{ color: '#111827' }}>{t('Side Effects')}:</strong> {t(med.sideEffects)}
                    </div>
                  )}
                  {med.dangerous && (
                    <div style={{ background: '#FEF2F2', padding: '12px', borderRadius: '12px', marginTop: '4px', borderLeft: '4px solid #EF4444' }}>
                      <strong style={{ color: '#EF4444' }}>⚠️ {t('Warning')}:</strong> <span style={{ color: '#991B1B' }}>{t(med.dangerous)}</span>
                    </div>
                  )}
                </div>
                
                {med.tags && med.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {med.tags.map((tag, tidx) => (
                      <span key={tidx} style={{
                        background: tag.type === 'prescription' ? '#FEE2E2' : '#E0E7FF',
                        color: tag.type === 'prescription' ? '#DC2626' : '#4F46E5',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
                      }}>
                        {t(tag.text)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredMeds.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: '24px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ margin: 0, color: '#111827', marginBottom: '8px' }}>{t('No medicines found')}</h3>
                <p style={{ margin: 0 }}>{t('No results matching')} &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
