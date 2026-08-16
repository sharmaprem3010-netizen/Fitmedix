import { useCallback, useEffect, useRef, useState } from "react";

type Language = "en-IN" | "hi-IN" | "bn-IN";

interface UseTextToSpeechReturn {
  speak: (text: string, lang?: Language) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

/**
 * Hook wrapping the Web Speech Synthesis API for text-to-speech output.
 * Auto-selects the best available voice for Hindi, Bengali, or English.
 */
export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const getBestVoice = useCallback(
    (lang: Language): SpeechSynthesisVoice | null => {
      if (!isSupported) return null;
      const voices = window.speechSynthesis.getVoices();
      // Exact match first
      const exact = voices.find((v) => v.lang === lang);
      if (exact) return exact;
      // Partial match (e.g. "hi" for "hi-IN")
      const prefix = lang.split("-")[0];
      const partial = voices.find((v) => v.lang.startsWith(prefix));
      if (partial) return partial;
      // Fallback to any English voice
      return voices.find((v) => v.lang.startsWith("en")) ?? null;
    },
    [isSupported],
  );

  const speak = useCallback(
    (text: string, lang: Language = "en-IN") => {
      if (!isSupported || !text.trim()) return;

      // Stop any current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      const voice = getBestVoice(lang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, getBestVoice],
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [isSupported]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Chrome bug workaround: voices load async, force a re-render
  useEffect(() => {
    if (!isSupported) return;
    const handleVoicesChanged = () => {
      // This triggers re-evaluation of getBestVoice on next speak() call
    };
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
