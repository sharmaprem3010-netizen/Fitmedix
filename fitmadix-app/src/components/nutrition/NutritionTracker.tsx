import React, { useState } from "react";
import {
  Utensils,
  Plus,
  Trash2,
  Flame,
  Droplets,
  Calculator,
  RefreshCw,
  Check,
} from "lucide-react";
import { MealItem, MacroTargets, UserMetrics } from "../../types/fitness";
import { calculateTDEE, calculateMacroSplit } from "../../utils/calculators";
import { ProgressRing } from "../ui/ProgressRing";
import { Button } from "../ui/AppButton";
import { Modal } from "../ui/Modal";

interface NutritionTrackerProps {
  meals: MealItem[];
  macroTargets: MacroTargets;
  userMetrics: UserMetrics;
  onAddMeal: (meal: MealItem) => void;
  onDeleteMeal: (mealId: string) => void;
  onUpdateMacroTargets: (targets: MacroTargets) => void;
  onUpdateUserMetrics: (metrics: UserMetrics) => void;
}

export const NutritionTracker: React.FC<NutritionTrackerProps> = ({
  meals,
  macroTargets,
  userMetrics,
  onAddMeal,
  onDeleteMeal,
  onUpdateMacroTargets,
  onUpdateUserMetrics,
}) => {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Quick Meal Form state
  const [mealName, setMealName] = useState("");
  const [servingSize, setServingSize] = useState("1 Portion");
  const [calories, setCalories] = useState(400);
  const [proteinG, setProteinG] = useState(30);
  const [carbsG, setCarbsG] = useState(40);
  const [fatG, setFatG] = useState(12);
  const [mealType, setMealType] = useState<MealItem["mealType"]>("Lunch");

  // Water intake
  const [loggedWaterMl, setLoggedWaterMl] = useState(0);

  // Calculator Form state
  const [calcMetrics, setCalcMetrics] = useState<UserMetrics>(userMetrics);

  // Calculate Daily Totals
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFat = meals.reduce((acc, m) => acc + m.fatG, 0);

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const newMeal: MealItem = {
      id: `meal-${Date.now()}`,
      name: mealName,
      servingSize,
      calories,
      proteinG,
      carbsG,
      fatG,
      mealType,
      loggedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    onAddMeal(newMeal);
    setIsMealModalOpen(false);
    setMealName("");
  };

  const handleCalculateTDEE = () => {
    const { targetCalories } = calculateTDEE(calcMetrics);
    const newTargets = calculateMacroSplit(targetCalories, calcMetrics.weightKg, calcMetrics.goal);
    onUpdateUserMetrics(calcMetrics);
    onUpdateMacroTargets(newTargets);
    setIsCalculatorOpen(false);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Nutrition & Macro Intelligence
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track daily macronutrients and optimize metabolic output
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsCalculatorOpen(true)} variant="secondary" className="gap-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>TDEE Calculator</span>
          </Button>

          <Button onClick={() => setIsMealModalOpen(true)} variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </Button>
        </div>
      </div>

      {/* Hero Macro Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calorie Ring Summary (Col 5) */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-2xl relative">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Daily Calorie Balance
          </p>

          <ProgressRing
            value={totalCalories}
            max={macroTargets.calories}
            size={160}
            strokeWidth={10}
            color="#ffffff"
            label={`${totalCalories}`}
            sublabel={`Target: ${macroTargets.calories} kcal`}
          />

          <p className="text-xs text-zinc-400 mt-4 font-medium">
            {macroTargets.calories - totalCalories > 0
              ? `${macroTargets.calories - totalCalories} kcal remaining for today`
              : "Daily calorie target reached"}
          </p>
        </div>

        {/* Individual Macro Bars (Col 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Protein */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Protein</p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {totalProtein}{" "}
                <span className="text-sm font-normal text-zinc-500">/ {macroTargets.protein}g</span>
              </p>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalProtein / macroTargets.protein) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Carbohydrates
              </p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {totalCarbs}{" "}
                <span className="text-sm font-normal text-zinc-500">/ {macroTargets.carbs}g</span>
              </p>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCarbs / macroTargets.carbs) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Fats */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Fats</p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {totalFat}{" "}
                <span className="text-sm font-normal text-zinc-500">/ {macroTargets.fat}g</span>
              </p>
            </div>
            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalFat / macroTargets.fat) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight">Hydration Tracker</h4>
            <p className="text-xs text-zinc-400">
              {loggedWaterMl} ml logged / {macroTargets.waterMl} ml daily goal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLoggedWaterMl((prev) => prev + 250)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-white cursor-pointer"
          >
            + 250ml Glass
          </button>
          <button
            onClick={() => setLoggedWaterMl((prev) => prev + 500)}
            className="px-3 py-1.5 bg-blue-500 text-black font-bold text-xs rounded-lg hover:bg-blue-400 cursor-pointer"
          >
            + 500ml Bottle
          </button>
        </div>
      </div>

      {/* Meals Log Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
          <h3 className="text-base font-bold text-white">Today's Logged Meals</h3>
          <span className="text-xs text-zinc-400">{meals.length} items logged</span>
        </div>

        {meals.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs">
            No meals logged today. Click "Log Meal" to add your food entries.
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {meals.map((m) => (
              <div
                key={m.id}
                className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-zinc-900/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                      {m.mealType}
                    </span>
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {m.servingSize} • Logged at {m.loggedAt}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-white">{m.calories} kcal</p>
                    <p className="text-[10px] text-zinc-400">
                      P: {m.proteinG}g • C: {m.carbsG}g • F: {m.fatG}g
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(m.id)}
                    className="p-2 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete meal entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Meal Modal */}
      <Modal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        title="Log Meal Entry"
        subtitle="Add nutrition data to your daily tracker"
        maxWidth="md"
      >
        <form onSubmit={handleSaveMeal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Meal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Salmon & Sweet Potato Bowl"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Meal Slot
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbsG}
                onChange={(e) => setCarbsG(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                value={fatG}
                onChange={(e) => setFatG(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={() => setIsMealModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* TDEE Calculator Modal */}
      <Modal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="TDEE & Metabolic Calculator"
        subtitle="Mifflin-St Jeor formula calculation for customized macro split"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={calcMetrics.weightKg}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, weightKg: parseFloat(e.target.value) || 70 })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={calcMetrics.heightCm}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, heightCm: parseFloat(e.target.value) || 175 })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Age</label>
              <input
                type="number"
                value={calcMetrics.age}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, age: parseInt(e.target.value) || 25 })
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Gender</label>
              <select
                value={calcMetrics.gender}
                onChange={(e) => setCalcMetrics({ ...calcMetrics, gender: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Activity Multiplier
            </label>
            <select
              value={calcMetrics.activityLevel}
              onChange={(e) =>
                setCalcMetrics({ ...calcMetrics, activityLevel: e.target.value as any })
              }
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="sedentary">Sedentary (Desk job, no workouts)</option>
              <option value="light">Lightly Active (1-3 workouts/week)</option>
              <option value="moderate">Moderately Active (3-5 workouts/week)</option>
              <option value="active">Very Active (6-7 workouts/week)</option>
              <option value="extra">Extra Active (2x daily intensive sessions)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
              Fitness Goal
            </label>
            <select
              value={calcMetrics.goal}
              onChange={(e) => setCalcMetrics({ ...calcMetrics, goal: e.target.value as any })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="cut">Fat Loss (-20% Calorie Deficit)</option>
              <option value="maintain">Maintenance (Recomposition)</option>
              <option value="bulk">Lean Muscle Mass (+15% Calorie Surplus)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <Button variant="outline" onClick={() => setIsCalculatorOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCalculateTDEE}>
              Recalculate & Apply
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
