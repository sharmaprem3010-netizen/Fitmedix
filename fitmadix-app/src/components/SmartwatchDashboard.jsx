'use client';

import React, { useState, useMemo } from 'react';
import { useBluetooth } from '@/components/BluetoothContext';
import { signIn, useSession } from 'next-auth/react';
import { useLanguage } from '@/components/LanguageContext';

export default function SmartwatchDashboard() {
  const bt = useBluetooth();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const { localData, heartRate, heartRateHistory, batteryLevel, isConnected, updateLocalData } = bt;

  const hrSparkPath = useMemo(() => {
    if (heartRateHistory.length < 2) return null;
    const recent = heartRateHistory.slice(-30);
    const minHR = Math.min(...recent.map(r => r.value));
    const maxHR = Math.max(...recent.map(r => r.value));
    const range = maxHR - minHR || 1;
    const points = recent.map((r, i) => {
      const x = (i / (recent.length - 1)) * 100;
      const y = 45 - ((r.value - minHR) / range) * 40;
      return `${x},${y}`;
    });
    return `M${points.join(' L')}`;
  }, [heartRateHistory]);

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editField && editValue !== '') {
      const num = parseFloat(editValue);
      if (!isNaN(num)) {
        updateLocalData({ [editField]: num });
      }
    }
    setEditField(null);
    setEditValue('');
  };

  const syncGoogleFit = async () => {
    setSyncingGoogle(true);
    try {
      const res = await fetch('/api/health-metrics');
      const data = await res.json();
      if (data.success && data.data) {
        const metrics = data.data.metrics;
        updateLocalData({
          steps: metrics.totalSteps || 0,
          caloriesActive: metrics.caloriesActive || 0,
          lastSyncTime: new Date().toISOString()
        });
        if (metrics.avgHeartRate) {
          updateLocalData({ restingHR: metrics.avgHeartRate });
        }
        setDataSource(data.data.primarySource);
      } else {
        alert(data.error || 'No data found in connected sources');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to sync with Google Fit');
    }
    setSyncingGoogle(false);
  };

  const cardStyle = {
    background: 'var(--bg-surface-soft)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-light)',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  };

  const badgeStyle = (bg, color) => ({
    fontSize: '0.65rem',
    fontWeight: 700,
    color: color,
    background: bg,
    padding: '4px 8px',
    borderRadius: '8px',
    display: 'inline-block',
  });

  const titleStyle = {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    marginBottom: '10px',
  };

  const editableBadge = (field, value, unit, bg, color) => (
    <span
      onClick={() => handleEdit(field, value)}
      style={{ ...badgeStyle(bg, color), cursor: 'pointer', borderBottom: '1px dashed ' + color }}
      title="Click to edit"
    >
      {value}{unit}
    </span>
  );

  const progressBar = (percent, color) => (
    <div style={{ width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', height: '6px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ width: `${Math.min(percent, 100)}%`, background: color, height: '100%', borderRadius: '20px', transition: 'width 0.6s ease' }} />
    </div>
  );

  const editModal = editField && (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100001, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }} onClick={() => setEditField(null)}>
      <div style={{ background: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', width: '280px', boxShadow: 'var(--shadow-overlay)', border: '1px solid var(--border-light)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Update {editField.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
        </div>
        <input
          type="number"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          autoFocus
          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '1rem', marginBottom: '12px', outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
          onKeyDown={e => e.key === 'Enter' && saveEdit()}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setEditField(null)} style={{ flex: 1, padding: '10px', background: 'var(--bg-surface-2)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={saveEdit} style={{ flex: 1, padding: '10px', background: 'var(--primary-teal, #10B981)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, color: 'white' }}>Save</button>
        </div>
      </div>
    </div>
  );

  const stepsPercent = localData.stepsGoal > 0 ? (localData.steps / localData.stepsGoal) * 100 : 0;
  const activeMinPercent = localData.activeMinutesGoal > 0 ? (localData.activeMinutes / localData.activeMinutesGoal) * 100 : 0;
  const calPercent = localData.caloriesTotal > 0 ? (localData.caloriesActive / localData.caloriesTotal) * 100 : 0;

  const displayHR = heartRate ?? localData.restingHR ?? '—';
  const displaySleep = localData.sleepHours > 0 ? `${localData.sleepHours}h ${localData.sleepMinutes}m` : '—';

  const insights = useMemo(() => {
    const items = [];

    if (localData.sleepHours > 0 && localData.sleepHours < 6) {
      items.push({
        tone: 'warning',
        icon: '🌙',
        title: 'Sleep is low',
        message: 'Try to get to bed 30 minutes earlier tonight and keep screens away before sleep.',
      });
    }

    if (localData.steps < 4000) {
      items.push({
        tone: 'info',
        icon: '🚶',
        title: 'Move a little more',
        message: 'A 10-minute walk or a short stretch break can help you close the gap.',
      });
    }

    if (batteryLevel !== null && batteryLevel < 20) {
      items.push({
        tone: 'danger',
        icon: '🔋',
        title: 'Watch battery is low',
        message: 'Charge your watch soon so your health tracking stays uninterrupted.',
      });
    }

    if (heartRate !== null && heartRate > 110) {
      items.push({
        tone: 'warning',
        icon: '❤️',
        title: 'Heart rate looks elevated',
        message: 'Slow down, breathe steadily, and drink some water if you have been active.',
      });
    }

    if (items.length === 0) {
      items.push({
        tone: 'good',
        icon: '✅',
        title: 'You are on track',
        message: 'Your current health data looks steady. Keep your routine going and check back later.',
      });
    }

    return items.slice(0, 3);
  }, [batteryLevel, heartRate, localData.sleepHours, localData.steps]);

  return (
    <div style={{ marginTop: '24px', paddingBottom: '30px' }}>
      {editModal}

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(255,255,255,0.4)', padding: '16px 24px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.6)' }}>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>🔄</span> {t('Unified Health Sync')}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
            {session ? (
              <span style={{ color: '#059669' }}>✅ {t('Signed in as')} {session.user?.email}</span>
            ) : (
              <span>{t('Not connected to any cloud service')}</span>
            )}
            {dataSource && (
              <span style={{ marginLeft: '12px', background: '#E0E7FF', padding: '4px 8px', borderRadius: '12px', color: '#4338CA', fontSize: '0.75rem', fontWeight: 700 }}>
                Data from: {dataSource === 'apple_health' ? '🍎 Apple Health' : dataSource === 'health_connect' ? '🤖 Health Connect' : dataSource === 'google_fit' ? '☁️ Google Fit' : 'None'}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!session ? (
            <button 
              onClick={() => signIn('google')}
              style={{ padding: '8px 16px', background: '#4285F4', color: 'white', border: 'none', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
              {t('Connect Google Fit')}
            </button>
          ) : (
            <button 
              onClick={syncGoogleFit}
              disabled={syncingGoogle}
              style={{ padding: '8px 16px', background: syncingGoogle ? '#ccc' : '#10B981', color: 'white', border: 'none', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, cursor: syncingGoogle ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
            >
              {syncingGoogle ? t('Syncing...') : t('Fetch Latest Data')}
            </button>
          )}
          <span
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6', cursor: 'pointer', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '16px' }}
          >
            {expanded ? t('Collapse') : t('See All')}
          </span>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))' }}>
        <div style={titleStyle}>💡 Smart Insights</div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {insights.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              style={{
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(255,255,255,0.7)',
                borderLeft: `4px solid ${item.tone === 'danger' ? '#EF4444' : item.tone === 'warning' ? '#F59E0B' : '#10B981'}`,
                borderRadius: '14px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.message}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: expanded ? '20px' : '0' }}>
        {/* Steps */}
        <div style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={labelStyle}>{t('Steps')}</div>
          <div style={{ ...valueStyle, cursor: 'pointer' }} onClick={() => handleEdit('steps', localData.steps)}>
            {localData.steps.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>/ {localData.stepsGoal.toLocaleString()}</div>
          {progressBar(stepsPercent, 'linear-gradient(90deg, #10B981, #34D399)')}
        </div>

        {/* Heart Rate */}
        <div style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={labelStyle}>{isConnected ? '❤️ ' + t('Live HR') : t('Heart Rate')}</div>
          <div style={{ ...valueStyle, color: '#EF4444' }}>
            {displayHR} {displayHR !== '—' && <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>bpm</span>}
          </div>
          {isConnected && heartRate && (
            <div style={{ marginTop: '8px' }}><span style={badgeStyle('#ECFDF5', '#10B981')}>{t('Live')}</span></div>
          )}
          {!isConnected && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>{t('Connect watch for live data')}</div>
          )}
        </div>

        {/* Sleep */}
        <div style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={labelStyle}>{t('Sleep')}</div>
          <div style={{ ...valueStyle, cursor: 'pointer' }} onClick={() => handleEdit('sleepHours', localData.sleepHours)}>{displaySleep}</div>
          {localData.sleepScore > 0 && (
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              <span style={badgeStyle('#EEF2FF', '#6366F1')}>{t('Score')} {localData.sleepScore}</span>
            </div>
          )}
        </div>

        {/* Calories */}
        <div style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={labelStyle}>{t('Calories')}</div>
          <div style={{ ...valueStyle, cursor: 'pointer', color: '#F97316' }} onClick={() => handleEdit('caloriesActive', localData.caloriesActive)}>
            {localData.caloriesActive || '—'} <span style={{ fontSize: '0.8rem' }}>kcal</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
            {t('active')}{localData.caloriesTotal > 0 ? ` / ${localData.caloriesTotal}` : ''}
          </div>
          {calPercent > 0 && progressBar(calPercent, 'linear-gradient(90deg, #F97316, #FDBA74)')}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', animation: 'fadeIn 0.3s ease' }}>

          {/* Vitals Card */}
          <div style={cardStyle}>
            <div style={titleStyle}>❤️ Vitals</div>

            {/* HR Graph — real data if available */}
            <div style={{ height: '50px', width: '100%', marginBottom: '10px', background: '#FEF2F2', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
              {hrSparkPath ? (
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 50" fill="none" stroke="#EF4444" strokeWidth="1.5">
                  <path d={hrSparkPath} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.65rem', color: '#EF4444' }}>
                  {isConnected ? 'Waiting for HR data...' : 'Connect watch to see HR graph'}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: 'var(--bg-surface-2)', padding: '8px', borderRadius: '10px' }}>
                <div style={labelStyle}>Resting HR</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {localData.restingHR ?? '—'} <span style={{ fontSize: '0.55rem' }}>bpm</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', padding: '8px', borderRadius: '10px' }}>
                <div style={labelStyle}>Peak HR</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {localData.peakHR ?? '—'} <span style={{ fontSize: '0.55rem' }}>bpm</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', padding: '8px', borderRadius: '10px' }}>
                <div style={labelStyle}>SpO2</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3B82F6', cursor: 'pointer' }} onClick={() => handleEdit('spo2', localData.spo2 || 0)}>
                  {localData.spo2 ? `${localData.spo2}%` : '—'}
                </div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', padding: '8px', borderRadius: '10px' }}>
                <div style={labelStyle}>HRV</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => handleEdit('hrv', localData.hrv || 0)}>
                    {localData.hrv ? `${localData.hrv}ms` : '—'}
                  </span>
                </div>
              </div>
            </div>
            {batteryLevel !== null && (
              <div style={{ background: '#F0FDF4', color: '#10B981', fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', padding: '6px', borderRadius: '8px', marginTop: '8px' }}>
                🔋 Watch Battery: {batteryLevel}%
              </div>
            )}
          </div>

          {/* Sleep Details Card */}
          <div style={cardStyle}>
            <div style={titleStyle}>🌙 Sleep Details</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', width: '55px', height: '55px', flexShrink: 0 }}>
                <svg width="55" height="55" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeDasharray={`${localData.sleepScore || 0} 100`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => handleEdit('sleepScore', localData.sleepScore)}>
                    {localData.sleepScore || '—'}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => handleEdit('sleepHours', localData.sleepHours)}>
                  {displaySleep}
                </div>
                {localData.sleepScore >= 80 && <span style={badgeStyle('#EEF2FF', '#6366F1')}>Excellent</span>}
                {localData.sleepScore >= 60 && localData.sleepScore < 80 && <span style={badgeStyle('#FEF9C3', '#CA8A04')}>Good</span>}
                {localData.sleepScore > 0 && localData.sleepScore < 60 && <span style={badgeStyle('#FEE2E2', '#EF4444')}>Poor</span>}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.6rem', color: '#FB923C' }}>Awake</span>
                <span style={{ fontSize: '0.6rem', color: '#A78BFA' }}>REM</span>
                <span style={{ fontSize: '0.6rem', color: '#93C5FD' }}>Light</span>
                <span style={{ fontSize: '0.6rem', color: '#4F46E5' }}>Deep</span>
              </div>
              <div style={{ display: 'flex', height: '6px', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ width: `${localData.sleepStages.awake}%`, background: '#FB923C' }} />
                <div style={{ width: `${localData.sleepStages.rem}%`, background: '#A78BFA' }} />
                <div style={{ width: `${localData.sleepStages.light}%`, background: '#93C5FD' }} />
                <div style={{ width: `${localData.sleepStages.deep}%`, background: '#4F46E5' }} />
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div style={cardStyle}>
            <div style={titleStyle}>👟 Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Active Minutes</span>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => handleEdit('activeMinutes', localData.activeMinutes)}>
                    {localData.activeMinutes} / {localData.activeMinutesGoal}
                  </span>
                </div>
                {progressBar(activeMinPercent, 'var(--accent-green)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Distance</span>
                  <span style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => handleEdit('distance', localData.distance)}>
                    {localData.distance} km
                  </span>
                </div>
                {progressBar(Math.min((localData.distance / 10) * 100, 100), 'var(--primary-dark)')}
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Stand Hours</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {localData.standHours.filter(h => h).length} / 12
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '2px', height: '10px' }}>
                  {localData.standHours.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        const updated = [...localData.standHours];
                        updated[i] = updated[i] ? 0 : 1;
                        updateLocalData({ standHours: updated });
                      }}
                      style={{ flex: 1, borderRadius: '2px', background: s ? 'var(--primary-teal)' : 'var(--border-light)', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Workout Card */}
          <div style={cardStyle}>
            <div style={titleStyle}>🏃 Latest Workout</div>
            {localData.workouts.length > 0 ? (
              <div style={{ background: 'var(--bg-surface-2)', borderRadius: '10px', padding: '10px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{localData.workouts[0].name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{localData.workouts[0].date}</div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-surface-2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏋️</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>No workouts logged yet</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Use &quot;Add Workout&quot; from the + menu</div>
              </div>
            )}
          </div>

        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
