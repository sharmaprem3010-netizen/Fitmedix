'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SmartwatchDashboard from '@/components/SmartwatchDashboard';
import Calendar from '@/components/Calendar';
import GlobalSearch from '@/components/GlobalSearch';
import { useLanguage } from '@/components/LanguageContext';
import { supabase } from '@/utils/supabaseClient';

export default function HomePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'User';
  const { t } = useLanguage();
  
  const [activities, setActivities] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const fetchActivities = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!supabase) {
      const stored = JSON.parse(localStorage.getItem('fitmadix_activities') || '[]');
      setActivities(stored);
      return;
    }

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching activities:", error);
    } else if (data) {
      setActivities(data);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleRemoveActivity = async (id) => {
    if (!supabase) {
      const updated = activities.filter(act => act.id !== id);
      setActivities(updated);
      localStorage.setItem('fitmadix_activities', JSON.stringify(updated));
      return;
    }

    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setActivities(activities.filter(act => act.id !== id));
    }
  };

  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);

  const [greeting, setGreeting] = useState('Welcome');
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening');
  }, []);
  const features = [
    { name: t('Medicine'), icon: '💊', color: 'teal', link: '/medicine' },
    { name: t('Diseases'), icon: '🦠', color: 'red', link: '/diseases' },
    { name: t('AI Guide'), icon: '🤖', color: 'blue', link: '/ai-guide' },
    { name: t('Translator'), icon: '📄', color: 'orange', link: '/report-translator' },
    { name: t('Scan/Search'), icon: '🔍', color: 'purple', link: '/scan' },
    { name: t('Diets'), icon: '🥗', color: 'green', link: '/diets' },
    { name: t('Exercises'), icon: '💪', color: 'pink', link: '/exercises' },
    { name: t('Yoga'), icon: '🧘', color: 'teal', link: '/yoga' },
    { name: t('Consultations'), icon: '🎙️', color: 'blue', link: '/consultations' }
  ];

  return (
    <div className="dashboard-screen" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <GlobalSearch />

      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t(greeting)},</div>
        <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{userName}</div>
      </div>

      {/* Main Banner */}
      <Link href="/daily-checkin" style={{ display: 'block', textDecoration: 'none', marginBottom: '40px', transition: 'transform 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        <div style={{ 
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', 
          borderRadius: '24px', padding: '32px', color: 'white', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 12px 30px rgba(16, 185, 129, 0.3)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: 800 }}>{t('How are You Feeling Today?')}</h3>
            <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>{t('Start your daily health and lifestyle tracking.')}</p>
          </div>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))', zIndex: 2 }}>📝</div>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-50px', right: '-20px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        </div>
      </Link>

      {/* Services Grid (Premium Redesign) */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>{t('Health Services')}</h2>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' 
        }}>
          {features.map((item, idx) => (
            <Link key={idx} href={item.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-light)',
                borderRadius: '20px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.08)';
                e.currentTarget.style.background = 'var(--bg-glass-hover)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.04)';
                e.currentTarget.style.background = 'var(--bg-glass)';
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: `var(--${item.color}-light)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))'
                }}>
                  <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <SmartwatchDashboard />
      <Calendar />
    </div>
  );
}
