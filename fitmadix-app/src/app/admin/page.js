'use client';

import Link from 'next/link';

export default function AdminPage() {
  const sections = [
    { name: 'Medicines', count: 8, icon: '💊', link: '/admin/medicines' },
    { name: 'Diseases', count: 6, icon: '🦠', link: '/admin/diseases' },
    { name: 'Diets', count: 5, icon: '🥗', link: '/admin/diets' },
    { name: 'Exercises', count: 15, icon: '💪', link: '/admin/exercises' },
    { name: 'Yoga Poses', count: 8, icon: '🧘', link: '/admin/yoga' },
    { name: 'Q & A', count: 7, icon: '❓', link: '/admin/qa' }
  ];

  return (
    <div className="admin-layout">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link href="/home" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>Exit Admin</Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-body">
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="stat-number">2,450</div>
            <div className="stat-name">Total Users</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-number">12</div>
            <div className="stat-name">Active Modules</div>
          </div>
        </div>

        {/* Content Modules */}
        <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>Manage Content</h2>
        <div className="services-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '24px' }}>
          {sections.map((sec, idx) => (
            <Link key={idx} href={sec.link} className="service-item" style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '12px', gap: '12px' }}>
              <div className="service-icon" style={{ width: '40px', height: '40px', background: 'rgba(0,180,216,0.1)' }}>{sec.icon}</div>
              <div style={{ textAlign: 'left' }}>
                <div className="service-label" style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{sec.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sec.count} items</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Toggles */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>Feature Toggles</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Turn homepage modules on or off</p>
          
          {[
            { id: 'ai', name: 'AI Guide Chatbot', desc: 'Allow users to chat with the AI assistant' },
            { id: 'translate', name: 'Report Translator', desc: 'Scan and translate medical reports' },
            { id: 'store', name: 'Records Storage', desc: 'Allow users to upload prescriptions' }
          ].map(feature => (
            <div key={feature.id} className="feature-toggle-row">
              <div>
                <div className="feature-toggle-label">{feature.name}</div>
                <div className="feature-toggle-desc">{feature.desc}</div>
              </div>
              <div className="toggle-switch active"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
