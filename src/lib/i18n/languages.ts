import { LanguageOption, SupportedLanguage } from '../../types/index.ts';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechLang: 'en-US',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechLang: 'bn-IN',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechLang: 'hi-IN',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    speechLang: 'es-ES',
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
