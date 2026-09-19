import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/encyclopedia/$category/")({
  component: EncyclopediaCategory,
});

function EncyclopediaCategory() {
  const { category } = Route.useParams();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation:
    // supabase.from('encyclopedia_entries').select('*').eq('category', category).eq('status', 'published')
    setLoading(false);
    setEntries([
      { id: 1, title: "Paracetamol", slug: "paracetamol", description: "Used to treat pain and fever." },
      { id: 2, title: "Ibuprofen", slug: "ibuprofen", description: "Anti-inflammatory pain reliever." },
    ]);
  }, [category]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      <div className="mb-8">
        <Link 
          to="/encyclopedia" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Encyclopedia
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          {capitalize(category)}
        </h1>
        <p className="text-muted-foreground">Browse all verified {category} entries.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link 
              key={entry.id}
              to="/encyclopedia/$category/$slug" 
              params={{ category, slug: entry.slug }}
              className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all"
            >
              <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
