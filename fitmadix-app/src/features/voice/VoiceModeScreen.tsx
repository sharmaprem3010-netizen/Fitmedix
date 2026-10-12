import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight, CheckCircle2, Mic } from 'lucide-react';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { useVoice } from './VoiceContext.tsx';
import { FitmadixLogo } from '../../components/ui/Logo.tsx';

export const VoiceModeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isVoiceMode, setVoiceMode, speak } = useVoice();

  const handleSelectVoice = (enabled: boolean) => {
    setVoiceMode(enabled);
    if (enabled) {
      speak('Voice mode is now turned on. Fitmadix will read instructions aloud as you navigate.');
    }
  };

  const handleProceed = () => {
    navigate('/intro');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] bg-radial-teal flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg text-center mb-6 space-y-2 flex flex-col items-center">
        <FitmadixLogo size="md" showTagline={false} />
        <p className="text-xs uppercase font-bold tracking-wider text-[#00A88F] mt-2">
          Step 2 of 2 · Accessibility Preferences
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.voiceModeTitle}</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{t.voiceModeSubtitle}</p>
      </div>

      <main className="w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Status Banner */}
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-colors text-left ${
            isVoiceMode
              ? 'bg-[#F0FDF9] border-[#00A88F]/40 text-[#002B49]'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {isVoiceMode ? (
            <div className="w-10 h-10 rounded-xl bg-[#00A88F] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <VolumeX className="w-5 h-5" />
            </div>
          )}
          <div className="space-y-0.5">
            <div className="text-sm font-bold">
              {isVoiceMode ? t.voiceModeOn : t.voiceModeOff}
            </div>
            <p className="text-xs text-slate-500">
              {isVoiceMode
                ? 'Text-to-speech audio feedback and speech-to-text input are active.'
                : 'Standard visual navigation is active without spoken prompts.'}
            </p>
          </div>
        </div>

        {/* Option Selectors */}
        <div className="space-y-3" role="radiogroup" aria-label="Voice assistance mode preference">
          <button
            role="radio"
            aria-checked={isVoiceMode}
            onClick={() => handleSelectVoice(true)}
            className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              isVoiceMode
                ? 'border-[#00A88F] bg-[#F0FDF9]/80 ring-1 ring-[#00A88F]/50 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="mt-0.5">
              {isVoiceMode ? (
                <CheckCircle2 className="w-5 h-5 text-[#00A88F]" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-300" />
              )}
            </div>
            <div className="space-y-1">
              <span className="block text-sm font-bold text-slate-900">{t.enableVoiceMode}</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recommended for blind users, low vision, and anyone preferring spoken voice interactions.
              </p>
            </div>
          </button>

          <button
            role="radio"
            aria-checked={!isVoiceMode}
            onClick={() => handleSelectVoice(false)}
            className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              !isVoiceMode
                ? 'border-[#002B49] bg-slate-50 ring-1 ring-[#002B49]/30 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="mt-0.5">
              {!isVoiceMode ? (
                <CheckCircle2 className="w-5 h-5 text-[#002B49]" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-300" />
              )}
            </div>
            <div className="space-y-1">
              <span className="block text-sm font-bold text-slate-900">{t.skipVoiceMode}</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use traditional on-screen visual navigation. You can toggle voice assistance anytime with the floating speaker.
              </p>
            </div>
          </button>
        </div>

        {/* Proceed Action */}
        <button
          onClick={handleProceed}
          className="w-full py-3.5 px-4 text-sm font-bold text-white bg-[#002B49] hover:bg-[#001D33] active:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg focus-visible:outline-2 focus-visible:outline-[#00A88F]"
        >
          <span>Continue to Fitmadix</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/language')}
          className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
        >
          Change language preference
        </button>
      </div>
    </div>
  );
};
