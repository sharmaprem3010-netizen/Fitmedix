import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthenticatedContext } from "./route";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { Stethoscope, ClipboardList, Pill, Activity, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/AppButton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const context = useContext(AuthenticatedContext);
  const navigate = useNavigate();
  const { voiceMode, simpleMode } = useAccessibility();

  if (!context) return null;
  const { isLoading } = context;



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
            onClick={() => navigate({ to: "/symptoms" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label="Check Symptoms"
          >
            <Stethoscope className="w-16 h-16 mb-4 text-primary" />
            <span className="text-2xl font-bold">Check Symptoms</span>
          </button>
          
          <button
            onClick={() => navigate({ to: "/reports" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label="My Reports"
          >
            <ClipboardList className="w-16 h-16 mb-4 text-blue-500" />
            <span className="text-2xl font-bold">My Reports</span>
          </button>
          
          <button
            onClick={() => navigate({ to: "/medicines" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label="My Medicines"
          >
            <Pill className="w-16 h-16 mb-4 text-emerald-500" />
            <span className="text-2xl font-bold">My Medicines</span>
          </button>
          
          <button
            onClick={() => navigate({ to: "/accessibility" })}
            className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 rounded-3xl hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
            aria-label="Accessibility Settings"
          >
            <Settings className="w-16 h-16 mb-4 text-amber-500" />
            <span className="text-2xl font-bold">Accessibility</span>
          </button>
        </div>
      </div>
    );
  }

  // Normal Dashboard layout
  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning 👋</h1>
          <p className="text-muted-foreground">How can Fitmadix help you today?</p>
        </div>
        <div className="w-full sm:w-auto">
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard 
          icon={<Stethoscope className="w-8 h-8 text-primary" />} 
          title="Symptoms" 
          onClick={() => navigate({ to: "/symptoms" })} 
        />
        <DashboardCard 
          icon={<ClipboardList className="w-8 h-8 text-blue-500" />} 
          title="Reports" 
          onClick={() => navigate({ to: "/reports" })} 
        />
        <DashboardCard 
          icon={<Pill className="w-8 h-8 text-emerald-500" />} 
          title="Medicines" 
          onClick={() => navigate({ to: "/medicines" })} 
        />
        <DashboardCard 
          icon={<Activity className="w-8 h-8 text-purple-500" />} 
          title="Timeline" 
          onClick={() => navigate({ to: "/timeline" })} 
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Health Activity</h2>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <Activity className="w-12 h-12 mb-3 opacity-20" />
            <p>No recent activity.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/symptoms" })}>
              Start Health Check
            </Button>
          </div>
        </section>
        
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Upcoming Reminders</h2>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <Pill className="w-12 h-12 mb-3 opacity-20" />
            <p>No medicines added.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate({ to: "/medicines" })}>
              Add Medicine
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-primary hover:bg-secondary/50 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary shadow-sm group"
      type="button"
    >
      <div className="mb-3 transform group-hover:scale-110 transition-transform">{icon}</div>
      <span className="font-semibold text-foreground tracking-tight">{title}</span>
    </button>
  );
}
