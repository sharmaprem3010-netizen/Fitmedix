import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback } from "react";
import { ArrowLeft, Loader2, Search, Mic, Volume2, AlertTriangle, RotateCcw } from "lucide-react";
import { searchEncyclopedia } from "@/lib/encyclopedia.functions";
import { toast } from "sonner";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

export const Route = createFileRoute("/_authenticated/encyclopedia/medicine")({
  component: MedicineEncyclopediaPage,
});

function MedicineEncyclopediaPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const search = useServerFn(searchEncyclopedia);

  const { isListening, startListening, stopListening, transcript } = useVoiceInput();
  const { speak } = useTextToSpeech();

  if (transcript && isListening) {
    if (query !== transcript) setQuery(transcript);
  }

  const handleSearch = useCallback(
    async (e?: React.FormEvent, directQuery?: string) => {
      e?.preventDefault();
      const searchTerm = directQuery ?? query;
      if (!searchTerm.trim()) return;

      if (directQuery) setQuery(directQuery);
      setLoading(true);
      setResult(null);
      try {
        const res = await search({ data: { query: searchTerm, type: "medicine" } });
        setResult(res);
        if (res.description) speak(res.description);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [query, search, speak],
  );

  const handleReset = () => {
    setResult(null);
    setQuery("");
  };

  const categories = [
    { name: "Pain Relief", emoji: "💊" },
    { name: "Fever", emoji: "🤒" },
    { name: "Allergy", emoji: "🤧" },
    { name: "Stomach", emoji: "🫃" },
    { name: "Blood Pressure", emoji: "❤️‍🩹" },
    { name: "Diabetes", emoji: "🩸" },
    { name: "Vitamins", emoji: "💛" },
    { name: "Antibiotics", emoji: "🦠" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/hub"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Go back to hub"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">💊 Medicine Lookup</h1>
            <p className="text-xs text-muted-foreground">Find simple info on medications</p>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Always follow your doctor's exact prescription. This is for general knowledge only.</p>
        </div>

        <form onSubmit={(e) => handleSearch(e)} className="relative mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Paracetamol, Aspirin... 🔍"
            aria-label="Search for a medicine"
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
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-elegant transition-transform hover:-translate-y-1"
                aria-label={`Search for ${c.name} medicines`}
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="text-xs font-medium text-foreground">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Searching medicine database...</p>
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

            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold">{result.name}</h2>
                <button
                  onClick={() => speak(result.description)}
                  className="text-primary hover:opacity-80"
                  aria-label="Read aloud"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
            </div>

            {result.uses?.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-medium text-muted-foreground">Common Uses</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.uses.map((u: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">
                💊 How to take it
              </h3>
              <p className="mt-1 text-sm text-blue-800/80 dark:text-blue-300/80">
                {result.dosage_tips}
              </p>
            </div>

            {result.side_effects?.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Side Effects</h3>
                <div className="space-y-2">
                  {result.side_effects.map((se: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
                    >
                      <span className="text-sm">{se.effect}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                          se.severity === "severe"
                            ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                            : se.severity === "moderate"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                        }`}
                      >
                        {se.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.warnings?.length > 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <h3 className="text-sm font-medium text-red-700 dark:text-red-400">
                  ⚠️ Important Warnings
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-600/80 dark:text-red-400/80">
                  {result.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
