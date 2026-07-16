'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function LogMeal() {
  const router = useRouter();
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newActivity = {
      type: 'Meal',
      icon: '🍽️',
      title: mealName,
      desc: `${calories} kcal`,
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
      alert('Error saving meal: ' + error.message);
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
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Log Meal 🍽️</h1>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>What did you eat?</label>
            <input 
              type="text" 
              placeholder="e.g. Grilled Chicken Salad" 
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #F0F9FF', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Estimated Calories (kcal)</label>
            <input 
              type="number" 
              placeholder="e.g. 450" 
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #F0F9FF', background: '#F9FAFB', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" style={{ flex: 1, padding: '10px', background: '#F4F7FC', border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#555', cursor: 'pointer' }}>📸 Scan Food</button>
            <button type="button" style={{ flex: 1, padding: '10px', background: '#F4F7FC', border: 'none', borderRadius: '10px', fontWeight: 'bold', color: '#555', cursor: 'pointer' }}>🔍 Search DB</button>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '16px', background: '#0369A1', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 8px 16px rgba(3, 105, 161, 0.2)' }}
          >
            Save Meal
          </button>
        </form>
      </div>
    </div>
  );
}
