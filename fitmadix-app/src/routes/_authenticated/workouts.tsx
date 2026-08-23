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

  const { routines, onStartWorkout, onSaveRoutine, onDeleteRoutine, searchQuery } = context;

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
