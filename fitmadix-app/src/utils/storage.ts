import { Routine, WorkoutSessionLog, MealItem, MacroTargets, WeightLogEntry, StrengthRecord, VitalsData, UserMetrics } from '../types/fitness';
import { INITIAL_ROUTINES, INITIAL_VITALS, INITIAL_MACRO_TARGETS, SAMPLE_MEALS, SAMPLE_WEIGHT_HISTORY, SAMPLE_STRENGTH_RECORDS } from '../data/mockData';

const STORAGE_KEYS = {
  ROUTINES: 'fitmadix_routines_v1',
  WORKOUT_LOGS: 'fitmadix_workout_logs_v1',
  MEALS: 'fitmadix_meals_v1',
  MACRO_TARGETS: 'fitmadix_macro_targets_v1',
  WEIGHT_LOGS: 'fitmadix_weight_logs_v1',
  STRENGTH_RECORDS: 'fitmadix_strength_records_v1',
  VITALS: 'fitmadix_vitals_v1',
  USER_METRICS: 'fitmadix_user_metrics_v1',
  DARK_MODE: 'fitmadix_dark_mode_v1'
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribeStorage(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyStorage() {
  listeners.forEach(fn => fn());
}

export function getRoutines(): Routine[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINES));
      return INITIAL_ROUTINES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ROUTINES;
  }
}

export function saveRoutine(routine: Routine): Routine[] {
  const routines = getRoutines();
  const existingIndex = routines.findIndex(r => r.id === routine.id);
  let updated: Routine[];
  if (existingIndex >= 0) {
    updated = [...routines];
    updated[existingIndex] = routine;
  } else {
    updated = [routine, ...routines];
  }
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updated));
  notifyStorage();
  return updated;
}

export function deleteRoutine(routineId: string): Routine[] {
  const routines = getRoutines().filter(r => r.id !== routineId);
  localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
  notifyStorage();
  return routines;
}

export function getWorkoutLogs(): WorkoutSessionLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWorkoutLog(log: WorkoutSessionLog): WorkoutSessionLog[] {
  const logs = getWorkoutLogs();
  const updated = [log, ...logs];
  localStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(updated));
  
  // Also update vitals
  const vitals = getVitals();
  vitals.totalWeeklyVolumeKg += log.totalVolumeKg;
  vitals.weeklyOutputKwh = Math.round((vitals.weeklyOutputKwh + (log.caloriesBurnedEstimate / 200)) * 10) / 10;
  vitals.activeStreakDays += 1;
  vitals.strainScore = Math.min(21, Math.round((vitals.strainScore + (log.durationSeconds / 300)) * 10) / 10);
  saveVitals(vitals);

  // Auto-record 1RM Strength PRs from completed exercise sets
  const currentRecords = getStrengthRecords();
  let recordsChanged = false;
  const updatedRecords = [...currentRecords];

  log.exerciseLogs.forEach(ex => {
    ex.sets.filter(s => s.completed && s.weightKg > 0 && s.reps > 0).forEach(set => {
      const estimated1RM = Math.round((set.weightKg * (1 + set.reps / 30)) * 10) / 10;
      const existingIdx = updatedRecords.findIndex(r => r.exerciseName.toLowerCase() === ex.exerciseName.toLowerCase());

      if (existingIdx >= 0) {
        if (estimated1RM > updatedRecords[existingIdx].estimatedOneRepMaxKg) {
          updatedRecords[existingIdx] = {
            id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            exerciseName: ex.exerciseName,
            weightKg: set.weightKg,
            reps: set.reps,
            estimatedOneRepMaxKg: estimated1RM,
            date: new Date().toISOString().split('T')[0],
          };
          recordsChanged = true;
        }
      } else {
        updatedRecords.push({
          id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          exerciseName: ex.exerciseName,
          weightKg: set.weightKg,
          reps: set.reps,
          estimatedOneRepMaxKg: estimated1RM,
          date: new Date().toISOString().split('T')[0],
        });
        recordsChanged = true;
      }
    });
  });

  if (recordsChanged) {
    localStorage.setItem(STORAGE_KEYS.STRENGTH_RECORDS, JSON.stringify(updatedRecords));
  }

  notifyStorage();
  return updated;
}

export function getMeals(): MealItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMeal(meal: MealItem): MealItem[] {
  const meals = getMeals();
  const updated = [meal, ...meals];
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(updated));
  notifyStorage();
  return updated;
}

export function deleteMeal(mealId: string): MealItem[] {
  const meals = getMeals().filter(m => m.id !== mealId);
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  notifyStorage();
  return meals;
}

export function getMacroTargets(): MacroTargets {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MACRO_TARGETS);
    return data ? JSON.parse(data) : INITIAL_MACRO_TARGETS;
  } catch {
    return INITIAL_MACRO_TARGETS;
  }
}

export function saveMacroTargets(targets: MacroTargets): MacroTargets {
  localStorage.setItem(STORAGE_KEYS.MACRO_TARGETS, JSON.stringify(targets));
  notifyStorage();
  return targets;
}

export function getWeightLogs(): WeightLogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addWeightLog(entry: WeightLogEntry): WeightLogEntry[] {
  const logs = getWeightLogs();
  const updated = [entry, ...logs].sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(updated));
  notifyStorage();
  return updated;
}

export function getStrengthRecords(): StrengthRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STRENGTH_RECORDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  notifyStorage();
}

export function getVitals(): VitalsData {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VITALS);
    return data ? JSON.parse(data) : INITIAL_VITALS;
  } catch {
    return INITIAL_VITALS;
  }
}

export function saveVitals(vitals: VitalsData): VitalsData {
  localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  notifyStorage();
  return vitals;
}

export function getUserMetrics(): UserMetrics {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_METRICS);
    return data ? JSON.parse(data) : {
      age: 28,
      gender: 'male',
      weightKg: 81.3,
      heightCm: 180,
      activityLevel: 'moderate',
      goal: 'cut',
      bodyFatPercentage: 14.5
    };
  } catch {
    return {
      age: 28,
      gender: 'male',
      weightKg: 81.3,
      heightCm: 180,
      activityLevel: 'moderate',
      goal: 'cut',
      bodyFatPercentage: 14.5
    };
  }
}

export function saveUserMetrics(metrics: UserMetrics): UserMetrics {
  localStorage.setItem(STORAGE_KEYS.USER_METRICS, JSON.stringify(metrics));
  notifyStorage();
  return metrics;
}

export function getDarkMode(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return val === null ? true : val === 'true'; // Default to true (Bold Typography theme)
  } catch {
    return true;
  }
}

export function setDarkMode(enabled: boolean) {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(enabled));
  notifyStorage();
}
