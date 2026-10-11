/**
 * Core type definitions for FitMadix V2
 */

export type SupportedLanguage = 'en' | 'bn' | 'hi' | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechLang: string;
}

export type TextSizePreference = 'standard' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  language: SupportedLanguage;
  voiceModeEnabled: boolean;
  textSize: TextSizePreference;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
}

export type BiologicalSex = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

export interface UserHealthProfile {
  id: string;
  userId: string;
  // Step 1: Basic
  fullName: string;
  dateOfBirth?: string;
  age?: number;
  sex?: BiologicalSex;
  heightCm?: number;
  weightKg?: number;
  // Step 2: Medical
  bloodGroup?: BloodGroup;
  knownConditions: string[];
  allergies: string[];
  currentMedications: string[];
  previousSurgeries: string[];
  // Step 3: Goals
  healthGoals: string[];
  // Step 4: Accessibility
  accessibility: AccessibilitySettings;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  isProfileComplete: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: UserAccount | null;
  profile: UserHealthProfile | null;
  accessToken?: string;
  isLoading: boolean;
}
