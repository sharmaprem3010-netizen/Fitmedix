'use client';

import { useState, useEffect } from 'react';
import NotificationBell from '@/components/NotificationBell';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

export default function YogaPage() {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/yoga')
      .then(res => res.json())
      .then(data => setPoses(data.poses || []))
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
        <h2>Yoga Poses</h2>
      </div>

      <div className="sub-body">
        <SearchBar />
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Loading yoga poses...</p>
          </div>
        )}

        {!loading && poses.map((pose, idx) => (
          <div key={pose._id || idx} className="exercise-card">
            <div className="exercise-thumb" style={{ background: pose.bg || 'rgba(0,180,216,0.1)' }}>
              {pose.emoji || '🧘'}
            </div>
            <div className="exercise-info">
              <div className="exercise-name">{pose.name}</div>
              <div className="exercise-meta">
                {pose.subtitle && <>{pose.subtitle} · </>}
                {pose.duration || '3 min'}
              </div>
            </div>
            <span className={`exercise-diff ${pose.difficulty}`}>
              {pose.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
