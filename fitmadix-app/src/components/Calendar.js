'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import Link from 'next/link';

export default function Calendar() {
  const { t } = useLanguage();
  const [streakData, setStreakData] = useState({ streak: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/daily-checkin/streak');
        const data = await res.json();
        if (data.history) {
          setStreakData(data);
        }
      } catch (e) {
        console.error('Failed to fetch streak', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStreak();
  }, []);

  // Generate calendar days for the current week
  const today = new Date();
  const weekDays = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Check if logged in history
    const log = streakData.history.find(h => h.date === dateStr);
    
    weekDays.push({
      date: d,
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      isToday: i === 0,
      hasLogged: !!log,
      energy: log?.energy || null
    });
  }

  const getEnergyColor = (energy) => {
    switch(energy) {
      case 'Exhausted': return '#EF4444'; // Red
      case 'Low': return '#F59E0B'; // Orange
      case 'Okay': return '#3B82F6'; // Blue
      case 'Good': return '#10B981'; // Green
      case 'High': return '#059669'; // Dark Green
      default: return '#E5E7EB'; // Gray
    }
  };

  if (loading) return null; // Or a skeleton

  return (
    <div style={{ marginTop: '24px', background: 'var(--bg-surface-soft)', padding: '24px', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔥</span> {t('My Streak')}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {streakData.streak} {t('Days in a row!')}
          </div>
        </div>
        <Link href="/daily-checkin" style={{ padding: '8px 16px', background: '#10B981', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          {t('Check-in Today')}
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {weekDays.map((day, idx) => (
          <div key={idx} style={{ 
            flex: 1, minWidth: '45px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            background: day.isToday ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            padding: '12px 8px', borderRadius: '16px',
            border: day.isToday ? '2px solid #10B981' : '2px solid transparent'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF' }}>{t(day.dayName)}</span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: day.hasLogged ? getEnergyColor(day.energy) : 'var(--bg-surface-2)',
              color: day.hasLogged ? 'white' : 'var(--text-secondary)',
              fontWeight: 800, fontSize: '0.9rem',
              boxShadow: day.hasLogged ? `0 4px 10px ${getEnergyColor(day.energy)}66` : 'none'
            }}>
              {day.dayNum}
            </div>
            {day.hasLogged && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getEnergyColor(day.energy) }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
