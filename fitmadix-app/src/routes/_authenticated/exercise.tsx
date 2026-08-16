import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Dumbbell, Flame } from "lucide-react";
import { workoutPlans } from "@/lib/exercise-data";

export const Route = createFileRoute("/_authenticated/exercise")({
  component: ExerciseIndexPage,
});

function ExerciseIndexPage() {
  const categories = [
    { title: "Full Body", icon: "🏋️", plans: workoutPlans.filter((p) => p.muscleGroup === "full_body") },
    { title: "Abs & Core", icon: "🎯", plans: workoutPlans.filter((p) => p.muscleGroup === "abs") },
    { title: "Legs", icon: "🦵", plans: workoutPlans.filter((p) => p.muscleGroup === "legs") },
    { title: "Stretching", icon: "🧘", plans: workoutPlans.filter((p) => p.muscleGroup === "stretching") },
  ];

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/hub" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">🏋️ Home Workout</h1>
            <p className="text-xs text-muted-foreground">No equipment needed</p>
          </div>
        </div>

        <div className="space-y-8">
          {categories.map((cat, i) => cat.plans.length > 0 && (
            <div key={i}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <span>{cat.icon}</span> {cat.title}
              </h2>
              <div className="grid gap-3">
                {cat.plans.map((plan) => (
                  <Link
                    key={plan.id}
                    to="/exercise/$workoutId"
                    params={{ workoutId: plan.id }}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{plan.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{plan.description}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        plan.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                        plan.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {plan.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 border-t border-border/50 pt-3 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {plan.estimatedMinutes} min
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="h-3.5 w-3.5" /> {plan.exercises.length} Exercises
                      </div>
                      <div className="flex items-center gap-1.5 text-orange-500">
                        <Flame className="h-3.5 w-3.5" /> {plan.estimatedCalories} kcal
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
