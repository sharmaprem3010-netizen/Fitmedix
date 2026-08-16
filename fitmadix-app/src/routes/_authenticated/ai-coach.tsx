import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { AICoach } from '@/components/ai/AICoach';
import { AuthenticatedContext } from './route';

export const Route = createFileRoute('/_authenticated/ai-coach')({
  component: AICoachComponent,
});

function AICoachComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;
  
  const { onSaveRoutine, userMetrics, vitals } = context;

  return (
    <AICoach 
      onSaveGeneratedRoutine={onSaveRoutine} 
      userMetrics={userMetrics}
      vitals={vitals}
    />
  );
}
