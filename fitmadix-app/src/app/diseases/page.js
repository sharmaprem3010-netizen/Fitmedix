'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetch('/api/diseases')
      .then(res => res.json())
      .then(data => setDiseases(data.diseases || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>Diseases & Conditions</h2>
      </div>

      <div className="sub-body">
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Loading diseases...</p>
          </div>
        )}

        {!loading && diseases.map((disease, idx) => (
          <div key={disease._id || idx} className="disease-card" onClick={() => setExpandedId(expandedId === idx ? null : idx)}>
            <div className="disease-header">
              <div className="disease-icon" style={{ background: disease.iconBg || 'rgba(230,57,70,0.1)' }}>
                {disease.icon || '🦠'}
              </div>
              <div>
                <div className="disease-name">{disease.name}</div>
                <div className="disease-category">{disease.category}</div>
              </div>
            </div>

            <div className="disease-symptoms">
              {disease.symptoms && disease.symptoms.slice(0, 3).map((s, i) => (
                <span key={i} className="symptom-tag">{s}</span>
              ))}
              {disease.symptoms && disease.symptoms.length > 3 && (
                <span className="symptom-tag" style={{ background: 'rgba(0,180,216,0.1)', color: 'var(--primary-teal)' }}>
                  +{disease.symptoms.length - 3} more
                </span>
              )}
            </div>

            {expandedId === idx && (
              <div className="disease-detail-view">
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-teal)' }}>
                  All Symptoms
                </h4>
                <div className="disease-symptoms" style={{ marginBottom: '14px' }}>
                  {disease.symptoms && disease.symptoms.map((s, i) => (
                    <span key={i} className="symptom-tag">{s}</span>
                  ))}
                </div>

                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-green)' }}>
                  Treatment & Management
                </h4>
                <ol className="disease-steps">
                  {disease.cure && disease.cure.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                {disease.prevention && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(45,198,83,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--accent-green)' }}>🛡️ Prevention:</strong> {disease.prevention}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
