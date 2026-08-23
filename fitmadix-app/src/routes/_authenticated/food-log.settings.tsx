import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/food-log/settings")({
  component: FoodLogSettingsPage,
});

function FoodLogSettingsPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/food-log"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Nutrition Goals</h1>
            <p className="text-xs text-muted-foreground">Set your daily targets</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Calorie Goal
            </h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                defaultValue={2000}
                className="w-24 rounded-xl border border-border bg-background px-4 py-3 text-lg font-bold outline-none ring-primary/40 focus:ring-2"
              />
              <span className="font-medium">kcal / day</span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              defaultValue={2000}
              className="w-full mt-4"
            />
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Macronutrients
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Protein</span>
                  <span>150g (30%)</span>
                </div>
                <input type="range" className="w-full accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Carbs</span>
                  <span>200g (40%)</span>
                </div>
                <input type="range" className="w-full accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Fat</span>
                  <span>65g (30%)</span>
                </div>
                <input type="range" className="w-full accent-rose-500" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">Total must equal 100%</p>
          </div>

          <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary py-4 font-bold text-primary-foreground shadow-glow">
            <Save className="h-5 w-5" /> Save Goals
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Note: Settings are illustrative in this demo implementation.
          </p>
        </div>
      </div>
    </div>
  );
}
