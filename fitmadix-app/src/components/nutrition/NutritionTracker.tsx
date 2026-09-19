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
import { useAccessibility } from "../AccessibilityProvider";
import { usePageIntro } from "../../hooks/usePageIntro";

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
  const { autoSpeak, language, setLocalCommandHandler, voiceMode } = useAccessibility();
  
  const intro = language.startsWith("en") 
    ? "You are in Nutrition. Say what you ate, for example, 'I ate two rotis and dal'."
    : language.startsWith("hi")
      ? "आप पोषण पृष्ठ पर हैं। बताएं कि आपने क्या खाया।"
      : "আপনি পুষ্টি পৃষ্ঠায় আছেন। আপনি কী খেয়েছেন তা বলুন।";
      
  usePageIntro(intro);

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

  React.useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      // Simple voice NLP for logging food
      if (/(ate|had|log|eat|kha|kheyechi|खाया|খেয়েছি)/.test(lower)) {
        // Extract the food (everything after the verb, roughly)
        const textParts = lower.split(/(?:ate|had|log|eat|khaaya|kheyechi|खाया|খেয়েছি)\s+(.*)/);
        const foodItem = textParts[1] ? textParts[1].trim() : text;
        
        // Mock nutrient calculation based on typical Indian/Global diet
        let estCal = 300; let estP = 10; let estC = 40; let estF = 10;
        if (/roti|dal|rice/.test(lower)) { estCal = 450; estP = 15; estC = 60; estF = 12; }
        if (/chicken|egg/.test(lower)) { estCal = 350; estP = 30; estC = 10; estF = 20; }

        const newMeal: MealItem = {
          id: `meal-${Date.now()}`,
          name: foodItem.charAt(0).toUpperCase() + foodItem.slice(1) || "Voice Logged Meal",
          servingSize: "1 Portion",
          calories: estCal,
          proteinG: estP,
          carbsG: estC,
          fatG: estF,
          mealType: "Snack",
          loggedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        onAddMeal(newMeal);

        const reply = language.startsWith("en") ? `Added ${foodItem}.`
                    : language.startsWith("hi") ? `${foodItem} जोड़ दिया गया है।`
                    : `${foodItem} যোগ করা হয়েছে।`;
        autoSpeak(reply);
        return true;
      }
      
      // Delete last meal
      if (/(delete|remove|undo|hata|muche|हटाओ|মুছে)/.test(lower)) {
        if (meals.length > 0) {
          const lastMeal = meals[meals.length - 1];
          onDeleteMeal(lastMeal.id);
          autoSpeak(language.startsWith("en") ? `Deleted ${lastMeal.name}.` : language.startsWith("hi") ? `${lastMeal.name} हटा दिया गया।` : `${lastMeal.name} মুছে ফেলা হয়েছে।`);
        } else {
          autoSpeak(language.startsWith("en") ? "No meals to delete." : language.startsWith("hi") ? "हटाने के लिए कोई भोजन नहीं है।" : "মুছে ফেলার জন্য কোনো খাবার নেই।");
        }
        return true;
      }

      return false;
    });

    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, onAddMeal, onDeleteMeal, meals, autoSpeak, language]);

  const { simpleMode } = useAccessibility();

  if (simpleMode) {
    return (
      <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto pb-32">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-8">
          Nutrition
        </h1>
        
        <div className="bg-card border-4 border-primary rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
          <p className="text-2xl font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Daily Calories
          </p>
          <ProgressRing
            value={totalCalories}
            max={macroTargets.calories}
            size={200}
            strokeWidth={16}
            color="#3b82f6"
            label={`${totalCalories}`}
            sublabel={`Target: ${macroTargets.calories} kcal`}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Button onClick={() => setIsMealModalOpen(true)} variant="primary" className="py-8 text-2xl rounded-3xl border-4 flex items-center justify-center gap-4">
            <Plus className="w-8 h-8" />
            <span>Log Meal</span>
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Meals</h2>
          {meals.map((m) => (
            <div key={m.id} className="bg-card border-4 border-border rounded-3xl p-6 flex justify-between items-center shadow-lg">
              <div>
                <h4 className="text-2xl font-bold">{m.name}</h4>
                <p className="text-lg text-muted-foreground mt-1">{m.calories} kcal</p>
              </div>
              <button
                onClick={() => onDeleteMeal(m.id)}
                className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500/20 transition-colors"
                aria-label="Delete meal"
              >
                <Trash2 className="w-8 h-8" />
              </button>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isMealModalOpen}
          onClose={() => setIsMealModalOpen(false)}
          title="Log Meal"
          subtitle="What did you eat?"
          maxWidth="md"
        >
          <form onSubmit={handleSaveMeal} className="space-y-4">
            <div>
              <label className="block text-xl font-bold mb-2">Meal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rice and Dal"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-4 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xl font-bold mb-2">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-background border-4 border-border rounded-2xl px-6 py-4 text-xl focus:outline-none focus:ring-4 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsMealModalOpen(false)} className="flex-1 py-4 text-xl rounded-2xl">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 py-4 text-xl rounded-2xl">
                Save
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto pb-32 bg-background text-foreground animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Nutrition & Macros
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track daily macronutrients and optimize metabolic output
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => setIsCalculatorOpen(true)} variant="outline" className="gap-2 shadow-sm">
            <Calculator className="w-5 h-5 text-blue-500" />
            <span>TDEE Calculator</span>
          </Button>

          <Button onClick={() => setIsMealModalOpen(true)} variant="primary" className="gap-2 shadow-sm">
            <Plus className="w-5 h-5" />
            <span>Log Meal</span>
          </Button>
        </div>
      </div>

      {/* Hero Macro Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calorie Ring Summary (Col 5) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-elegant relative">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Daily Calorie Balance
          </p>

          <ProgressRing
            value={totalCalories}
            max={macroTargets.calories}
            size={180}
            strokeWidth={12}
            color="var(--color-primary)"
            label={`${totalCalories}`}
            sublabel={`Target: ${macroTargets.calories} kcal`}
          />

          <p className="text-sm text-muted-foreground mt-6 font-medium">
            {macroTargets.calories - totalCalories > 0
              ? `${macroTargets.calories - totalCalories} kcal remaining for today`
              : "Daily calorie target reached"}
          </p>
        </div>

        {/* Individual Macro Bars (Col 7) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Protein */}
          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-transform hover:-translate-y-1">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-500">Protein</p>
              <p className="text-4xl font-extrabold text-foreground mt-2">
                {totalProtein} <span className="text-base font-medium text-muted-foreground">/ {macroTargets.protein}g</span>
              </p>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalProtein / macroTargets.protein) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-transform hover:-translate-y-1">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-500">
                Carbs
              </p>
              <p className="text-4xl font-extrabold text-foreground mt-2">
                {totalCarbs} <span className="text-base font-medium text-muted-foreground">/ {macroTargets.carbs}g</span>
              </p>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalCarbs / macroTargets.carbs) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Fats */}
          <div className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm transition-transform hover:-translate-y-1">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amber-500">Fats</p>
              <p className="text-4xl font-extrabold text-foreground mt-2">
                {totalFat} <span className="text-base font-medium text-muted-foreground">/ {macroTargets.fat}g</span>
              </p>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalFat / macroTargets.fat) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="bg-card border border-border rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-2xl">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground tracking-tight">Hydration Tracker</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {loggedWaterMl} ml logged / {macroTargets.waterMl} ml daily goal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => setLoggedWaterMl((prev) => prev + 250)}
            className="flex-1 sm:flex-none px-4 py-3 bg-surface hover:bg-secondary border border-border rounded-xl text-sm font-bold text-foreground cursor-pointer transition-colors shadow-sm"
          >
            + 250ml
          </button>
          <button
            onClick={() => setLoggedWaterMl((prev) => prev + 500)}
            className="flex-1 sm:flex-none px-4 py-3 bg-blue-500 text-blue-950 font-bold text-sm rounded-xl hover:bg-blue-400 cursor-pointer transition-colors shadow-sm"
          >
            + 500ml
          </button>
        </div>
      </div>

      {/* Meals Log Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-elegant">
        <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-surface">
          <h3 className="text-lg font-bold text-foreground">Today's Logged Meals</h3>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">{meals.length} items logged</span>
        </div>

        {meals.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <Utensils className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm font-medium">
              No meals logged today. Click "Log Meal" to add your food entries.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {meals.map((m) => (
              <div
                key={m.id}
                className="px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2.5 py-1 bg-surface border border-border text-foreground rounded-md shadow-sm uppercase tracking-wide">
                      {m.mealType}
                    </span>
                    <h4 className="text-lg font-bold text-foreground">{m.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {m.servingSize} • Logged at {m.loggedAt}
                  </p>
                </div>

                <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1">
                    <p className="text-xl font-extrabold text-foreground">{m.calories} kcal</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-surface px-2 py-1 rounded border border-border">
                      <span className="text-emerald-500">P: {m.proteinG}g</span>
                      <span>•</span>
                      <span className="text-blue-500">C: {m.carbsG}g</span>
                      <span>•</span>
                      <span className="text-amber-500">F: {m.fatG}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(m.id)}
                    className="p-3 bg-surface hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 border border-border hover:border-rose-500/30 rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Delete meal entry"
                  >
                    <Trash2 className="w-5 h-5" />
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
        <form onSubmit={handleSaveMeal} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Meal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Salmon & Sweet Potato Bowl"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Meal Slot
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-emerald-500 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-500 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                value={carbsG}
                onChange={(e) => setCarbsG(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-amber-500 mb-2">
                Fat (g)
              </label>
              <input
                type="number"
                value={fatG}
                onChange={(e) => setFatG(parseInt(e.target.value) || 0)}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border mt-2">
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
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={calcMetrics.weightKg}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, weightKg: parseFloat(e.target.value) || 70 })
                }
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={calcMetrics.heightCm}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, heightCm: parseFloat(e.target.value) || 175 })
                }
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Age</label>
              <input
                type="number"
                value={calcMetrics.age}
                onChange={(e) =>
                  setCalcMetrics({ ...calcMetrics, age: parseInt(e.target.value) || 25 })
                }
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Gender</label>
              <select
                value={calcMetrics.gender}
                onChange={(e) => setCalcMetrics({ ...calcMetrics, gender: e.target.value as any })}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Activity Multiplier
            </label>
            <select
              value={calcMetrics.activityLevel}
              onChange={(e) =>
                setCalcMetrics({ ...calcMetrics, activityLevel: e.target.value as any })
              }
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="sedentary">Sedentary (Desk job, no workouts)</option>
              <option value="light">Lightly Active (1-3 workouts/week)</option>
              <option value="moderate">Moderately Active (3-5 workouts/week)</option>
              <option value="active">Very Active (6-7 workouts/week)</option>
              <option value="extra">Extra Active (2x daily intensive sessions)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              Fitness Goal
            </label>
            <select
              value={calcMetrics.goal}
              onChange={(e) => setCalcMetrics({ ...calcMetrics, goal: e.target.value as any })}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="cut">Fat Loss (-20% Calorie Deficit)</option>
              <option value="maintain">Maintenance (Recomposition)</option>
              <option value="bulk">Lean Muscle Mass (+15% Calorie Surplus)</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border mt-2">
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
