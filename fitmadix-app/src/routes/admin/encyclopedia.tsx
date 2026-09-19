import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/AppButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/encyclopedia")({
  component: EncyclopediaAdmin,
});

function EncyclopediaAdmin() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from Supabase
    setLoading(false);
    setEntries([
      { id: 1, title: "Paracetamol", category: "medicine", status: "published", updated_at: new Date().toISOString() },
      { id: 2, title: "Premium Whey Isolate", category: "product", status: "draft", updated_at: new Date().toISOString() },
    ]);
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "published": return <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3 mr-1"/> Published</span>;
      case "draft": return <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-500/10 px-2 py-1 rounded-full"><Clock className="w-3 h-3 mr-1"/> Draft</span>;
      case "in_review": return <span className="flex items-center text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full"><AlertCircle className="w-3 h-3 mr-1"/> Review</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Encyclopedia CMS</h1>
          <p className="text-muted-foreground">Manage articles, medical terms, and product reviews.</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Entry
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-elegant">
        <table className="w-full text-left">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Title</th>
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Category</th>
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Status</th>
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">Last Updated</th>
              <th className="p-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-surface/50 transition-colors">
                <td className="p-4 font-bold">{entry.title}</td>
                <td className="p-4 capitalize text-muted-foreground">{entry.category}</td>
                <td className="p-4"><StatusBadge status={entry.status} /></td>
                <td className="p-4 text-sm text-muted-foreground">{new Date(entry.updated_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary transition-colors inline-flex"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-2 text-muted-foreground hover:text-destructive transition-colors inline-flex"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
