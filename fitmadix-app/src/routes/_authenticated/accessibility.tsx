import { createFileRoute } from "@tanstack/react-router";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { Switch } from "@/components/ui/switch";
import { Mic, Eye, Settings, MousePointer2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/accessibility")({
  component: AccessibilitySettings,
});

function AccessibilitySettings() {
  const { 
    highContrast, setHighContrast, 
    reducedMotion, setReducedMotion, 
    simpleMode, setSimpleMode, 
    voiceMode, setVoiceMode 
  } = useAccessibility();

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Accessibility Settings
        </h1>
        <p className="text-muted-foreground mt-2">Customize your experience to fit your needs.</p>
      </header>

      <div className="grid gap-6">
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Voice-First Mode</h3>
                <p className="text-sm text-muted-foreground">Increases touch targets and enables voice navigation by default.</p>
              </div>
            </div>
            <Switch 
              checked={voiceMode} 
              onCheckedChange={setVoiceMode} 
              aria-label="Toggle Voice Mode"
              className="scale-125"
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">High Contrast</h3>
                <p className="text-sm text-muted-foreground">Enhances text visibility and removes subtle backgrounds.</p>
              </div>
            </div>
            <Switch 
              checked={highContrast} 
              onCheckedChange={setHighContrast} 
              aria-label="Toggle High Contrast"
              className="scale-125"
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <MousePointer2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Simple Interface</h3>
                <p className="text-sm text-muted-foreground">Reduces clutter and simplifies navigation options.</p>
              </div>
            </div>
            <Switch 
              checked={simpleMode} 
              onCheckedChange={setSimpleMode} 
              aria-label="Toggle Simple Mode"
              className="scale-125"
            />
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Reduce Motion</h3>
                <p className="text-sm text-muted-foreground">Disables animations and transitions across the app.</p>
              </div>
            </div>
            <Switch 
              checked={reducedMotion} 
              onCheckedChange={setReducedMotion} 
              aria-label="Toggle Reduce Motion"
              className="scale-125"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
