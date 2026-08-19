import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  Activity, 
  BookOpen, 
  Camera, 
  Dumbbell, 
  HeartPulse, 
  MapPin, 
  MessageSquare, 
  UtensilsCrossed,
  Pill,
  Biohazard,
  LineChart,
  User,
  LogOut,
  Volume2,
  VolumeX
} from "lucide-react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useAccessibility, LanguagePicker, FontSizeToggle } from "@/components/AccessibilityProvider";
import { hubTranslations } from "@/translations/hub";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/hub")({
  component: HubPage,
});

function HubPage() {
  const { autoSpeak, stopSpeaking, isSpeaking, language } = useAccessibility();
  const navigate = useNavigate();
  const t = hubTranslations[language] || hubTranslations["en-IN"];
  const [isSigningOut, setIsSigningOut] = useState(false);

  const readAllOptions = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    const intro = t.intro;
    const optionsText = features.map(f => f.voice).join(". ");
    autoSpeak(intro + optionsText);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSpeak(t.intro);
    }, 500);
    return () => clearTimeout(timer);
  }, [autoSpeak, t.intro]);

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate({ to: "/", replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const features = useMemo(() => [
    { title: t.features.aiDoctor.title, icon: MessageSquare, emoji: "💬", color: "bg-blue-500", link: "/chat", desc: t.features.aiDoctor.desc, voice: t.features.aiDoctor.voice },
    { title: t.features.prescriptions.title, icon: Camera, emoji: "📋", color: "bg-purple-500", link: "/prescription", desc: t.features.prescriptions.desc, voice: t.features.prescriptions.voice },
    { title: t.features.dietScanner.title, icon: UtensilsCrossed, emoji: "🍽️", color: "bg-emerald-500", link: "/food-scan", desc: t.features.dietScanner.desc, voice: t.features.dietScanner.voice },
    { title: t.features.nearbyHelp.title, icon: MapPin, emoji: "📍", color: "bg-red-500", link: "/nearby", desc: t.features.nearbyHelp.desc, voice: t.features.nearbyHelp.voice },
    { title: t.features.foodLogs.title, icon: LineChart, emoji: "📊", color: "bg-orange-500", link: "/food-log", desc: t.features.foodLogs.desc, voice: t.features.foodLogs.voice },
    { title: t.features.workouts.title, icon: Dumbbell, emoji: "🏋️", color: "bg-cyan-500", link: "/exercise", desc: t.features.workouts.desc, voice: t.features.workouts.voice },
    { title: t.features.foodInfo.title, icon: BookOpen, emoji: "🍎", color: "bg-green-500", link: "/encyclopedia/food", desc: t.features.foodInfo.desc, voice: t.features.foodInfo.voice },
    { title: t.features.medicines.title, icon: Pill, emoji: "💊", color: "bg-indigo-500", link: "/encyclopedia/medicine", desc: t.features.medicines.desc, voice: t.features.medicines.voice },
    { title: t.features.diseases.title, icon: Biohazard, emoji: "🦠", color: "bg-rose-500", link: "/encyclopedia/disease", desc: t.features.diseases.desc, voice: t.features.diseases.voice },
    { title: t.features.profile.title, icon: User, emoji: "👤", color: "bg-slate-500", link: "/profile", desc: t.features.profile.desc, voice: t.features.profile.voice },
  ], [t]);

  return (
    <div className="min-h-dvh w-full flex-1 overflow-y-auto bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-white shadow-glow">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Fitmadix Hub</h1>
              <p className="text-sm text-muted-foreground">Your complete health assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontSizeToggle />
            <LanguagePicker compact />
          </div>
        </div>

        {/* Voice Navigation for Illiterate Users */}
        <button
          onClick={readAllOptions}
          className={`mb-8 flex w-full items-center justify-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
            isSpeaking 
              ? "animate-pulse border-blue-500 bg-blue-500/10 text-blue-500" 
              : "border-primary bg-primary/10 text-primary hover:bg-primary/20"
          }`}
          aria-label={isSpeaking ? t.stopSpeaking : t.readAloud}
        >
          {isSpeaking ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
          <div>
            <h2 className="text-lg font-bold">{isSpeaking ? t.stopSpeaking : t.readAloud}</h2>
            <p className="text-xs opacity-80">{t.tapToHear}</p>
          </div>
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={f.voice}
              onFocus={() => autoSpeak(f.voice)}
              onMouseEnter={() => autoSpeak(f.voice)}
            >
              <div className={`grid h-16 w-16 place-items-center rounded-2xl ${f.color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                <span className="text-4xl" role="img" aria-hidden="true">{f.emoji}</span>
              </div>
              <div>
                <h2 className="font-semibold">{f.title}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={signOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Sign out of your account"
          >
            {isSigningOut ? (
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <LogOut className="h-4 w-4" /> 
            )}
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
