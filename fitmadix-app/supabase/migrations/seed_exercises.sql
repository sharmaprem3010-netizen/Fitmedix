-- Seed data for exercises table

INSERT INTO public.exercises (id, name, category, primary_muscle, equipment, difficulty)
VALUES 
  (gen_random_uuid(), 'Barbell Bench Press', 'Chest', 'Pectoralis Major', 'Barbell', 'Intermediate'),
  (gen_random_uuid(), 'Incline Dumbbell Press', 'Chest', 'Upper Pectoralis', 'Dumbbell', 'Intermediate'),
  (gen_random_uuid(), 'Lat Pulldown', 'Back', 'Latissimus Dorsi', 'Cable', 'Beginner'),
  (gen_random_uuid(), 'Barbell Bent-Over Row', 'Back', 'Mid-Back & Lats', 'Barbell', 'Intermediate'),
  (gen_random_uuid(), 'Barbell Back Squat', 'Legs', 'Quadriceps', 'Barbell', 'Advanced'),
  (gen_random_uuid(), 'Romanian Deadlift (RDL)', 'Legs', 'Hamstrings', 'Barbell', 'Intermediate'),
  (gen_random_uuid(), 'Seated Overhead Dumbbell Press', 'Shoulders', 'Anterior & Medial Deltoids', 'Dumbbell', 'Intermediate'),
  (gen_random_uuid(), 'Lateral Cable Raises', 'Shoulders', 'Lateral Deltoids', 'Cable', 'Beginner'),
  (gen_random_uuid(), 'Barbell Bicep Curls', 'Arms', 'Biceps Brachii', 'Barbell', 'Beginner'),
  (gen_random_uuid(), 'Triceps Rope Pushdowns', 'Arms', 'Triceps Lateral & Medial Head', 'Cable', 'Beginner'),
  (gen_random_uuid(), 'Hanging Leg Raises', 'Core', 'Rectus Abdominis', 'Bodyweight', 'Intermediate'),
  (gen_random_uuid(), 'Assault Bike / Rowing Intervals', 'Cardio', 'Cardiovascular System', 'Machine', 'Intermediate');
