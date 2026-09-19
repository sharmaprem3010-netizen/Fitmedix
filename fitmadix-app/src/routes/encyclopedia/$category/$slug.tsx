import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, ExternalLink, Info, AlertTriangle } from "lucide-react";
import { AskFitmadixAI } from "@/components/ui/AskFitmadixAI";

export const Route = createFileRoute("/encyclopedia/$category/$slug")({
  component: EncyclopediaEntry,
});

function EncyclopediaEntry() {
  const { category, slug } = Route.useParams();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Supabase:
    // supabase.from('encyclopedia_entries').select('*, medicine_details(*)').eq('slug', slug).single()
    
    // For now, simulating the layout structure
    setLoading(false);
    setEntry({
      title: "Paracetamol",
      category: "medicine",
      description: "A common medication used to treat pain and fever.",
      benefits_uses: "Used for mild to moderate pain relief and to reduce fever.",
      risks_limitations: "Can cause liver damage if taken in excessive amounts.",
      warnings: "Do not exceed recommended dosage. Avoid alcohol while taking.",
      last_reviewed_at: new Date().toISOString(),
      medicine_details: {
        generic_name: "Paracetamol",
        brand_names: ["Crocin", "Calpol", "Dolo", "Panadol"],
        drug_class: "Analgesic / Antipyretic",
        prescription_status: "OTC (Over-the-counter)",
      },
      sources: [
        { source_name: "WHO Model List of Essential Medicines", source_url: "https://www.who.int" }
      ]
    });
  }, [category, slug]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) {
    return <div className="p-8 text-center">Entry not found</div>;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6">
      
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()}
        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Header */}
      <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{entry.title}</h1>
            <p className="text-lg text-muted-foreground">{entry.description}</p>
          </div>
          {entry.image_url && (
            <img src={entry.image_url} alt={entry.title} className="w-24 h-24 rounded-2xl object-cover shrink-0" />
          )}
        </div>
        
        {/* Quick Info Grid for Medicines */}
        {entry.category === 'medicine' && entry.medicine_details && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Generic Name</span>
              <p className="font-medium mt-1">{entry.medicine_details.generic_name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Class</span>
              <p className="font-medium mt-1">{entry.medicine_details.drug_class}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Status</span>
              <p className="font-medium mt-1">{entry.medicine_details.prescription_status}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Brands</span>
              <p className="font-medium mt-1 text-sm">{entry.medicine_details.brand_names?.join(", ")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        
        {/* Overview / Uses */}
        <section className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Benefits & Uses
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {entry.benefits_uses}
          </div>
        </section>

        {/* Risks */}
        <section className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Risks & Limitations
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {entry.risks_limitations}
          </div>
        </section>

        {/* Warnings */}
        {entry.warnings && (
          <section className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-destructive-foreground">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Important Warnings
            </h2>
            <div className="prose prose-sm max-w-none text-current">
              {entry.warnings}
            </div>
            {entry.category === 'medicine' && (
              <p className="mt-4 text-sm font-semibold border-t border-destructive/20 pt-4">
                Prescription may be required. Follow the advice of a qualified healthcare professional and use a licensed pharmacy.
              </p>
            )}
          </section>
        )}

      </div>

      <AskFitmadixAI contextItem={entry.title} />

      {/* Trust & Sources */}
      <div className="mt-12 mb-8 pt-8 border-t border-border">
        <h3 className="font-bold text-lg mb-4">Sources & References</h3>
        {entry.sources?.map((src: any, i: number) => (
          <a key={i} href={src.source_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline mb-2">
            {src.source_name}
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
        {entry.last_reviewed_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Last reviewed: {new Date(entry.last_reviewed_at).toLocaleDateString()}
          </p>
        )}
      </div>

    </div>
  );
}
