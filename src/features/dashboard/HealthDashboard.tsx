import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  Footprints,
  Flame,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Plus,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  Volume2,
  BookOpen,
  UserCheck,
  AlertCircle,
  Dumbbell,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';
import {
  userHealthSummaryService,
  UserHealthSummary,
  ActivitySession,
} from '../../services/health-dashboard/healthSummaryService.ts';
import { MedicalInsight } from '../insights/HealthInsightsSection.tsx';

const DEFAULT_MEDICAL_INSIGHTS: MedicalInsight[] = [
  {
    id: 'hd-insight-1',
    title: 'Zone 2 Cardio & Mitochondrial Biogenesis',
    category: 'Cardiovascular',
    snippet:
      'Sustained moderate aerobic exercise (60–70% max heart rate) stimulates mitochondrial density and improves capillary perfusion without elevating systemic cortisol.',
    clinicalContext:
      'Enhances left ventricular stroke volume, lactate clearance, and resting vagal tone (heart rate variability).',
    evidenceSource: 'American Heart Association (AHA) & ACSM',
    actionableAdvice:
      'Aim for 150 minutes per week of brisk conversational-pace walking, cycling, or swimming.',
    tags: ['Zone 2', 'Cardiology', 'Endurance'],
  },
  {
    id: 'hd-insight-2',
    title: 'Post-Meal Ambulatory Cadence & Glycemic Control',
    category: 'Metabolic Health',
    snippet:
      'A 10-to-15 minute light walk within 30 minutes of a meal recruits GLUT-4 transporters in skeletal muscle, blunting postprandial glucose excursions by up to 30%.',
    clinicalContext:
      'Non-insulin-mediated glucose uptake reduces pancreatic beta-cell workload and vascular endothelial glycation.',
    evidenceSource: 'American Diabetes Association (ADA) Clinical Care',
    actionableAdvice:
      'Take a brisk 10-minute walk after lunch and dinner to stabilize daily energy and glycemic variability.',
    tags: ['Glucose', 'Walking', 'Metabolism'],
  },
  {
    id: 'hd-insight-3',
    title: 'Sodium-to-Potassium Balance in Arterial Compliance',
    category: 'Cardiovascular',
    snippet:
      'Optimizing dietary potassium alongside moderate sodium reduction promotes renal natriuresis and endothelial nitric oxide vasodilation.',
    clinicalContext:
      'Reduces systemic vascular resistance and helps maintain systolic blood pressure below the 120 mmHg AHA threshold.',
    evidenceSource: 'World Health Organization (WHO) & DASH Trial',
    actionableAdvice:
      'Include potassium-rich leafy greens, legumes, and avocados alongside daily hydration.',
    tags: ['Blood Pressure', 'Electrolytes', 'Vascular'],
  },
  {
    id: 'hd-insight-4',
    title: 'Eccentric Resistance Loading & Tendon Integrity',
    category: 'Musculoskeletal',
    snippet:
      'Controlled eccentric muscle lengthening stimulates tenocyte mechanoreceptors and Type I collagen synthesis across load-bearing joints.',
    clinicalContext:
      'Preserves lean muscle mass, bone mineral density, and functional joint stability with aging.',
    evidenceSource: 'British Journal of Sports Medicine & NIH',
    actionableAdvice:
      'Incorporate two weekly strength sessions using controlled 3-second lowering phases.',
    tags: ['Strength', 'Longevity', 'Mobility'],
  },
];

export const HealthDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, isProfileComplete } = useAuth();
  const { speak, isVoiceMode } = useVoice();

  const userId = user?.id || 'guest';
  const displayName = profile?.fullName || user?.fullName || 'Health Explorer';

  // User fitness & biometric summary state
  const [summary, setSummary] = useState<UserHealthSummary>(() =>
    userHealthSummaryService.getSummary(userId)
  );

  // Recent medical insights state
  const [insights, setInsights] = useState<MedicalInsight[]>(DEFAULT_MEDICAL_INSIGHTS);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  // Quick fitness log modal state
  const [showQuickLog, setShowQuickLog] = useState<boolean>(false);
  const [stepsInput, setStepsInput] = useState<number>(3500);
  const [minutesInput, setMinutesInput] = useState<number>(30);
  const [activityTypeInput, setActivityTypeInput] =
    useState<ActivitySession['activityType']>('walking');
  const [logFeedback, setLogFeedback] = useState<string | null>(null);

  // Sync summary when user changes
  useEffect(() => {
    setSummary(userHealthSummaryService.getSummary(userId));
  }, [userId]);

  // Fetch recent medical insights from backend
  const fetchRecentInsights = async (categoryFilter: string, forceRefresh = false) => {
    setLoadingInsights(true);
    try {
      const response = await fetch('/api/health-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryFilter,
          count: 4,
          language: profile?.preferredLanguage || 'en',
          forceRefresh,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.insights) && data.insights.length > 0) {
          setInsights(data.insights.slice(0, 4));
        }
      }
    } catch {
      // Retain verified default insights on offline/error
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchRecentInsights(selectedCategory, false);
  }, [selectedCategory]);

  // Derived fitness metrics
  const fitnessMetrics = useMemo(() => {
    const history = summary.activityHistory || [];
    const totalCalories = history.reduce((acc, item) => acc + (item.caloriesBurned || 0), 0);
    const totalDistanceKm = history.reduce((acc, item) => acc + (item.distanceKm || 0), 0);
    const latestSession = history.length > 0 ? history[history.length - 1] : null;
    const todaySteps = latestSession ? latestSession.steps : 0;
    const stepGoalPct = Math.min(100, Math.round((todaySteps / (summary.dailyStepGoal || 10000)) * 100));
    const whoWeeklyMinutesGoal = 150;
    const weeklyActivePct = Math.min(
      100,
      Math.round((summary.weeklyActiveMinutesTotal / whoWeeklyMinutesGoal) * 100)
    );

    const latestBP = summary.latestBloodPressure;
    const mapValue = latestBP
      ? Math.round(latestBP.diastolic + (latestBP.systolic - latestBP.diastolic) / 3)
      : 90;

    return {
      totalCalories: totalCalories || Math.round(summary.weeklyStepsTotal * 0.04),
      totalDistanceKm: totalDistanceKm ? totalDistanceKm.toFixed(1) : ((summary.weeklyStepsTotal * 0.762) / 1000).toFixed(1),
      todaySteps,
      stepGoalPct,
      whoWeeklyMinutesGoal,
      weeklyActivePct,
      latestBP,
      mapValue,
    };
  }, [summary]);

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = userHealthSummaryService.logActivity(
      userId,
      stepsInput,
      minutesInput,
      activityTypeInput
    );
    setSummary({ ...updated });
    setShowQuickLog(false);
    setLogFeedback(`Logged +${stepsInput.toLocaleString()} steps & ${minutesInput} active mins`);
    if (isVoiceMode) {
      speak(`Logged ${stepsInput} steps and ${minutesInput} active minutes to your fitness dashboard.`);
    }
    setTimeout(() => setLogFeedback(null), 3500);
  };

  const handleAskAIAboutStats = () => {
    const bpText = fitnessMetrics.latestBP
      ? `${fitnessMetrics.latestBP.systolic}/${fitnessMetrics.latestBP.diastolic} mmHg (${fitnessMetrics.latestBP.category})`
      : '118/76 mmHg';
    const hrText = summary.restingHeartRate ? `${summary.restingHeartRate} BPM` : '68 BPM';
    navigate('/ai', {
      state: {
        initialQuery: `Based on my current fitness stats — Weekly Steps: ${summary.weeklyStepsTotal.toLocaleString()}, Weekly Active Minutes: ${summary.weeklyActiveMinutesTotal}/150 mins, Resting Heart Rate: ${hrText}, and Blood Pressure: ${bpText} — what are the top 3 evidence-based recommendations to optimize my cardiovascular and metabolic fitness?`,
      },
    });
  };

  const handleAskAIAboutInsight = (insight: MedicalInsight) => {
    navigate('/ai', {
      state: {
        initialQuery: `Can you explain "${insight.title}" (${insight.category}) in more detail and how I can apply "${insight.actionableAdvice}" to my daily health routine?`,
      },
    });
  };

  return (
    <section
      aria-labelledby="health-dashboard-title"
      className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xs space-y-6 text-left min-w-0"
    >
      {/* Top User & AuthContext Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0FDF9] text-[#00A88F] border border-[#00A88F]/20">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Authenticated Member' : 'Guest Session'}</span>
            </span>
            {profile?.bloodGroup && profile.bloodGroup !== 'unknown' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-[#002B49]">
                Blood Group: {profile.bloodGroup}
              </span>
            )}
            {profile?.healthGoals && profile.healthGoals.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 capitalize">
                Focus: {profile.healthGoals[0].replace(/-/g, ' ')}
              </span>
            )}
          </div>

          <h2
            id="health-dashboard-title"
            className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]"
          >
            {displayName}&apos;s Fitness &amp; Clinical Intelligence Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Real-time ambulatory fitness telemetry, cardiovascular vitals, and peer-reviewed medical insights personalized via your Fitmadix profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowQuickLog(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#002B49] bg-[#F0FDF9] hover:bg-[#E0FBF4] border border-[#00A88F]/30 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#00A88F]" />
            <span>Log Workout / Steps</span>
          </button>

          <button
            onClick={handleAskAIAboutStats}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00D2B4]" />
            <span>AI Fitness Review</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner on New Log */}
      {logFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {logFeedback}
          </span>
          <button
            onClick={() => setLogFeedback(null)}
            className="text-emerald-700 hover:underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4-Card Fitness & Biometric Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Weekly & Daily Steps */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Ambulatory Steps</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00A88F] flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#002B49]">
                {summary.weeklyStepsTotal.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">steps (7d)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Latest day: <strong className="text-slate-700">{fitnessMetrics.todaySteps.toLocaleString()}</strong> /{' '}
              {(summary.dailyStepGoal || 10000).toLocaleString()} goal
            </p>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00A88F] rounded-full transition-all duration-500"
                style={{ width: `${fitnessMetrics.stepGoalPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>{fitnessMetrics.stepGoalPct}% Daily Target</span>
              <span>{fitnessMetrics.totalDistanceKm} km total</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Minutes & WHO Target */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Active Exercise</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#002B49]">
                {summary.weeklyActiveMinutesTotal}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {fitnessMetrics.whoWeeklyMinutesGoal} mins
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              WHO aerobic standard (150 min/week)
            </p>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${fitnessMetrics.weeklyActivePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>{fitnessMetrics.weeklyActivePct}% Weekly Goal</span>
              <span>~{fitnessMetrics.totalCalories} kcal burned</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cardiac Conditioning (Heart Rate) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Cardiac Conditioning</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#002B49]">
                {summary.restingHeartRate ?? 68}
              </span>
              <span className="text-xs text-slate-500 font-medium">BPM resting</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Peak: <strong className="text-slate-700">{summary.peakHeartRate ?? 112} BPM</strong> · Avg:{' '}
              <strong className="text-slate-700">{summary.avgHeartRate ?? 72} BPM</strong>
            </p>
          </div>

          <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">AHA Resting Range:</span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              60–100 BPM Optimal
            </span>
          </div>
        </div>

        {/* Card 4: Hemodynamic Pressure (BP & MAP) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Blood Pressure</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-[#002B49]">
                {fitnessMetrics.latestBP
                  ? `${fitnessMetrics.latestBP.systolic}/${fitnessMetrics.latestBP.diastolic}`
                  : '118/76'}
              </span>
              <span className="text-xs text-slate-500 font-medium">mmHg</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mean Arterial Pressure (MAP): <strong className="text-slate-700">{fitnessMetrics.mapValue} mmHg</strong>
            </p>
          </div>

          <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">AHA Stage:</span>
            <span className="font-bold text-[#00A88F] bg-[#F0FDF9] px-2 py-0.5 rounded border border-[#00A88F]/20">
              {fitnessMetrics.latestBP?.category || 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Fitness Cadence Chart (Left 5 Cols) + Recent Medical Insights (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Column: Fitness Activity Trend & Profile Context */}
        <div className="lg:col-span-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00A88F]">
                Fitness Telemetry
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {summary.activityHistory.length} Recorded Sessions
              </span>
            </div>
            <h3 className="text-base font-bold text-[#002B49]">
              Step Cadence &amp; Daily Target
            </h3>
          </div>

          <div className="w-full h-56 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={summary.activityHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="dayLabel"
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} steps`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#002B49',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={summary.dailyStepGoal || 10000}
                  stroke="#00A88F"
                  strokeDasharray="4 4"
                />
                <Bar
                  dataKey="steps"
                  fill="#00A88F"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AuthContext Profile Clinical Snapshot */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#002B49] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00A88F]" />
                Authenticated Clinical Context
              </span>
              {!isProfileComplete && (
                <Link
                  to="/onboarding"
                  className="text-[11px] font-bold text-[#00A88F] hover:underline"
                >
                  Complete Profile →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Known Conditions:</span>
                <span className="font-semibold text-slate-800">
                  {profile?.knownConditions && profile.knownConditions.length > 0
                    ? profile.knownConditions.join(', ')
                    : 'None reported'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Allergies:</span>
                <span className="font-semibold text-slate-800">
                  {profile?.allergies && profile.allergies.length > 0
                    ? profile.allergies.join(', ')
                    : 'None reported'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Medical Insights Feed */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00A88F]">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Peer-Reviewed Literature</span>
              </div>
              <h3 className="text-base font-bold text-[#002B49]">
                Recent Medical Insights
              </h3>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Cardiovascular', 'Metabolic Health', 'Musculoskeletal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#002B49] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => fetchRecentInsights(selectedCategory, true)}
                disabled={loadingInsights}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-[#00A88F] cursor-pointer"
                title="Refresh medical insights"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Insights List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {insights.map((item) => {
              const isExpanded = expandedInsightId === item.id;
              return (
                <article
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/90 hover:border-[#00A88F]/60 transition-all flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF9] text-[#00A88F] rounded-md border border-[#00A88F]/20">
                        {item.category}
                      </span>
                      <button
                        onClick={() =>
                          speak(`${item.title}. ${item.snippet} Actionable advice: ${item.actionableAdvice}`)
                        }
                        className="p-1 text-slate-400 hover:text-[#00A88F] rounded-md cursor-pointer"
                        title="Read insight aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-[#002B49] leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.snippet}
                    </p>

                    {isExpanded && (
                      <div className="pt-2 space-y-2 border-t border-slate-200/60 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                          <span className="font-bold text-[#002B49] block mb-0.5">
                            Physiological Mechanism:
                          </span>
                          <p className="text-slate-600">{item.clinicalContext}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#F0FDF9] border border-[#00A88F]/20">
                          <span className="font-bold text-[#00A88F] block mb-0.5">
                            Actionable Protocol:
                          </span>
                          <p className="text-[#002B49]">{item.actionableAdvice}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 text-[11px]">
                    <button
                      onClick={() => setExpandedInsightId(isExpanded ? null : item.id)}
                      className="font-bold text-slate-600 hover:text-[#002B49] cursor-pointer"
                    >
                      {isExpanded ? 'Hide Details' : 'Clinical Mechanism'}
                    </button>

                    <button
                      onClick={() => handleAskAIAboutInsight(item)}
                      className="inline-flex items-center gap-1 font-bold text-[#00A88F] hover:underline cursor-pointer"
                    >
                      <span>Ask AI</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Fitness Log Modal */}
      {showQuickLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-[#002B49] flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#00A88F]" />
                Log Fitness Session
              </h3>
              <button
                onClick={() => setShowQuickLog(false)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Activity Type
                </label>
                <select
                  value={activityTypeInput}
                  onChange={(e) =>
                    setActivityTypeInput(e.target.value as ActivitySession['activityType'])
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F]"
                >
                  <option value="walking">Brisk Walking</option>
                  <option value="running">Running / Jogging</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="hiit">Strength / HIIT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Steps Completed
                </label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  step="100"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Active Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickLog(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#00A88F] hover:bg-[#00947D] rounded-xl cursor-pointer shadow-xs"
                >
                  Save to Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthDashboard;
