'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QAPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch('/api/qa')
      .then(res => res.json())
      .then(data => setItems(data.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>Health Q &amp; A</h2>
      </div>

      <div className="sub-body">
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Loading questions...</p>
          </div>
        )}

        {!loading && items.map((item, idx) => (
          <div key={item._id || idx} className={`qa-item ${openIndex === idx ? 'open' : ''}`}>
            <div className="qa-question" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
              <h4>{item.question}</h4>
              <div className="qa-toggle">+</div>
            </div>
            <div className="qa-answer">
              <div className="qa-answer-content">
                {item.answer}
                {item.category && (
                  <div style={{ marginTop: '10px' }}>
                    <span className="symptom-tag" style={{ background: 'rgba(0,180,216,0.1)', color: 'var(--primary-teal)' }}>
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
