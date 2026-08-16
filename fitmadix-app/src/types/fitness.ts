export type NavigationTab = 
  | 'dashboard' 
  | 'workouts' 
  | 'exercises' 
  | 'nutrition' 
  | 'ai-coach' 
  | 'analytics' 
  | 'vitals'
  | 'hub'
  | 'chat'
  | 'food-log'
  | 'food-scan'
  | 'prescription'
  | 'nearby'
  | 'profile'
  | 'exercise'
  | 'encyclopedia-food'
  | 'encyclopedia-medicine'
  | 'encyclopedia-disease';

export type ExerciseCategory = 
  | 'Chest' 
  | 'Back' 
  | 'Legs' 
  | 'Shoulders' 
  | 'Arms' 
  | 'Core' 
  | 'Cardio' 
  | 'Full Body';

export type EquipmentType = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Machine' 
  | 'Cable' 
  | 'Bodyweight' 
  | 'Kettlebell' 
  | 'Bands';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  tips: string[];
  gifUrl?: string;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  sets: number;
  reps: string;
  targetWeightKg?: number;
  restSeconds: number;
  notes?: string;
}

export interface Routine {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  durationMinutes: number;
  targetMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: RoutineExercise[];
  isCustom?: boolean;
  createdAt?: string;
}

export interface SetLog {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutSessionLog {
  id: string;
  routineId: string;
  routineTitle: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  totalVolumeKg: number;
  caloriesBurnedEstimate: number;
  exerciseLogs: ExerciseLog[];
  completed: boolean;
  notes?: string;
}

export interface MealItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  loggedAt: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
}

export interface UserMetrics {
  age: number;
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
  goal: 'cut' | 'maintain' | 'bulk';
  bodyFatPercentage?: number;
}

export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface StrengthRecord {
  id: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  estimatedOneRepMaxKg: number;
  date: string;
}

export interface VitalsData {
  heartRateRecoveryBpm: number;
  restingHeartRateBpm: number;
  activeStreakDays: number;
  weeklyOutputKwh: number;
  totalWeeklyVolumeKg: number;
  sleepScore: number; // 0-100
  recoveryScore: number; // 0-100
  strainScore: number; // 0-21
  deviceName: string;
  lastSynced: string;
}

export interface AIWorkoutPlan {
  title: string;
  summary: string;
  splitOverview: string;
  exercises: {
    name: string;
    category: ExerciseCategory;
    sets: number;
    reps: string;
    restSeconds: number;
    reasoning: string;
  }[];
}

export interface AIMealPlan {
  title: string;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  meals: {
    mealName: string;
    timeSlot: string;
    description: string;
    ingredients: string[];
    macros: { calories: number; protein: number; carbs: number; fat: number };
  }[];
}
