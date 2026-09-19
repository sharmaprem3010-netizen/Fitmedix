import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  Dumbbell,
  Lock,
  Menu,
  MessagesSquare,
  Moon,
  ShieldCheck,
  Stethoscope,
  Sun,
  UtensilsCrossed,
  User,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fitmadix — AI Fitness & Health Platform" },
      {
        name: "description",
        content:
          "Your complete AI-powered fitness dashboard — track workouts, log nutrition, get AI coaching, and monitor your health.",
      },
      { property: "og:title", content: "Fitmadix — AI Fitness & Health Platform" },
      {
        property: "og:description",
        content:
          "AI-powered fitness tracking, workout planning, nutrition logging, and health insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Determine current theme from DOM (set by __root.tsx inline script)
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("fitmadix-theme", next);
  };
  return { theme, toggle };
}

function useSession() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn;
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
      <img src="/logo.jpg" alt="Fitmadix Logo" className="h-10 object-contain" />
    </Link>
  );
}

function Nav() {
  const { theme, toggle } = useTheme();
  const signedIn = useSession();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How it works" },
    { href: "#safety", label: "Safety" },
  ];
  return (
    <header className="glass sticky top-0 z-50 border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {signedIn ? (
            <Link
              to="/dashboard"
              className="hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <Link
              to={signedIn ? "/dashboard" : "/auth"}
              search={signedIn ? undefined : { mode: "signup" }}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background"
            >
              {signedIn ? "Dashboard" : "Get Started"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const signedIn = useSession();
  return (
    <section id="top" className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Text */}
          <div className="flex-1 text-left">
            <div className="animate-float-up inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft">
              <Activity className="h-3.5 w-3.5" />
              FITMADIX
            </div>
            <h1
              className="animate-float-up mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
              style={{ animationDelay: "80ms" }}
            >
              Your AI Health & <span className="text-primary">Fitness</span>
              <br className="hidden sm:block" /> Companion
            </h1>
            <p
              className="animate-float-up mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Personalized workouts, nutrition guidance, health information and AI coaching — designed around you.
            </p>
            <div
              className="animate-float-up mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                to={signedIn ? "/dashboard" : "/auth"}
                search={signedIn ? undefined : { mode: "signup" }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-elegant transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                {signedIn ? "Go to Dashboard" : "Create My Plan"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#features"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-surface border border-border px-6 py-3 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5 sm:w-auto hover:bg-secondary"
              >
                Explore Fitmadix
              </a>
            </div>
          </div>
          
          {/* Right Side: Mock Dashboard */}
          <div 
            className="flex-1 w-full animate-float-up lg:flex hidden justify-center"
            style={{ animationDelay: "320ms" }}
          >
            <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="border-b border-border bg-surface p-4 flex items-center justify-between">
                <span className="font-semibold text-sm">Today's Plan</span>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="rounded-xl border border-border bg-surface p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase">Workout</p>
                    <p className="font-medium mt-1 text-foreground">Chest + Triceps</p>
                    <p className="text-xs text-muted-foreground mt-1">5 exercises • 45 min</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase">Nutrition</p>
                    <p className="font-medium mt-1 text-foreground">1,620 / 2,200 kcal</p>
                    <p className="text-xs text-muted-foreground mt-1">110g protein remaining</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Data & Privacy */}
        <div
          className="animate-float-up mt-16 flex flex-col items-center justify-center border-t border-border/60 pt-8"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Encrypted connections</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">Privacy-focused design</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">You control your data</span>
            </div>
          </div>
          <div className="mt-8">
             <div className="flex items-start gap-2 rounded-2xl border border-border bg-background/60 p-4 text-left text-xs text-muted-foreground shadow-soft max-w-2xl">
               <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
               <p>
                 <span className="font-medium text-foreground">Educational, not medical.</span> Fitmadix is an
                 AI assistant, not a licensed physician. It does not provide medical advice or diagnosis. For emergencies, call your local emergency number immediately.
                 <a href="#safety" className="ml-1 underline hover:text-foreground transition-colors">Read full safety notice.</a>
               </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Dumbbell,
      title: "Workout",
      color: "text-primary",
      bg: "bg-primary/10",
      content: (
        <div className="mt-4 p-3 rounded-xl border border-border bg-surface text-left">
          <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Muscle Gain • Intermediate</p>
          <p className="font-semibold text-sm mt-1 text-foreground">Chest + Triceps</p>
          <p className="text-xs text-muted-foreground mt-1 mb-3">45 min • 5 exercises</p>
          <div className="w-full h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shadow-soft">Generate Workout →</div>
        </div>
      ),
    },
    {
      icon: UtensilsCrossed,
      title: "Nutrition",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      content: (
        <div className="mt-4 p-3 rounded-xl border border-border bg-surface text-left">
          <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Daily Target</p>
          <p className="font-semibold text-sm mt-1 text-foreground">2,180 kcal</p>
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3 text-xs">
            <div className="text-center p-1.5 bg-background rounded-lg border border-border shadow-sm"><span className="block font-bold text-foreground">120g</span><span className="text-[10px] text-muted-foreground">Protein</span></div>
            <div className="text-center p-1.5 bg-background rounded-lg border border-border shadow-sm"><span className="block font-bold text-foreground">240g</span><span className="text-[10px] text-muted-foreground">Carbs</span></div>
            <div className="text-center p-1.5 bg-background rounded-lg border border-border shadow-sm"><span className="block font-bold text-foreground">65g</span><span className="text-[10px] text-muted-foreground">Fat</span></div>
          </div>
          <div className="w-full h-8 rounded-lg bg-foreground text-background text-xs font-semibold flex items-center justify-center shadow-soft">View Meal Plan →</div>
        </div>
      ),
    },
    {
      icon: MessagesSquare,
      title: "Coach",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      content: (
        <div className="mt-4 p-3 rounded-xl border border-border bg-surface space-y-2 flex flex-col justify-end text-left h-full">
           <div className="bg-background border border-border p-2.5 rounded-xl text-xs max-w-[85%] rounded-tl-sm text-foreground shadow-sm">
             Good morning! What would you like help with?
           </div>
           <div className="bg-primary text-primary-foreground p-2.5 rounded-xl text-xs max-w-[85%] self-end rounded-tr-sm shadow-sm font-medium">
             Why am I not progressing?
           </div>
        </div>
      ),
    },
    {
      icon: Stethoscope,
      title: "Health",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      content: (
        <div className="mt-4 p-3 rounded-xl border border-border bg-surface text-left h-full">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Based on what you described</p>
            <p className="text-xs font-semibold text-foreground pt-1">Possible explanations</p>
            <div className="h-1.5 w-3/4 bg-border rounded-full mt-2"></div>
            <div className="h-1.5 w-1/2 bg-border rounded-full mt-1.5"></div>
            <p className="text-[10px] font-bold text-chart-4 uppercase tracking-wider mt-4">Warning Signs</p>
            <div className="h-1.5 w-2/3 bg-chart-4/30 rounded-full mt-2"></div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
        <p className="text-sm font-bold tracking-widest uppercase text-primary">What it does</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl text-foreground">
          Everything you need, in one place.
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto sm:mx-0">
          Fitmadix connects your workouts, nutrition, and health information into a single personalized experience.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <article
            key={it.title}
            className="group relative rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant flex flex-col"
          >
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${it.bg} ${it.color}`}>
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{it.title}</h3>
            </div>
            <div className="flex-1 mt-4">
              {it.content}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExploreEncyclopedia() {
  return (
    <section id="encyclopedia" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-border bg-linear-to-b from-card to-surface p-8 sm:p-12 shadow-elegant">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground mb-4">
              Explore the Health Encyclopedia
            </h2>
            <p className="text-muted-foreground mb-8">
              Search through our growing database of medicines, foods, exercises, health conditions, and unbiased product reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/encyclopedia"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Browse Encyclopedia
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-surface border border-border px-6 py-3 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5 hover:bg-secondary"
              >
                Product Guide
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-blue-500 font-bold mb-1">Medicines</span>
                <span className="text-xs text-muted-foreground">Uses & Side effects</span>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-green-500 font-bold mb-1">Nutrition</span>
                <span className="text-xs text-muted-foreground">Foods & Vitamins</span>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-orange-500 font-bold mb-1">Fitness</span>
                <span className="text-xs text-muted-foreground">Exercises & Gear</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-red-500 font-bold mb-1">Conditions</span>
                <span className="text-xs text-muted-foreground">Symptoms & Causes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us about yourself",
      desc: "Sign up and add your basic metrics like age, weight, and fitness level to tailor the AI's answers.",
    },
    {
      n: "02",
      title: "Choose your goal",
      desc: "Tell Fitmadix what you want to achieve — from building muscle to losing weight or improving health.",
    },
    {
      n: "03",
      title: "Get your personalized plan",
      desc: "Get an instant, structured workout split, nutrition targets, and daily AI guidance on your dashboard.",
    },
  ];
  return (
    <section id="how" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl text-center mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-primary">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">Three steps to your personalized plan.</h2>
        </div>
        <ol className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl border border-border bg-card p-8 shadow-soft text-center sm:text-left transition-transform hover:-translate-y-1 hover:shadow-elegant">
              <p className="font-mono text-lg font-bold text-primary mb-4">{s.n}</p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Safety() {
  return (
    <section id="safety" className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-chart-4/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-chart-4/15 text-chart-4">
            <AlertTriangle className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl text-foreground">Important safety notice</h2>
        </div>
        <div className="mt-8 space-y-5 text-sm text-muted-foreground leading-relaxed relative z-10">
          <p>
            Fitmadix is an AI assistant powered by large language models. It is designed for
            <span className="text-foreground font-medium"> general educational and informational purposes only</span>{" "}
            and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            <span className="text-foreground font-medium">
              Always seek the advice of a qualified healthcare provider
            </span>{" "}
            with any questions you may have regarding a medical condition. Never disregard
            professional medical advice or delay seeking it because of something you read here.
          </p>
          <ul className="grid gap-3 pt-4 border-t border-border/50">
            {[
              "If you may be having a medical emergency, call your local emergency number immediately.",
              "Do not rely on Fitmadix for prescriptions, dosing, or diagnosis of serious conditions.",
              "AI can make mistakes. Verify important information with a licensed clinician.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm font-medium text-muted-foreground ml-2">
            © {new Date().getFullYear()} Fitmadix
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#safety" className="hover:text-foreground transition-colors">
            Safety
          </a>
          <Link to="/auth" className="hover:text-primary transition-colors">
            Sign In
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is Fitmadix free to use?", a: "Yes, Fitmadix offers a free tier with basic workout tracking and nutrition logging. Advanced AI coaching and specialized plans require a premium subscription." },
    { q: "Does Fitmadix provide medical diagnoses?", a: "No. Fitmadix is an educational tool and fitness companion. It does not replace professional medical advice, diagnosis, or treatment." },
    { q: "How does the AI Coach work?", a: "The AI Coach uses your personalized metrics, workout history, and nutrition logs to provide tailored recommendations and answer health and fitness questions in real-time." },
    { q: "Can I use Fitmadix on my phone?", a: "Yes! Fitmadix is designed as a mobile-first progressive web app that works perfectly on any smartphone." }
  ];

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-2xl border border-border bg-card p-6 shadow-soft cursor-pointer">
            <summary className="flex font-semibold text-lg items-center justify-between outline-none">
              {faq.q}
              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <ExploreEncyclopedia />
        <FAQ />
        <Safety />
      </main>
      <Footer />
    </div>
  );
}
