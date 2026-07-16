'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function AIGuidePage() {
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: 'Hello! I am your AI Health Guide. I can help you understand symptoms, provide general health advice, and answer medical questions.\n\n*Note: I am an AI, not a doctor. Always consult a healthcare professional for medical emergencies.*' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Network error. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (text) => {
    setInput(text);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      {/* Header */}
      <div className="sub-header">
        <Link href="/home" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div>
          <h2>AI Health Guide</h2>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }}></span> Online
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="sub-body">
        <div className="chat-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-avatar">
                {msg.role === 'bot' ? '🤖' : '👤'}
              </div>
              <div className="chat-bubble" style={msg.role === 'bot' ? { background: 'var(--bg-surface)', border: '1px solid var(--border-light)' } : {}}>
                {msg.role === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble chat-typing" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chat-input-bar" style={{ flexDirection: 'column', padding: '12px 20px', bottom: 0 }}>
        {messages.length === 1 && (
          <div className="chat-chips">
            <button className="chat-chip" onClick={() => handleChipClick('What are the symptoms of COVID-19?')}>COVID-19 Symptoms</button>
            <button className="chat-chip" onClick={() => handleChipClick('How to manage a mild fever at home?')}>Fever Management</button>
            <button className="chat-chip" onClick={() => handleChipClick('What is a healthy diet for high blood pressure?')}>BP Diet Plan</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <input 
            type="text" 
            placeholder="Type your health question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button className="chat-send" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
