import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoutines,
  saveRoutineToDb,
  deleteRoutineFromDb,
  fetchWorkoutLogs,
  saveWorkoutSession,
  fetchMeals,
  saveMealToDb,
  deleteMealFromDb,
  fetchExercises,
  fetchWeightLogs,
  saveWeightLogToDb,
  fetchUserSettings,
  saveUserSettingsToDb,
  fetchStrengthRecords,
  upsertStrengthRecord,
} from "@/services/fitnessService";
import type {
  Routine,
  WorkoutSessionLog,
  MealItem,
  MacroTargets,
  UserMetrics,
  WeightLogEntry,
  StrengthRecord,
} from "@/types/fitness";
import { toast } from "sonner";

export function useFitnessData() {
  const queryClient = useQueryClient();

  // ── Queries ─────────────────────────────────────────

  const { data: routines = [], isLoading: isLoadingRoutines } = useQuery({
    queryKey: ["routines"],
    queryFn: fetchRoutines,
  });

  const { data: exercises = [], isLoading: isLoadingExercises } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const { data: workoutLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["workoutLogs"],
    queryFn: fetchWorkoutLogs,
  });

  const { data: meals = [], isLoading: isLoadingMeals } = useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });

  const { data: weightLogs = [], isLoading: isLoadingWeights } = useQuery({
    queryKey: ["weightLogs"],
    queryFn: fetchWeightLogs,
  });

  const { data: userSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["userSettings"],
    queryFn: fetchUserSettings,
  });

  const { data: strengthRecords = [], isLoading: isLoadingStrength } = useQuery({
    queryKey: ["strengthRecords"],
    queryFn: fetchStrengthRecords,
  });

  // ── Derived settings with defaults ──────────────────

  const macroTargets: MacroTargets = userSettings?.macroTargets ?? {
    calories: 2400,
    protein: 180,
    carbs: 250,
    fat: 70,
    waterMl: 3000,
  };

  const userMetrics: UserMetrics = userSettings?.userMetrics ?? {
    age: 25,
    gender: "male",
    weightKg: 75,
    heightCm: 175,
    activityLevel: "moderate",
    goal: "maintain",
  };

  // ── Mutations ───────────────────────────────────────

  const saveRoutineMutation = useMutation({
    mutationFn: saveRoutineToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success("Routine saved!");
    },
    onError: (err) => {
      toast.error("Failed to save routine");
      console.error(err);
    },
  });

  const deleteRoutineMutation = useMutation({
    mutationFn: deleteRoutineFromDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success("Routine deleted");
    },
  });

  const saveWorkoutMutation = useMutation({
    mutationFn: saveWorkoutSession,
    onSuccess: (_data, log: WorkoutSessionLog) => {
      queryClient.invalidateQueries({ queryKey: ["workoutLogs"] });
      toast.success("Workout logged successfully!");

      // Auto-calculate 1RM strength records from completed sets
      log.exerciseLogs.forEach((ex) => {
        ex.sets
          .filter((s) => s.completed && s.weightKg > 0 && s.reps > 0)
          .forEach((set) => {
            const estimated1RM = Math.round(set.weightKg * (1 + set.reps / 30) * 10) / 10;
            const existing = strengthRecords.find(
              (r) => r.exerciseName.toLowerCase() === ex.exerciseName.toLowerCase(),
            );
            if (!existing || estimated1RM > existing.estimatedOneRepMaxKg) {
              upsertStrengthRecord({
                id:
                  existing?.id || `sr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                exerciseName: ex.exerciseName,
                weightKg: set.weightKg,
                reps: set.reps,
                estimatedOneRepMaxKg: estimated1RM,
                date: new Date().toISOString().split("T")[0],
              }).then(() => {
                queryClient.invalidateQueries({ queryKey: ["strengthRecords"] });
              });
            }
          });
      });
    },
  });

  const saveMealMutation = useMutation({
    mutationFn: saveMealToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      toast.success("Meal logged!");
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMealFromDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });

  const saveWeightLogMutation = useMutation({
    mutationFn: saveWeightLogToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weightLogs"] });
      toast.success("Weight logged!");
    },
  });

  const saveUserSettingsMutation = useMutation({
    mutationFn: saveUserSettingsToDb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      toast.success("Settings saved!");
    },
  });

  // ── Return ──────────────────────────────────────────

  return {
    routines,
    exercises,
    workoutLogs,
    meals,
    weightLogs,
    macroTargets,
    userMetrics,
    strengthRecords,
    isLoading:
      isLoadingRoutines ||
      isLoadingLogs ||
      isLoadingMeals ||
      isLoadingExercises ||
      isLoadingWeights ||
      isLoadingSettings ||
      isLoadingStrength,
    saveRoutine: saveRoutineMutation.mutate,
    deleteRoutine: deleteRoutineMutation.mutate,
    saveWorkout: saveWorkoutMutation.mutate,
    saveMeal: saveMealMutation.mutate,
    deleteMeal: deleteMealMutation.mutate,
    saveWeightLog: saveWeightLogMutation.mutate,
    saveUserSettings: saveUserSettingsMutation.mutate,
  };
}
