'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function LogMedication() {
  const router = useRouter();
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newActivity = {
      type: 'Medication',
      icon: '💊',
      title: medName,
      desc: dosage,
    };
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      alert("⚠️ Supabase not configured! Please add your keys to .env.local to save to the cloud. Falling back to local storage.");
      const existing = JSON.parse(localStorage.getItem('fitmadix_activities') || '[]');
      localStorage.setItem('fitmadix_activities', JSON.stringify([{ id: Date.now().toString(), time: Date.now(), ...newActivity }, ...existing]));
      router.push('/home');
      return;
    }

    // Save to Supabase
    const { error } = await supabase
      .from('activities')
      .insert([newActivity]);
      
    if (error) {
      console.error(error);
      alert('Error saving medication: ' + error.message);
      setIsSubmitting(false);
    } else {
      router.push('/home');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Log Medication 💊</h1>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Medication Name</label>
            <input 
              type="text" 
              placeholder="e.g. Vitamin D3" 
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #FFF7ED', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Dosage</label>
            <input 
              type="text" 
              placeholder="e.g. 1 Pill (50mg)" 
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #FFF7ED', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            />
          </div>
          
          <div style={{ background: '#FFF7ED', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⏰</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#C2410C' }}>Set a Reminder?</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Get notified next time you need to take this.</div>
            </div>
            <input type="checkbox" style={{ marginLeft: 'auto', width: '20px', height: '20px' }} />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', background: '#C2410C', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 8px 16px rgba(194, 65, 12, 0.2)' }}
          >
            Log Medication
          </button>
        </form>
      </div>
    </div>
  );
}
