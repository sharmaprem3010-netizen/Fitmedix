import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { AuthenticatedContext } from './route';

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsComponent,
});

function AnalyticsComponent() {
  const context = useContext(AuthenticatedContext);
  if (!context) return null;
  
  const { weightLogs, strengthRecords, workoutLogs, onAddWeightLog } = context;

  return (
    <AnalyticsView
      weightLogs={weightLogs}
      strengthRecords={strengthRecords}
      workoutLogs={workoutLogs}
      onAddWeightLog={onAddWeightLog}
    />
  );
}
