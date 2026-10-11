import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  userHealthSummaryService,
  UserHealthSummary,
  HeartRateReading,
} from "../../services/healthSummaryService";

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
      <div className="bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl text-xs">
        <p className="text-zinc-400 font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className="font-semibold text-white flex items-center gap-1.5"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color || "#10b981" }}
            />
            <span>{entry.name}:</span>
            <span className="font-mono text-zinc-100">
              {entry.value.toLocaleString()} {unit || ""}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface UserHealthDashboardProps {
  userId?: string;
  userName?: string;
  className?: string;
}

export const UserHealthDashboard: React.FC<UserHealthDashboardProps> = ({
  userId = "default_user",
  userName = "Member",
  className = "",
}) => {
  const [summary, setSummary] = useState<UserHealthSummary>(() =>
    userHealthSummaryService.getSummary(userId),
  );

  const [activeTab, setActiveTab] = useState<"overview" | "heart" | "activity">("overview");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<"heart" | "activity">("heart");

  // Heart log form
  const [bpmInput, setBpmInput] = useState<number>(72);
  const [stateInput, setStateInput] = useState<HeartRateReading["state"]>("resting");
  const [notesInput, setNotesInput] = useState<string>("");

  // Activity log form
  const [stepsInput, setStepsInput] = useState<number>(4500);
  const [minutesInput, setMinutesInput] = useState<number>(30);
  const [distanceInput, setDistanceInput] = useState<number>(3.2);

  const [message, setMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleRefresh = () => {
    const updated = userHealthSummaryService.getSummary(userId);
    setSummary(updated);
    showNotification("Health summary updated.");
  };

  const handleClearData = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Reset health summary metrics? This will clear all recorded readings.")
    ) {
      const cleared = userHealthSummaryService.clearData(userId);
      setSummary(cleared);
      showNotification("Metrics reset to empty authentic state.");
    }
  };

  const handleSaveHeartLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bpmInput || bpmInput < 35 || bpmInput > 240) {
      alert("Please enter a realistic heart rate between 35 and 240 BPM.");
      return;
    }
    const updated = userHealthSummaryService.logHeartRate(
      userId,
      Number(bpmInput),
      stateInput,
      notesInput.trim() || undefined,
    );
    setSummary(updated);
    setIsLogModalOpen(false);
    setNotesInput("");
    showNotification(`Recorded ${bpmInput} BPM (${stateInput}).`);
  };

  const handleSaveActivityLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepsInput || stepsInput <= 0) {
      alert("Please enter a valid step count.");
      return;
    }
    const updated = userHealthSummaryService.logActivity(
      userId,
      Number(stepsInput),
      Number(minutesInput),
      distanceInput ? Number(distanceInput) : undefined,
    );
    setSummary(updated);
    setIsLogModalOpen(false);
    showNotification(`Logged ${stepsInput.toLocaleString()} steps.`);
  };

  // Formatted Heart Rate Chart Data
  const heartRateChartData = useMemo(() => {
    if (!summary.heartRateReadings || summary.heartRateReadings.length === 0) {
      return [];
    }
    return summary.heartRateReadings.map((r, idx) => {
      const dateObj = new Date(r.timestamp);
      const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return {
        index: idx + 1,
        time: timeStr,
        bpm: r.bpm,
        state: r.state,
      };
    });
  }, [summary.heartRateReadings]);

  // Activity History Chart Data
  const activityChartData = useMemo(() => {
    if (!summary.activityHistory || summary.activityHistory.length === 0) {
      return [];
    }
    return summary.activityHistory.map((item) => ({
      day: item.dayLabel,
      date: item.date,
      steps: item.steps,
      activeMinutes: item.activeMinutes,
      calories: item.caloriesBurned,
      stepGoal: summary.dailyStepGoal,
    }));
  }, [summary.activityHistory, summary.dailyStepGoal]);

  const hasHeartData = summary.heartRateReadings.length > 0;
  const hasActivityData = summary.activityHistory.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert toast */}
      {message && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-2xl flex items-center justify-between text-sm shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Clinical Health Summary
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Biometric Activity & Heart Rate
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified biometric trends with zero synthetic data. Connect wearable or log readings.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors border border-zinc-700/50"
            title="Refresh metrics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          <button
            onClick={() => {
              setLogType("heart");
              setIsLogModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center gap-1.5 transition-colors border border-rose-500/40"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Heart Rate</span>
          </button>

          <button
            onClick={() => {
              setLogType("activity");
              setIsLogModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Activity</span>
          </button>

          {(hasHeartData || hasActivityData) && (
            <button
              onClick={handleClearData}
              className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Clear data"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "overview"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Overview Summary
        </button>
        <button
          onClick={() => setActiveTab("heart")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "heart"
              ? "bg-zinc-800 text-rose-400 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Heart Rate Tracking</span>
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "activity"
              ? "bg-zinc-800 text-emerald-400 shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>Activity & Steps</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Current */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Current Heart Rate
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.currentBpm !== null ? summary.currentBpm : "--"}
            </span>
            <span className="text-xs font-bold text-zinc-500">BPM</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            {summary.currentBpm !== null
              ? "Verified wearable reading"
              : "No reading yet. Log BPM to track."}
          </p>
        </div>

        {/* Resting Heart Rate */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Resting Heart Rate
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.restingHeartRate !== null ? summary.restingHeartRate : "--"}
            </span>
            <span className="text-xs font-bold text-zinc-500">BPM</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            {summary.restingHeartRate !== null
              ? summary.restingHeartRate < 60
                ? "Athletic resting zone"
                : "Healthy clinical baseline"
              : "Awaiting resting log entries"}
          </p>
        </div>

        {/* Weekly Steps Total */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Weekly Steps
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.weeklyStepsTotal.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-zinc-500">steps</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            {summary.weeklyStepsTotal > 0
              ? `${Math.round(summary.weeklyStepsTotal * 0.042)} kcal burned`
              : "No steps recorded this week"}
          </p>
        </div>

        {/* Active Minutes Total */}
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Weekly Active Min
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.weeklyActiveMinutesTotal}
            </span>
            <span className="text-xs font-bold text-zinc-500">min</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            Goal: {summary.dailyActiveMinutesGoal * 7} min / week
          </p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Recharts Area */}
        {(activeTab === "overview" || activeTab === "heart") && (
          <div
            className={`bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl ${
              activeTab === "heart" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-white text-base">Heart Rate Continuous Curve</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Real-time beats per minute across recorded sessions
                </p>
              </div>
              {hasHeartData && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>BPM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-0.5 bg-blue-400 border-dashed" />
                    <span>Normal Range</span>
                  </div>
                </div>
              )}
            </div>

            {hasHeartData ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={heartRateChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <YAxis
                      domain={[40, 180]}
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <Tooltip content={<CustomChartTooltip unit="BPM" />} />
                    <ReferenceLine
                      y={60}
                      stroke="#3b82f6"
                      strokeDasharray="3 3"
                      label={{ value: "Resting (60)", fill: "#60a5fa", fontSize: 10 }}
                    />
                    <ReferenceLine
                      y={100}
                      stroke="#f59e0b"
                      strokeDasharray="3 3"
                      label={{ value: "Max Resting (100)", fill: "#fbbf24", fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bpm"
                      name="Heart Rate"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#heartGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40">
                <Heart className="w-10 h-10 text-zinc-600 mb-2.5" />
                <h4 className="font-bold text-zinc-300 text-sm">No Heart Rate Readings</h4>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-4">
                  Log your first resting or workout reading to see the interactive Recharts curve.
                </p>
                <button
                  onClick={() => {
                    setLogType("heart");
                    setIsLogModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                >
                  Log Reading Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Activity & Steps Recharts Bar Chart */}
        {(activeTab === "overview" || activeTab === "activity") && (
          <div
            className={`bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl ${
              activeTab === "activity" ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Activity & Steps Timeline</h3>
                </div>
                <p className="text-xs text-zinc-400">Daily steps compared to your 10,000 target</p>
              </div>
              {hasActivityData && (
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Steps</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2.5 h-0.5 bg-emerald-400 border-dashed" />
                    <span>10k Goal</span>
                  </div>
                </div>
              )}
            </div>

            {hasActivityData ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityChartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#27272a" }}
                    />
                    <Tooltip content={<CustomChartTooltip unit="steps" />} />
                    <ReferenceLine
                      y={summary.dailyStepGoal}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{ value: "Goal (10k)", fill: "#34d399", fontSize: 10 }}
                    />
                    <Bar dataKey="steps" name="Daily Steps" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-zinc-950/40">
                <Footprints className="w-10 h-10 text-zinc-600 mb-2.5" />
                <h4 className="font-bold text-zinc-300 text-sm">No Activity Logged</h4>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-4">
                  Log your daily steps and active minutes to view activity breakdown.
                </p>
                <button
                  onClick={() => {
                    setLogType("activity");
                    setIsLogModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                >
                  Log Steps Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Honest Medical Transparency Disclaimer */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-zinc-300">Data Integrity Policy:</strong> Fitmadix displays only
          verified user logs and synced hardware data. No synthetic or inflated health numbers are
          generated. All heart rate metrics are for general fitness reference and do not constitute
          diagnostic cardiology.
        </p>
      </div>

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {logType === "heart" ? (
                  <>
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span>Log Heart Rate Reading</span>
                  </>
                ) : (
                  <>
                    <Footprints className="w-5 h-5 text-emerald-400" />
                    <span>Log Daily Activity</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-zinc-500 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {logType === "heart" ? (
              <form onSubmit={handleSaveHeartLog} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="240"
                    value={bpmInput}
                    onChange={(e) => setBpmInput(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    State / Condition
                  </label>
                  <select
                    value={stateInput}
                    onChange={(e) => setStateInput(e.target.value as HeartRateReading["state"])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-rose-500"
                  >
                    <option value="resting">Resting (Morning / Calm)</option>
                    <option value="walking">Walking / Low Activity</option>
                    <option value="active">Active (During Workout)</option>
                    <option value="post-workout">Post-Workout Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. After 5k run or 8hr sleep"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors font-bold shadow-md shadow-rose-500/20"
                  >
                    Save Reading
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveActivityLog} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Steps Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Active Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minutesInput}
                      onChange={(e) => setMinutesInput(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={distanceInput}
                      onChange={(e) => setDistanceInput(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors font-bold shadow-md shadow-emerald-500/20"
                  >
                    Save Activity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
