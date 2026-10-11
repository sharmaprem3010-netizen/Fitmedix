import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Play, Square, FastForward, Info } from 'lucide-react';
import { useVoice } from './VoiceContext.tsx';
import { useLanguage } from '../onboarding/LanguageContext.tsx';

export const FloatingVoiceBar: React.FC = () => {
  const { isVoiceMode, toggleVoiceMode, isSpeaking, stopSpeaking, speak, isListening, startListening, stopListening } = useVoice();
  const { t } = useLanguage();
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  if (!isVoiceMode) {
    return (
      <aside aria-label="Voice accessibility quick toggle" className="fixed bottom-20 md:bottom-6 right-4 z-40">
        <button
          onClick={toggleVoiceMode}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-white text-slate-800 border border-slate-200/90 shadow-md hover:bg-[#F0FDF9] hover:border-[#00A88F] hover:text-[#00A88F] transition-all cursor-pointer group"
          title="Enable spoken voice assistance mode"
        >
          <Volume2 className="w-4 h-4 text-[#00A88F] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Voice Assistant</span>
        </button>
      </aside>
    );
  }

  const handleReadCurrentView = () => {
    const mainHeading = document.querySelector('h1')?.textContent || 'Fitmadix health overview';
    speak(`Reading current section: ${mainHeading}.`);
  };

  const handleCycleRate = () => {
    const nextRate = speechRate === 1.0 ? 1.25 : speechRate === 1.25 ? 0.8 : 1.0;
    setSpeechRate(nextRate);
    speak(`Speech rate set to ${nextRate}x`);
  };

  return (
    <aside
      aria-label="Fitmadix Voice Assistant Controller"
      className="fixed bottom-18 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] sm:w-auto bg-[#002B49] text-white rounded-full px-4 py-2.5 shadow-xl border border-slate-700/60 flex items-center justify-between gap-3 sm:gap-5 animate-in slide-in-from-bottom-3"
    >
      {/* Live Voice Indicator & Waveform */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#00A88F] flex items-center justify-center shrink-0">
          <Volume2 className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-none text-white flex items-center gap-1.5">
            <span>Voice Assistant</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2B4] animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-300 leading-tight mt-0.5">
            {isSpeaking ? 'Speaking audio...' : isListening ? 'Listening...' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Mini audio wave visualization */}
      {isSpeaking && (
        <div className="flex items-center gap-0.5 h-4 px-1" aria-hidden="true">
          <div className="w-1 bg-[#00D2B4] rounded-full animate-bounce h-3" />
          <div className="w-1 bg-[#00D2B4] rounded-full animate-bounce h-4 [animation-delay:150ms]" />
          <div className="w-1 bg-[#00D2B4] rounded-full animate-bounce h-2 [animation-delay:300ms]" />
          <div className="w-1 bg-[#00D2B4] rounded-full animate-bounce h-4 [animation-delay:450ms]" />
        </div>
      )}

      {/* Audio Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isSpeaking ? (
          <button
            onClick={stopSpeaking}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            title="Stop audio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            onClick={handleReadCurrentView}
            className="p-1.5 rounded-full bg-[#00A88F] hover:bg-[#00947D] text-white transition-colors"
            title="Read current page"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {/* Speed toggle */}
        <button
          onClick={handleCycleRate}
          className="px-2 py-1 text-[10px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-md transition-colors"
          title="Change playback speed"
        >
          {speechRate}x
        </button>

        {/* Mic toggle */}
        <button
          onClick={() => (isListening ? stopListening() : startListening())}
          className={`p-1.5 rounded-full transition-colors ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title={isListening ? 'Listening active' : 'Turn on voice dictation'}
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>

        {/* Dismiss Voice Mode */}
        <button
          onClick={toggleVoiceMode}
          className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors ml-1"
          title="Turn off voice mode"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
