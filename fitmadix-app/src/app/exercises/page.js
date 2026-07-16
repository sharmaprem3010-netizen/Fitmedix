'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';
import SearchBar from '@/components/SearchBar';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'chest', 'arms', 'legs', 'core', 'back'];

  useEffect(() => {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(data => setExercises(data.exercises || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? exercises
    : exercises.filter(e => e.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <NotificationBell />
        <h2>Exercises</h2>
      </div>

      <div className="sub-body">
        <SearchBar />
        <div className="exercise-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Loading exercises...</p>
          </div>
        )}

        {!loading && filtered.map((ex, idx) => (
          <div key={ex._id || idx} className="exercise-card">
            <div className="exercise-thumb" style={{ background: ex.bg || 'rgba(0,180,216,0.1)' }}>
              {ex.emoji || '💪'}
            </div>
            <div className="exercise-info">
              <div className="exercise-name">{ex.name}</div>
              <div className="exercise-meta">{ex.sets} · {ex.category}</div>
            </div>
            <span className={`exercise-diff ${ex.difficulty}`}>
              {ex.difficulty}
            </span>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏋️</div>
            <p>No exercises in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
