import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback } from "react";
import { ArrowLeft, Loader2, Search, Mic, Volume2, RotateCcw } from "lucide-react";
import { searchEncyclopedia } from "@/lib/encyclopedia.functions";
import { toast } from "sonner";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

export const Route = createFileRoute("/_authenticated/encyclopedia/food")({
  component: FoodEncyclopediaPage,
});

function FoodEncyclopediaPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const search = useServerFn(searchEncyclopedia);

  const { isListening, startListening, stopListening, transcript } = useVoiceInput();
  const { speak } = useTextToSpeech();

  // Update query when voice transcript changes
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
        const res = await search({ data: { query: searchTerm, type: "food" } });
        setResult(res);
        // Auto-speak the description for non-readers
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
    { name: "Fruits", emoji: "🍎" },
    { name: "Vegetables", emoji: "🥦" },
    { name: "Grains", emoji: "🌾" },
    { name: "Proteins", emoji: "🥩" },
    { name: "Dairy", emoji: "🥛" },
    { name: "Nuts", emoji: "🥜" },
    { name: "Drinks", emoji: "☕" },
    { name: "Spices", emoji: "🌶️" },
    { name: "Seafood", emoji: "🐟" },
    { name: "Sweets", emoji: "🍫" },
    { name: "Oils", emoji: "🫒" },
    { name: "Superfoods", emoji: "🫐" },
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
            <h1 className="text-xl font-semibold tracking-tight">🍎 Food Encyclopedia</h1>
            <p className="text-xs text-muted-foreground">
              Search any food for nutrition & benefits
            </p>
          </div>
        </div>

        <form onSubmit={(e) => handleSearch(e)} className="relative mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a food... 🔍"
            aria-label="Search for a food"
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
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSearch(undefined, c.name)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-4 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`Search for ${c.name}`}
              >
                <span className="text-4xl">{c.emoji}</span>
                <span className="text-xs font-medium text-foreground">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Searching knowledge base...</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
            {/* Back button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
              aria-label="Go back to categories"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Search again
            </button>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-semibold">{result.name}</h2>
                <button
                  type="button"
                  onClick={() => speak(result.description)}
                  className="text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  aria-label="Read aloud"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>

              <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rating</span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      result.health_rating === "good"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : result.health_rating === "okay"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {result.health_rating?.toUpperCase() || "UNKNOWN"}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Calories:</span> {result.calories}
                </div>
              </div>

              {result.nutrients && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Protein</div>
                    <div className="text-sm font-semibold">{result.nutrients.protein}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Carbs</div>
                    <div className="text-sm font-semibold">{result.nutrients.carbs}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Fat</div>
                    <div className="text-sm font-semibold">{result.nutrients.fat}</div>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Fiber</div>
                    <div className="text-sm font-semibold">{result.nutrients.fiber}</div>
                  </div>
                </div>
              )}
            </div>

            {result.benefits?.length > 0 && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h3 className="font-medium text-emerald-700 dark:text-emerald-400">
                  ✅ Health Benefits
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {result.benefits.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.warnings?.length > 0 && result.warnings[0] !== "" && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <h3 className="font-medium text-red-700 dark:text-red-400">
                  ⚠️ Things to watch out for
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
