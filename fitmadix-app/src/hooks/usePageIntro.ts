import { useEffect, useRef } from "react";
import { useAccessibility } from "@/components/AccessibilityProvider";

export function usePageIntro(introText: string, delayMs = 800) {
  const { voiceMode, lowLiteracyMode, autoSpeak } = useAccessibility();
  const hasSpoken = useRef(false);

  useEffect(() => {
    if ((voiceMode || lowLiteracyMode) && !hasSpoken.current) {
      const timer = setTimeout(() => {
        autoSpeak(introText);
        hasSpoken.current = true;
      }, delayMs);
      
      return () => clearTimeout(timer);
    }
  }, [voiceMode, lowLiteracyMode, autoSpeak, introText, delayMs]);
}
