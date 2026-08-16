import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { NutritionTracker } from '@/components/nutrition/NutritionTracker';
import { AuthenticatedContext } from './route';

export const Route = createFileRoute('/_authenticated/nutrition')({
  component: NutritionComponent,
});

function NutritionComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;
  
  const { meals, macroTargets, userMetrics, onAddMeal, onDeleteMeal, onUpdateMacroTargets, onUpdateUserMetrics } = context;

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
