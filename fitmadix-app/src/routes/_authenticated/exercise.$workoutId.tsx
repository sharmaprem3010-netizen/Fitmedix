import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, ChevronRight, Pause, Play, SkipForward } from "lucide-react";
import { workoutPlans } from "@/lib/exercise-data";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";

export const Route = createFileRoute("/_authenticated/exercise/$workoutId")({
  component: ActiveWorkoutPage,
});

function ActiveWorkoutPage() {
  const { workoutId } = Route.useParams();
  const navigate = useNavigate();
  const plan = workoutPlans.find((p) => p.id === workoutId);

  const {
    state,
    currentExercise,
    currentExerciseIndex,
    timeRemaining,
    progress,
    totalExercises,
    startWorkout,
    pause,
    resume,
    next,
  } = useWorkoutTimer({
    exercises: plan?.exercises || [],
    restDurationSeconds: plan?.restDurationSeconds || 20,
  });

  if (!plan) return <div>Workout not found</div>;

  if (state === "idle") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <div className="relative h-64 w-full bg-gradient-primary">
          <button
            onClick={() => navigate({ to: "/exercise" })}
            className="absolute left-4 top-6 grid h-10 w-10 place-items-center rounded-full bg-black/20 text-white backdrop-blur-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">{plan.title}</h1>
            <p className="mt-2 text-white/80">{plan.estimatedMinutes} mins • {totalExercises} exercises</p>
          </div>
        </div>
        <div className="flex-1 rounded-t-3xl bg-background -mt-4 px-6 pt-6 pb-24">
          <h2 className="mb-4 text-lg font-semibold">Exercises</h2>
          <div className="space-y-4">
            {plan.exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-2xl">
                  {ex.icon}
                </span>
                <div>
                  <h3 className="font-semibold">{ex.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ex.duration_seconds ? `00:${ex.duration_seconds.toString().padStart(2, '0')}` : `x${ex.reps}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4">
          <button
            onClick={startWorkout}
            className="w-full rounded-full bg-gradient-primary py-4 text-center font-bold text-primary-foreground shadow-glow"
          >
            START
          </button>
        </div>
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6 text-center">
        <CheckCircle2 className="mx-auto h-24 w-24 text-emerald-500" />
        <h1 className="mt-6 text-3xl font-bold">Workout Complete!</h1>
        <p className="mt-2 text-muted-foreground">You burned approx {plan.estimatedCalories} calories.</p>
        <Link
          to="/exercise"
          className="mt-10 w-full rounded-full bg-gradient-primary py-4 font-bold text-primary-foreground shadow-glow"
        >
          DONE
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate({ to: "/exercise" })} className="text-muted-foreground">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            {currentExerciseIndex + 1} / {totalExercises}
          </span>
        </div>

        {state === "resting" ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-primary">REST</h2>
            <div className="my-8 text-8xl font-bold tracking-tighter">{timeRemaining}</div>
            <div className="mt-8 rounded-2xl bg-secondary p-4 w-full">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Next Up</p>
              <p className="mt-1 text-lg font-medium">
                {plan.exercises[currentExerciseIndex]?.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="mb-6 text-8xl">{currentExercise?.icon}</span>
            <h2 className="text-2xl font-bold">{currentExercise?.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{currentExercise?.description}</p>
            
            <div className="my-8 text-7xl font-bold tracking-tighter text-primary">
              {currentExercise?.duration_seconds ? (
                <span>00:{timeRemaining.toString().padStart(2, '0')}</span>
              ) : (
                <span>x{currentExercise?.reps}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card p-6">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={state === "paused" ? resume : pause}
            className="grid h-16 w-16 place-items-center rounded-full border-2 border-border text-foreground hover:bg-secondary"
          >
            {state === "paused" ? <Play className="h-8 w-8 ml-1" /> : <Pause className="h-8 w-8" />}
          </button>
          
          <button
            onClick={next}
            className="grid h-20 w-20 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
          >
            {(state === "resting" || currentExercise?.duration_seconds) ? (
              <SkipForward className="h-8 w-8" />
            ) : (
              <ChevronRight className="h-10 w-10" /> // "Done" with reps
            )}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
          {(state === "resting" || currentExercise?.duration_seconds) ? "Skip" : "Done with reps"}
        </p>
      </div>
    </div>
  );
}
