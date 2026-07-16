'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-light)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center', 
      padding: '40px 20px' 
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🩺</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: 1.6, marginBottom: '30px' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/home" className="btn-primary" style={{ display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>
        ← Back to Home
      </Link>
    </div>
  );
}
