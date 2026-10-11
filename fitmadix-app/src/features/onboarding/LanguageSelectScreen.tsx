import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Check, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n/languages.ts';
import { SupportedLanguage } from '../../types/index.ts';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const LanguageSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setHasSelectedLanguage, t } = useLanguage();
  const { isVoiceMode, setVoiceMode, speak } = useVoice();
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(language);

  const handleLanguagePick = (langCode: SupportedLanguage) => {
    setSelectedLang(langCode);
    setLanguage(langCode);
    if (isVoiceMode) {
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      speak(`Selected ${langObj?.name || langCode}`);
    }
  };

  const handleContinue = () => {
    setHasSelectedLanguage(true);
    navigate('/voice-mode');
  };

  const handleVoiceModeDirect = () => {
    setVoiceMode(true);
    setHasSelectedLanguage(true);
    speak('Voice mode activated. Choose your language or continue to the introduction.');
    navigate('/voice-mode');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-radial-teal flex flex-col justify-center items-center px-4 py-12">
      {/* Brand & Official Logo */}
      <div className="w-full max-w-md text-center mb-8 flex flex-col items-center">
        <FitmadixLogo variant="full" size="lg" showTagline={true} />
        <p className="text-xs text-slate-500 mt-3 font-medium">
          Accessible & Multilingual Health Intelligence
        </p>
      </div>

      {/* Language Selection Card */}
      <main className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00A88F] uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Select Locale</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t.chooseLanguage}</h1>
          <p className="text-xs text-slate-500">{t.selectToContinue}</p>
        </div>

        {/* Language Grid */}
        <div
          role="radiogroup"
          aria-label={t.chooseLanguage}
          className="grid grid-cols-1 gap-2.5"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleLanguagePick(lang.code)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#00A88F] bg-[#F0FDF9] text-slate-900 ring-1 ring-[#00A88F]/40 shadow-xs'
                    : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-base text-slate-900">{lang.nativeName}</div>
                  <div className="text-xs text-slate-500 font-medium">{lang.name}</div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#00A88F] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#002B49] hover:bg-[#001D33] active:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#00A88F]"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Accessible Voice Mode Option */}
        <div className="pt-2 border-t border-slate-100">
          <div className="bg-[#F0FDF9] border border-[#00A88F]/30 rounded-2xl p-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-[#002B49] font-bold text-xs">
              <Volume2 className="w-4 h-4 text-[#00A88F] shrink-0" />
              <span>{t.cantReadPrompt}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.voiceModeDesc}
            </p>
            <button
              onClick={handleVoiceModeDirect}
              className="mt-1 w-full py-2.5 px-3 text-xs font-bold text-[#002B49] bg-white border border-[#00A88F]/40 hover:bg-[#00A88F] hover:text-white rounded-xl transition-all cursor-pointer text-center shadow-2xs"
            >
              {t.useVoiceMode}
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-xs text-slate-400 max-w-md">
        <p>Fitmadix adheres to WCAG AA accessibility standards and source-driven clinical integrity.</p>
      </footer>
    </div>
  );
};
