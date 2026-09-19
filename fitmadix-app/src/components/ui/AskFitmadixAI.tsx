import { useState } from "react";
import { MessageSquare, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/AppButton";

export function AskFitmadixAI({ contextItem }: { contextItem: string }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    // Simulate AI response for the MVP
    setTimeout(() => {
      setResponse(`This is an AI summary about ${contextItem}. Remember, this is for informational purposes only. Please consult your physician for medical advice regarding your specific question: "${query}".`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Ask Fitmadix AI</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Have a specific question about {contextItem}? Ask our AI assistant.
      </p>
      
      <form onSubmit={handleAsk} className="flex gap-2">
        <input 
          type="text" 
          placeholder="e.g. Can I take this before a workout?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
        />
        <Button variant="primary" type="submit" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask"}
        </Button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-background border border-border rounded-xl text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
          <strong className="block mb-1 text-primary">Fitmadix AI:</strong>
          {response}
        </div>
      )}
    </div>
  );
}
