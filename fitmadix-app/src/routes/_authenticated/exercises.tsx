import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { ExerciseLibrary } from "@/components/exercises/ExerciseLibrary";
import { AuthenticatedContext } from "./route";

export const Route = createFileRoute("/_authenticated/exercises")({
  component: ExercisesComponent,
});

function ExercisesComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;

  const { searchQuery } = context;

  return <ExerciseLibrary searchQuery={searchQuery} />;
}
