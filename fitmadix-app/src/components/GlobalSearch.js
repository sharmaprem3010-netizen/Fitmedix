'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function GlobalSearch() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const hasResults = results && (
    (results.medicines && results.medicines.length > 0) ||
    (results.yoga && results.yoga.length > 0) ||
    (results.exercises && results.exercises.length > 0) ||
    (results.diets && results.diets.length > 0)
  );

  return (
    <div className="dash-search" style={{ marginBottom: '32px', position: 'relative' }} ref={searchRef}>
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)', border: '1px solid var(--border-light)',
        borderRadius: '24px', padding: '12px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease'
      }}>
        <span style={{ fontSize: '1.2rem', marginRight: '12px' }}>🔍</span>
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setShowDropdown(true);
          }}
          onFocus={() => { if (query.trim()) setShowDropdown(true); }}
          placeholder={t("Search medicines, diseases...")}
          style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '1.05rem', color: 'var(--text-primary)' }} 
        />
        {loading && <span style={{ fontSize: '0.9rem', color: '#666' }}>{t('Syncing...')}</span>}
      </div>

      {/* Dropdown Results */}
      {showDropdown && query.trim() && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', zIndex: 100,
          background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
          borderRadius: '20px', padding: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
          border: '1px solid var(--border-light)', maxHeight: '400px', overflowY: 'auto'
        }}>
          {!loading && !hasResults && (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              {t('No results matching')} &quot;{query}&quot;
            </div>
          )}

          {results?.medicines?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Medicine')}</h4>
              {results.medicines.map(m => (
                <Link key={m._id} href={`/medicine`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-surface)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{m.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>{t('View')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results?.yoga?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Yoga')}</h4>
              {results.yoga.map(y => (
                <Link key={y._id} href={`/yoga`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-surface)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{y.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>{t('View')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {results?.exercises?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Exercises')}</h4>
              {results.exercises.map(e => (
                <Link key={e._id} href={`/exercises`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-surface)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{e.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>{t('View')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results?.diets?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('Diets')}</h4>
              {results.diets.map(d => (
                <Link key={d._id} href={`/diets`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--bg-surface)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 600, color: '#111827' }}>{d.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px' }}>{t('View')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
