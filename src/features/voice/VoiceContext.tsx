import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { voiceService } from '../../services/voice/voiceService.ts';
import { SpeechRecognitionResult } from '../../services/voice/types.ts';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n/languages.ts';

interface VoiceContextType {
  isVoiceMode: boolean;
  setVoiceMode: (enabled: boolean) => void;
  toggleVoiceMode: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  startListening: (onResultCallback?: (text: string) => void) => void;
  stopListening: () => void;
  isSupported: boolean;
}

const STORAGE_VOICE_KEY = 'fitmadix_voicemode_v2';

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [isVoiceMode, setIsVoiceModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_VOICE_KEY) === 'true';
    }
    return false;
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
  }, []);

  const setVoiceMode = useCallback((enabled: boolean) => {
    setIsVoiceModeState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_VOICE_KEY, enabled ? 'true' : 'false');
    }
    if (!enabled) {
      voiceService.stopSpeaking();
      voiceService.stopListening();
    }
  }, []);

  const toggleVoiceMode = useCallback(() => {
    setVoiceMode(!isVoiceMode);
  }, [isVoiceMode, setVoiceMode]);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (!isVoiceMode && !voiceService.isSupported()) return;
      try {
        setIsSpeaking(true);
        const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
        const speechLang = langConfig?.speechLang || 'en-US';
        await voiceService.speak(text, { language: speechLang, rate: 0.95 });
      } catch (err) {
        console.warn('Voice synthesis error:', err);
      } finally {
        setIsSpeaking(false);
      }
    },
    [isVoiceMode, language]
  );

  const stopSpeaking = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(
    (onResultCallback?: (text: string) => void) => {
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      const speechLang = langConfig?.speechLang || 'en-US';

      setIsListening(true);
      setTranscript('');

      voiceService.startListening(
        (res: SpeechRecognitionResult) => {
          setTranscript(res.transcript);
          if (res.isFinal && onResultCallback) {
            onResultCallback(res.transcript);
            setIsListening(false);
          }
        },
        (errorMsg) => {
          console.warn('Speech recognition error:', errorMsg);
          setIsListening(false);
        },
        speechLang
      );
    },
    [language]
  );

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isVoiceMode,
        setVoiceMode,
        toggleVoiceMode,
        speak,
        stopSpeaking,
        isSpeaking,
        isListening,
        transcript,
        startListening,
        stopListening,
        isSupported,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
