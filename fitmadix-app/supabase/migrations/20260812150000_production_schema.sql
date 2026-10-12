-- ==============================================================================
-- FITMADIX PRODUCTION SCHEMA MIGRATION
-- Apply this in the Supabase SQL Editor to create all necessary tables.
-- ==============================================================================

-- 1. PROFILES UPDATE (Add missing fields to existing profiles table)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS height_cm NUMERIC,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
ADD COLUMN IF NOT EXISTS fitness_goal TEXT,
ADD COLUMN IF NOT EXISTS fitness_level TEXT,
ADD COLUMN IF NOT EXISTS training_preference TEXT,
ADD COLUMN IF NOT EXISTS dietary_preference TEXT,
ADD COLUMN IF NOT EXISTS target_calories INT,
ADD COLUMN IF NOT EXISTS target_protein INT,
ADD COLUMN IF NOT EXISTS target_carbs INT,
ADD COLUMN IF NOT EXISTS target_fats INT;

-- 2. EXERCISES (Global Database of Exercises)
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  primary_muscle TEXT,
  secondary_muscles TEXT[],
  equipment TEXT,
  difficulty TEXT,
  instructions TEXT[],
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exercises TO authenticated;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "exercises_select_all" ON public.exercises;
CREATE POLICY "exercises_select_all" ON public.exercises FOR SELECT USING (true);

-- 3. ROUTINES (Workout Plans)
CREATE TABLE IF NOT EXISTS public.routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  difficulty TEXT,
  target_muscles TEXT[],
  duration_minutes INT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routines TO authenticated;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "routines_all_own" ON public.routines;
CREATE POLICY "routines_all_own" ON public.routines FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. ROUTINE EXERCISES (Exercises within a Routine)
CREATE TABLE IF NOT EXISTS public.routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INT,
  reps TEXT,
  rest_seconds INT,
  target_weight_kg NUMERIC,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_exercises TO authenticated;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "routine_exercises_select_own" ON public.routine_exercises;
CREATE POLICY "routine_exercises_select_own" ON public.routine_exercises FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.routines WHERE routines.id = routine_exercises.routine_id AND routines.user_id = auth.uid())
);
DROP POLICY IF EXISTS "routine_exercises_insert_own" ON public.routine_exercises;
CREATE POLICY "routine_exercises_insert_own" ON public.routine_exercises FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.routines WHERE routines.id = routine_exercises.routine_id AND routines.user_id = auth.uid())
);
DROP POLICY IF EXISTS "routine_exercises_update_own" ON public.routine_exercises;
CREATE POLICY "routine_exercises_update_own" ON public.routine_exercises FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.routines WHERE routines.id = routine_exercises.routine_id AND routines.user_id = auth.uid())
);
DROP POLICY IF EXISTS "routine_exercises_delete_own" ON public.routine_exercises;
CREATE POLICY "routine_exercises_delete_own" ON public.routine_exercises FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.routines WHERE routines.id = routine_exercises.routine_id AND routines.user_id = auth.uid())
);

-- 5. WORKOUT SESSIONS (Completed Workouts)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.routines(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  total_volume_kg NUMERIC DEFAULT 0,
  calories_burned NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sessions TO authenticated;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "workout_sessions_all_own" ON public.workout_sessions;
CREATE POLICY "workout_sessions_all_own" ON public.workout_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. EXERCISE SETS (Logged Sets during a session)
CREATE TABLE IF NOT EXISTS public.exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  set_number INT NOT NULL,
  reps INT,
  weight_kg NUMERIC,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercise_sets TO authenticated;
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "exercise_sets_all_own" ON public.exercise_sets;
CREATE POLICY "exercise_sets_all_own" ON public.exercise_sets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workout_sessions WHERE workout_sessions.id = exercise_sets.session_id AND workout_sessions.user_id = auth.uid())
);

-- 7. FOOD LOG (Meal Logging)
CREATE TABLE IF NOT EXISTS public.food_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  serving_size TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  meal_type TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_log TO authenticated;
ALTER TABLE public.food_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "food_log_all_own" ON public.food_log;
CREATE POLICY "food_log_all_own" ON public.food_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. ACTIVITY LOGS (For Streak & Dashboard calculations)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  duration_minutes INT,
  calories_burned NUMERIC,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO authenticated;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "activity_logs_all_own" ON public.activity_logs;
CREATE POLICY "activity_logs_all_own" ON public.activity_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 9. DEVICES
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  status TEXT NOT NULL,
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devices TO authenticated;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "devices_all_own" ON public.devices;
CREATE POLICY "devices_all_own" ON public.devices FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. VITALS LOGS
CREATE TABLE IF NOT EXISTS public.vitals_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vitals_logs TO authenticated;
ALTER TABLE public.vitals_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "vitals_logs_all_own" ON public.vitals_logs;
CREATE POLICY "vitals_logs_all_own" ON public.vitals_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_routines_updated ON public.routines;
CREATE TRIGGER trg_routines_updated BEFORE UPDATE ON public.routines
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
