import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FilePlus,
  Compass,
  Sliders,
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  Check,
  Pill,
  Brain,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useLanguage } from '../onboarding/LanguageContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import { EmptyState } from '../../components/ui/FeedbackStates.tsx';
import { LabReportDecoder } from '../tools/LabReportDecoder.tsx';
import { DrugInteractionChecker } from '../tools/DrugInteractionChecker.tsx';
import { AnatomicalBodyExplorer } from '../tools/AnatomicalBodyExplorer.tsx';
import { EmergencyMedicalCard } from '../tools/EmergencyMedicalCard.tsx';
import { HealthInsightsSection } from '../insights/HealthInsightsSection.tsx';
import { UserHealthDashboard } from '../dashboard/UserHealthDashboard.tsx';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isProfileComplete } = useAuth();
  const { t } = useLanguage();
  const { speak, isVoiceMode } = useVoice();

  // Active interactive clinical tool view tab
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<
    'none' | 'lab-decoder' | 'drug-checker' | 'body-explorer' | 'ice-card'
  >('lab-decoder');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning;
    if (hour < 17) return t.greetingAfternoon;
    return t.greetingEvening;
  };

  const displayName = profile?.fullName || user?.fullName || 'Health Explorer';

  const handleReadSummary = () => {
    speak(`${getGreeting()}, ${displayName}. Welcome to your Fitmadix health dashboard. Your health, our priority.`);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Greeting & Voice Announce Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span aria-hidden="true">·</span>
            <span>Fitmadix V2 Health Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#002B49]">
            {getGreeting()}, {displayName}
          </h1>
        </div>

        {isVoiceMode && (
          <button
            onClick={handleReadSummary}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-[#00A88F] bg-[#F0FDF9] border border-[#00A88F]/30 hover:bg-[#E0FBF4] rounded-full cursor-pointer transition-colors"
          >
            <span>Read dashboard aloud</span>
          </button>
        )}
      </div>

      {/* Profile Incomplete Banner if needed */}
      {!isProfileComplete && (
        <div className="p-4 bg-[#F0FDF9] border border-[#00A88F]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#002B49]">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#00A88F] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">{t.completeProfilePrompt}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Set up your blood group, medical history, and goals to enable personalized guidance.
              </p>
            </div>
          </div>
          <Link
            to="/onboarding"
            className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-xl transition-colors whitespace-nowrap shrink-0 text-center shadow-xs"
          >
            {t.completeProfileBtn}
          </Link>
        </div>
      )}

      {/* Quick Actions Grid */}
      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="quick-actions-heading" className="text-base font-bold text-[#002B49]">
            {t.quickActions}
          </h2>
          <span className="text-xs text-slate-400 font-medium">Empirical Toolkit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            onClick={() => setActiveInteractiveTool('lab-decoder')}
            className={`p-4 border rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeInteractiveTool === 'lab-decoder'
                ? 'bg-[#F0FDF9] border-[#00A88F] ring-1 ring-[#00A88F]/40 shadow-xs'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00A88F] flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">Lab Decrypter</span>
              <p className="text-xs text-slate-500 mt-0.5">Decode blood tests & CBC</p>
            </div>
          </button>

          <button
            onClick={() => setActiveInteractiveTool('drug-checker')}
            className={`p-4 border rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeInteractiveTool === 'drug-checker'
                ? 'bg-[#F0FDF9] border-[#00A88F] ring-1 ring-[#00A88F]/40 shadow-xs'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">Drug Interactions</span>
              <p className="text-xs text-slate-500 mt-0.5">Pharmacology safety engine</p>
            </div>
          </button>

          <button
            onClick={() => setActiveInteractiveTool('body-explorer')}
            className={`p-4 border rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeInteractiveTool === 'body-explorer'
                ? 'bg-[#F0FDF9] border-[#00A88F] ring-1 ring-[#00A88F]/40 shadow-xs'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">Body Systems</span>
              <p className="text-xs text-slate-500 mt-0.5">Organ anatomy & screenings</p>
            </div>
          </button>

          <button
            onClick={() => setActiveInteractiveTool('ice-card')}
            className={`p-4 border rounded-2xl text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeInteractiveTool === 'ice-card'
                ? 'bg-[#F0FDF9] border-[#00A88F] ring-1 ring-[#00A88F]/40 shadow-xs'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">Emergency ID</span>
              <p className="text-xs text-slate-500 mt-0.5">Printable paramedic ICE card</p>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Interactive Tool Display Area */}
      {activeInteractiveTool !== 'none' && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A88F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#002B49]">
                Live Diagnostic Tool
              </span>
            </div>
            <button
              onClick={() => setActiveInteractiveTool('none')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700"
            >
              Hide Tool
            </button>
          </div>

          {activeInteractiveTool === 'lab-decoder' && <LabReportDecoder />}
          {activeInteractiveTool === 'drug-checker' && <DrugInteractionChecker />}
          {activeInteractiveTool === 'body-explorer' && <AnatomicalBodyExplorer />}
          {activeInteractiveTool === 'ice-card' && <EmergencyMedicalCard />}
        </section>
      )}

      {/* User Health Summary Dashboard with Recharts */}
      <UserHealthDashboard />

      {/* Main Two-Column Layout: Profile Context & Records Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Health Profile & Certified Baselines */}
        <section aria-labelledby="today-overview-heading" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="today-overview-heading" className="text-base font-bold text-[#002B49]">
              Certified Clinical Baseline
            </h2>
            <span className="text-xs font-mono text-[#00A88F]">Patient Profile</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            {profile ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Blood Group</span>
                  <span className="font-bold text-[#002B49] font-mono text-sm">
                    {profile.bloodGroup && profile.bloodGroup !== 'unknown' ? profile.bloodGroup : 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Known Allergies</span>
                  <span className="font-semibold text-slate-900">
                    {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None registered'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Conditions</span>
                  <span className="font-semibold text-slate-900">
                    {profile.knownConditions.length > 0 ? profile.knownConditions.join(', ') : 'None registered'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Primary Focus</span>
                  <span className="font-semibold text-slate-900 capitalize">
                    {profile.healthGoals[0]?.replace('-', ' ') || 'Wellness'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Configure your blood type and known conditions in the Profile settings to calculate custom cardiac zones.
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero false data: All vitals and activity logs persist in local client storage.
              </span>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-xs font-bold text-[#00A88F] hover:underline"
              >
                Edit baseline
              </button>
            </div>
          </div>
        </section>

        {/* Right 1 Col: Recent Records Placeholder */}
        <section aria-labelledby="recent-records-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="recent-records-heading" className="text-base font-bold text-[#002B49]">
              Medical Documents
            </h2>
            <Link to="/records" className="text-xs text-[#00A88F] hover:underline font-bold">
              View vault
            </Link>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <EmptyState
              title={t.noRecordsYet}
              description="Keep lab panels, prescriptions, and physician notes securely stored under your client ownership."
              action={{
                label: t.uploadFirstReport,
                onClick: () => navigate('/records'),
              }}
              icon={<FileText className="w-8 h-8 text-slate-400 stroke-1" />}
            />

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero-knowledge client architecture ready for Supabase Storage buckets.</span>
            </div>
          </div>
        </section>
      </div>

      {/* Verified Health Insights Section (Signature Medical Grid Background) */}
      <HealthInsightsSection />

      {/* AI Assistant Banner */}
      <section className="bg-[#002B49] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00D2B4]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitmadix AI Assistant</span>
            <span aria-hidden="true">·</span>
            <span>Source-Grounded Medical Guidance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Have questions about a lab term or medication?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            The Fitmadix assistant translates complex clinical terminology into patient-friendly language with validated safety guardrails.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/ai')}
              className="px-5 py-2.5 text-xs font-bold text-[#002B49] bg-white hover:bg-[#F0FDF9] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
            >
              <span>{t.askAssistantAction}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#00A88F]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
