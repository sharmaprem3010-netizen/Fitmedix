'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import SearchBar from '@/components/SearchBar';

export default function DietsPage() {
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/diets')
      .then(res => res.json())
      .then(data => setDiets(data.diets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <NotificationBell />
        <h2>Diet Plans</h2>
      </div>

      <div className="sub-body"><SearchBar />
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Loading diet plans...</p>
          </div>
        )}

        {!loading && diets.map((diet, idx) => (
          <div key={diet._id || idx} className="diet-card">
            <div className="diet-banner" style={{ background: diet.gradient || 'linear-gradient(135deg, #E8F5E9, #C8E6C9)' }}>
              {diet.emoji || '🥗'}
            </div>
            <div className="diet-body">
              <div className="diet-name">{diet.name}</div>
              <div className="diet-desc">{diet.desc}</div>

              <div className="diet-meals">
                {diet.meals && Object.entries(diet.meals).map(([time, item]) => (
                  <div key={time} className="diet-meal">
                    <div className="meal-time">{time}</div>
                    <div className="meal-item">{item}</div>
                  </div>
                ))}
              </div>

              {diet.calories && (
                <div className="diet-calories">
                  🔥 {diet.calories}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
