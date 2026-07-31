import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type Profile = {
  display_name: string | null;
  age: number | null;
  sex: string | null;
  medical_history: string | null;
  allergies: string | null;
};

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState<Profile>({
    display_name: "",
    age: null,
    sex: "",
    medical_history: "",
    allergies: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: row } = await supabase
        .from("profiles")
        .select("display_name, age, sex, medical_history, allergies")
        .eq("id", data.user.id)
        .maybeSingle();
      if (row) setP(row);
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: p.display_name,
          age: p.age,
          sex: p.sex,
          medical_history: p.medical_history,
          allergies: p.allergies,
        })
        .eq("id", u.user.id);
      if (error) throw error;
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate({ to: "/chat" })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to chat
        </button>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-elegant">
          <h1 className="text-2xl font-semibold tracking-tight">Your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The AI uses these details in every consultation to personalize its guidance. All fields
            are optional.
          </p>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={save} className="mt-6 grid gap-4">
              <F label="Name">
                <input
                  className="input"
                  value={p.display_name ?? ""}
                  onChange={(e) => setP({ ...p, display_name: e.target.value })}
                  placeholder="Your name"
                />
              </F>
              <div className="grid grid-cols-2 gap-4">
                <F label="Age">
                  <input
                    type="number"
                    min={0}
                    max={130}
                    className="input"
                    value={p.age ?? ""}
                    onChange={(e) =>
                      setP({ ...p, age: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="e.g. 32"
                  />
                </F>
                <F label="Sex">
                  <select
                    className="input"
                    value={p.sex ?? ""}
                    onChange={(e) => setP({ ...p, sex: e.target.value })}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </F>
              </div>
              <F label="Known medical history">
                <textarea
                  className="input min-h-24"
                  value={p.medical_history ?? ""}
                  onChange={(e) => setP({ ...p, medical_history: e.target.value })}
                  placeholder="e.g. asthma, hypertension"
                />
              </F>
              <F label="Allergies">
                <textarea
                  className="input min-h-20"
                  value={p.allergies ?? ""}
                  onChange={(e) => setP({ ...p, allergies: e.target.value })}
                  placeholder="e.g. penicillin, peanuts"
                />
              </F>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save profile
              </button>
            </form>
          )}
        </div>

        <Link
          to="/chat"
          className="mt-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          Continue to chat →
        </Link>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--color-border);background:var(--color-background);padding:0.6rem 0.9rem;font-size:0.875rem;outline:none;transition:box-shadow .2s}.input:focus{box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 30%,transparent)}`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
