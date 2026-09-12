import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Language =
  | "en-IN"
  | "hi-IN"
  | "bn-IN"
  | "te-IN"
  | "mr-IN"
  | "ta-IN"
  | "ur-IN"
  | "gu-IN"
  | "kn-IN"
  | "ml-IN"
  | "pa-IN"
  | "or-IN";
type FontSize = "normal" | "large" | "x-large";

interface AccessibilityContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageCode: string;
  languageLabel: string;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontScale: number;
  autoSpeak: (text: string) => void;
  stopSpeaking: () => void;
  readPage: () => void;
  isSpeaking: boolean;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;
  voiceMode: boolean;
  setVoiceMode: (val: boolean) => void;
  lowLiteracyMode: boolean;
  setLowLiteracyMode: (val: boolean) => void;
  hasCompletedVoiceOnboarding: boolean;
  setHasCompletedVoiceOnboarding: (val: boolean) => void;
  localCommandHandler: ((text: string) => boolean) | null;
  setLocalCommandHandler: (handler: ((text: string) => boolean) | null) => void;
  // Global Voice Recognition State
  transcript: string;
  isListeningVoice: boolean;
  startListeningVoice: () => void;
  stopListeningVoice: () => void;
  voiceError: string | null;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const LANG_MAP: Record<Language, { code: string; label: string; flag: string }> = {
  "en-IN": { code: "en", label: "English", flag: "🇬🇧" },
  "hi-IN": { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  "bn-IN": { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  "te-IN": { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  "mr-IN": { code: "mr", label: "मराठी", flag: "🇮🇳" },
  "ta-IN": { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  "ur-IN": { code: "ur", label: "اردو", flag: "🇮🇳" },
  "gu-IN": { code: "gu", label: "ગુજરાતી", flag: "🇮🇳" },
  "kn-IN": { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  "ml-IN": { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  "pa-IN": { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  "or-IN": { code: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳" },
};

const FONT_SCALES: Record<FontSize, number> = {
  normal: 1,
  large: 1.15,
  "x-large": 1.3,
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en-IN");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // New Accessibility States
  const [highContrast, setHighContrastState] = useState(false);
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [simpleMode, setSimpleModeState] = useState(false);
  const [voiceMode, setVoiceModeState] = useState(false);
  const [lowLiteracyMode, setLowLiteracyModeState] = useState(false);
  const [hasCompletedVoiceOnboarding, setHasCompletedVoiceOnboardingState] = useState(false);
  const [localCommandHandlerState, setLocalCommandHandlerState] = useState<((text: string) => boolean) | null>(null);

  const setLocalCommandHandler = useCallback((handler: ((text: string) => boolean) | null) => {
    setLocalCommandHandlerState(() => handler);
  }, []);

  // Voice Recognition Global State
  const [transcript, setTranscript] = useState("");
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // Load persisted preferences
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("fitmadix-lang") as Language | null;
      const savedFont = localStorage.getItem("fitmadix-fontsize") as FontSize | null;
      const savedHC = localStorage.getItem("fitmadix-highcontrast") === "true";
      const savedRM = localStorage.getItem("fitmadix-reducedmotion") === "true";
      const savedSM = localStorage.getItem("fitmadix-simplemode") === "true";
      const savedVM = localStorage.getItem("fitmadix-voicemode") === "true";
      const savedLLM = localStorage.getItem("fitmadix-lowliteracy") === "true";
      const savedVO = localStorage.getItem("fitmadix-voiceonboarding") === "true";
      
      if (savedLang && LANG_MAP[savedLang]) setLanguageState(savedLang);
      if (savedFont && FONT_SCALES[savedFont]) setFontSizeState(savedFont);
      setHighContrastState(savedHC);
      setReducedMotionState(savedRM);
      setSimpleModeState(savedSM);
      setVoiceModeState(savedVM);
      setLowLiteracyModeState(savedLLM);
      setHasCompletedVoiceOnboardingState(savedVO);
    } catch {
      /* SSR guard */
    }
  }, []);

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => {
          setIsListeningVoice(true);
          setVoiceError(null);
        };

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsListeningVoice(false);
          setVoiceError(null);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListeningVoice(false);

          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            setVoiceError(language.startsWith("en") ? "Microphone permission denied." : "माइक्रोफ़ोन की अनुमति नहीं है");
          } else if (event.error === "no-speech") {
            setVoiceError(language.startsWith("en") ? "No speech detected." : "कोई आवाज़ नहीं");
          } else if (event.error === "network") {
            setVoiceError(language.startsWith("en") ? "Network error." : "नेटवर्क त्रुटि");
          } else if (event.error !== "aborted") {
            setVoiceError("Error: " + event.error);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListeningVoice(false);
        };
      }
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);
  
  // Update recognition language when global language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const autoSpeak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a matching local voice
      const voices = window.speechSynthesis.getVoices();
      const prefix = language.split("-")[0];
      const voice =
        voices.find((v) => v.lang === language) ??
        voices.find((v) => v.lang.startsWith(prefix)) ??
        null;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const readPage = useCallback(() => {
    if (typeof document !== "undefined") {
      const main = document.querySelector("main");
      if (main) {
        // Strip out hidden elements and scripts, then get text
        const text = main.innerText;
        autoSpeak("Reading page... " + text);
      } else {
        autoSpeak("No main content found to read.");
      }
    }
  }, [autoSpeak]);

  const startListeningVoice = useCallback(() => {
    if (!recognitionRef.current) {
      setVoiceError("Speech recognition is not supported in this browser.");
      return;
    }
    setTranscript("");
    setVoiceError(null);
    if (isSpeaking) {
      stopSpeaking();
    }
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);
    }
  }, [isSpeaking, stopSpeaking]);

  const stopListeningVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListeningVoice(false);
  }, []);

  // Apply font scale to root element
  useEffect(() => {
    try {
      document.documentElement.style.fontSize = `${FONT_SCALES[fontSize] * 100}%`;
    } catch {
      /* SSR guard */
    }
  }, [fontSize]);
  
  // Apply HTML classes for CSS overriding
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [highContrast, reducedMotion]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("fitmadix-lang", lang);
      document.documentElement.lang = LANG_MAP[lang].code;
    } catch {
      /* SSR guard */
    }
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    try {
      localStorage.setItem("fitmadix-fontsize", size);
    } catch {
      /* SSR guard */
    }
  }, []);
  
  const setHighContrast = useCallback((val: boolean) => {
    setHighContrastState(val);
    try { localStorage.setItem("fitmadix-highcontrast", String(val)); } catch {}
  }, []);

  const setReducedMotion = useCallback((val: boolean) => {
    setReducedMotionState(val);
    try { localStorage.setItem("fitmadix-reducedmotion", String(val)); } catch {}
  }, []);

  const setSimpleMode = useCallback((val: boolean) => {
    setSimpleModeState(val);
    try { localStorage.setItem("fitmadix-simplemode", String(val)); } catch {}
  }, []);

  const setVoiceMode = useCallback((val: boolean) => {
    setVoiceModeState(val);
    try { localStorage.setItem("fitmadix-voicemode", String(val)); } catch {}
  }, []);

  const setLowLiteracyMode = useCallback((val: boolean) => {
    setLowLiteracyModeState(val);
    try { localStorage.setItem("fitmadix-lowliteracy", String(val)); } catch {}
  }, []);

  const setHasCompletedVoiceOnboarding = useCallback((val: boolean) => {
    setHasCompletedVoiceOnboardingState(val);
    try { localStorage.setItem("fitmadix-voiceonboarding", String(val)); } catch {}
  }, []);



  const langInfo = LANG_MAP[language];

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        setLanguage,
        languageCode: langInfo.code,
        languageLabel: langInfo.label,
        fontSize,
        setFontSize,
        fontScale: FONT_SCALES[fontSize],
        autoSpeak,
        stopSpeaking,
        readPage,
        isSpeaking,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        simpleMode,
        setSimpleMode,
        voiceMode,
        setVoiceMode,
        lowLiteracyMode,
        setLowLiteracyMode,
        hasCompletedVoiceOnboarding,
        setHasCompletedVoiceOnboarding,
        localCommandHandler: localCommandHandlerState,
        setLocalCommandHandler,
        transcript,
        isListeningVoice,
        startListeningVoice,
        stopListeningVoice,
        voiceError
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    // Return safe defaults when used outside of provider (e.g. landing page)
    return {
      language: "en-IN" as Language,
      setLanguage: () => {},
      languageCode: "en",
      languageLabel: "English",
      fontSize: "normal" as FontSize,
      setFontSize: () => {},
      fontScale: 1,
      autoSpeak: () => {},
      stopSpeaking: () => {},
      readPage: () => {},
      isSpeaking: false,
      highContrast: false,
      setHighContrast: () => {},
      reducedMotion: false,
      setReducedMotion: () => {},
      simpleMode: false,
      setSimpleMode: () => {},
      voiceMode: false,
      setVoiceMode: () => {},
      lowLiteracyMode: false,
      setLowLiteracyMode: () => {},
      hasCompletedVoiceOnboarding: false,
      setHasCompletedVoiceOnboarding: () => {},
      localCommandHandler: null,
      setLocalCommandHandler: () => {},
      transcript: "",
      isListeningVoice: false,
      startListeningVoice: () => {},
      stopListeningVoice: () => {},
      voiceError: null
    };
  }
  return ctx;
}

/**
 * Language picker component — usable in nav, sidebar, or settings.
 */
export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useAccessibility();
  const [open, setOpen] = useState(false);

  const options: { lang: Language; flag: string; label: string }[] = [
    { lang: "en-IN", flag: "🇬🇧", label: "English" },
    { lang: "hi-IN", flag: "🇮🇳", label: "हिंदी" },
    { lang: "bn-IN", flag: "🇮🇳", label: "বাংলা" },
    { lang: "te-IN", flag: "🇮🇳", label: "తెలుగు" },
    { lang: "mr-IN", flag: "🇮🇳", label: "मराठी" },
    { lang: "ta-IN", flag: "🇮🇳", label: "தமிழ்" },
    { lang: "ur-IN", flag: "🇮🇳", label: "اردو" },
    { lang: "gu-IN", flag: "🇮🇳", label: "ગુજરાતી" },
    { lang: "kn-IN", flag: "🇮🇳", label: "ಕನ್ನಡ" },
    { lang: "ml-IN", flag: "🇮🇳", label: "മലയാളം" },
    { lang: "pa-IN", flag: "🇮🇳", label: "ਪੰਜਾਬੀ" },
    { lang: "or-IN", flag: "🇮🇳", label: "ଓଡ଼ିଆ" },
  ];

  const current = options.find((o) => o.lang === language) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-secondary transition-colors"
        aria-label="Change language"
      >
        <span className="text-lg">{current.flag}</span>
        {!compact && <span className="text-xs font-medium">{current.label}</span>}
        <span className="text-[10px] text-muted-foreground">▼</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-1 shadow-elegant">
            {options.map((o) => (
              <button
                key={o.lang}
                onClick={() => {
                  setLanguage(o.lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  o.lang === language ? "bg-secondary font-medium" : "hover:bg-secondary/50"
                }`}
              >
                <span className="text-lg">{o.flag}</span>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Font size toggle component — cycles through normal → large → x-large
 */
export function FontSizeToggle() {
  const { fontSize, setFontSize } = useAccessibility();

  const cycle = () => {
    const order: FontSize[] = ["normal", "large", "x-large"];
    const idx = order.indexOf(fontSize);
    setFontSize(order[(idx + 1) % order.length]);
  };

  const labels: Record<FontSize, string> = {
    normal: "A",
    large: "A+",
    "x-large": "A++",
  };

  return (
    <button
      onClick={cycle}
      className="flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-bold hover:bg-secondary transition-colors"
      title={`Font size: ${fontSize} — click to change`}
      aria-label={`Current font size: ${fontSize}. Click to increase.`}
    >
      {labels[fontSize]}
    </button>
  );
}
