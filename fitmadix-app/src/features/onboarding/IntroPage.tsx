import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Activity,
  Pill,
  FolderHeart,
  Brain,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Shield,
  Heart,
  HelpCircle,
  Volume2,
  Lock,
} from 'lucide-react';
import { useLanguage } from './LanguageContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import { useAuth } from '../authentication/AuthContext.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';
import { HealthInsightsSection } from '../insights/HealthInsightsSection.tsx';

export const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { speak, isVoiceMode } = useVoice();

  const handleReadIntro = () => {
    speak(
      `Fitmadix. Your health, our priority. ${t.introHeadline} ${t.introSubheadline}. Explore verified medical information, laboratory decrypter, drug interaction checker, and secure health records.`
    );
  };

  const handleExplore = (targetPath: string = '/home') => {
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate('/login', {
        state: {
          from: { pathname: targetPath },
          message: 'Sign in to access your FitMadix Health Dashboard and clinical tools.',
        },
      });
    }
  };

  const pillars = [
    {
      title: 'Lab Report Decrypter',
      desc: 'Instant visual breakdown of blood tests (CBC, Lipids, Metabolic) with reference gauges and questions for your doctor.',
      icon: Activity,
      tag: 'Interactive Diagnostic Tool',
    },
    {
      title: 'Medication Safety Checker',
      desc: 'Real-time drug-to-drug contraindication detection, pharmacokinetic mechanisms, and food precaution guides.',
      icon: Pill,
      tag: 'Pharmacology Safety Core',
    },
    {
      title: 'Human Body Systems Explorer',
      desc: 'Anatomical exploration of cardiovascular, respiratory, neural, and digestive physiology with recommended clinical screenings.',
      icon: Brain,
      tag: 'Physiology Explorer',
    },
    {
      title: 'Verified Health Insights',
      desc: 'Peer-reviewed medical snippets generated via Gemini 3.8 Flash grounded in WHO, AHA, and NIH clinical literature.',
      icon: Sparkles,
      tag: 'Medical Intelligence',
    },
    {
      title: 'Emergency Medical ID (ICE)',
      desc: 'Generate printable paramedic-ready health cards with blood type, allergies, medications, and emergency contacts.',
      icon: Shield,
      tag: 'First Responder Safety',
    },
    {
      title: 'Encrypted Records Vault',
      desc: 'Private, end-to-end encrypted storage for lab tests and clinical documents under your exclusive client ownership.',
      icon: FolderHeart,
      tag: 'Zero-Knowledge Security',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#00A88F]/20 selection:text-[#002B49] bg-medical-grid">
      {/* Top Header with Official Logo */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-2">
          <Link to="/intro" className="group flex items-center shrink-0" aria-label="FitMadix Home">
            <FitmadixLogo size="sm" showTagline={false} />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isVoiceMode && (
              <button
                onClick={handleReadIntro}
                className="hidden md:inline-flex text-xs text-[#00A88F] bg-[#F0FDF9] hover:bg-[#E0FBF4] px-3 py-1.5 rounded-full font-bold border border-[#00A88F]/30 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 mr-1" />
                <span>Read aloud</span>
              </button>
            )}
            <Link
              to="/login"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {t.logIn}
            </Link>
            <Link
              to="/signup"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-lg sm:rounded-xl transition-colors shadow-xs whitespace-nowrap"
            >
              {t.signUp}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-20 flex-1 space-y-10 sm:space-y-16 overflow-x-hidden">
        <div className="max-w-3xl w-full space-y-4 sm:space-y-6 text-left">
          {/* Unboxed Metadata Kicker */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#00A88F] tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00A88F] animate-pulse shrink-0" />
            <span>Clinical Intelligence Platform</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Multilingual</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>WCAG AA Accessible</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-[#002B49] leading-[1.15] sm:leading-[1.1] break-words">
            Your Health, <span className="text-[#00A88F]">Our Priority.</span>
          </h1>

          <p className="text-xs sm:text-base lg:text-xl text-slate-600 leading-relaxed font-normal">
            Understand your health. Make better-informed decisions. An accessible, privacy-first digital health platform built on verified medical literature, interactive clinical decrypters, and zero fabricated data.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-1 sm:pt-2 w-full">
            <button
              onClick={() => handleExplore('/home')}
              className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold text-white bg-[#00A88F] hover:bg-[#00947D] active:bg-[#007D69] rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? 'Open Health Dashboard' : t.exploreFitmadix}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold text-[#002B49] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs text-center"
              >
                {t.signUp}
              </Link>
            ) : (
              <Link
                to="/explore"
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold text-[#002B49] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs text-center"
              >
                Explore Clinical Tools
              </Link>
            )}
            <Link
              to="/language"
              className="w-full sm:w-auto px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors text-center"
            >
              Language Switcher
            </Link>
          </div>

          {/* Medical Responsibility Note */}
          <div className="pt-2 flex items-start gap-2 text-[11px] sm:text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#00A88F] shrink-0 mt-0.5" />
            <p>
              Strictly evidence-backed health guidance. Never substitutes for licensed professional medical advice, clinical diagnosis, or emergency dispatch.
            </p>
          </div>
        </div>

        {/* Evidence Credibility Ticker */}
        <div className="p-3.5 sm:p-4 bg-white/90 border border-slate-200/90 rounded-2xl shadow-2xs space-y-2 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] sm:text-[11px] block">
            Empirical Medical References:
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-semibold text-slate-600 text-[11px] sm:text-xs">
            <span>🏛 American Heart Association (AHA)</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
            <span>🏛 World Health Organization (WHO)</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
            <span>🏛 National Institutes of Health (NIH)</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
            <span>🏛 Mayo Clinic Clinical Standards</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-300">·</span>
            <span>🏛 FDA National Drug Code</span>
          </div>
        </div>

        {/* Feature Pillars Grid */}
        <div className="pt-6 border-t border-slate-200">
          <div className="mb-8 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A88F]">
              Platform Architecture
            </span>
            <h2 className="text-2xl font-bold text-[#002B49] tracking-tight mt-1">
              Engineered For Clinical Clarity & Life Safety
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Interactive diagnostic tools and privacy-first records designed without synthetic or fabricated data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleExplore('/explore')}
                  className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:border-[#00A88F]/50 hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F0FDF9] text-[#00A88F] flex items-center justify-center group-hover:bg-[#00A88F] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#002B49] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-[#00A88F]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Empirical Standard V2</span>
                    </span>
                    <span className="text-slate-400 group-hover:text-[#00A88F] transition-colors">
                      {isAuthenticated ? 'Open Tool →' : 'Sign In to Access →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Health Insights Section on Landing Page */}
        <div className="pt-6">
          <HealthInsightsSection limit={3} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <FitmadixLogo size="sm" showTagline={true} />
          <div className="flex items-center gap-5 font-semibold text-slate-600">
            <Link to="/language" className="hover:text-[#00A88F]">Language</Link>
            <Link to="/voice-mode" className="hover:text-[#00A88F]">Voice Mode</Link>
            <button
              onClick={() => handleExplore('/home')}
              className="hover:text-[#00A88F] cursor-pointer"
            >
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
