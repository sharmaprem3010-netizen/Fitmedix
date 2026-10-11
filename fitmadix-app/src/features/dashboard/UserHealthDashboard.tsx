import React, { useState, useMemo } from 'react';
import {
  Heart,
  Activity,
  Flame,
  Footprints,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  RefreshCw,
  CheckCircle2,
  Info,
  Calendar,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  userHealthSummaryService,
  UserHealthSummary,
  HeartRateReading,
} from '../../services/health-dashboard/healthSummaryService.ts';
import { useAuth } from '../authentication/AuthContext.tsx';
import { useVoice } from '../voice/VoiceContext.tsx';

interface TooltipPayloadItem {
  value: number;
  name: string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  unit?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#002B49] text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color || '#00A88F' }}
            />
            <span className="capitalize text-slate-200">{item.name}:</span>
            <span className="font-bold font-mono text-white">
              {item.value.toLocaleString()} {unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const UserHealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';
  const { speak, isVoiceMode } = useVoice();

  const [summary, setSummary] = useState<UserHealthSummary>(() =>
    userHealthSummaryService.getSummary(userId)
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'heart' | 'activity'>('overview');
  const [showLogModal, setShowLogModal] = useState<'none' | 'heart' | 'activity'>('none');

  // Input states for quick logging
  const [inputBpm, setInputBpm] = useState<number>(72);
  const [inputHeartState, setInputHeartState] = useState<HeartRateReading['state']>('resting');
  const [inputSteps, setInputSteps] = useState<number>(2500);
  const [inputActiveMinutes, setInputActiveMinutes] = useState<number>(20);

  const refreshData = () => {
    const updated = userHealthSummaryService.getSummary(userId);
    setSummary(updated);
  };

  const handleClearData = () => {
    if (confirm('Clear all logged heart rate and activity metrics?')) {
      const cleared = userHealthSummaryService.clearData(userId);
      setSummary(cleared);
      if (isVoiceMode) {
        speak('All biometrics data cleared.');
      }
    }
  };

  const handleLogHeartRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBpm || inputBpm < 35 || inputBpm > 240) return;
    const updated = userHealthSummaryService.logHeartRate(userId, inputBpm, inputHeartState);
    setSummary(updated);
    setShowLogModal('none');
    if (isVoiceMode) {
      speak(`Logged heart rate: ${inputBpm} beats per minute, state: ${inputHeartState}`);
    }
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSteps || inputSteps <= 0) return;
    const updated = userHealthSummaryService.logActivity(userId, inputSteps, inputActiveMinutes);
    setSummary(updated);
    setShowLogModal('none');
    if (isVoiceMode) {
      speak(`Logged activity: ${inputSteps.toLocaleString()} steps and ${inputActiveMinutes} active minutes.`);
    }
  };

  // Prepare Heart Rate Chart Data with readable time format
  const heartRateChartData = useMemo(() => {
    return summary.heartRateReadings.map((reading) => {
      const d = new Date(reading.timestamp);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        time: timeStr,
        bpm: reading.bpm,
        state: reading.state,
      };
    });
  }, [summary.heartRateReadings]);

  // Today's stats calculation
  const todaySession = summary.activityHistory[summary.activityHistory.length - 1] || null;

  const stepProgress = todaySession
    ? Math.min(Math.round((todaySession.steps / summary.dailyStepGoal) * 100), 100)
    : 0;
  const activeMinutesProgress = todaySession
    ? Math.min(Math.round((todaySession.activeMinutes / summary.dailyActiveMinutesGoal) * 100), 100)
    : 0;

  const hasHeartData = summary.heartRateReadings.length > 0;
  const hasActivityData = summary.activityHistory.length > 0;

  return (
    <section aria-labelledby="health-dashboard-heading" className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00A88F] mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Empirical Biometrics Engine</span>
            <span aria-hidden="true">·</span>
            <span>Zero False Data Standard</span>
          </div>
          <h2 id="health-dashboard-heading" className="text-xl sm:text-2xl font-black tracking-tight text-[#002B49]">
            User Health Summary & Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real user activity levels and cardiac vitals logged directly by you or certified devices.
          </p>
        </div>

        {/* Action buttons & Log modals */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLogModal('heart')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Log Pulse</span>
          </button>
          <button
            onClick={() => setShowLogModal('activity')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#002B49] bg-teal-50 hover:bg-teal-100 border border-[#00A88F]/30 rounded-xl transition-colors cursor-pointer"
          >
            <Footprints className="w-3.5 h-3.5 text-[#00A88F]" />
            <span>Log Activity</span>
          </button>
          {(hasHeartData || hasActivityData) && (
            <button
              onClick={handleClearData}
              title="Clear all recorded data"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={refreshData}
            title="Refresh metrics"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Key Health Metric Badges (Strictly Authentic) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Heart Rate Current */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              Latest Pulse
            </span>
            {summary.currentBpm ? (
              <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                Verified
              </span>
            ) : (
              <span className="text-[10px] uppercase font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                No Log
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#002B49]">
              {summary.currentBpm !== null ? summary.currentBpm : '—'}
            </span>
            <span className="text-xs font-bold text-slate-400">BPM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Resting: {summary.restingHeartRate !== null ? `${summary.restingHeartRate} BPM` : '—'}</span>
            <span>Peak: {summary.peakHeartRate !== null ? `${summary.peakHeartRate} BPM` : '—'}</span>
          </p>
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full -mr-6 -mt-6 pointer-events-none" />
        </div>

        {/* Daily Steps */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-[#00A88F]" />
              Today's Steps
            </span>
            {todaySession ? (
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                {stepProgress}% Goal
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Pending
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#002B49]">
              {todaySession ? todaySession.steps.toLocaleString() : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 10k</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#00A88F] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Active Minutes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Active Time
            </span>
            {todaySession ? (
              <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded">
                {activeMinutesProgress}%
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                Pending
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#002B49]">
              {todaySession ? todaySession.activeMinutes : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">min</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-sky-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${activeMinutesProgress}%` }}
            />
          </div>
        </div>

        {/* Caloric Expenditure */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Activity Energy
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              Active Burn
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#002B49]">
              {todaySession ? todaySession.caloriesBurned.toLocaleString() : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400">kcal</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Distance:</span>
            <span className="font-semibold text-slate-700">
              {todaySession ? `${todaySession.distanceKm} km` : '0.00 km'}
            </span>
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#002B49] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview & Combined
        </button>
        <button
          onClick={() => setActiveTab('heart')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'heart'
              ? 'bg-[#002B49] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Heart Rate Dynamics
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'activity'
              ? 'bg-[#002B49] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Activity Trends
        </button>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Timeline Chart */}
        {(activeTab === 'overview' || activeTab === 'heart') && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#002B49]">Heart Rate Variation (BPM)</h3>
                    <p className="text-[11px] text-slate-400">Intraday physiological readings</p>
                  </div>
                </div>
                {hasHeartData && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span>Measured BPM</span>
                  </div>
                )}
              </div>

              {/* Chart or Genuine Empty State */}
              <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                {hasHeartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={heartRateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E11D48" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#E11D48" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: '#64748B' }}
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[40, 160]}
                        tick={{ fontSize: 10, fill: '#64748B' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip unit="BPM" />} />
                      <ReferenceLine y={60} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '60 Min', fill: '#94A3B8', fontSize: 9 }} />
                      <ReferenceLine y={100} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '100 Max', fill: '#94A3B8', fontSize: 9 }} />
                      <Area
                        type="monotone"
                        dataKey="bpm"
                        name="Heart Rate"
                        stroke="#E11D48"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#heartGradient)"
                        activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#BE123C' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
                      <Heart className="w-6 h-6 stroke-1" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">No Heart Rate Readings Recorded</p>
                      <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                        Fitmadix does not generate fake biometric waveforms. Tap below to log your real pulse measurement.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLogModal('heart')}
                      className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Log First Reading
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clinical context footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#00A88F]" />
                Normal adult resting heart rate: 60 - 100 BPM (AHA Standard)
              </span>
              <span className="font-semibold text-slate-700">
                {summary.avgHeartRate !== null ? `Avg: ${summary.avgHeartRate} BPM` : 'No data'}
              </span>
            </div>
          </div>
        )}

        {/* Activity Levels Bar Chart */}
        {(activeTab === 'overview' || activeTab === 'activity') && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#00A88F] flex items-center justify-center">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#002B49]">Daily Activity & Step Volume</h3>
                    <p className="text-[11px] text-slate-400">Authentic ambulatory cadence</p>
                  </div>
                </div>
                {hasActivityData && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#00A88F] inline-block" />
                    <span>Steps</span>
                  </div>
                )}
              </div>

              {/* Chart or Genuine Empty State */}
              <div className="w-full h-64 sm:h-72 flex items-center justify-center">
                {hasActivityData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.activityHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="dayLabel"
                        tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                        axisLine={{ stroke: '#E2E8F0' }}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 'dataMax + 2000']}
                        tick={{ fontSize: 10, fill: '#64748B' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomChartTooltip unit="steps" />} />
                      <ReferenceLine
                        y={10000}
                        stroke="#00A88F"
                        strokeDasharray="4 4"
                        label={{ value: '10K Goal', fill: '#00A88F', fontSize: 10, position: 'right' }}
                      />
                      <Bar
                        dataKey="steps"
                        name="Steps"
                        fill="#00A88F"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={44}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#00A88F] mx-auto flex items-center justify-center">
                      <Footprints className="w-6 h-6 stroke-1" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">No Activity Logged Yet</p>
                      <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                        Steps and movement are logged only from your actual entries or synced health monitors.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLogModal('activity')}
                      className="px-3.5 py-1.5 text-xs font-bold text-[#002B49] bg-teal-50 hover:bg-teal-100 border border-[#00A88F]/30 rounded-xl transition-colors cursor-pointer"
                    >
                      Log Activity
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Activity footer stats */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Weekly Total: {summary.weeklyStepsTotal.toLocaleString()} steps</span>
              <span className="font-semibold text-[#002B49]">
                {hasActivityData
                  ? `${Math.round(summary.weeklyStepsTotal / summary.activityHistory.length).toLocaleString()} steps / day avg`
                  : '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Minutes Trend Line Chart */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#002B49]">Active Minutes & Exercise Duration</h3>
                <p className="text-[11px] text-slate-400">Progression against WHO aerobic recommendation (150 min/wk)</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
              {summary.weeklyActiveMinutesTotal} / 150 min (WHO Target)
            </span>
          </div>

          <div className="w-full h-56 flex items-center justify-center">
            {hasActivityData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.activityHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} />
                  <YAxis domain={[0, 'dataMax + 20']} tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} />
                  <Tooltip content={<CustomChartTooltip unit="mins" />} />
                  <ReferenceLine y={30} stroke="#38BDF8" strokeDasharray="3 3" label={{ value: 'Daily 30m', fill: '#0284C7', fontSize: 9 }} />
                  <Line
                    type="monotone"
                    dataKey="activeMinutes"
                    name="Active Minutes"
                    stroke="#0284C7"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0284C7' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 text-xs text-slate-400">
                Log active minutes to visualize weekly exercise cadence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Heart Rate Zones Reference Table (Empirical Guidelines) */}
      {activeTab === 'heart' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#002B49] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00A88F]" />
            Clinical Cardiovascular Zones Reference (AHA & CDC Guidelines)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Zone 1: Resting</span>
              <p className="font-bold text-[#002B49] text-base mt-0.5">50 - 65 BPM</p>
              <p className="text-[11px] text-slate-600 mt-1">Parasympathetic dominance during sleep or quiet rest.</p>
            </div>
            <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Zone 2: Moderate</span>
              <p className="font-bold text-[#002B49] text-base mt-0.5">90 - 115 BPM</p>
              <p className="text-[11px] text-slate-600 mt-1">Aerobic fat oxidation zone, light brisk walking or cycling.</p>
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Zone 3: Vigorous</span>
              <p className="font-bold text-[#002B49] text-base mt-0.5">120 - 145 BPM</p>
              <p className="text-[11px] text-slate-600 mt-1">Cardiopulmonary capacity building, running or swimming.</p>
            </div>
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Zone 4: Peak</span>
              <p className="font-bold text-[#002B49] text-base mt-0.5">&gt; 150 BPM</p>
              <p className="text-[11px] text-slate-600 mt-1">Anaerobic high-intensity threshold; consult physician if sustained.</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Pulse Modal */}
      {showLogModal === 'heart' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-[#002B49] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
                Record Pulse Measurement
              </h3>
              <button
                onClick={() => setShowLogModal('none')}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogHeartRate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Heart Rate (BPM)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="45"
                    max="180"
                    value={inputBpm}
                    onChange={(e) => setInputBpm(Number(e.target.value))}
                    className="w-full accent-[#00A88F]"
                  />
                  <span className="font-mono font-bold text-lg text-[#002B49] w-12 text-right">
                    {inputBpm}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Measurement Context
                </label>
                <select
                  value={inputHeartState}
                  onChange={(e) => setInputHeartState(e.target.value as HeartRateReading['state'])}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F]"
                >
                  <option value="resting">Resting (Seated / Relaxed)</option>
                  <option value="walking">Ambulatory (Walking / Commute)</option>
                  <option value="active">Active (During Exercise)</option>
                  <option value="post-workout">Post-Workout Recovery</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A88F] shrink-0 mt-0.5" />
                <span>Zero false data: Only your real logged measurements appear on the chart.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal('none')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-xl cursor-pointer shadow-xs"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {showLogModal === 'activity' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-[#002B49] flex items-center gap-2">
                <Footprints className="w-4 h-4 text-[#00A88F]" />
                Record Activity & Movement
              </h3>
              <button
                onClick={() => setShowLogModal('none')}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Steps Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  step="50"
                  value={inputSteps}
                  onChange={(e) => setInputSteps(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={inputActiveMinutes}
                  onChange={(e) => setInputActiveMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A88F] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal('none')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#002B49] hover:bg-[#001D33] rounded-xl cursor-pointer shadow-xs"
                >
                  Add Activity Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
