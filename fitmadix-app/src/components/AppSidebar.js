'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AppSidebar({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          backdropFilter: 'blur(3px)'
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          zIndex: 10000,
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease forwards'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>Menu</h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}>✕</button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
          <Link href="/home" onClick={onClose} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>🏠 Home Dashboard</Link>
          <Link href="/user-info" onClick={onClose} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>👤 Patient Profile</Link>
          <Link href="/daily-checkin" onClick={onClose} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>📝 Daily Check-in</Link>
          <Link href="/schedule" onClick={onClose} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>📅 Schedule</Link>
          <Link href="/scan" onClick={onClose} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>🔍 Disease Scan</Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Log Out
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
}
