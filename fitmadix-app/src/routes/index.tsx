import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  Check,
  ChevronRight,
  Dumbbell,
  Lock,
  MapPin,
  Menu,
  MessagesSquare,
  Mic,
  Moon,
  ShieldCheck,
  Stethoscope,
  Sun,
  UtensilsCrossed,
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
              to="/chat"
              className="hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Open chat <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="hidden items-center gap-1 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                Get started <ArrowRight className="h-3.5 w-3.5" />
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
              to={signedIn ? "/chat" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background"
            >
              {signedIn ? "Open chat" : "Get started"}
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
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-24 sm:pb-20">
        <div className="animate-float-up inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft">
          <ShieldCheck className="h-3.5 w-3.5" />
          Clinical-Grade AI Assistant
        </div>
        <h1
          className="animate-float-up mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Your personal <span className="text-primary">AI doctor,</span>
          <br className="hidden sm:block" /> anytime.
        </h1>
        <p
          className="animate-float-up mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Describe how you feel and Fitmadix walks you through possible causes, red-flag warnings,
          and next steps — grounded in general medical knowledge and clear about its limits.
        </p>
        <div
          className="animate-float-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to={signedIn ? "/chat" : "/auth"}
            search={signedIn ? undefined : { mode: "signup" }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-elegant transition-transform hover:-translate-y-0.5 sm:w-auto"
          >
            {signedIn ? "Continue your consultation" : "Start a free consultation"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#safety"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto"
          >
            Read safety notice
          </a>
        </div>

        <div
          className="animate-float-up mt-8 flex items-start gap-2 rounded-2xl border border-border bg-background/60 p-4 text-left text-xs text-muted-foreground shadow-soft"
          style={{ animationDelay: "320ms" }}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
          <p>
            <span className="font-medium text-foreground">Not medical advice.</span> Fitmadix is an
            AI assistant, not a licensed physician. For emergencies, call your local emergency
            number immediately.
          </p>
        </div>

        {/* Trust badges — from original Fitmadix branding */}
        <div
          className="animate-float-up mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border/60 pt-8"
          style={{ animationDelay: "400ms" }}
        >
          {[
            { icon: ShieldCheck, label: "HIPAA", sub: "Compliant" },
            { icon: Check, label: "GDPR", sub: "Ready" },
            { icon: Lock, label: "E2EE", sub: "Encrypted" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2.5 text-left">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                <b.icon className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-base tracking-wide text-foreground">{b.label}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {b.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Brain,
      title: "Symptom analysis",
      desc: "Describe what you feel in your own words. The AI asks clarifying questions like a real intake.",
    },
    {
      icon: Stethoscope,
      title: "Doctor-style guidance",
      desc: "Possible causes, home care tips, and when to seek in-person care — explained plainly.",
    },
    {
      icon: AlertTriangle,
      title: "Red-flag warnings",
      desc: "Clear alerts for emergency symptoms so you never miss something serious.",
    },
    {
      icon: MessagesSquare,
      title: "Saved consultations",
      desc: "Every conversation is saved to your account so you can pick up where you left off.",
    },
    {
      icon: Activity,
      title: "Personalized to you",
      desc: "Add age, sex, allergies, and history once — the AI uses it in every reply.",
    },
    {
      icon: ShieldCheck,
      title: "Private by default",
      desc: "Your chats are only visible to you. Encrypted in transit and at rest.",
    },
    {
      icon: Camera,
      title: "Prescription reader",
      desc: "Snap a photo of your prescription — AI explains each medicine, timing, and next steps.",
    },
    {
      icon: UtensilsCrossed,
      title: "Diet scanner",
      desc: "Photograph your meal and get instant nutritional advice with a simple health rating.",
    },
    {
      icon: MapPin,
      title: "Nearby facilities",
      desc: "Find hospitals, clinics, and pharmacies near you with one tap. Navigate or call instantly.",
    },
    {
      icon: Mic,
      title: "Voice-first input",
      desc: "Speak your symptoms in Hindi, Bengali, or English — no typing needed.",
    },
    {
      icon: BookOpen,
      title: "Health encyclopedias",
      desc: "Search food, medicine, and disease info — AI-powered knowledge at your fingertips.",
    },
    {
      icon: Dumbbell,
      title: "Home workouts",
      desc: "Guided exercises with timers, reps, and rest periods — no gym required.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">What it does</p>
        <h2 className="mt-2 text-3xl font-semibold sm:text-5xl">
          A thoughtful first opinion, on tap.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Fitmadix isn't a booking tool or a clinic — it's an AI you can talk to like a doctor
          friend, whenever a question comes up.
        </p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article
            key={it.title}
            className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
              <it.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-medium">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            <ChevronRight className="absolute right-5 top-6 h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </article>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Create your account",
      desc: "Sign up with email and add a basic profile so the AI can tailor its answers.",
    },
    {
      n: "02",
      title: "Describe your symptoms",
      desc: "Chat naturally. The AI asks follow-up questions the way a good doctor would.",
    },
    {
      n: "03",
      title: "Get clear guidance",
      desc: "Possible causes, self-care steps, and when to seek professional help — with warnings when it matters.",
    },
  ];
  return (
    <section id="how" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Three steps to an answer.</h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="font-mono text-sm text-primary">{s.n}</p>
              <h3 className="mt-3 text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
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
      <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant sm:p-12">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-chart-4/15 text-chart-4">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-semibold sm:text-3xl">Important safety notice</h2>
        </div>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            Fitmadix is an AI assistant powered by large language models. It is designed for
            <span className="text-foreground">
              {" "}
              general educational and informational purposes only
            </span>{" "}
            and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            <span className="text-foreground">
              Always seek the advice of a qualified healthcare provider
            </span>{" "}
            with any questions you may have regarding a medical condition. Never disregard
            professional medical advice or delay seeking it because of something you read here.
          </p>
          <ul className="grid gap-2">
            {[
              "If you may be having a medical emergency, call your local emergency number immediately.",
              "Do not rely on Fitmadix for prescriptions, dosing, or diagnosis of serious conditions.",
              "AI can make mistakes. Verify important information with a licensed clinician.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                <span>{t}</span>
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
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fitmadix
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#safety" className="hover:text-foreground">
            Safety
          </a>
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <Link to="/auth" className="hover:text-foreground">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-dvh">
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Safety />
      </main>
      <Footer />
    </div>
  );
}
