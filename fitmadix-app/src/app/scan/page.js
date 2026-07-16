'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ScanPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      
      const formattedResults = [];
      
      if (data.medicines) {
        data.medicines.forEach(m => formattedResults.push({ name: m.name, type: 'Medicine', icon: '💊' }));
      }
      if (data.diseases) {
        data.diseases.forEach(d => formattedResults.push({ name: d.name, type: 'Disease', icon: d.icon || '🤧' }));
      }
      if (data.diets) {
        data.diets.forEach(d => formattedResults.push({ name: d.name, type: 'Diet Plan', icon: d.emoji || '🥗' }));
      }
      if (data.yoga) {
        data.yoga.forEach(y => formattedResults.push({ name: y.name, type: 'Yoga', icon: '🧘‍♀️' }));
      }
      if (data.exercises) {
        data.exercises.forEach(e => formattedResults.push({ name: e.name, type: 'Exercise', icon: '💪' }));
      }
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>Scan &amp; Search</h2>
      </div>

      <div className="sub-body">
        {/* Scanner Preview */}
        <div className="scan-preview">
          <div className="scan-frame"></div>
          <div className="scan-icon">📷</div>
        </div>

        {/* Action Buttons */}
        <div className="scan-actions">
          <button className="scan-btn">
            <div className="scan-btn-icon">📸</div>
            Scan Barcode
          </button>
          <button className="scan-btn">
            <div className="scan-btn-icon">📋</div>
            Scan Prescription
          </button>
        </div>

        {/* Text Search */}
        <div className="search-container" style={{ marginBottom: '20px' }}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search medicines, diseases, diets..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value.length > 2) handleSearch(); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Search Results */}
        {results && results.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
              Search Results
            </h3>
            {results.map((r, idx) => (
              <div key={idx} className="record-item">
                <div className="record-item-icon">{r.icon}</div>
                <div>
                  <div className="record-item-title">{r.name}</div>
                  <div className="record-item-date">{r.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            <p>No results found for &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
