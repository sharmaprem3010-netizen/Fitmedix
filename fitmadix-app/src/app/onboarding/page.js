'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Your Personal Doctor",
      desc: "Get instant access to medical information, disease symptoms, and health guides right from your pocket.",
      icon: "👨‍⚕️",
      color: "rgba(0,180,216,0.1)",
      borderColor: "rgba(0,180,216,0.5)"
    },
    {
      title: "AI Health Assistant",
      desc: "Chat with our smart AI to translate medical reports, track health records, and get personalized advice.",
      icon: "🤖",
      color: "rgba(45,198,83,0.1)",
      borderColor: "rgba(45,198,83,0.5)"
    }
  ];

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push('/home');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    router.push('/home');
  };

  const slide = slides[currentSlide];

  return (
    <div className="onboarding-screen">
      <button className="onboarding-skip" onClick={handleSkip}>Skip</button>

      <div className="onboarding-slide" key={currentSlide}>
        <div 
          className="onboarding-illustration" 
          style={{ 
            background: slide.color,
            '--ob-border-color': slide.borderColor
          }}
        >
          <div className="ob-icon">{slide.icon}</div>
        </div>

        <h2>{slide.title}</h2>
        <p>{slide.desc}</p>
      </div>

      <div className="onboarding-footer">
        <div className="onboarding-dots">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`onboarding-dot ${currentSlide === idx ? 'active' : ''}`}
            />
          ))}
        </div>

        <button className="btn-onboarding" onClick={handleNext}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
