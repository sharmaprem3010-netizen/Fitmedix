import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Heart,
  Target,
  Eye,
  Volume2,
  VolumeX,
  LogOut,
  Edit3,
  Shield,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import { useAccessibility } from '../../components/accessibility/AccessibilityContext.tsx';
import { SUPPORTED_LANGUAGES } from '../../lib/i18n/languages.ts';
import { TextSizePreference, SupportedLanguage } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isVoiceMode, toggleVoiceMode, speak } = useVoice();
  const {
    textSize,
    setTextSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'overview' | 'accessibility' | 'security'>('overview');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    showNotification('Language updated.');
    if (isVoiceMode) speak(`Language changed to ${lang}`);
  };

  const handleTextSizeChange = (size: TextSizePreference) => {
    setTextSize(size);
    showNotification(`Text scale set to ${size}.`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/intro');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <span>Account Profile & Preferences</span>
            <span aria-hidden="true">·</span>
            <span>Fitmadix V2</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#002B49]">
            {profile?.fullName || user?.fullName || 'User Profile'}
          </h1>
          <p className="text-xs text-slate-500 font-mono">
            {user?.email || 'Active Local Session'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/onboarding">
            <Button variant="outline" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />}>
              Edit Profile
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-3.5 h-3.5" />}>
            Sign Out
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 bg-[#F0FDF9] border border-[#00A88F]/40 text-[#002B49] rounded-xl text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00A88F] shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#00A88F] text-[#002B49]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Health Profile
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'accessibility'}
          onClick={() => setActiveTab('accessibility')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'accessibility'
              ? 'border-[#00A88F] text-[#002B49]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Accessibility & Voice
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#00A88F] text-[#002B49]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Privacy & Security
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Physiological Data</h2>
              <p className="text-xs text-slate-500">Biometric reference context for medical metrics</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Sex</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {profile?.sex?.replace('-', ' ') || 'Unspecified'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Age</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {profile?.age ? `${profile.age} years` : 'Unspecified'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Height</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {profile?.heightCm ? `${profile.heightCm} cm` : 'Unspecified'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Weight</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {profile?.weightKg ? `${profile.weightKg} kg` : 'Unspecified'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Medical History & Allergies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-semibold text-slate-700 block">Blood Group</span>
                  <p className="font-mono text-slate-900 font-bold">
                    {profile?.bloodGroup || 'Not specified'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-semibold text-slate-700 block">Registered Allergies</span>
                  <p className="text-slate-700">
                    {profile?.allergies && profile.allergies.length > 0
                      ? profile.allergies.join(', ')
                      : 'None registered'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-semibold text-slate-700 block">Known Conditions</span>
                  <p className="text-slate-700">
                    {profile?.knownConditions && profile.knownConditions.length > 0
                      ? profile.knownConditions.join(', ')
                      : 'None registered'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-semibold text-slate-700 block">Current Medications</span>
                  <p className="text-slate-700">
                    {profile?.currentMedications && profile.currentMedications.length > 0
                      ? profile.currentMedications.join(', ')
                      : 'None registered'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Health Goals</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.healthGoals && profile.healthGoals.length > 0 ? (
                  profile.healthGoals.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-sky-50 text-sky-800 rounded-lg text-xs font-medium border border-sky-200 capitalize"
                    >
                      {g.replace('-', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No specific goals chosen yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Accessibility */}
      {activeTab === 'accessibility' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Accessibility Controls</h2>
              <p className="text-xs text-slate-500">Adjust the interface to match your visual, auditory, and motor preferences</p>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                      language === l.code
                        ? 'border-sky-600 bg-sky-50 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-sm">{l.nativeName}</div>
                    <div className="text-[11px] text-slate-500">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {isVoiceMode ? (
                    <Volume2 className="w-4 h-4 text-sky-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Voice Assistance Mode ({isVoiceMode ? 'ON' : 'OFF'})</span>
                </div>
                <p className="text-xs text-slate-500">
                  Speaks out screen elements and enables speech-to-text dictation.
                </p>
              </div>
              <button
                onClick={() => {
                  toggleVoiceMode();
                  showNotification(`Voice mode turned ${!isVoiceMode ? 'ON' : 'OFF'}.`);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isVoiceMode
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {isVoiceMode ? 'Disable Voice' : 'Enable Voice'}
              </button>
            </div>

            {/* Typography Scale */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Text Scaling
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['standard', 'large', 'xlarge'] as TextSizePreference[]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleTextSizeChange(sz)}
                    className={`p-3 rounded-xl border text-center capitalize transition-colors cursor-pointer ${
                      textSize === sz
                        ? 'border-sky-600 bg-sky-50 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className={sz === 'standard' ? 'text-xs' : sz === 'large' ? 'text-sm' : 'text-base font-bold'}>
                      {sz}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-900">High Contrast Mode</span>
                <p className="text-xs text-slate-500">
                  Sharpens element boundaries and elevates text contrast.
                </p>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  highContrast
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {highContrast ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-900">Reduced Motion</span>
                <p className="text-xs text-slate-500">
                  Disables animations for users sensitive to motion sickness.
                </p>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  reducedMotion
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {reducedMotion ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Health Privacy & Data Protection Model</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <span className="font-semibold text-slate-900 block">Row-Level Security Architecture</span>
              <p>
                Every table in FitMadix V2 uses strict Supabase Row Level Security (RLS). Users can only read and write rows where `auth.uid() = user_id`.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <span className="font-semibold text-slate-900 block">Encrypted Document Buckets</span>
              <p>
                Medical reports and lab tests are stored in private Supabase Storage buckets with zero-knowledge token gating. No public URLs are ever created.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
              <span className="font-semibold text-slate-900 block">Non-Commercial Medical Ethics</span>
              <p>
                FitMadix does not monetize personal health telemetry or sell browsing behavioral logs to insurance or advertising networks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
