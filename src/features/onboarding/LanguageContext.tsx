import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../../types/index.ts';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../../lib/i18n/languages.ts';
import { translations, TranslationDictionary } from '../../lib/i18n/translations.ts';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
}

const STORAGE_LANG_KEY = 'fitmadix_lang_v2';
const STORAGE_LANG_SELECTED_KEY = 'fitmadix_lang_selected_v2';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage;
      if (saved && ['en', 'bn', 'hi', 'es'].includes(saved)) {
        return saved;
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const [hasSelectedLanguage, setHasSelectedLanguageState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_LANG_SELECTED_KEY) === 'true';
    }
    return false;
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  const setHasSelectedLanguage = (value: boolean) => {
    setHasSelectedLanguageState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_SELECTED_KEY, value ? 'true' : 'false');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasSelectedLanguage,
        setHasSelectedLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
