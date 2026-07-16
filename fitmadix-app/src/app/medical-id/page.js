'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function MedicalID() {
  const router = useRouter();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#FEF2F2', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'var(--bg-surface)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)' }}
        >
          <span style={{ color: '#DC2626', fontWeight: 'bold' }}>←</span>
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🚨</span> Medical ID
        </h1>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(220, 38, 38, 0.1)', border: '2px solid #FEE2E2' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #FEE2E2', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.3rem' }}>Jane Doe</h2>
            <div style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '0.9rem' }}>ORGAN DONOR</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold' }}>BLOOD TYPE</div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>O+</div>
          </div>
          <div>
            <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold' }}>AGE / WEIGHT</div>
            <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>28 / 145 lbs</div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>MEDICAL CONDITIONS</div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-primary)', fontWeight: '500' }}>
            <li>Asthma</li>
            <li>Type 1 Diabetes</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>ALLERGIES & REACTIONS</div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#DC2626', fontWeight: 'bold' }}>
            <li>Penicillin - Severe Anaphylaxis</li>
            <li>Peanuts - Mild Hives</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>CURRENT MEDICATIONS</div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-primary)', fontWeight: '500' }}>
            <li>Insulin Glargine (20 units daily)</li>
            <li>Albuterol Inhaler (as needed)</li>
          </ul>
        </div>

        <div style={{ borderTop: '1px solid #FEE2E2', paddingTop: '20px' }}>
          <div style={{ color: '#999', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>EMERGENCY CONTACTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="tel:+15551234567" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none' }}>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>John Doe</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>Husband</div>
              </div>
              <div style={{ color: '#10B981', fontSize: '1.5rem' }}>📞</div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
