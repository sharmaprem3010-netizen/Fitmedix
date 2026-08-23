import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createThread } from "@/lib/ai-doctor.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const create = useServerFn(createThread);
  const [threads, setThreads] = useState<
    { id: string; title: string; updated_at: string }[] | null
  >(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase
      .from("threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setThreads(data ?? []);
        if (!data || data.length === 0) {
          startNew();
        } else {
          navigate({ to: "/chat/$threadId", params: { threadId: data[0].id }, replace: true });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNew = async () => {
    setCreating(true);
    try {
      const { id } = await create();
      navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create consultation");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {creating || threads === null ? "Loading…" : "Redirecting…"}
        <button
          onClick={startNew}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-foreground hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" /> New consultation
        </button>
        <Link to="/" className="text-xs hover:underline">
          Back home
        </Link>
      </div>
    </div>
  );
}
