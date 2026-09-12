/// <reference types="@types/dom-speech-recognition" />
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccessibility, type Language } from "@/components/AccessibilityProvider";

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isSupported: boolean;
  error: string | null;
}

/**
 * Hook wrapping the Web Speech API (SpeechRecognition) for voice-to-text input.
 * Consumes global language state from AccessibilityProvider.
 */
export function useVoiceInput(): UseVoiceInputReturn {
  const {
    isListeningVoice,
    transcript,
    startListeningVoice,
    stopListeningVoice,
    language,
    setLanguage,
    voiceError
  } = useAccessibility();

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  return {
    isListening: isListeningVoice,
    transcript,
    interimTranscript: "", // Removed interim support to simplify and match global
    startListening: startListeningVoice,
    stopListening: stopListeningVoice,
    language,
    setLanguage,
    isSupported,
    error: voiceError,
  };
}
