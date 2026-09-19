import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, ChevronRight, Loader2, BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type EncyclopediaEntry = Database["public"]["Tables"]["encyclopedia_entries"]["Row"];

export const Route = createFileRoute("/encyclopedia/search")({
  component: EncyclopediaSearch,
});

function EncyclopediaSearch() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<EncyclopediaEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Basic text search using Supabase ILIKE
      const { data, error } = await supabase
        .from("encyclopedia_entries")
        .select("*")
        .or(`title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`)
        .eq("status", "published")
        .limit(20);

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      // Fallback for MVP if db fails
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Update URL without page reload
      window.history.pushState({}, "", `/encyclopedia/search?q=${encodeURIComponent(query)}`);
      performSearch(query);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/encyclopedia" className="hover:text-primary transition-colors">Encyclopedia</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Search</span>
      </div>

      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-6">Search Encyclopedia</h1>
        
        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-xl shadow-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Search medicines, foods, conditions, exercises, vitamins..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              className="absolute right-2 h-10 px-6 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Searching database...</p>
          </div>
        ) : (
          <div>
            {hasSearched && (
              <p className="text-sm text-muted-foreground mb-6">
                Found {results.length} results for "{query}"
              </p>
            )}

            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((entry) => (
                  <Link
                    key={entry.id}
                    to="/encyclopedia/$category/$slug"
                    params={{ category: entry.category, slug: entry.slug }}
                    className="block bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-glow transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {entry.category}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {entry.title}
                        </h2>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {entry.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 shrink-0">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : hasSearched && !loading ? (
              <div className="text-center py-20 bg-surface border border-border border-dashed rounded-2xl">
                <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any articles matching "{query}". Try checking your spelling or using more general terms.
                </p>
                <button
                  onClick={() => { setQuery(""); setHasSearched(false); }}
                  className="text-primary font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
