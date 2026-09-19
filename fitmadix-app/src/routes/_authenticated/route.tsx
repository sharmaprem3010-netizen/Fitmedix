import { createFileRoute, Outlet, redirect, useRouter, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import React, { useState, useEffect } from "react";
import { LayoutDashboard, Dumbbell, Utensils, Activity, User, MessageSquare, Stethoscope } from "lucide-react";

// Types
import type {
  NavigationTab,
  Routine,
  WorkoutSessionLog,
  MealItem,
  MacroTargets,
  UserMetrics,
  WeightLogEntry,
  VitalsData,
  Exercise,
  StrengthRecord,
} from "@/types/fitness";

// Only keep dark mode from localStorage — everything else is in Supabase
import { getDarkMode, setDarkMode } from "@/utils/storage";

import { useFitnessData } from "@/hooks/useFitnessData";
import { saveUserSettingsToDb } from "@/services/fitnessService";
import type { UserSettingsRow } from "@/services/fitnessService";

// Components
import { AppNavigation } from "@/components/layout/AppNavigation";
import { LiveWorkoutSession } from "@/components/workouts/LiveWorkoutSession";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/AppButton";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { VoiceOnboardingModal } from "@/components/ui/VoiceOnboardingModal";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { parseIntent } from "@/lib/voiceIntents";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

export type AuthenticatedContextType = {
  routines: Routine[];
  exercises: Exercise[];
  workoutLogs: WorkoutSessionLog[];
  meals: MealItem[];
  macroTargets: MacroTargets;
  weightLogs: WeightLogEntry[];
  strengthRecords: StrengthRecord[];
  vitals: VitalsData;
  userMetrics: UserMetrics;
  onStartWorkout: (routine: Routine) => void;
  onSaveRoutine: (routine: Routine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onAddMeal: (meal: MealItem) => void;
  onDeleteMeal: (mealId: string) => void;
  onUpdateMacroTargets: (targets: MacroTargets) => void;
  onUpdateUserMetrics: (metrics: UserMetrics) => void;
  onAddWeightLog: (entry: WeightLogEntry) => void;
  searchQuery: string;
  isLoading: boolean;
};

export const AuthenticatedContext = React.createContext<AuthenticatedContextType | null>(null);

function AuthenticatedLayout() {
  const router = useRouter();
  const location = useLocation();

  // Determine active tab from current route path
  const currentPath = location.pathname;
  let activeTab: NavigationTab = "dashboard";
  if (currentPath.includes("/workouts")) activeTab = "workouts";
  else if (currentPath.includes("/exercises")) activeTab = "exercises";
  else if (currentPath.includes("/nutrition")) activeTab = "nutrition";
  else if (currentPath.includes("/ai-coach")) activeTab = "ai-coach";
  else if (currentPath.includes("/analytics")) activeTab = "analytics";
  else if (currentPath.includes("/vitals")) activeTab = "vitals";
  else if (currentPath.includes("/hub")) activeTab = "hub";
  else if (currentPath.includes("/chat")) activeTab = "chat";
  else if (currentPath.includes("/symptoms")) activeTab = "symptoms";
  else if (currentPath.includes("/reports")) activeTab = "reports";
  else if (currentPath.includes("/medicines")) activeTab = "medicines";
  else if (currentPath.includes("/timeline")) activeTab = "timeline";
  else if (currentPath.includes("/progress")) activeTab = "progress";
  else if (currentPath.includes("/accessibility")) activeTab = "accessibility";
  else if (currentPath.includes("/food-log")) activeTab = "food-log";
  else if (currentPath.includes("/food-scan")) activeTab = "food-scan";
  else if (currentPath.includes("/prescription")) activeTab = "prescription";
  else if (currentPath.includes("/nearby")) activeTab = "nearby";
  else if (currentPath.includes("/profile")) activeTab = "profile";
  else if (currentPath.includes("/exercise")) activeTab = "exercise";
  else if (currentPath.startsWith("/encyclopedia")) activeTab = "encyclopedia";
  else if (currentPath.startsWith("/products")) activeTab = "products";
  else if (currentPath.startsWith("/admin")) activeTab = "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeLiveWorkout, setActiveLiveWorkout] = useState<Routine | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(true);
  
  const { voiceMode, readPage, stopSpeaking, localCommandHandler } = useAccessibility();

  const handleVoiceCommand = (text: string) => {
    // 1. Try local page handler first
    if (localCommandHandler && localCommandHandler(text)) {
      return;
    }

    // 2. Fallback to global intents
    const intent = parseIntent(text);
    
    switch (intent) {
      case "GO_HOME": router.navigate({ to: "/dashboard" }); break;
      case "OPEN_SYMPTOMS": router.navigate({ to: "/symptoms" }); break;
      case "OPEN_REPORTS": router.navigate({ to: "/reports" }); break;
      case "OPEN_MEDICINES": router.navigate({ to: "/medicines" }); break;
      case "OPEN_TIMELINE": router.navigate({ to: "/timeline" }); break;
      case "OPEN_NUTRITION": router.navigate({ to: "/nutrition" }); break;
      case "OPEN_WORKOUTS": router.navigate({ to: "/workouts" }); break;
      case "OPEN_SETTINGS": router.navigate({ to: "/accessibility" }); break;
      case "OPEN_AI": router.navigate({ to: "/chat" }); break;
      case "GO_BACK": window.history.back(); break;
      case "STOP_SPEAKING": stopSpeaking(); break;
      case "READ_PAGE": readPage(); break;
      case "UNKNOWN":
      default:
        // Pass unknown text to the chat or the specific route's context handler
        // if they are on a page that handles voice locally, we could emit an event,
        // but for now we fallback to Chat AI.
        router.navigate({ to: "/chat", search: { q: text } });
        break;
    }
  };

  // Initialize dark mode from localStorage (the ONLY localStorage thing we keep)
  useEffect(() => {
    try {
      setIsDark(getDarkMode());
    } catch {
      /* SSR fallback */
    }
  }, []);

  // Fetch ALL data from Supabase via React Query
  const {
    routines,
    exercises,
    workoutLogs,
    meals,
    weightLogs,
    macroTargets,
    userMetrics,
    strengthRecords,
    isLoading,
    saveRoutine,
    deleteRoutine,
    saveWorkout,
    saveMeal,
    deleteMeal,
    saveWeightLog,
    saveUserSettings,
  } = useFitnessData();

  const handleToggleDarkMode = () => {
    const nextVal = !isDark;
    setIsDark(nextVal);
    try {
      setDarkMode(nextVal);
    } catch {
      /* SSR guard */
    }
    if (nextVal) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleStartWorkout = (routine: Routine) => {
    if (!routine) return; // Guard against null
    setActiveLiveWorkout(routine);
  };

  const handleFinishLiveWorkout = (log: WorkoutSessionLog) => {
    saveWorkout(log);
    setActiveLiveWorkout(null);
    router.navigate({ to: "/dashboard" });
  };

  const handleNavigate = (tab: NavigationTab) => {
    // Map extended tabs to their actual routes
    const routeMap: Record<string, string> = {
      dashboard: "/dashboard",
      workouts: "/workouts",
      exercises: "/exercises",
      nutrition: "/nutrition",
      "ai-coach": "/ai-coach",
      analytics: "/analytics",
      vitals: "/vitals",
      hub: "/hub",
      chat: "/chat",
      "food-log": "/food-log",
      "food-scan": "/food-scan",
      prescription: "/prescription",
      nearby: "/nearby",
      profile: "/profile",
      exercise: "/exercise",
      encyclopedia: "/encyclopedia",
      products: "/products",
      admin: "/admin/encyclopedia",
      "encyclopedia-disease": "/encyclopedia",
      "encyclopedia-food": "/encyclopedia",
      "encyclopedia-medicine": "/encyclopedia",
      "symptoms": "/symptoms",
      "reports": "/reports",
      "medicines": "/medicines",
      "timeline": "/timeline",
      "progress": "/analytics",
      "accessibility": "/accessibility",
    };
    router.navigate({ to: routeMap[tab] || `/${tab}` });
  };

  const handleUpdateMacroTargets = (targets: MacroTargets) => {
    saveUserSettings({ macroTargets: targets, userMetrics });
  };

  const handleUpdateUserMetrics = (metrics: UserMetrics) => {
    saveUserSettings({ macroTargets, userMetrics: metrics });
  };

  // Calculate dynamic vitals from workout logs
  const dynamicVitals = React.useMemo((): VitalsData => {
    let streak = 0;
    const sortedLogs = [...workoutLogs].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

    if (sortedLogs.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let currentDate = new Date(sortedLogs[0].startTime);
      currentDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - currentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak = 1;
        for (let i = 1; i < sortedLogs.length; i++) {
          const logDate = new Date(sortedLogs[i].startTime);
          logDate.setHours(0, 0, 0, 0);

          const prevDate = new Date(sortedLogs[i - 1].startTime);
          prevDate.setHours(0, 0, 0, 0);

          const gap = Math.ceil(
            Math.abs(prevDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (gap === 1) streak++;
          else if (gap > 1) break;
        }
      }
    }

    // Weekly output (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = sortedLogs.filter((l) => new Date(l.startTime) >= sevenDaysAgo);

    const weeklyVolume = recentLogs.reduce((acc, log) => acc + log.totalVolumeKg, 0);
    const weeklyCalories = recentLogs.reduce((acc, log) => acc + log.caloriesBurnedEstimate, 0);
    const weeklyKwh = Math.round((weeklyCalories / 200) * 10) / 10;

    // Dynamic recovery score based on rest days and workout intensity
    const daysSinceLastWorkout =
      sortedLogs.length > 0
        ? Math.floor(
            (Date.now() - new Date(sortedLogs[0].startTime).getTime()) / (1000 * 60 * 60 * 24),
          )
        : 3;
    const recoveryScore = Math.min(
      100,
      Math.max(40, 60 + daysSinceLastWorkout * 15 - recentLogs.length * 5),
    );

    // Dynamic sleep score (simulated but based on workout pattern)
    const sleepScore = Math.min(100, Math.max(50, 75 + (daysSinceLastWorkout > 0 ? 10 : -5)));

    // Dynamic strain (based on recent workout volume)
    const strainScore = Math.min(21, Math.max(0, Math.round((weeklyVolume / 2000) * 10)));

    return {
      heartRateRecoveryBpm: Math.round(55 + recoveryScore / 10),
      restingHeartRateBpm: Math.round(58 - streak * 0.3),
      activeStreakDays: streak,
      weeklyOutputKwh: weeklyKwh,
      totalWeeklyVolumeKg: weeklyVolume,
      sleepScore,
      recoveryScore,
      strainScore,
      deviceName: "FitMadix Band",
      lastSynced: new Date().toISOString(),
    };
  }, [workoutLogs]);

  const context: AuthenticatedContextType = {
    routines,
    exercises,
    workoutLogs,
    meals,
    macroTargets,
    weightLogs,
    strengthRecords,
    vitals: dynamicVitals,
    userMetrics,
    onStartWorkout: handleStartWorkout,
    onSaveRoutine: (r) => saveRoutine(r),
    onDeleteRoutine: (id) => deleteRoutine(id),
    onAddMeal: (m) => saveMeal(m),
    onDeleteMeal: (id) => deleteMeal(id),
    onUpdateMacroTargets: handleUpdateMacroTargets,
    onUpdateUserMetrics: handleUpdateUserMetrics,
    onAddWeightLog: (entry) => saveWeightLog(entry),
    searchQuery,
    isLoading,
  };

  return (
    <div
      className={`h-dvh w-full flex overflow-hidden select-none font-sans ${isDark ? "bg-black text-white" : "bg-zinc-100 text-zinc-900"}`}
    >
      {/* Global Application Navigation */}
      <AppNavigation onOpenProfile={() => setIsProfileOpen(true)} />
      <main className="flex-1 h-full flex flex-col min-w-0 md:pt-16 pb-14 md:pb-0 relative overflow-y-auto overflow-x-hidden">
        <div className="flex-1 flex flex-col min-h-0 w-full relative z-10">
          <AuthenticatedContext.Provider value={context}>
            <Outlet />
          </AuthenticatedContext.Provider>
        </div>

        {/* Global Voice Button Container */}
        {voiceMode && (
          <div className="shrink-0 bg-background border-t border-border p-4 flex justify-center pb-safe z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <VoiceButton onResult={handleVoiceCommand} />
          </div>
        )}
        
        {!voiceMode && (
          <div className="hidden sm:block fixed bottom-6 right-6 z-40">
            <VoiceButton onResult={handleVoiceCommand} className="shadow-2xl" />
          </div>
        )}
      </main>

      {/* Modals and Overlays */}
      <VoiceOnboardingModal />

      {/* Live Workout Fullscreen Overlay */}
      {activeLiveWorkout && (
        <LiveWorkoutSession
          routine={activeLiveWorkout}
          onFinishWorkout={handleFinishLiveWorkout}
          onCancelWorkout={() => setActiveLiveWorkout(null)}
        />
      )}

      {/* Profile & Settings Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Athlete Profile & Preferences"
        subtitle="FitMadix Account & Device Settings"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-tr from-primary to-purple-500 opacity-20 blur-2xl rounded-full" />
              <div className="relative w-12 h-12 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-lg font-bold text-white">
                FM
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Athlete Profile</h4>
              <p className="text-xs text-zinc-400">Pro Member • Connected to FitMadix Band</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Biometric Defaults
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Weight:</span>{" "}
                <span className="font-bold text-white">{userMetrics.weightKg} kg</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Height:</span>{" "}
                <span className="font-bold text-white">{userMetrics.heightCm} cm</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Goal:</span>{" "}
                <span className="font-bold text-white capitalize">{userMetrics.goal}</span>
              </div>
              <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
                <span className="text-zinc-500">Age:</span>{" "}
                <span className="font-bold text-white">{userMetrics.age} yrs</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
            <button
              onClick={() => router.navigate({ to: "/profile" })}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
            >
              Edit Full Profile
            </button>
            <Button variant="primary" onClick={() => setIsProfileOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
