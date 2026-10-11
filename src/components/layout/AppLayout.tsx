import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, ShieldAlert, Sparkles, User, FileText, Compass, Home, Activity } from 'lucide-react';
import { useLanguage } from '../../features/onboarding/LanguageContext.tsx';
import { useVoice } from '../../features/voice/VoiceContext.tsx';
import { useAccessibility } from '../accessibility/AccessibilityContext.tsx';
import { useAuth } from '../../features/authentication/AuthContext.tsx';
import { FitmadixLogo } from '../ui/Logo.tsx';
import { FloatingVoiceBar } from '../../features/voice/FloatingVoiceBar.tsx';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const { isVoiceMode, toggleVoiceMode, speak, isSpeaking } = useVoice();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/home', label: t.navHome, icon: Home },
    { to: '/explore', label: t.navExplore, icon: Compass },
    { to: '/ai', label: t.navAiAssistant, icon: Sparkles },
    { to: '/records', label: t.navMedicalRecords, icon: FileText },
    { to: '/profile', label: t.navProfile, icon: User },
  ];

  const handleVoiceToggle = () => {
    const nextState = !isVoiceMode;
    toggleVoiceMode();
    if (nextState) {
      speak('Voice mode enabled. Fitmadix will read screen elements aloud.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#00A88F]/20 selection:text-[#002B49]">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00A88F] focus:text-white focus:rounded-md focus:shadow-md focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Bar with Official Fitmadix Logo and 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Official Brand Logo & Wordmark */}
          <Link
            to="/home"
            className="whitespace-nowrap shrink-0 group flex items-center"
            aria-label="Fitmadix Home"
          >
            <FitmadixLogo variant="full" size="md" showTagline={false} />
          </Link>

          {/* Zone 2: 5 single-line clean nav links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600"
            aria-label="Main Navigation"
          >
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                    isActive
                      ? 'text-[#002B49] border-[#00A88F] font-bold'
                      : 'border-transparent hover:text-[#002B49] hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Accessible Controls Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Voice Mode indicator button */}
            <button
              onClick={handleVoiceToggle}
              aria-label={
                isVoiceMode
                  ? 'Voice Mode is Active. Click to turn off.'
                  : 'Voice Mode is Inactive. Click to turn on.'
              }
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                isVoiceMode
                  ? 'bg-[#F0FDF9] text-[#00A88F] border-[#00A88F]/40 shadow-xs ring-1 ring-[#00A88F]/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isVoiceMode ? (
                <>
                  <Volume2 className={`w-3.5 h-3.5 text-[#00A88F] ${isSpeaking ? 'animate-pulse' : ''}`} />
                  <span className="whitespace-nowrap font-bold">Voice ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="whitespace-nowrap">Voice OFF</span>
                </>
              )}
            </button>

            {/* Profile or Sign In */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors whitespace-nowrap shrink-0 border border-slate-200"
              >
                <div className="w-5 h-5 rounded-full bg-[#00A88F] text-white flex items-center justify-center text-[10px] font-bold">
                  {(user?.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[110px] truncate">{user?.fullName || 'Profile'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        {children}
      </main>

      {/* Floating Interactive Voice Bar */}
      <FloatingVoiceBar />

      {/* Accessible Medical Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <FitmadixLogo size="sm" showTagline={true} />

            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <button
                onClick={toggleHighContrast}
                className="hover:text-[#00A88F] transition-colors cursor-pointer"
              >
                {highContrast ? 'Normal Contrast' : 'High Contrast'}
              </button>
              <span aria-hidden="true">·</span>
              <Link to="/language" className="hover:text-[#00A88F] transition-colors">
                Language
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/voice-mode" className="hover:text-[#00A88F] transition-colors">
                Voice Mode
              </Link>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-500">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.medicalDisclaimerNotice}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Fitmadix Platform. Your Health, Our Priority.</p>
            <p className="mt-1 sm:mt-0 font-mono text-[11px]">Empirical Standards · WCAG AA Ready</p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-lg"
        aria-label="Mobile Navigation"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2 text-[10px] font-semibold transition-colors whitespace-nowrap min-w-[56px] min-h-[44px] ${
                isActive ? 'text-[#00A88F]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#00A88F]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer for mobile bottom bar */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </div>
  );
};
