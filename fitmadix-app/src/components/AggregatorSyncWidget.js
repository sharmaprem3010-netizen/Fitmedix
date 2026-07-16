'use client';

import React, { useState } from 'react';
import { useBluetooth } from '@/components/BluetoothContext';

export default function AggregatorSyncWidget({ onClose }) {
  const [step, setStep] = useState('select'); // select, auth, syncing, success
  const [selectedProvider, setSelectedProvider] = useState(null);
  const bt = useBluetooth(); // We'll reuse BluetoothContext's updateLocalData to populate the dashboard

  const providers = [
    { id: 'google', name: 'Google Fit', icon: '🏃‍♂️', color: '#4285F4' },
    { id: 'apple', name: 'Apple Health', icon: '❤️', color: '#000000' },
    { id: 'garmin', name: 'Garmin Connect', icon: '⌚', color: '#007CC3' },
    { id: 'fitbit', name: 'Fitbit', icon: '👟', color: '#00B0B9' },
    { id: 'oura', name: 'Oura', icon: '💍', color: '#1B1B1B' },
    { id: 'polar', name: 'Polar', icon: '🏔️', color: '#E31B23' }
  ];

  const handleSelect = (provider) => {
    setSelectedProvider(provider);
    setStep('auth');
  };

  const handleAuth = () => {
    setStep('syncing');
    
    // Simulate API connection and data normalization
    setTimeout(() => {
      // Push mock normalized data to our dashboard context
      bt.updateLocalData({
        steps: Math.floor(Math.random() * 3000) + 5000,
        caloriesActive: Math.floor(Math.random() * 400) + 300,
        distance: (Math.random() * 3 + 4).toFixed(1),
        spo2: Math.floor(Math.random() * 3) + 96,
        sleepHours: Math.floor(Math.random() * 2) + 6,
        sleepMinutes: Math.floor(Math.random() * 60),
        lastSyncDevice: `${selectedProvider.name} (Cloud)`,
        lastSyncTime: new Date().toISOString()
      });
      // Mock HR directly
      bt.quickSync({ heartRate: Math.floor(Math.random() * 15) + 65, battery: 100 });
      
      setStep('success');
    }, 2500);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {step === 'select' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>☁️</div>
            <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>Connect Health Provider</h3>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
              Securely sync data from your wearable&apos;s cloud account.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = p.color}
                onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                <div style={{ fontSize: '1.5rem', background: 'white', padding: '6px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {p.icon}
                </div>
                <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>{p.name}</span>
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', fontWeight: '500' }}>
            Cancel
          </button>
        </div>
      )}

      {step === 'auth' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem' }}>{selectedProvider.icon}</div>
          <div>
            <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>Authorize {selectedProvider.name}</h3>
            <p style={{ margin: '8px 0 0', color: '#6B7280', fontSize: '0.9rem', lineHeight: '1.4' }}>
              You will be securely redirected to log into your {selectedProvider.name} account to grant read access to your health data.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
            <button onClick={() => setStep('select')} style={{ flex: 1, padding: '12px', background: '#F3F4F6', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#374151' }}>
              Back
            </button>
            <button onClick={handleAuth} style={{ flex: 2, padding: '12px', background: selectedProvider.color, border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}>
              Continue
            </button>
          </div>
          
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '10px' }}>
            🔒 Secured by Fitmedx Aggregator
          </div>
        </div>
      )}

      {step === 'syncing' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '30px 0' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #F3F4F6', borderTopColor: selectedProvider.color, borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: 0, color: '#111827', fontSize: '1.1rem' }}>Aggregating Data...</h4>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>Fetching standard schema from {selectedProvider.name}</p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', color: '#10B981', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>✅</div>
          <style>{`@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
          
          <div>
            <h4 style={{ margin: 0, color: '#111827', fontSize: '1.2rem' }}>Successfully Connected</h4>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
              Your {selectedProvider.name} data is now syncing to your dashboard.
            </p>
          </div>
          
          <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#10B981', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', color: 'white', marginTop: '10px' }}>
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
