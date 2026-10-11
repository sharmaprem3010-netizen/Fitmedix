import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLanguage } from '../features/onboarding/LanguageContext.tsx';
import { useAuth } from '../features/authentication/AuthContext.tsx';

// Layout
import { AppLayout } from '../components/layout/AppLayout.tsx';

// Screens
import { LanguageSelectScreen } from '../features/onboarding/LanguageSelectScreen.tsx';
import { VoiceModeScreen } from '../features/voice/VoiceModeScreen.tsx';
import { IntroPage } from '../features/onboarding/IntroPage.tsx';
import { LoginPage } from '../features/authentication/LoginPage.tsx';
import { SignUpPage } from '../features/authentication/SignUpPage.tsx';
import { ForgotPasswordPage } from '../features/authentication/ForgotPasswordPage.tsx';
import { ProfileOnboardingPage } from '../features/profile/ProfileOnboardingPage.tsx';
import { HomePage } from '../features/home/HomePage.tsx';
import { ExplorePage } from '../features/explore/ExplorePage.tsx';
import { AIAssistantPage } from '../features/ai-assistant/AIAssistantPage.tsx';
import { MedicalRecordsPage } from '../features/medical-reports/MedicalRecordsPage.tsx';
import { ProfilePage } from '../features/profile/ProfilePage.tsx';

export const AppRoutes: React.FC = () => {
  const { hasSelectedLanguage } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-sky-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Root Route: If language not selected, route to /language first */}
      <Route
        path="/"
        element={
          !hasSelectedLanguage ? (
            <Navigate to="/language" replace />
          ) : isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/intro" replace />
          )
        }
      />

      {/* Onboarding & Gateway Screens */}
      <Route path="/language" element={<LanguageSelectScreen />} />
      <Route path="/voice-mode" element={<VoiceModeScreen />} />
      <Route path="/intro" element={<IntroPage />} />

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Multi-step Profile Onboarding */}
      <Route path="/onboarding" element={<ProfileOnboardingPage />} />

      {/* Application Shell Pages */}
      <Route
        path="/home"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/explore"
        element={
          <AppLayout>
            <ExplorePage />
          </AppLayout>
        }
      />
      <Route
        path="/ai"
        element={
          <AppLayout>
            <AIAssistantPage />
          </AppLayout>
        }
      />
      <Route
        path="/records"
        element={
          <AppLayout>
            <MedicalRecordsPage />
          </AppLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
