import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { WorkoutPlanner } from "@/components/workouts/WorkoutPlanner";
import { AuthenticatedContext } from "./route";

export const Route = createFileRoute("/_authenticated/workouts")({
  component: WorkoutsComponent,
});

function WorkoutsComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;

  const { routines, onStartWorkout, onSaveRoutine, onDeleteRoutine, searchQuery, isLoading } = context;

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p>Loading workouts data...</p>
      </div>
    );
  }

  return (
    <WorkoutPlanner
      routines={routines}
      onStartWorkout={onStartWorkout}
      onSaveRoutine={onSaveRoutine}
      onDeleteRoutine={onDeleteRoutine}
      searchQuery={searchQuery}
    />
  );
}
