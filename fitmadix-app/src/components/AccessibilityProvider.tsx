import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Language = "en-IN" | "hi-IN" | "bn-IN" | "te-IN" | "mr-IN" | "ta-IN" | "ur-IN" | "gu-IN" | "kn-IN" | "ml-IN" | "pa-IN" | "or-IN";
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
  isSpeaking: boolean;
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

  // Load persisted preferences
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("fitmadix-lang") as Language | null;
      const savedFont = localStorage.getItem("fitmadix-fontsize") as FontSize | null;
      if (savedLang && LANG_MAP[savedLang]) setLanguageState(savedLang);
      if (savedFont && FONT_SCALES[savedFont]) setFontSizeState(savedFont);
    } catch {
      /* SSR guard */
    }
  }, []);

  // Apply font scale to root element
  useEffect(() => {
    try {
      document.documentElement.style.fontSize = `${FONT_SCALES[fontSize] * 100}%`;
    } catch {
      /* SSR guard */
    }
  }, [fontSize]);

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

  const autoSpeak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !text.trim()) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const prefix = language.split("-")[0];
      const voice =
        voices.find((v) => v.lang === language) ??
        voices.find((v) => v.lang.startsWith(prefix)) ??
        voices.find((v) => v.lang.startsWith("en")) ??
        null;
      if (voice) utterance.voice = voice;

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
        isSpeaking,
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
      isSpeaking: false,
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
