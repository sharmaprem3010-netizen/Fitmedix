import React, { createContext, useContext, useState, useEffect } from 'react';
import { TextSizePreference, AccessibilitySettings } from '../../types/index.ts';

interface AccessibilityContextType {
  textSize: TextSizePreference;
  setTextSize: (size: TextSizePreference) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  toggleReducedMotion: () => void;
  settings: AccessibilitySettings;
}

const STORAGE_ACCESSIBILITY_KEY = 'fitmadix_accessibility_v2';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSizePreference>('standard');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_ACCESSIBILITY_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.textSize) setTextSizeState(parsed.textSize);
          if (parsed.highContrast !== undefined) setHighContrastState(parsed.highContrast);
          if (parsed.reducedMotion !== undefined) setReducedMotionState(parsed.reducedMotion);
        }
      } catch {
        // Fallback to default
      }
    }
  }, []);

  const saveSettings = (newSize: TextSizePreference, newContrast: boolean, newMotion: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_ACCESSIBILITY_KEY,
        JSON.stringify({ textSize: newSize, highContrast: newContrast, reducedMotion: newMotion })
      );
    }
  };

  const setTextSize = (size: TextSizePreference) => {
    setTextSizeState(size);
    saveSettings(size, highContrast, reducedMotion);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    saveSettings(textSize, enabled, reducedMotion);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrastState(next);
    saveSettings(textSize, next, reducedMotion);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    saveSettings(textSize, highContrast, enabled);
  };

  const toggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotionState(next);
    saveSettings(textSize, highContrast, next);
  };

  // Sync DOM classes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Text size classes
    root.classList.remove('text-size-standard', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${textSize}`);

    // Contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [textSize, highContrast, reducedMotion]);

  const settings: AccessibilitySettings = {
    language: 'en',
    voiceModeEnabled: false,
    textSize,
    highContrast,
    reducedMotion,
    screenReaderOptimized: false,
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        settings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
