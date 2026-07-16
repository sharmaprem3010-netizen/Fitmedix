'use client';

import React, { useState } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';

export default function AIManagerPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const currentPrompt = prompt;
    setPrompt('');
    
    setLogs(prev => [...prev, { role: 'user', text: currentPrompt }]);
    
    try {
      const res = await fetch('/api/admin/ai-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });
      const data = await res.json();
      
      if (data.success) {
        setLogs(prev => [...prev, { role: 'ai', text: `Success! Added 1 ${data.type} record: ${data.data.name}`, data: data.data }]);
      } else {
        setLogs(prev => [...prev, { role: 'ai', error: true, text: `Error: ${data.error}` }]);
      }
    } catch (e) {
      setLogs(prev => [...prev, { role: 'ai', error: true, text: `Network Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          borderRadius: '24px', padding: '32px', color: 'white',
          boxShadow: '0 12px 30px rgba(79, 70, 229, 0.3)', marginBottom: '32px'
        }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 800 }}>AI Data Manager</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Instruct AI to automatically generate and insert health data (Medicines, Diets, Exercises, Yoga) into the database.</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
          borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)', minHeight: '400px', display: 'flex', flexDirection: 'column'
        }}>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {logs.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9CA3AF', margin: 'auto' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤖</div>
                <p>Try saying: &quot;Add Paracetamol 500mg as a medicine&quot;</p>
                <p>Or: &quot;Create a 3-day Keto Diet for beginners&quot;</p>
              </div>
            )}
            
            {logs.map((log, i) => (
              <div key={i} style={{
                alignSelf: log.role === 'user' ? 'flex-end' : 'flex-start',
                background: log.role === 'user' ? '#4F46E5' : log.error ? '#FEE2E2' : '#F3F4F6',
                color: log.role === 'user' ? 'white' : log.error ? '#DC2626' : '#1F2937',
                padding: '12px 16px', borderRadius: '16px', maxWidth: '80%',
                borderBottomRightRadius: log.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: log.role === 'ai' ? '4px' : '16px'
              }}>
                <div style={{ fontWeight: 600, marginBottom: log.data ? '8px' : '0' }}>{log.text}</div>
                {log.data && (
                  <pre style={{ margin: 0, background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', overflowX: 'auto' }}>
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#F3F4F6', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', color: '#6B7280' }}>
                AI is processing and inserting to database...
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="E.g. Add a medicine called Ibuprofen"
              style={{
                flex: 1, padding: '16px 20px', borderRadius: '20px',
                border: '1px solid #E5E7EB', outline: 'none', fontSize: '1rem',
                background: 'rgba(255,255,255,0.8)'
              }}
              disabled={loading}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                background: '#4F46E5', color: 'white', border: 'none',
                borderRadius: '20px', padding: '0 24px', fontWeight: 600,
                cursor: (loading || !prompt.trim()) ? 'not-allowed' : 'pointer',
                opacity: (loading || !prompt.trim()) ? 0.5 : 1
              }}
            >
              Generate
            </button>
          </div>
          
        </div>
      </div>
    </ResponsiveLayout>
  );
}
