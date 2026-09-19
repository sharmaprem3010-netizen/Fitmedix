import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  Dumbbell,
  HeartPulse,
  Loader2,
  LogOut,
  Menu,
  Mic,
  MicOff,
  Plus,
  Trash2,
  User,
  Utensils,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createThread, deleteThread, sendChatMessage } from "@/lib/ai-doctor.functions";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { SpeakButton } from "@/components/SpeakButton";
import { useAccessibility } from "@/components/AccessibilityProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThread,
});

type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};
type Thread = { id: string; title: string; updated_at: string };

function ChatThread() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();

  const send = useServerFn(sendChatMessage);
  const create = useServerFn(createThread);
  const remove = useServerFn(deleteThread);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { language, autoSpeak, voiceMode, lowLiteracyMode } = useAccessibility();

  // Load threads
  useEffect(() => {
    supabase
      .from("threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .then(({ data }) => setThreads(data ?? []));
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    setLoadingMsgs(true);
    setMessages([]);
    supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setMessages((data ?? []) as Msg[]);
        setLoadingMsgs(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      });
  }, [threadId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    // Optimistic user message
    const tempId = `tmp-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: tempId, role: "user", content: text, created_at: new Date().toISOString() },
    ]);
    try {
      const { reply } = await send({ data: { threadId, message: text, language } });
      
      // Auto-read response if voice/low-literacy mode is active
      if (voiceMode || lowLiteracyMode) {
        autoSpeak(reply);
      }
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: reply,
          created_at: new Date().toISOString(),
        },
      ]);
      // Refresh threads list to bump order & title
      supabase
        .from("threads")
        .select("id, title, updated_at")
        .order("updated_at", { ascending: false })
        .then(({ data }) => setThreads(data ?? []));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send");
      setMessages((m) => m.filter((x) => x.id !== tempId));
      setInput(text);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const newThread = async () => {
    try {
      const { id } = await create();
      navigate({ to: "/chat/$threadId", params: { threadId: id } });
      setSidebarOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create");
    }
  };

  const removeThread = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    try {
      await remove({ data: { threadId: id } });
      const next = threads.filter((t) => t.id !== id);
      setThreads(next);
      if (id === threadId) {
        if (next.length) navigate({ to: "/chat/$threadId", params: { threadId: next[0].id } });
        else newThread();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex h-full w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo.jpg" alt="FitMadix Logo" className="h-8 object-contain" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={newThread}
          className="mx-3 mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-3.5 w-3.5" /> New conversation
        </button>
        <div className="mt-4 flex-1 overflow-y-auto px-2 pb-2">
          <p className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent
          </p>
          {threads.length === 0 && (
            <p className="px-2 py-4 text-xs text-muted-foreground">No conversations yet.</p>
          )}
          <ul className="space-y-0.5">
            {threads.map((t) => {
              const active = t.id === threadId;
              return (
                <li
                  key={t.id}
                  className={`group flex items-center gap-1 rounded-lg px-1 ${
                    active ? "bg-accent" : "hover:bg-secondary"
                  }`}
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    onClick={() => setSidebarOpen(false)}
                    className={`min-w-0 flex-1 truncate px-2 py-2 text-sm ${
                      active ? "text-accent-foreground font-medium" : "text-foreground"
                    }`}
                    title={t.title}
                  >
                    {t.title}
                  </Link>
                  <button
                    onClick={() => removeThread(t.id)}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-border p-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-secondary"
          >
            <User className="h-4 w-4" /> Profile
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="glass flex items-center justify-between border-b border-border px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">AI Coach · health & fitness guidance</div>
        </header>

        {/* Safety banner */}
        <div className="border-b border-border/60 bg-chart-4/5 px-4 py-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-chart-4" />
            Coach Madix provides health & fitness guidance. It cannot diagnose or treat medical conditions.
          </span>
        </div>
        
        {/* Screen Reader Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {busy ? "AI is typing..." : messages.length > 0 && messages[messages.length - 1].role === "assistant" ? `AI says: ${messages[messages.length - 1].content}` : ""}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-6">
            {loadingMsgs ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <Welcome onPick={(t) => setInput(t)} />
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <Bubble key={m.id} role={m.role} content={m.content} />
                ))}
                {busy && <Bubble role="assistant" content="" typing />}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="border-t border-border bg-background px-4 py-3">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <MicButton
              onTranscript={(t) => setInput((prev) => (prev ? prev + " " : "") + t)}
              disabled={busy}
            />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="Ask Coach Madix..."
              className="min-h-11 max-h-40 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              aria-label="Send"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[10px] text-muted-foreground">
            AI can make mistakes. Verify important info with a licensed clinician.
          </p>
        </form>
      </main>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (t: string) => void }) {
  const categories = [
    {
      title: "Workout",
      icon: <Dumbbell className="h-5 w-5 text-emerald-500" />,
      prompts: ["I want to improve my squat form.", "Build me a 3-day split."],
    },
    {
      title: "Nutrition",
      icon: <Utensils className="h-5 w-5 text-blue-500" />,
      prompts: ["Suggest a high protein breakfast.", "How many carbs should I eat?"],
    },
    {
      title: "Recovery",
      icon: <HeartPulse className="h-5 w-5 text-amber-500" />,
      prompts: ["I'm feeling tired, should I skip?", "Best stretches for back pain."],
    },
  ];

  return (
    <div className="py-12 animate-fade-in">
      <div className="text-center mb-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary shadow-sm mb-6">
          <Sparkles className="h-8 w-8" />
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">How can Coach Madix help?</h1>
        <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
          Get personalized advice for your fitness, nutrition, and wellness journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {categories.map((cat, i) => (
          <div key={i} className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-background rounded-xl border border-border shadow-sm">
                {cat.icon}
              </div>
              <h3 className="font-bold text-foreground text-lg">{cat.title}</h3>
            </div>
            <div className="space-y-3">
              {cat.prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => onPick(p)}
                  className="w-full text-left rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-all hover:border-primary hover:-translate-y-0.5"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bubble({
  role,
  content,
  typing,
}: {
  role: "user" | "assistant" | "system";
  content: string;
  typing?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft ${
          isUser
            ? "bg-gradient-primary text-primary-foreground"
            : "border border-border bg-card text-foreground"
        }`}
      >
        {typing ? (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
          </span>
        ) : (
          <>
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
            {!isUser && content && (
              <div className="mt-2 flex justify-end">
                <SpeakButton text={content} />
              </div>
            )}
          </>
        )}
      </div>
      {isUser && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground">
          <User className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}

function MicButton({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled: boolean;
}) {
  const { isListening, transcript, interimTranscript, startListening, stopListening, isSupported } =
    useVoiceInput();

  useEffect(() => {
    if (transcript) onTranscript(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all ${
        isListening
          ? "animate-pulse border-red-400 bg-red-500/10 text-red-500"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      } disabled:opacity-50`}
      aria-label={isListening ? "Stop listening" : "Voice input"}
      title={isListening ? "Tap to stop" : "Speak your symptoms"}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

