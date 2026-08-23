/**
 * AI Service — thin wrappers around TanStack server functions.
 *
 * Previously this file returned hardcoded empty data.  Now every call goes
 * through the real Gemini-powered server functions defined in /lib/*.
 */
import type { AIWorkoutPlan, AIMealPlan } from "../types/fitness";
import {
  generateAIWorkoutServer,
  generateAIMealPlanServer,
  askAICoachServer,
} from "../lib/ai-coach.functions";

export async function generateAIWorkout(params: {
  goal: string;
  experienceLevel: string;
  daysPerWeek: number;
  equipment: string;
  targetFocus: string;
}): Promise<AIWorkoutPlan> {
  const result = await generateAIWorkoutServer({ data: params });
  return {
    title: result.title ?? "AI Generated Routine",
    summary: result.summary ?? "",
    splitOverview: result.splitOverview ?? "",
    exercises: (result.exercises ?? []).map((ex: any) => ({
      name: ex.name ?? "Unknown",
      category: ex.category ?? "Full Body",
      sets: Number(ex.sets) || 3,
      reps: String(ex.reps ?? "10"),
      restSeconds: Number(ex.restSeconds) || 60,
      reasoning: ex.reasoning ?? "",
    })),
  };
}

export async function generateAIMealPlan(params: {
  calorieTarget: number;
  dietType: string;
  goal: string;
  allergies: string;
}): Promise<AIMealPlan> {
  const result = await generateAIMealPlanServer({ data: params });
  return {
    title: result.title ?? "AI Generated Meal Plan",
    dailyCalories: Number(result.dailyCalories) || params.calorieTarget,
    macros: {
      protein: Number(result.macros?.protein) || 150,
      carbs: Number(result.macros?.carbs) || 200,
      fat: Number(result.macros?.fat) || 65,
    },
    meals: (result.meals ?? []).map((m: any) => ({
      mealName: m.mealName ?? "Meal",
      timeSlot: m.timeSlot ?? "",
      description: m.description ?? "",
      ingredients: m.ingredients ?? [],
      macros: {
        calories: Number(m.macros?.calories) || 0,
        protein: Number(m.macros?.protein) || 0,
        carbs: Number(m.macros?.carbs) || 0,
        fat: Number(m.macros?.fat) || 0,
      },
    })),
  };
}

export async function askAICoach(query: string, context: string): Promise<string> {
  const result = await askAICoachServer({ data: { query, context } });
  return result.reply ?? "I'm sorry, I couldn't generate a response. Please try again.";
}
