'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ConsultationsPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      const data = await res.json();
      if (data.consultations) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
    }
  };

  const startRecording = async () => {
    if (!consentGiven) {
      alert("Please check the consent box before recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // 1. Transcribe
      const formData = new FormData();
      // Whisper usually prefers a known extension for the file format.
      formData.append('audio', audioBlob, 'consultation.webm');

      const recordRes = await fetch('/api/consultations/record', {
        method: 'POST',
        body: formData,
      });
      const recordData = await recordRes.json();
      
      if (recordData.error) {
        throw new Error(recordData.error);
      }

      const transcript = recordData.transcript;

      // 2. Summarize
      const summarizeRes = await fetch('/api/consultations/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language: 'en' }), // User can select language later
      });
      
      const summarizeData = await summarizeRes.json();
      
      if (summarizeData.error) {
        throw new Error(summarizeData.error);
      }

      // Refresh list
      await fetchConsultations();
      alert('Consultation recorded and summarized successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to process the consultation: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-screen" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Link href="/home" style={{ textDecoration: 'none', color: 'var(--text-secondary)', marginRight: '16px', fontSize: '1.5rem' }}>
          ←
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Consultation Replay</h1>
      </div>

      {/* Recording Section */}
      <div style={{ background: 'var(--bg-glass)', padding: '24px', borderRadius: '20px', marginBottom: '32px', border: '1px solid var(--border-light)' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Record New Consultation</h2>
        
        <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={consentGiven} 
              onChange={(e) => setConsentGiven(e.target.checked)}
              style={{ marginTop: '4px' }}
            />
            <span>
              <strong>Consent Notice:</strong> This will record audio for your personal health record. 
              Please inform your doctor before recording. In compliance with the DPDP Act 2023, the raw audio will be automatically deleted after 30 days. Your data is encrypted and secure.
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              disabled={isProcessing}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px',
                fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1
              }}
            >
              {isProcessing ? 'Processing...' : '🎙️ Start Recording'}
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              style={{
                background: 'var(--bg-elevated)',
                color: '#ef4444', border: '2px solid #ef4444', padding: '12px 24px', borderRadius: '12px',
                fontWeight: 'bold', cursor: 'pointer', animation: 'pulse 1.5s infinite'
              }}
            >
              ⏹️ Stop Recording
            </button>
          )}
          
          {isRecording && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Recording...</span>}
          {isProcessing && <span style={{ color: 'var(--text-secondary)' }}>Transcribing and summarizing with AI...</span>}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', marginBottom: '32px', color: '#dc2626', fontSize: '0.9rem' }}>
        ⚠️ <strong>Disclaimer:</strong> This is an AI-generated summary and is not a medical diagnosis. Always verify with your doctor or healthcare provider.
      </div>

      {/* Timeline Section */}
      <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Past Consultations</h2>
      
      {consultations.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No past consultations found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {consultations.map((consult) => {
            const isExpanded = expandedId === consult._id;
            const date = new Date(consult.date).toLocaleDateString();
            
            return (
              <div key={consult._id} style={{ 
                background: 'var(--bg-glass)', borderRadius: '16px', border: '1px solid var(--border-light)', overflow: 'hidden'
              }}>
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : consult._id)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Consultation on {date}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {consult.summary?.diagnosis?.join(', ') || 'General Checkup'}
                    </p>
                  </div>
                  <div style={{ fontSize: '1.2rem' }}>{isExpanded ? '▲' : '▼'}</div>
                </div>

                {isExpanded && consult.summary && (
                  <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-body)' }}>
                    {/* Diagnosis */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>🩺 Diagnosis</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                        {consult.summary.diagnosis?.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                    
                    {/* Medications */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>💊 Medications</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                        {consult.summary.medications?.map((m, i) => (
                          <li key={i}><strong>{m.name}</strong> - {m.dosage} ({m.frequency})</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tests */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>🧪 Recommended Tests</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                        {consult.summary.tests?.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>

                    {/* Lifestyle */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>🥗 Lifestyle Advice</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                        {consult.summary.lifestyleAdvice?.map((l, i) => <li key={i}>{l}</li>)}
                      </ul>
                    </div>

                    {/* Next Appointment */}
                    <div>
                      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>📅 Next Appointment</h4>
                      <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{consult.summary.nextAppointment}</p>
                    </div>

                    {/* Share Button Placeholder */}
                    <div style={{ marginTop: '24px' }}>
                       <button onClick={(e) => { e.stopPropagation(); alert('Share functionality coming soon!'); }} style={{
                         background: 'var(--blue-light, #e0f2fe)', color: '#0284c7', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                       }}>
                         🔗 Share Summary
                       </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
