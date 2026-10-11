import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Droplet, Plus, Settings } from "lucide-react";
import { useFoodLog, MealType, FoodLogEntry } from "@/hooks/use-food-log";
import { searchFoodLogItem } from "@/lib/food-log.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/_authenticated/food-log")({
  component: FoodLogPage,
});

function FoodLogPage() {
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });
  const { entries, summary, loading, addEntry, removeEntry, waterGlasses, updateWater } =
    useFoodLog(dateStr);
  const searchFood = useServerFn(searchFoodLogItem);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { isListening, startListening, stopListening, transcript } = useVoiceInput();

  if (transcript && isListening) {
    if (searchQuery !== transcript) setSearchQuery(transcript);
  }

  const changeDate = (days: number) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    setDateStr(d.toISOString().split("T")[0]);
  };

  const handleSearchAndAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await searchFood({ data: { query: searchQuery } });
      await addEntry({
        date: dateStr,
        meal: activeMeal,
        food_name: res.name,
        calories: res.calories,
        protein_g: res.protein_g,
        carbs_g: res.carbs_g,
        fat_g: res.fat_g,
      });
      toast.success(`Added ${res.name}`);
      setIsAddModalOpen(false);
      setSearchQuery("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add food");
    } finally {
      setIsSearching(false);
    }
  };

  const meals: { type: MealType; label: string; emoji: string }[] = [
    { type: "breakfast", label: "Breakfast", emoji: "🌅" },
    { type: "lunch", label: "Lunch", emoji: "☀️" },
    { type: "dinner", label: "Dinner", emoji: "🌙" },
    { type: "snack", label: "Snacks", emoji: "🍪" },
  ];

  // Demo goals
  const goals = { calories: 2000, protein: 150, carbs: 200, fat: 65, water: 8 };

  const calProgress = Math.min((summary.calories / goals.calories) * 100, 100);

  return (
    <div className="min-h-dvh bg-background pb-20">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/hub"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">📊 Diary</h1>
          </div>
          <Link to="/food-log/settings" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        {/* Date Navigator */}
        <div className="mb-6 flex items-center justify-between rounded-full bg-secondary p-1">
          <button
            onClick={() => changeDate(-1)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">
            {new Date(dateStr).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
          <button
            onClick={() => changeDate(1)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="mb-6 rounded-3xl border border-border bg-card p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Eaten
              </p>
              <p className="text-2xl font-bold">{Math.round(summary.calories)}</p>
            </div>
            {/* Simple CSS ring chart */}
            <div className="relative h-24 w-24">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-secondary stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="4"
                />
                <path
                  className="text-primary stroke-current transition-all duration-1000"
                  strokeDasharray={`${calProgress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">
                  {Math.max(0, goals.calories - Math.round(summary.calories))}
                </span>
                <span className="text-[10px] text-muted-foreground">Left</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Goal
              </p>
              <p className="text-2xl font-bold">{goals.calories}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min((summary.protein / goals.protein) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[10px]">
                {Math.round(summary.protein)} / {goals.protein}g
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${Math.min((summary.carbs / goals.carbs) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[10px]">
                {Math.round(summary.carbs)} / {goals.carbs}g
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fat</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${Math.min((summary.fat / goals.fat) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[10px]">
                {Math.round(summary.fat)} / {goals.fat}g
              </p>
            </div>
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          {meals.map((meal) => {
            const mealEntries = entries.filter((e) => e.meal === meal.type);
            const mealCals = mealEntries.reduce((acc, e) => acc + (e.calories || 0), 0);

            return (
              <div
                key={meal.type}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <span>{meal.emoji}</span> {meal.label}
                  </h2>
                  <span className="font-bold text-primary">{Math.round(mealCals)}</span>
                </div>

                {mealEntries.length > 0 ? (
                  <div className="mb-4 space-y-3">
                    {mealEntries.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-start justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium">{e.food_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            P: {Math.round(e.protein_g)}g • C: {Math.round(e.carbs_g)}g • F:{" "}
                            {Math.round(e.fat_g)}g
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">{Math.round(e.calories)}</span>
                          <button
                            onClick={() => removeEntry(e.id)}
                            className="text-red-500 hover:opacity-70 text-xs"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mb-4">No entries yet.</p>
                )}

                <button
                  onClick={() => {
                    setActiveMeal(meal.type);
                    setIsAddModalOpen(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-secondary/50 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary"
                >
                  <Plus className="h-3.5 w-3.5" /> ADD FOOD
                </button>
              </div>
            );
          })}
        </div>

        {/* Water */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-cyan-600">
              <Droplet className="h-5 w-5 fill-cyan-500" /> Water Tracker
            </h2>
            <span className="text-sm font-medium text-muted-foreground">
              {waterGlasses} / {goals.water} glasses
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.max(goals.water, waterGlasses + 1) }).map((_, i) => (
              <button
                key={i}
                onClick={() => updateWater(i + 1)}
                className={`grid h-10 w-10 place-items-center rounded-xl transition-all ${
                  i < waterGlasses
                    ? "bg-cyan-500 text-white"
                    : "bg-secondary text-muted-foreground hover:bg-cyan-100"
                }`}
              >
                <Droplet className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full rounded-t-3xl bg-background p-6 shadow-2xl sm:max-w-md sm:rounded-3xl animate-in slide-in-from-bottom-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add to {activeMeal}</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 hover:bg-secondary"
              >
                ❌
              </button>
            </div>

            <form onSubmit={handleSearchAndAdd} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe what you ate..."
                autoFocus
                className="w-full rounded-2xl border border-border bg-card py-4 pl-4 pr-12 text-sm outline-none ring-primary/40 focus:ring-2"
                disabled={isSearching}
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute inset-y-0 right-2 flex items-center px-2 ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}
              >
                <Mic className="h-5 w-5" />
              </button>
            </form>

            <button
              onClick={handleSearchAndAdd}
              disabled={isSearching || !searchQuery.trim()}
              className="w-full rounded-full bg-gradient-primary py-4 font-bold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {isSearching ? "Estimating Nutrition..." : "Add Food"}
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Just type what you ate naturally (e.g. "2 slices of bread with peanut butter"). AI
              will estimate the calories and macros.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
