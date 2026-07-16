'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to login after 4 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="splash-screen">
      <div className="splash-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="splash-particle"></div>
        ))}
      </div>
      
      <div className="splash-content">
        <div className="splash-logo-ring">
          <Image 
            src="/logo.jpeg" 
            alt="Fitmadix Logo" 
            width={160} 
            height={160} 
            className="splash-logo-img" 
            priority
          />
        </div>
        
        <h1 className="splash-brand">
          <span className="brand-fit">Fit</span><span className="brand-madix">madix</span>
        </h1>
        <div className="splash-tagline">Medical Health App</div>
        
        <div className="splash-heartbeat">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0,10 L30,10 L40,2 L50,18 L60,10 L100,10" />
          </svg>
        </div>
        
        <div className="splash-loader" style={{ margin: '20px auto 0', justifyContent: 'center' }}>
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}
