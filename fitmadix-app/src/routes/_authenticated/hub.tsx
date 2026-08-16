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
  LogOut
} from "lucide-react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useAccessibility, LanguagePicker, FontSizeToggle } from "@/components/AccessibilityProvider";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/hub")({
  component: HubPage,
});

function HubPage() {
  const { speak } = useTextToSpeech();
  const { autoSpeak, language } = useAccessibility();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (language === "hi-IN") {
        autoSpeak("आज आप क्या करना चाहेंगे?");
      } else if (language === "bn-IN") {
        autoSpeak("আজ আপনি কী করতে চান?");
      } else {
        autoSpeak("What would you like to do today?");
      }
    }, 500);
    return () => clearTimeout(t);
  }, [autoSpeak, language]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const features = [
    { title: "AI Doctor", icon: MessageSquare, emoji: "💬", color: "bg-blue-500", link: "/chat", desc: "Talk about your symptoms", voice: "AI Doctor. Talk about your symptoms." },
    { title: "Prescriptions", icon: Camera, emoji: "📋", color: "bg-purple-500", link: "/prescription", desc: "Scan and read medicines", voice: "Prescriptions. Scan and read your medicines." },
    { title: "Diet Scanner", icon: UtensilsCrossed, emoji: "🍽️", color: "bg-emerald-500", link: "/food-scan", desc: "Check if food is healthy", voice: "Diet Scanner. Check if your food is healthy." },
    { title: "Nearby Help", icon: MapPin, emoji: "📍", color: "bg-red-500", link: "/nearby", desc: "Find hospitals & clinics", voice: "Nearby Help. Find hospitals and clinics near you." },
    { title: "Food Logs", icon: LineChart, emoji: "📊", color: "bg-orange-500", link: "/food-log", desc: "Track daily calories", voice: "Food Logs. Track your daily calories." },
    { title: "Workouts", icon: Dumbbell, emoji: "🏋️", color: "bg-cyan-500", link: "/exercise", desc: "Home exercise plans", voice: "Workouts. Home exercise plans." },
    { title: "Food Info", icon: BookOpen, emoji: "🍎", color: "bg-green-500", link: "/encyclopedia/food", desc: "Nutrition encyclopedia", voice: "Food Info. Learn about nutrition of any food." },
    { title: "Medicines", icon: Pill, emoji: "💊", color: "bg-indigo-500", link: "/encyclopedia/medicine", desc: "Drug uses and effects", voice: "Medicines. Learn about drug uses and effects." },
    { title: "Diseases", icon: Biohazard, emoji: "🦠", color: "bg-rose-500", link: "/encyclopedia/disease", desc: "Condition encyclopedia", voice: "Diseases. Learn about medical conditions." },
    { title: "Profile", icon: User, emoji: "👤", color: "bg-slate-500", link: "/profile", desc: "Your health details", voice: "Profile. Your health details." },
  ];

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
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Sign out of your account"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
