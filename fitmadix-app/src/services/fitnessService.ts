import { supabase } from "@/integrations/supabase/client";
import type { Routine, WorkoutSessionLog, MealItem, MacroTargets, WeightLogEntry, VitalsData, UserMetrics, Exercise } from "@/types/fitness";

// ==========================================
// ROUTINES & EXERCISES
// ==========================================

export async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercises').select('*');
  if (error || !data) return [];
  
  return data.map((ex: any) => ({
    id: ex.id,
    exerciseId: ex.id, // Compatibility for legacy usage
    name: ex.name,
    category: ex.category || 'General',
    primaryMuscle: ex.primary_muscle || '',
    secondaryMuscles: ex.secondary_muscles || [],
    equipment: ex.equipment || 'Bodyweight',
    difficulty: (ex.difficulty as any) || 'Beginner',
    instructions: ex.instructions || [],
    tips: [], // we don't have tips in DB yet, but could add
    defaultSets: 3,
    defaultReps: '10-12',
    restSeconds: 60
  }));
}

export async function fetchRoutines(): Promise<Routine[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // In a full implementation, you would fetch from `routines` and `routine_exercises`
  // For now, we will try fetching routines. If none exist, we might return empty array.
  const { data, error } = await supabase
    .from('routines')
    .select(`
      *,
      routine_exercises (*, exercises(*))
    `)
    .eq('user_id', user.id);
  
  if (error || !data) return [];
  
  // Map Supabase rows to our Routine type
  return data.map((r: any) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle || '',
    category: r.category || 'General',
    durationMinutes: r.duration_minutes || 60,
    targetMuscles: r.target_muscles || [],
    difficulty: (r.difficulty as any) || 'Intermediate',
    exercises: (r.routine_exercises || []).sort((a: any, b: any) => a.order_index - b.order_index).map((re: any) => ({
      exerciseId: re.exercise_id,
      exerciseName: re.exercises?.name || 'Unknown',
      category: re.exercises?.category || 'General',
      sets: re.sets,
      reps: re.reps,
      restSeconds: re.rest_seconds,
      targetWeightKg: re.target_weight_kg,
    }))
  }));
}

export async function saveRoutineToDb(routine: Routine): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Since inserting a routine with exercises is complex, we do it in steps.
  // 1. Upsert routine
  const { data: insertedRoutine, error: routineError } = await supabase
    .from('routines')
    .upsert({
      id: routine.id.startsWith('routine-') ? undefined : routine.id, // Generate new UUID if it's a mock ID
      user_id: user.id,
      title: routine.title,
      subtitle: routine.subtitle,
      category: routine.category,
      difficulty: routine.difficulty,
      target_muscles: routine.targetMuscles,
      duration_minutes: routine.durationMinutes,
    })
    .select()
    .single();

  if (routineError || !insertedRoutine) throw routineError;

  // 2. Delete old routine_exercises if updating
  await supabase.from('routine_exercises').delete().eq('routine_id', insertedRoutine.id);

  // 3. Insert new routine_exercises
  if (routine.exercises.length > 0) {
    await supabase.from('routine_exercises').insert(
      routine.exercises.map((ex, index) => ({
        routine_id: insertedRoutine.id,
        exercise_id: ex.exerciseId, // Requires valid UUID in exercises table
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.restSeconds,
        target_weight_kg: ex.targetWeightKg,
        order_index: index,
      }))
    );
  }
}

export async function deleteRoutineFromDb(routineId: string): Promise<void> {
  await supabase.from('routines').delete().eq('id', routineId);
}

// ==========================================
// WORKOUT SESSIONS
// ==========================================

export async function fetchWorkoutLogs(): Promise<WorkoutSessionLog[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      routines (title),
      exercise_sets (*, exercises(name))
    `)
    .eq('user_id', user.id)
    .order('start_time', { ascending: false });

  if (error || !data) return [];

  return data.map((session: any) => {
    // Group sets by exercise
    const exerciseGroups: Record<string, any> = {};
    (session.exercise_sets || []).forEach((set: any) => {
      if (!exerciseGroups[set.exercise_id]) {
        exerciseGroups[set.exercise_id] = {
          exerciseId: set.exercise_id,
          exerciseName: set.exercises?.name || 'Unknown',
          sets: []
        };
      }
      exerciseGroups[set.exercise_id].sets.push({
        setNumber: set.set_number,
        reps: set.reps,
        weightKg: set.weight_kg,
        completed: set.completed
      });
    });

    return {
      id: session.id,
      routineId: session.routine_id || '',
      routineTitle: session.routines?.title || 'Custom Workout',
      startTime: session.start_time,
      endTime: session.end_time || session.start_time,
      durationSeconds: Math.floor((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000) || 0,
      totalVolumeKg: Number(session.total_volume_kg),
      caloriesBurnedEstimate: Number(session.calories_burned),
      completed: true,
      exerciseLogs: Object.values(exerciseGroups)
    };
  });
}

export async function saveWorkoutSession(log: WorkoutSessionLog): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      routine_id: log.routineId.includes('-') ? null : log.routineId, // Only valid UUIDs
      start_time: log.startTime,
      end_time: log.endTime,
      total_volume_kg: log.totalVolumeKg,
      calories_burned: log.caloriesBurnedEstimate,
    })
    .select()
    .single();

  if (sessionError || !session) throw sessionError;

  // Insert sets
  const setsToInsert: any[] = [];
  log.exerciseLogs.forEach(exLog => {
    exLog.sets.forEach(set => {
      setsToInsert.push({
        session_id: session.id,
        exercise_id: exLog.exerciseId.includes('-') ? null : exLog.exerciseId, // Must be UUID
        set_number: set.setNumber,
        reps: set.reps,
        weight_kg: set.weightKg,
        completed: set.completed,
      });
    });
  });

  if (setsToInsert.length > 0) {
    // Filter out mock IDs to avoid FK constraint errors, or ensure exercises are seeded
    const validSets = setsToInsert.filter(s => s.exercise_id);
    if (validSets.length > 0) {
       await supabase.from('exercise_sets').insert(validSets);
    }
  }
}

// ==========================================
// MEALS / NUTRITION
// ==========================================

export async function fetchMeals(): Promise<MealItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('food_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    name: row.food_name,
    calories: Number(row.calories),
    proteinG: Number(row.protein || 0),
    carbsG: Number(row.carbs || 0),
    fatG: Number(row.fat || 0),
    servingSize: row.serving_size || '1 serving',
    mealType: (row.meal_type || 'Snack') as any,
    loggedAt: row.date
  }));
}

export async function saveMealToDb(meal: MealItem): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('food_log').insert({
    user_id: user.id,
    food_name: meal.name,
    calories: meal.calories,
    protein: meal.proteinG,
    carbs: meal.carbsG,
    fat: meal.fatG,
    serving_size: meal.servingSize,
    meal_type: meal.mealType,
    date: meal.loggedAt || new Date().toISOString().split('T')[0],
  });
}

export async function deleteMealFromDb(mealId: string): Promise<void> {
  await supabase.from('food_log').delete().eq('id', mealId);
}

// ==========================================
// VITALS / WEIGHT LOGS
// ==========================================

export async function fetchWeightLogs(): Promise<WeightLogEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('vitals_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'weight')
    .order('date', { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    weightKg: Number(row.value),
    date: row.date
  }));
}

export async function saveWeightLogToDb(entry: WeightLogEntry): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('vitals_logs').insert({
    user_id: user.id,
    type: 'weight',
    value: entry.weightKg,
    unit: 'kg',
    date: entry.date
  });
}

// ==========================================
// USER SETTINGS (Macro Targets + User Metrics)
// ==========================================

export type UserSettingsRow = {
  macroTargets: MacroTargets;
  userMetrics: UserMetrics;
};

export async function fetchUserSettings(): Promise<UserSettingsRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Try to get from profiles table first (already has fitness fields)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    macroTargets: {
      calories: profile.target_calories || 2400,
      protein: profile.target_protein || 180,
      carbs: profile.target_carbs || 250,
      fat: profile.target_fats || 70,
      waterMl: 3000,
    },
    userMetrics: {
      age: profile.age || 25,
      gender: (profile.sex === 'female' ? 'female' : 'male') as 'male' | 'female',
      weightKg: profile.weight_kg || 75,
      heightCm: profile.height_cm || 175,
      activityLevel: (profile.fitness_level === 'advanced' ? 'active' : 'moderate') as any,
      goal: (profile.fitness_goal === 'weight_loss' ? 'cut' : profile.fitness_goal === 'muscle_gain' ? 'bulk' : 'maintain') as any,
      bodyFatPercentage: undefined,
    },
  };
}

export async function saveUserSettingsToDb(settings: UserSettingsRow): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('profiles').upsert({
    id: user.id,
    target_calories: settings.macroTargets.calories,
    target_protein: settings.macroTargets.protein,
    target_carbs: settings.macroTargets.carbs,
    target_fats: settings.macroTargets.fat,
    weight_kg: settings.userMetrics.weightKg,
    height_cm: settings.userMetrics.heightCm,
    age: settings.userMetrics.age,
    sex: settings.userMetrics.gender,
    fitness_goal: settings.userMetrics.goal === 'cut' ? 'weight_loss' : settings.userMetrics.goal === 'bulk' ? 'muscle_gain' : 'maintain',
  });
}

// ==========================================
// STRENGTH RECORDS (1RM PRs)
// ==========================================

import type { StrengthRecord } from "@/types/fitness";

export async function fetchStrengthRecords(): Promise<StrengthRecord[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // We'll store strength records in exercise_sets as personal records
  // For now, compute them from the workout logs
  const { data: sessions, error } = await supabase
    .from('workout_sessions')
    .select('id')
    .eq('user_id', user.id);
  
  if (error || !sessions || sessions.length === 0) return [];

  const sessionIds = sessions.map((s: any) => s.id);
  
  const { data: sets } = await supabase
    .from('exercise_sets')
    .select('*, exercises(name)')
    .in('session_id', sessionIds)
    .eq('completed', true)
    .gt('weight_kg', 0)
    .gt('reps', 0);

  if (!sets || sets.length === 0) return [];

  // Calculate best 1RM for each exercise
  const bestByExercise: Record<string, StrengthRecord> = {};
  
  sets.forEach((set: any) => {
    const name = set.exercises?.name || 'Unknown';
    const estimated1RM = Math.round((set.weight_kg * (1 + set.reps / 30)) * 10) / 10;
    
    if (!bestByExercise[name] || estimated1RM > bestByExercise[name].estimatedOneRepMaxKg) {
      bestByExercise[name] = {
        id: set.id,
        exerciseName: name,
        weightKg: set.weight_kg,
        reps: set.reps,
        estimatedOneRepMaxKg: estimated1RM,
        date: new Date(set.created_at).toISOString().split('T')[0],
      };
    }
  });

  return Object.values(bestByExercise).sort((a, b) => b.estimatedOneRepMaxKg - a.estimatedOneRepMaxKg);
}

export async function upsertStrengthRecord(record: StrengthRecord): Promise<void> {
  // Strength records are auto-computed from exercise_sets
  // This is a no-op since the data lives in exercise_sets already
  // The fetchStrengthRecords query will pick up the new data automatically
}
