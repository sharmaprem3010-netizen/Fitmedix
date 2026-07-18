import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'Fitmadix - Enterprise Medical Health Platform',
    description: 'A comprehensive, clinical-grade medical application featuring AI guidance, chronotherapy, and personalized health tracking.',
    url: 'https://fitmadix-app.vercel.app',
    audience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patients and Clinicians'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Navigation Bar */}
      <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-sm">
            <Image 
              src="/logo.jpeg" 
              alt="Fitmadix Logo" 
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Fit<span className="text-teal-600">madix</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-teal-600 text-white px-5 py-2.5 rounded-full hover:bg-teal-700 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-20 md:py-32 bg-gradient-to-br from-teal-50 via-white to-blue-50 text-center relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-100/40 rounded-full blur-3xl -z-10"></div>

        {/* Splash Particles */}
        <div className="splash-particles absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="splash-particle" style={{ background: '#00B4D8', width: '8px', height: '8px', filter: 'drop-shadow(0 0 5px #00B4D8)' }}></div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider shadow-sm border border-teal-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Enterprise-Grade Security
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight mb-6">
          Advanced Clinical Intelligence <br className="hidden md:block"/> at Your Fingertips.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed z-10">
          Fitmadix unifies AI-driven diagnostics, automated chronotherapy, and secure health records into one seamless platform. Built for trust, scale, and clinical accuracy.
        </p>
        
        {/* Heartbeat Animation */}
        <div className="splash-heartbeat relative flex justify-center items-center w-full max-w-sm mx-auto" style={{ marginTop: '0', marginBottom: '40px', opacity: 1, zIndex: 10 }}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-12 drop-shadow-md">
            <path d="M0,10 L30,10 L40,2 L50,18 L60,10 L100,10" style={{ stroke: '#00B4D8', strokeWidth: 3 }} />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link href="/signup" className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
            Join Waitlist
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto">
            Log in
          </Link>
        </div>

        {/* Compliance Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold font-serif">HIPAA</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Compliant</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold font-serif">GDPR</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Ready</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold font-serif">E2EE</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Fitmadix. All rights reserved. Not intended to replace professional medical advice.
      </footer>
    </div>
  );
}
