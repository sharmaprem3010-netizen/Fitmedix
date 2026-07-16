'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ReportTranslatorPage() {
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biomarkers, setBiomarkers] = useState([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset state
    setError(null);
    setIsLoading(true);
    setShowResult(false);

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result;
        const mimeType = file.type;

        // Send to API
        const response = await fetch('/api/translate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType })
        });

        const data = await response.json();

        if (response.ok) {
          setBiomarkers(data.biomarkers || []);
          setSummary(data.summary || 'No summary available.');
          setShowResult(true);
        } else {
          setError(data.error || 'Failed to process report');
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
    } catch (err) {
      setError(err.message || 'An error occurred during translation.');
    } finally {
      // Small delay to ensure state updates before hiding loader
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>Report Translator</h2>
      </div>

      <div className="sub-body">
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {!showResult && !isLoading ? (
          <>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />

            {/* Upload Area */}
            <div className="upload-area" onClick={triggerUpload}>
              <div className="upload-icon">📸</div>
              <h3>Upload Medical Report</h3>
              <p>Take a photo or upload an image of your blood test, X-ray, or lab report</p>
            </div>

            {/* Info Cards */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
                How It Works
              </h3>
              <div className="folder-grid">
                <div className="folder-card">
                  <div className="folder-icon">📸</div>
                  <div className="folder-name">Scan</div>
                  <div className="folder-count">Take a photo of your report</div>
                </div>
                <div className="folder-card">
                  <div className="folder-icon">🤖</div>
                  <div className="folder-name">Translate</div>
                  <div className="folder-count">AI converts to simple language</div>
                </div>
              </div>
            </div>
          </>
        ) : isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div className="splash-loader" style={{ justifyContent: 'center', marginBottom: '16px' }}><span></span><span></span><span></span></div>
            <p>Analyzing your report using Gemini AI...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>This may take a few seconds.</p>
          </div>
        ) : (
          <>
            {/* Translated Report */}
            <div className="translated-report">
              <h4>✅ Report Analysis</h4>
              {biomarkers.length > 0 ? biomarkers.map((line, idx) => (
                <div key={idx} className="report-line">
                  <span className="report-label">{line.label}</span>
                  <span className={`report-value ${line.status}`}>{line.value}</span>
                </div>
              )) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No specific biomarkers could be extracted.</p>
              )}
            </div>

            {/* Summary */}
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                📋 Simple Summary
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {summary}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px', fontStyle: 'italic', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                ⚠️ This is an AI-generated summary using Gemini. Always consult your doctor for medical advice.
              </p>
            </div>

            <button className="btn-secondary" style={{ marginTop: '24px' }} onClick={() => {
              setShowResult(false);
              setBiomarkers([]);
              setSummary('');
            }}>
              ← Upload Another Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
