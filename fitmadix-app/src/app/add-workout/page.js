'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function AddWorkout() {
  const router = useRouter();
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newActivity = {
      type: 'Workout',
      icon: '🏋️',
      title: workoutType,
      desc: `${duration} mins`,
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
      alert('Error saving workout: ' + error.message);
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
          style={{ background: 'white', border: '1px solid #E5E9F2', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Add Workout 🏋️</h1>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Workout Type</label>
            <select 
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #ECFDF5', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            >
              <option value="" disabled>Select workout type...</option>
              <option value="Running">Running 🏃</option>
              <option value="Weightlifting">Weightlifting 🏋️</option>
              <option value="Yoga">Yoga 🧘</option>
              <option value="Cycling">Cycling 🚴</option>
              <option value="Swimming">Swimming 🏊</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Duration (minutes)</label>
            <input 
              type="number" 
              placeholder="e.g. 45" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #ECFDF5', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', background: '#047857', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 8px 16px rgba(4, 120, 87, 0.2)' }}
          >
            Save Workout
          </button>
        </form>
      </div>
    </div>
  );
}
