'use client';

import Link from 'next/link';

export default function ComingSoonPage({ title, icon, description, backLink = '/home' }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href={backLink} className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>{title}</h2>
      </div>

      <div className="sub-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'pulse 2s ease-in-out infinite' }}>{icon}</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>Coming Soon</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.6 }}>{description}</p>
        <Link href={backLink} className="btn-primary" style={{ marginTop: '30px', display: 'inline-block', padding: '12px 32px', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
