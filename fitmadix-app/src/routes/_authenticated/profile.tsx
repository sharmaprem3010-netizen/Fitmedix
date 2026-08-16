import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save, User, Activity, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type Profile = {
  display_name: string | null;
  age: number | null;
  sex: string | null;
  medical_history: string | null;
  allergies: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_goal: string | null;
  fitness_level: string | null;
  training_preference: string | null;
  dietary_preference: string | null;
  target_calories: number | null;
  target_protein: number | null;
  target_carbs: number | null;
  target_fats: number | null;
};

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "fitness" | "nutrition">("personal");
  const [p, setP] = useState<Profile>({
    display_name: "",
    age: null,
    sex: "",
    medical_history: "",
    allergies: "",
    height_cm: null,
    weight_kg: null,
    fitness_goal: "",
    fitness_level: "",
    training_preference: "",
    dietary_preference: "",
    target_calories: null,
    target_protein: null,
    target_carbs: null,
    target_fats: null,
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: row } = await supabase
        .from("profiles")
        .select("*")
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
          height_cm: p.height_cm,
          weight_kg: p.weight_kg,
          fitness_goal: p.fitness_goal,
          fitness_level: p.fitness_level,
          training_preference: p.training_preference,
          dietary_preference: p.dietary_preference,
          target_calories: p.target_calories,
          target_protein: p.target_protein,
          target_carbs: p.target_carbs,
          target_fats: p.target_fats,
        })
        .eq("id", u.user.id);
      if (error) throw error;
      toast.success("Profile saved successfully");
      // Invalidate React Query cache so dashboard picks up the changes immediately
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "fitness", label: "Fitness", icon: Activity },
    { id: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
  ] as const;

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate({ to: "/" })}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-elegant">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                These details help Fitmadix personalize your dashboard, AI coaching, and workouts.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Vertical Tabs */}
              <div className="w-full md:w-48 shrink-0 flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap
                      ${activeTab === tab.id 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={save} className="flex-1 grid gap-6">
                {activeTab === "personal" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid gap-5">
                    <F label="Display Name">
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
                          onChange={(e) => setP({ ...p, age: e.target.value ? Number(e.target.value) : null })}
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
                    <F label="Known Medical History (Optional)">
                      <textarea
                        className="input min-h-24 resize-y"
                        value={p.medical_history ?? ""}
                        onChange={(e) => setP({ ...p, medical_history: e.target.value })}
                        placeholder="e.g. asthma, hypertension"
                      />
                    </F>
                    <F label="Allergies (Optional)">
                      <textarea
                        className="input min-h-24 resize-y"
                        value={p.allergies ?? ""}
                        onChange={(e) => setP({ ...p, allergies: e.target.value })}
                        placeholder="e.g. penicillin, peanuts"
                      />
                    </F>
                  </div>
                )}

                {activeTab === "fitness" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <F label="Height (cm)">
                        <input
                          type="number"
                          min={50}
                          max={300}
                          className="input"
                          value={p.height_cm ?? ""}
                          onChange={(e) => setP({ ...p, height_cm: e.target.value ? Number(e.target.value) : null })}
                          placeholder="e.g. 175"
                        />
                      </F>
                      <F label="Weight (kg)">
                        <input
                          type="number"
                          min={20}
                          max={400}
                          className="input"
                          value={p.weight_kg ?? ""}
                          onChange={(e) => setP({ ...p, weight_kg: e.target.value ? Number(e.target.value) : null })}
                          placeholder="e.g. 70"
                        />
                      </F>
                    </div>
                    <F label="Primary Fitness Goal">
                      <select
                        className="input"
                        value={p.fitness_goal ?? ""}
                        onChange={(e) => setP({ ...p, fitness_goal: e.target.value })}
                      >
                        <option value="">Select a goal</option>
                        <option value="lose_weight">Lose Weight / Body Fat</option>
                        <option value="build_muscle">Build Muscle (Hypertrophy)</option>
                        <option value="strength">Increase Strength</option>
                        <option value="endurance">Improve Endurance / Cardio</option>
                        <option value="general_health">General Health & Wellness</option>
                      </select>
                    </F>
                    <F label="Current Fitness Level">
                      <select
                        className="input"
                        value={p.fitness_level ?? ""}
                        onChange={(e) => setP({ ...p, fitness_level: e.target.value })}
                      >
                        <option value="">Select your level</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3+ years)</option>
                      </select>
                    </F>
                    <F label="Preferred Training Location">
                      <select
                        className="input"
                        value={p.training_preference ?? ""}
                        onChange={(e) => setP({ ...p, training_preference: e.target.value })}
                      >
                        <option value="">Select preference</option>
                        <option value="gym">Commercial Gym</option>
                        <option value="home">Home / Bodyweight</option>
                        <option value="hybrid">Hybrid (Both)</option>
                      </select>
                    </F>
                  </div>
                )}

                {activeTab === "nutrition" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid gap-5">
                    <F label="Dietary Preference">
                      <select
                        className="input"
                        value={p.dietary_preference ?? ""}
                        onChange={(e) => setP({ ...p, dietary_preference: e.target.value })}
                      >
                        <option value="none">No Specific Preference (Omnivore)</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan / Plant-Based</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="keto">Keto / Low Carb</option>
                        <option value="paleo">Paleo</option>
                      </select>
                    </F>
                    
                    <div className="pt-4 mt-2 border-t border-border">
                      <h3 className="text-sm font-semibold mb-4 text-foreground/80">Daily Macro Targets</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <F label="Target Calories (kcal)">
                          <input
                            type="number"
                            className="input"
                            value={p.target_calories ?? ""}
                            onChange={(e) => setP({ ...p, target_calories: e.target.value ? Number(e.target.value) : null })}
                            placeholder="e.g. 2400"
                          />
                        </F>
                        <F label="Target Protein (g)">
                          <input
                            type="number"
                            className="input"
                            value={p.target_protein ?? ""}
                            onChange={(e) => setP({ ...p, target_protein: e.target.value ? Number(e.target.value) : null })}
                            placeholder="e.g. 150"
                          />
                        </F>
                        <F label="Target Carbs (g)">
                          <input
                            type="number"
                            className="input"
                            value={p.target_carbs ?? ""}
                            onChange={(e) => setP({ ...p, target_carbs: e.target.value ? Number(e.target.value) : null })}
                            placeholder="e.g. 250"
                          />
                        </F>
                        <F label="Target Fats (g)">
                          <input
                            type="number"
                            className="input"
                            value={p.target_fats ?? ""}
                            onChange={(e) => setP({ ...p, target_fats: e.target.value ? Number(e.target.value) : null })}
                            placeholder="e.g. 70"
                          />
                        </F>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>{`.input{width:100%;border-radius:0.75rem;border:1px solid var(--color-border);background:var(--color-background);padding:0.75rem 1rem;font-size:0.875rem;outline:none;transition:all .2s; color: var(--color-foreground)}.input:focus{box-shadow:0 0 0 2px color-mix(in oklab,var(--primary) 20%,transparent); border-color: var(--primary)}.input::placeholder{color: var(--color-muted-foreground)}`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-1">{label}</span>
      {children}
    </label>
  );
}
