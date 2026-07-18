'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import NotificationBell from '@/components/NotificationBell';
import { useLanguage } from '@/components/LanguageContext';
import { useBluetooth } from '@/components/BluetoothContext';

function QuickSyncForm({ bt, onDone }) {
  const [formData, setFormData] = useState({
    heartRate: bt.heartRate || '',
    battery: bt.batteryLevel || '',
    steps: bt.localData.steps || '',
    calories: bt.localData.caloriesActive || '',
    spo2: bt.localData.spo2 || '',
    sleepHours: bt.localData.sleepHours || '',
    sleepMinutes: bt.localData.sleepMinutes || '',
    distance: bt.localData.distance || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    bt.quickSync(formData);
    onDone();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Quick Sync</h4>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Enter the current readings from your watch screen.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Heart Rate (bpm)</label>
          <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Battery (%)</label>
          <input type="number" name="battery" value={formData.battery} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Steps</label>
          <input type="number" name="steps" value={formData.steps} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Calories</label>
          <input type="number" name="calories" value={formData.calories} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>SpO2 (%)</label>
          <input type="number" name="spo2" value={formData.spo2} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Distance (km)</label>
          <input type="number" name="distance" step="0.1" value={formData.distance} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sleep Hours</label>
          <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Sleep Mins</label>
          <input type="number" name="sleepMinutes" value={formData.sleepMinutes} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => bt.setShowQuickSync(false)} style={{ flex: 1, padding: '10px', background: 'var(--bg-surface-2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            Cancel
          </button>
          <button type="submit" style={{ flex: 1, padding: '10px', background: '#10B981', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
            Save Data
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResponsiveLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { language, changeLanguage, t, supportedLanguages } = useLanguage();
  
  const [showLang, setShowLang] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProCard, setShowProCard] = useState(true);

  // New Features States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showStreakPopover, setShowStreakPopover] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Use shared Bluetooth context
  const bt = useBluetooth();
  const isSyncing = bt?.connectionState === 'scanning';
  const syncStatus = bt?.isConnected ? 'Watch Synced' : 'Device Sync';
  const logoStyle = {
    height: '55px',
    objectFit: 'contain',
    borderRadius: '12px'
  };

  const handleSyncClick = () => {
    setShowSyncModal(true);
  };

  const isSplash = pathname === '/';
  const isAuth = ['/login', '/onboarding'].includes(pathname);

  if (isSplash) {
    return <>{children}</>;
  }

  if (isAuth) {
    return (
      <div className="auth-wrapper sage-bg" style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div className="sage-card">
          {children}
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';
  const userAvatar = session?.user?.image || 'https://i.pravatar.cc/150?img=5';

  const navItems = [
    { href: '/home', icon: '🏠', label: t('Home Dashboard') },
    { href: '/user-info', icon: '👤', label: t('Patient Profile') },
    { href: '/daily-checkin', icon: '📝', label: t('Daily Check-in') },
    { href: '/schedule', icon: '📅', label: t('Schedule') },
    { href: '/ai-guide', icon: '🤖', label: t('AI Guide') },
    { href: '/medicine', icon: '💊', label: t('Medicine') },
    { href: '/diseases', icon: '🦠', label: t('Diseases') },
    { href: '/diets', icon: '🥗', label: t('Diets') },
    { href: '/exercises', icon: '🏃', label: t('Exercises') },
    { href: '/yoga', icon: '🧘', label: t('Yoga') },
    { href: '/scan', icon: '🔍', label: t('Disease Scan') },
    { href: '/health-records', icon: '📁', label: t('Health Records') },
  ];

  return (
    <div className="clinik-dashboard">
      {/* Backdrop for sidebar drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 10000,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Desktop Sidebar (hidden by default now) */}
      <aside className={`clinik-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="clinik-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', padding: '0 20px' }}>
          <div style={{ 
            background: 'var(--bg-surface)', 
            padding: '12px 20px', 
            borderRadius: '20px', 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-overlay)'
          }}>
            <img src="/logo.jpeg" alt="Fitmadix Logo" className="site-logo" style={logoStyle} />
          </div>
        </div>
        
        <nav className="clinik-nav" style={{ overflowY: 'auto' }}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`clinik-nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon} {item.label}
            </Link>
          ))}

          {!showProCard && (
            <Link 
              href="/pro" 
              className={`clinik-nav-item ${pathname === '/pro' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFD700', fontWeight: 'bold' }}
            >
              💎 Upgrade to PRO
            </Link>
          )}
        </nav>

        {showProCard && (
          <div className="clinik-pro-card" style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowProCard(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ×
            </button>
            <h4>Upgrade to PRO</h4>
            <p>Improve your health journey and start doing more with Fitmadix PRO!</p>
            <button>UPDATE TO PRO</button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="clinik-main">
        {/* Top Header */}
        <header className="clinik-header">
          <div className="clinik-header-title">
            <div 
              className="clinik-hamburger mobile-only"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer', 
                marginRight: '15px',
                background: 'var(--bg-surface)',
                padding: '8px 16px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <img src="/logo.jpeg" alt="Fitmadix Logo" className="site-logo" style={logoStyle} />
            </div>
            {pathname !== '/' && pathname !== '/home' && (
              <button
                onClick={() => router.back()}
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  marginRight: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                title="Go Back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h2 className="header-page-title" style={{ display: 'none' }}>
              {navItems.find(i => i.href === pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="clinik-header-actions" style={{ gap: '16px' }}>
            
            {/* Quick Action Button */}
            <button onClick={() => setShowAddModal(true)} className="clinik-hide-mobile" style={{ 
              background: '#1DA1F2', color: 'white', border: 'none', padding: '6px 14px', 
              borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 10px rgba(29, 161, 242, 0.3)' 
            }}>
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Add
            </button>

            {/* SOS Emergency Button */}
            <button onClick={() => setShowSOSModal(true)} className="clinik-hide-mobile" style={{ 
              background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 12px', 
              borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '6px' 
            }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>🚨</span> SOS
            </button>

            {/* Cloud Sync Status */}
            <div onClick={handleSyncClick} className="clinik-hide-mobile" title="Sync from Mobile Bridge" style={{ 
              color: '#3B82F6', display: 'flex', alignItems: 'center', cursor: 'pointer',
              background: '#EFF6FF', padding: '6px', borderRadius: '50%', border: '1px solid #BFDBFE'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isSyncing ? 0.5 : 1 }}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
            </div>

            <div className="clinik-hide-mobile" style={{ width: '1px', height: '24px', background: '#E5E9F2', margin: '0 4px' }}></div>

            {/* Gamification Streak */}
            <div onClick={() => setShowStreakPopover(!showStreakPopover)} className="clinik-hide-mobile" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', color: '#FF7A00', fontSize: '1rem', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span> 3
              
              {showStreakPopover && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', width: '200px', background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', boxShadow: 'var(--shadow-overlay)', zIndex: 100, color: 'var(--text-primary)', fontWeight: 'normal', fontSize: '0.9rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔥</div>
                  <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}>3 Day Streak!</strong>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>Log in tomorrow to keep your fitness flame burning bright!</p>
                </div>
              )}
            </div>

            <div className="clinik-hide-mobile" style={{ width: '1px', height: '24px', background: '#E5E9F2', margin: '0 4px' }}></div>

            {/* Language Selector */}
            <div className="clinik-hide-mobile" style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowLang(!showLang)}
                style={{ 
                  background: 'var(--bg-glass)', 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '20px', 
                  padding: '6px 14px', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🌐</span> {language.substring(0,2).toUpperCase()}
                <svg 
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showLang ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '2px' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {showLang && (
                <div style={{ 
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0, 
                  background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '8px', 
                  borderRadius: '12px', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
                  width: '130px', display: 'flex', flexDirection: 'column', gap: '4px' 
                }}>
                  {supportedLanguages.map(lang => (
                    <div 
                      key={lang} 
                      onClick={() => { changeLanguage(lang); setShowLang(false); }}
                      style={{ 
                        cursor: 'pointer', 
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: lang === language ? '#F4F7FC' : 'transparent',
                        color: lang === language ? '#7DD3FC' : 'var(--text-secondary)', 
                        fontWeight: lang === language ? 'bold' : '500',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s'
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <NotificationBell />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></div>
            </div>

            {/* User Profile Dropdown */}
            <div className="clinik-user-drop" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', padding: '4px 10px 4px 4px', borderRadius: '24px' }} onClick={() => setShowProfile(!showProfile)}>
              <img src={userAvatar} alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
              <div className="clinik-hide-mobile" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)', fontWeight: 600 }}>
                {userName}
                <svg 
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '6px' }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {showProfile && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '220px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '15px', borderRadius: '12px', zIndex: 10, color: 'var(--text-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{userName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px', wordBreak: 'break-all' }}>{userEmail}</div>
                  <button onClick={() => signOut({ callbackUrl: '/' })} style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="clinik-content-scrollable">
          {children}
        </div>

      </main>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <Link href="/home" className={`nav-item ${pathname === '/home' ? 'active' : ''}`}>
          <span>🏠</span>
          <span>Home Dashboard</span>
        </Link>
        <Link href="/schedule" className={`nav-item ${pathname === '/schedule' ? 'active' : ''}`}>
          <span>📅</span>
          <span>Schedule</span>
        </Link>
        <Link href="/health-records" className={`nav-item ${pathname === '/health-records' ? 'active' : ''}`}>
          <span>📋</span>
          <span>Health Records</span>
        </Link>
        <Link href="/qa" className={`nav-item ${pathname === '/qa' ? 'active' : ''}`}>
          <span>❓</span>
          <span>Q&amp;A</span>
        </Link>
      </div>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'var(--shadow-overlay)', border: '1px solid var(--border-light)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>Quick Add</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>&times;</button>
            </div>
            <button onClick={() => { setShowAddModal(false); router.push('/log-meal'); }} style={{ padding: '14px', background: 'var(--bg-surface-2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ fontSize: '1.4rem' }}>🍽️</span> Log Meal
            </button>
            <button onClick={() => { setShowAddModal(false); router.push('/add-workout'); }} style={{ padding: '14px', background: 'var(--bg-surface-2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ fontSize: '1.4rem' }}>🏋️</span> Add Workout
            </button>
            <button onClick={() => { setShowAddModal(false); router.push('/log-medication'); }} style={{ padding: '14px', background: 'var(--bg-surface-2)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem', textAlign: 'left', transition: 'background 0.2s' }}>
              <span style={{ fontSize: '1.4rem' }}>💊</span> Log Medication
            </button>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {showSOSModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(220, 38, 38, 0.4)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }} onClick={() => setShowSOSModal(false)}>
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '16px', border: '3px solid #DC2626', boxShadow: 'var(--shadow-overlay)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', fontWeight: 900 }}><span>🚨</span> EMERGENCY</h3>
              <button onClick={() => setShowSOSModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>&times;</button>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>Do you need immediate medical assistance? This will alert emergency services.</p>
            <a href="tel:112" onClick={() => setShowSOSModal(false)} style={{ padding: '14px', background: '#DC2626', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white', fontSize: '1.1rem', marginTop: '8px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              Call Ambulance (112)
            </a>
            <button onClick={() => { setShowSOSModal(false); router.push('/medical-id'); }} style={{ padding: '14px', background: 'var(--bg-surface-2)', border: '2px solid #DC2626', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#FCA5A5', fontSize: '1.1rem', width: '100%' }}>
              View Medical ID
            </button>
          </div>
        </div>
      )}

      {/* Cloud Sync Modal */}
      {showSyncModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }} onClick={() => setShowSyncModal(false)}>
          <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '350px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--shadow-overlay)', border: '1px solid var(--border-light)' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3B82F6' }}>☁️</span> Cloud Sync
              </h3>
              <button onClick={() => setShowSyncModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>&times;</button>
            </div>

            {bt.connectionState === 'idle' && (
              <>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Pull your latest health data directly from your Mobile Bridge app.
                </p>
                <button onClick={bt.syncFromBridge} style={{ padding: '14px', background: '#3B82F6', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                  Fetch Mobile Bridge Data
                </button>
              </>
            )}

            {bt.connectionState === 'syncing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #EFF6FF', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 'bold' }}>Syncing with Cloud...</p>
              </div>
            )}

            {bt.connectionState === 'connected' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', color: '#10B981', marginBottom: '4px' }}>✅</div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Sync Complete</h4>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Dashboard is up to date.</p>
                </div>
                <button onClick={() => setShowSyncModal(false)} style={{ width: '100%', padding: '10px', background: '#10B981', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white', fontSize: '0.9rem', marginTop: '10px' }}>
                  View Dashboard
                </button>
              </div>
            )}

            {bt.connectionState === 'error' && !bt.showQuickSync && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '10px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#F87171' }}>⚠️</div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>Sync Failed</h4>
                <p style={{ margin: 0, color: '#FCA5A5', fontSize: '0.85rem' }}>{bt.errorMessage}</p>
                <button onClick={() => bt.setShowQuickSync(true)} style={{ marginTop: '12px', padding: '10px', background: 'linear-gradient(135deg, #00B4D8, #0077B6)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', color: 'white', width: '100%' }}>
                  📝 Manual Data Entry (Quick Sync)
                </button>
              </div>
            )}
            
            {bt.connectionState === 'error' && bt.showQuickSync && (
              <QuickSyncForm bt={bt} onDone={() => setShowSyncModal(false)} />
            )}

          </div>
        </div>
      )}
    </div>
  );
}
