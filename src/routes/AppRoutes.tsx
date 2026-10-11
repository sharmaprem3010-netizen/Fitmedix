import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

/**
 * Route protection wrapper: guarantees authenticated session
 * before granting access to health metrics, patient tools, and insights.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#00A88F] rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500">Verifying secure clinical credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Sign-in required: Please authenticate to access the FitMadix Health Dashboard and clinical tools.',
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { hasSelectedLanguage } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-[#00A88F] rounded-full animate-spin" />
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

      {/* Public Gateway Screens */}
      <Route path="/language" element={<LanguageSelectScreen />} />
      <Route path="/voice-mode" element={<VoiceModeScreen />} />
      <Route path="/intro" element={<IntroPage />} />

      {/* Authentication Screens (Redirect to /home if already logged in) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <SignUpPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Profile Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <ProfileOnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Health Application Shell Pages */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExplorePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AIAssistantPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MedicalRecordsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
