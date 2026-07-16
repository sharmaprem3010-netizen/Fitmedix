'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HealthRecordsPage() {
  const [records, setRecords] = useState([
    { type: 'Blood Pressure', value: '120/80 mmHg', date: 'Today', icon: '❤️', status: 'normal' },
    { type: 'Blood Sugar', value: '98 mg/dL', date: 'Today', icon: '🩸', status: 'normal' },
    { type: 'Weight', value: '70 kg', date: 'Yesterday', icon: '⚖️', status: 'normal' },
    { type: 'Heart Rate', value: '72 bpm', date: 'Yesterday', icon: '💓', status: 'normal' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('Blood Pressure');
  const [formValue, setFormValue] = useState('');
  
  const [medicalReports, setMedicalReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const fetchMedicalReports = async () => {
    try {
      const response = await fetch('/api/medical-reports');
      if (response.ok) {
        const data = await response.json();
        setMedicalReports(data);
      }
    } catch (error) {
      console.error('Failed to load medical reports:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchMedicalReports();
  }, []);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;
    setRecords([{ type: formType, value: formValue, date: 'Just now', icon: '📝', status: 'normal' }, ...records]);
    setFormValue('');
    setShowForm(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h2>Health Records</h2>
      </div>

      <div className="sub-body">
        {/* Vitals Overview */}
        <div className="vitals-grid" style={{ marginBottom: '20px' }}>
          <div className="vital-card">
            <div className="vital-icon">❤️</div>
            <div className="vital-label">Blood Pressure</div>
            <div className="vital-value">120/80</div>
            <div className="vital-status normal">Normal</div>
          </div>
          <div className="vital-card">
            <div className="vital-icon">🩸</div>
            <div className="vital-label">Blood Sugar</div>
            <div className="vital-value">98</div>
            <div className="vital-status normal">Normal</div>
          </div>
          <div className="vital-card">
            <div className="vital-icon">⚖️</div>
            <div className="vital-label">Weight</div>
            <div className="vital-value">70 kg</div>
            <div className="vital-status normal">Healthy</div>
          </div>
          <div className="vital-card">
            <div className="vital-icon">💓</div>
            <div className="vital-label">Heart Rate</div>
            <div className="vital-value">72</div>
            <div className="vital-status normal">Normal</div>
          </div>
        </div>

        {/* Add Record Button */}
        <button className="btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add New Record'}
        </button>

        {/* Quick Add Form */}
        {showForm && (
          <div className="record-form">
            <h3>Log a New Record</h3>
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label>Record Type</label>
                <select className="form-input" value={formType} onChange={(e) => setFormType(e.target.value)}>
                  <option>Blood Pressure</option>
                  <option>Blood Sugar</option>
                  <option>Weight</option>
                  <option>Heart Rate</option>
                  <option>Temperature</option>
                  <option>SpO2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Value</label>
                <input type="text" className="form-input" placeholder="e.g. 120/80 mmHg" value={formValue} onChange={(e) => setFormValue(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">Save Record</button>
            </form>
          </div>
        )}

        {/* Records List */}
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
          Recent Records
        </h3>
        {records.map((rec, idx) => (
          <div key={idx} className="record-item">
            <div className="record-item-icon">{rec.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="record-item-title">{rec.type}</div>
              <div className="record-item-date">{rec.date}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary-teal)' }}>
              {rec.value}
            </div>
          </div>
        ))}

        {/* Uploaded Documents List */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
            Uploaded Medical Reports
          </h3>
          <Link href="/report-translator" style={{ fontSize: '0.8rem', color: 'var(--primary-teal)', fontWeight: 600 }}>
            + Upload New
          </Link>
        </div>
        
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isLoadingReports ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading reports...</p>
          ) : medicalReports.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No medical reports uploaded yet.</p>
          ) : (
            medicalReports.map((report) => (
              <div key={report._id} style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Thumbnail / Link */}
                  <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {report.fileUrl.endsWith('.pdf') ? (
                      <span style={{ fontSize: '24px' }}>📄</span>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={report.fileUrl} alt="Report Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </a>
                  
                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      AI Report Analysis
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {new Date(report.createdAt).toLocaleDateString()} • {report.biomarkers.length} biomarkers detected
                    </div>
                    
                    {report.summary && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: '#f8f9fa', padding: '8px', borderRadius: '6px', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        &quot;{report.summary}&quot;
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Bottom spacer */}
        <div style={{ height: '40px' }}></div>
      </div>
    </div>
  );
}
