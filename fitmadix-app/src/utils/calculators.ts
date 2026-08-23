import { UserMetrics, MacroTargets } from "../types/fitness";

/**
 * Calculates BMR using the Mifflin-St Jeor Formula
 */
export function calculateBMR(metrics: UserMetrics): number {
  const { weightKg, heightCm, age, gender } = metrics;
  if (gender === "male") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

/**
 * Calculates TDEE based on BMR and activity multiplier
 */
export function calculateTDEE(metrics: UserMetrics): {
  bmr: number;
  tdee: number;
  targetCalories: number;
} {
  const bmr = calculateBMR(metrics);

  const multipliers: Record<UserMetrics["activityLevel"], number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };

  const tdee = Math.round(bmr * (multipliers[metrics.activityLevel] || 1.55));

  let targetCalories = tdee;
  if (metrics.goal === "cut") {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (metrics.goal === "bulk") {
    targetCalories = Math.round(tdee * 1.15); // 15% surplus
  }

  return { bmr, tdee, targetCalories };
}

/**
 * Calculates target macronutrients based on calorie target & weight
 */
export function calculateMacroSplit(
  targetCalories: number,
  weightKg: number,
  goal: UserMetrics["goal"],
): MacroTargets {
  let proteinG = Math.round(weightKg * 2.2); // ~2.2g per kg (1g per lb)
  if (goal === "cut") {
    proteinG = Math.round(weightKg * 2.4); // slightly higher protein on cut
  }

  const proteinCal = proteinG * 4;
  const fatG = Math.round(weightKg * 0.9); // ~0.9g per kg
  const fatCal = fatG * 9;

  const remainingCal = Math.max(0, targetCalories - (proteinCal + fatCal));
  const carbsG = Math.round(remainingCal / 4);

  return {
    calories: targetCalories,
    protein: proteinG,
    carbs: carbsG,
    fat: fatG,
    waterMl: Math.round(weightKg * 40), // 40ml per kg
  };
}

/**
 * Calculates Estimated 1-Rep Max (Epley Formula)
 */
export function calculateOneRepMax(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg;
  if (reps === 0 || weightKg === 0) return 0;
  return Math.round(weightKg * (1 + reps / 30));
}

/**
 * Estimates workout calorie expenditure based on duration and intensity
 */
export function estimateCalorieBurn(
  durationMinutes: number,
  bodyWeightKg: number = 80,
  intensityMultiplier: number = 6.5,
): number {
  // Calorie Burn = MET x 3.5 x weight (kg) / 200 x duration (mins)
  return Math.round(((intensityMultiplier * 3.5 * bodyWeightKg) / 200) * durationMinutes);
}
