import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { OverviewDashboard } from "@/components/dashboard/OverviewDashboard";
import { AuthenticatedContext } from "./route";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const context = useContext(AuthenticatedContext);
  const navigate = Route.useNavigate();

  if (!context) return null;
  const { vitals, routines, meals, macroTargets, workoutLogs, onStartWorkout, isLoading } = context;

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
          <div className="md:col-span-8 bg-zinc-900 rounded-2xl min-h-[340px]"></div>
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-2xl min-h-[160px]"></div>
            <div className="bg-zinc-900 rounded-2xl min-h-[160px]"></div>
          </div>
          <div className="md:col-span-4 bg-zinc-900 rounded-2xl min-h-[220px]"></div>
          <div className="md:col-span-4 bg-zinc-900 rounded-2xl min-h-[220px]"></div>
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-2xl min-h-[100px]"></div>
            <div className="bg-zinc-900 rounded-2xl min-h-[100px]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OverviewDashboard
      vitals={vitals}
      nextRoutine={routines[0]}
      meals={meals}
      macroTargets={macroTargets}
      workoutLogs={workoutLogs}
      onStartWorkout={onStartWorkout}
      onNavigate={(tab) => navigate({ to: `/${tab}` })}
    />
  );
}
