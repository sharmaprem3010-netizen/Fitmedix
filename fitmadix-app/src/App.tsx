import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './features/onboarding/LanguageContext.tsx';
import { VoiceProvider } from './features/voice/VoiceContext.tsx';
import { AccessibilityProvider } from './components/accessibility/AccessibilityContext.tsx';
import { AuthProvider } from './features/authentication/AuthContext.tsx';
import { AppRoutes } from './routes/AppRoutes.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <VoiceProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </AccessibilityProvider>
        </VoiceProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
