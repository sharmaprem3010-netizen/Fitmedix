import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { NutritionTracker } from "@/components/nutrition/NutritionTracker";
import { AuthenticatedContext } from "./route";

export const Route = createFileRoute("/_authenticated/nutrition")({
  component: NutritionComponent,
});

function NutritionComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;

  const {
    meals,
    macroTargets,
    userMetrics,
    onAddMeal,
    onDeleteMeal,
    onUpdateMacroTargets,
    onUpdateUserMetrics,
    isLoading,
  } = context;

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p>Loading nutrition data...</p>
      </div>
    );
  }

  return (
    <NutritionTracker
      meals={meals}
      macroTargets={macroTargets}
      userMetrics={userMetrics}
      onAddMeal={onAddMeal}
      onDeleteMeal={onDeleteMeal}
      onUpdateMacroTargets={onUpdateMacroTargets}
      onUpdateUserMetrics={onUpdateUserMetrics}
    />
  );
}
