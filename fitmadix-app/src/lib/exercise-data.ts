export type MuscleGroup = "full_body" | "arms" | "legs" | "abs" | "chest" | "back" | "stretching";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  duration_seconds?: number; // For timed exercises
  reps?: number; // For rep-based exercises
  icon: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  exercises: Exercise[];
  restDurationSeconds: number;
  estimatedMinutes: number;
  estimatedCalories: number;
}

const allExercises: Record<string, Exercise> = {
  jumping_jacks: {
    id: "jumping_jacks",
    name: "Jumping Jacks",
    description:
      "Start with your feet together and arms by your sides, then jump up with your feet apart and your hands overhead.",
    muscleGroup: "full_body",
    duration_seconds: 30,
    icon: "🏃",
  },
  pushups: {
    id: "pushups",
    name: "Push-ups",
    description:
      "Start in a plank position and lower your body until your chest nearly touches the floor.",
    muscleGroup: "chest",
    reps: 10,
    icon: "💪",
  },
  squats: {
    id: "squats",
    name: "Squats",
    description:
      "Stand with your feet shoulder-width apart, and lower your hips as if sitting in a chair.",
    muscleGroup: "legs",
    reps: 15,
    icon: "🦵",
  },
  plank: {
    id: "plank",
    name: "Plank",
    description:
      "Hold a push-up position with your weight on your forearms, keeping your body straight.",
    muscleGroup: "abs",
    duration_seconds: 30,
    icon: "🧘",
  },
  crunches: {
    id: "crunches",
    name: "Crunches",
    description: "Lie on your back with knees bent and lift your shoulders towards the ceiling.",
    muscleGroup: "abs",
    reps: 15,
    icon: "💥",
  },
  lunges: {
    id: "lunges",
    name: "Lunges",
    description:
      "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle.",
    muscleGroup: "legs",
    reps: 12,
    icon: "🚶",
  },
  high_knees: {
    id: "high_knees",
    name: "High Knees",
    description: "Run in place, bringing your knees as high as possible.",
    muscleGroup: "full_body",
    duration_seconds: 30,
    icon: "🏃‍♂️",
  },
  burpees: {
    id: "burpees",
    name: "Burpees",
    description:
      "Drop into a squat, kick your feet back to a plank, return to a squat, and stand up.",
    muscleGroup: "full_body",
    reps: 8,
    icon: "🔥",
  },
  stretching: {
    id: "stretching",
    name: "Full Body Stretch",
    description: "Reach for your toes, then stretch your arms overhead.",
    muscleGroup: "stretching",
    duration_seconds: 60,
    icon: "🤸",
  },
};

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "full_body_beginner",
    title: "Full Body Starter",
    description: "A great introductory workout to get your heart pumping and muscles moving.",
    muscleGroup: "full_body",
    difficulty: "beginner",
    restDurationSeconds: 20,
    estimatedMinutes: 7,
    estimatedCalories: 60,
    exercises: [
      allExercises.jumping_jacks,
      allExercises.squats,
      allExercises.pushups, // Modified or knee pushups conceptually for beginner
      allExercises.crunches,
      allExercises.plank,
    ],
  },
  {
    id: "abs_core_blaster",
    title: "Core Blaster",
    description: "Focus on your midsection with this quick and effective ab routine.",
    muscleGroup: "abs",
    difficulty: "intermediate",
    restDurationSeconds: 15,
    estimatedMinutes: 5,
    estimatedCalories: 40,
    exercises: [
      allExercises.crunches,
      allExercises.plank,
      { ...allExercises.crunches, reps: 20 },
      { ...allExercises.plank, duration_seconds: 45 },
    ],
  },
  {
    id: "leg_day",
    title: "Lower Body Power",
    description: "Build strength in your legs and glutes without any equipment.",
    muscleGroup: "legs",
    difficulty: "intermediate",
    restDurationSeconds: 20,
    estimatedMinutes: 8,
    estimatedCalories: 70,
    exercises: [
      allExercises.squats,
      allExercises.lunges,
      { ...allExercises.squats, reps: 20 },
      allExercises.jumping_jacks,
    ],
  },
  {
    id: "morning_stretch",
    title: "Morning Wake Up",
    description: "Gentle movements to start your day right.",
    muscleGroup: "stretching",
    difficulty: "beginner",
    restDurationSeconds: 10,
    estimatedMinutes: 3,
    estimatedCalories: 15,
    exercises: [
      allExercises.stretching,
      allExercises.stretching, // Just for demo, you'd have more specific stretches
    ],
  },
];
