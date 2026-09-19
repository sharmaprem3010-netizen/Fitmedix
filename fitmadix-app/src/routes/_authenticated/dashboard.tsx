import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthenticatedContext } from "./route";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { Dumbbell, Utensils, MessageSquare, Activity, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/AppButton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const context = useContext(AuthenticatedContext);
  const navigate = useNavigate();
  const { voiceMode, simpleMode } = useAccessibility();

  if (!context) return null;
  const { isLoading, workoutLogs, meals, macroTargets, userMetrics, routines } = context;

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-zinc-800"></div>
      </div>
    );
  }

  // Voice-first / Simple Mode layout
  if (voiceMode || simpleMode) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 space-y-12 overflow-y-auto">
        <div className="text-center space-y-4 max-w-2xl mx-auto w-full">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">How can I help you?</h1>
          <p className="text-xl text-zinc-400">Tap the microphone to speak, or select an option below.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
          <button
            onClick={() => navigate({ to: "/workouts" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all"
          >
            <Dumbbell className="w-16 h-16 mb-4 text-primary" />
            <span className="text-2xl font-bold">Start Workout</span>
          </button>
          
          <button
            onClick={() => navigate({ to: "/nutrition" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all"
          >
            <Utensils className="w-16 h-16 mb-4 text-blue-500" />
            <span className="text-2xl font-bold">Log Food</span>
          </button>
        </div>
      </div>
    );
  }

  // Normal Dashboard layout: "What to do today"
  const hasWorkouts = routines.length > 0;
  const hasLoggedMeals = meals.length > 0;

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.proteinG || 0), 0);
  
  const caloriePercent = Math.min(100, Math.round((totalCalories / macroTargets.calories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((totalProtein / macroTargets.protein) * 100)) || 0;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-5xl mx-auto w-full">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Good morning 👋</h1>
        <p className="text-muted-foreground mt-1 font-medium">Your goal: {userMetrics.goal === 'cut' ? 'Cut' : userMetrics.goal === 'bulk' ? 'Bulk' : 'Maintain'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Today's Workout Widget */}
        <section className="col-span-1 md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Today's Plan</h2>
          
          {hasWorkouts ? (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Dumbbell className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-primary">Workout</span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-1">{routines[0].title}</h3>
                <p className="text-muted-foreground mb-6">
                  {routines[0].exercises.length} exercises • ~45 min
                </p>
                
                <Button variant="primary" onClick={() => context.onStartWorkout(routines[0])}>
                  Start Workout
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your fitness journey starts here 🌱</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-6">
                You haven't set up your first workout yet. Let's build your routine.
              </p>
              <Button variant="outline" onClick={() => navigate({ to: "/workouts" })}>
                Create My First Workout
              </Button>
            </div>
          )}
          
          {/* Coach Insight Widget */}
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="p-3 bg-background rounded-2xl shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-sm mb-1 uppercase tracking-wider">Coach Madix</h4>
              <p className="text-foreground text-sm font-medium">
                "You haven't trained in 2 days. Today is a great day to get back on track with a quick upper body session."
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: "/chat" })} className="shrink-0 bg-background">
              Talk to Coach
            </Button>
          </div>
        </section>

        {/* Nutrition Widget */}
        <section className="col-span-1 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Nutrition</h2>
          
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="font-semibold text-blue-500">Intake</span>
              </div>
              <button onClick={() => navigate({ to: "/nutrition" })} className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center">
                Details <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
            
            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Calories</span>
                  <span className="text-muted-foreground">{totalCalories} / {macroTargets.calories} kcal</span>
                </div>
                <div className="h-3 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${caloriePercent}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Protein</span>
                  <span className="text-muted-foreground">{totalProtein}g / {macroTargets.protein}g</span>
                </div>
                <div className="h-3 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${proteinPercent}%` }} />
                </div>
              </div>
            </div>
            
            <div className="pt-6 mt-4 border-t border-border">
               {!hasLoggedMeals ? (
                 <p className="text-xs font-medium text-muted-foreground mb-4 text-center">No meals logged today. Start tracking what you eat.</p>
               ) : (
                 <p className="text-xs font-medium text-muted-foreground mb-4 text-center">You are on track with your macros today.</p>
               )}
               <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/nutrition" })}>
                 Log a Meal
               </Button>
            </div>
          </div>
        </section>

        {/* Progress Widget */}
        <section className="col-span-1 md:col-span-3 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">Weekly Progress</h2>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Consistency</p>
                  <p className="text-2xl font-bold text-foreground">78%</p>
                </div>
                <div className="flex gap-1 items-end h-16">
                  {/* Simple CSS bar chart */}
                  {[40, 70, 45, 90, 60, 20, 80].map((h, i) => (
                    <div key={i} className="w-6 sm:w-8 bg-surface rounded-t-sm relative group overflow-hidden h-full">
                      <div 
                        className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors rounded-t-sm" 
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="sm:w-1/3 w-full pl-0 sm:pl-6 sm:border-l border-t sm:border-t-0 border-border pt-4 sm:pt-0">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Active Streak</p>
                   <p className="font-bold text-foreground">{context.vitals?.activeStreakDays || 0} Days</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
