import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback } from "react";
import { ArrowLeft, Loader2, Search, Mic, Volume2, AlertTriangle, Activity, RotateCcw, ShieldCheck } from "lucide-react";
import { searchEncyclopedia } from "@/lib/encyclopedia.functions";
import { toast } from "sonner";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

export const Route = createFileRoute("/_authenticated/encyclopedia/disease")({
  component: DiseaseEncyclopediaPage,
});

function DiseaseEncyclopediaPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const search = useServerFn(searchEncyclopedia);

  const { isListening, startListening, stopListening, transcript } = useVoiceInput();
  const { speak } = useTextToSpeech();

  if (transcript && isListening) {
    if (query !== transcript) setQuery(transcript);
  }

  const handleSearch = useCallback(async (e?: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const searchTerm = directQuery ?? query;
    if (!searchTerm.trim()) return;
    
    if (directQuery) setQuery(directQuery);
    setLoading(true);
    setResult(null);
    try {
      const res = await search({ data: { query: searchTerm, type: "disease" } });
      setResult(res);
      if (res.description) speak(res.description);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [query, search, speak]);

  const handleReset = () => {
    setResult(null);
    setQuery("");
  };

  const categories = [
    { name: "Heart", emoji: "❤️" },
    { name: "Lungs", emoji: "🫁" },
    { name: "Skin", emoji: "🧴" },
    { name: "Bones", emoji: "🦴" },
    { name: "Brain", emoji: "🧠" },
    { name: "Eyes", emoji: "👁️" },
    { name: "Stomach", emoji: "🫄" },
    { name: "Kidney", emoji: "🫘" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/hub" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Go back to hub">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">🦠 Disease & Conditions</h1>
            <p className="text-xs text-muted-foreground">Learn about medical conditions</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSearch(e)} className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Diabetes, Asthma... 🔍"
            aria-label="Search for a disease or condition"
            className="w-full rounded-2xl border border-border bg-card py-4 pl-10 pr-12 text-sm outline-none ring-primary/40 focus:ring-2"
          />
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`absolute inset-y-0 right-2 flex items-center px-2 ${isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"}`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            <Mic className="h-5 w-5" />
          </button>
        </form>

        {!result && !loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSearch(undefined, c.name)}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-elegant"
                aria-label={`Search for ${c.name} conditions`}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-xs font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Searching condition database...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Go back to categories"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Search again
            </button>

            {result.is_emergency && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-500 p-4 text-white shadow-lg shadow-red-500/20">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <p className="text-sm font-medium">🚨 This condition can be a medical emergency. Seek immediate care if experiencing severe symptoms.</p>
              </div>
            )}

            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold">{result.name}</h2>
                <button onClick={() => speak(result.description)} className="text-primary hover:opacity-80" aria-label="Read aloud">
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-medium text-muted-foreground">🤒 Symptoms</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  {result.symptoms?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-medium text-muted-foreground">🔍 Common Causes</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  {result.causes?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>

            {result.prevention?.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Prevention
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {result.prevention.map((p: string, i: number) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            {result.treatments?.length > 0 && (
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">💊 Common Treatments</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800/80 dark:text-blue-300/80">
                  {result.treatments.map((t: string, i: number) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400">🏥 When to see a doctor</h3>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">{result.when_to_see_doctor}</p>
            </div>

            <Link
              to="/chat"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              aria-label="Discuss this condition with the AI Doctor"
            >
              <Activity className="h-4 w-4" /> 💬 Discuss with AI Doctor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
