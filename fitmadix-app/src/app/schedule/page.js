'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AppSidebar from '@/components/AppSidebar';

export default function SchedulePage() {
  const { data: session } = useSession();
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [days, setDays] = useState([]);
  const [todayString, setTodayString] = useState('');
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Modal State
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('');
  const [newIcon, setNewIcon] = useState('📅');

  useEffect(() => {
    const today = new Date();
    setSelectedDateObj(today);
    setTodayString(today.toISOString().split('T')[0]);

    const generatedDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        date: d.getDate(),
        weekday: d.toLocaleDateString('en', { weekday: 'short' }),
        fullDate: d,
        formatted: d.toISOString().split('T')[0]
      };
    });
    setDays(generatedDays);
  }, []);

  const formattedSelectedDate = selectedDateObj ? selectedDateObj.toISOString().split('T')[0] : '';

  const fetchSchedules = async (dateStr) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule?date=${dateStr}`);
      const data = await res.json();
      if (data.schedules) {
        setAppointments(data.schedules);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchedules(formattedSelectedDate);
    }, 0);

    return () => clearTimeout(timer);
  }, [formattedSelectedDate]);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newTitle || !newTime || !newType) return;
    
    // 1. Create the new appointment object matching schema
    const newAppointment = {
      _id: Date.now().toString(),
      date: formattedSelectedDate,
      time: newTime,
      title: newTitle,
      type: newType,
      icon: newIcon || '📅'
    };

    // 2. Optimistically update the UI immediately
    setAppointments((prev) => [...prev, newAppointment]);
    
    // 3. Close the modal and reset form state
    setShowAddModal(false);
    setNewTitle('');
    setNewType('');
    
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formattedSelectedDate,
          time: newTime,
          title: newTitle,
          type: newType,
          icon: newIcon || '📅'
        })
      });
      if (res.ok) {
        // Fetch again to ensure sync with real DB _ids if needed
        fetchSchedules(formattedSelectedDate);
      } else {
        throw new Error('Failed to save to database');
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
      // Revert the optimistic update if API call fails
      setAppointments((prev) => prev.filter((a) => a._id !== newAppointment._id));
      alert("Failed to save appointment. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments(appointments.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/schedule/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: formattedSelectedDate })
      });
      if (res.ok) {
        // Refresh
        fetchSchedules(formattedSelectedDate);
      }
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, overflowY: 'auto', background: 'var(--bg-light)' }}>
      <AppSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-light)', minHeight: '100vh', paddingBottom: '40px' }}>
      
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/home" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', borderRadius: '12px', color: '#1A1A2E' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#1A1A2E' }}>Schedule</h2>
        </div>
        
        <div onClick={() => setShowSidebar(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #00B4D8' }}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#00B4D8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {session?.user?.name ? session.user.name.charAt(0) : 'U'}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="calendar-strip">
        {days.map((day) => (
          <div
            key={day.formatted}
            className={`cal-day ${formattedSelectedDate === day.formatted ? 'active' : ''}`}
            onClick={() => setSelectedDateObj(day.fullDate)}
          >
            <div className="cal-weekday">{day.weekday}</div>
            <div className="cal-date">{day.date}</div>
          </div>
        ))}
      </div>

      <div className="sub-body" style={{ padding: '0 20px' }}>
        <div className="section-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-title" style={{ fontWeight: 800, color: '#1A1A2E', fontSize: '1.1rem' }}>
            {formattedSelectedDate === todayString ? "Today's Schedule" : `Schedule for ${selectedDateObj?.getDate()}`}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ background: 'var(--primary-teal)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 180, 216, 0.3)' }}
          >
            + Add
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : appointments.length > 0 ? (
          <div>
            {appointments.map((appt) => (
              <div key={appt._id} className="appointment-card" style={{ position: 'relative' }}>
                <div className="appt-date" style={{ background: 'rgba(0,180,216,0.1)' }}>
                  <div style={{ fontSize: '1.5rem' }}>{appt.icon}</div>
                </div>
                <div className="appt-info">
                  <div className="appt-time">{appt.time}</div>
                  <div className="appt-doctor">{appt.title}</div>
                  <div className="appt-type">{appt.type}</div>
                </div>
                <button 
                  onClick={() => handleDelete(appt._id)}
                  style={{ position: 'absolute', right: '15px', top: '15px', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>No schedule for today</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px', marginBottom: '20px' }}>Add tasks manually or let AI plan a healthy day for you!</p>
            
            <button 
              onClick={handleGenerateAI}
              disabled={generating}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: generating ? '#ccc' : 'linear-gradient(135deg, #7B2FF7 0%, #00B4D8 100%)',
                color: 'white',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {generating ? '✨ Generating...' : '✨ Auto-Generate with AI'}
            </button>
          </div>
        )}

        {appointments.length > 0 && (
          <button 
            onClick={handleGenerateAI}
            disabled={generating}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: generating ? '#ccc' : 'linear-gradient(135deg, #7B2FF7 0%, #00B4D8 100%)',
              color: 'white',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '15px'
            }}
          >
            {generating ? '✨ Generating...' : '✨ Add AI Suggestions'}
          </button>
        )}

        {/* Quick Add Reminders */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Quick Reminders</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Medicine', icon: '💊', time: 'Every 8 hours' },
              { label: 'Checkup', icon: '🩺', time: 'Monthly' },
              { label: 'Exercise', icon: '🏃', time: 'Daily 6 AM' },
              { label: 'Water', icon: '💧', time: 'Every 2 hours' },
            ].map((rem, i) => (
              <div key={i} className="vital-card">
                <div className="vital-icon">{rem.icon}</div>
                <div className="vital-label">{rem.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', fontWeight: 600, marginTop: '4px' }}>{rem.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg-surface)', width: '90%', maxWidth: '400px', borderRadius: '20px', padding: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '20px', fontWeight: 700, fontSize: '1.2rem' }}>Add Schedule Item</h3>
            <form onSubmit={handleAddSchedule}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Time</label>
                <input type="text" value={newTime} onChange={e => setNewTime(e.target.value)} required placeholder="09:00 AM" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Title</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g. Morning Yoga" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Description / Type</label>
                <input type="text" value={newType} onChange={e => setNewType(e.target.value)} required placeholder="e.g. Stretching & Core" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Emoji Icon</label>
                <input type="text" value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="📅" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--bg-surface-2)', color: 'var(--text-primary)', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--primary-teal)', color: 'white', fontWeight: 600 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      </div> {/* End centered wrapper */}
    </div>
  );
}
