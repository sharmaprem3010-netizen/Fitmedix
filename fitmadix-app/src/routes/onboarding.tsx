import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, Target, Activity, Flame, Trophy, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/AppButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveUserSettingsToDb } from "@/services/fitnessService";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingFlow,
});

function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [goal, setGoal] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        // Save to Supabase (assuming saveUserSettingsToDb handles this)
        await saveUserSettingsToDb({
          userMetrics: {
            age: parseInt(age) || 30,
            weightKg: parseInt(weight) || 75,
            heightCm: parseInt(height) || 175,
            goal: (goal || "fitness") as any,
            gender: sex as any,
            activityLevel: experience as any,
          },
          macroTargets: {
            calories: 2200,
            protein: 150,
            carbs: 250,
            fat: 70,
            waterMl: 2500,
          }
        });
      }
      
      // Artificial delay to show the "Generating Plan" state
      setTimeout(() => {
        toast.success("Profile complete!");
        navigate({ to: "/dashboard", replace: true });
      }, 2000);
    } catch (error) {
      toast.error("Failed to save profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-4 sm:p-6 text-foreground">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full max-w-xl mb-12">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step {step} of 5</span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {step === 1 && "Goal"}
              {step === 2 && "Metrics"}
              {step === 3 && "Experience"}
              {step === 4 && "Environment"}
              {step === 5 && "Preferences"}
            </span>
          </div>
          <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-elegant relative overflow-hidden">
        
        {/* Step 1: Goal */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">What's your main goal?</h1>
            <p className="text-muted-foreground mb-8 text-sm">Select the primary focus for your Fitmadix journey.</p>
            
            <div className="grid gap-3">
              {[
                { id: "muscle", label: "Build Muscle", icon: Dumbbell },
                { id: "weight", label: "Lose Weight", icon: Flame },
                { id: "fitness", label: "Improve Fitness", icon: Activity },
                { id: "health", label: "Maintain Health", icon: Target },
                { id: "sports", label: "Sports Performance", icon: Trophy },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGoal(item.id);
                    setTimeout(handleNext, 300);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                    goal === item.id 
                      ? "border-primary bg-primary/10 text-foreground" 
                      : "border-border bg-surface hover:border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`p-2 rounded-xl ${goal === item.id ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Metrics */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Tell us about yourself</h1>
            <p className="text-muted-foreground mb-8 text-sm">This helps calculate your calorie targets and workout intensity.</p>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sex</label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-shadow appearance-none"
                  >
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3">
              <Button variant="outline" className="flex-1 py-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                variant="primary" 
                className="flex-2 py-6" 
                onClick={handleNext}
                disabled={!age || !sex || !height || !weight}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">What's your experience level?</h1>
            <p className="text-muted-foreground mb-8 text-sm">We'll adapt your workout complexity and volume.</p>
            
            <div className="grid gap-3">
              {[
                { id: "beginner", title: "Beginner", desc: "I'm new to structured training" },
                { id: "intermediate", title: "Intermediate", desc: "I've been training consistently for a while" },
                { id: "advanced", title: "Advanced", desc: "I'm highly experienced and need advanced programming" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setExperience(item.id);
                    setTimeout(handleNext, 300);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    experience === item.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-surface hover:border-border/80 hover:bg-secondary"
                  }`}
                >
                  <p className={`font-bold ${experience === item.id ? "text-foreground" : "text-foreground"}`}>{item.title}</p>
                  <p className={`text-sm mt-1 ${experience === item.id ? "text-primary/80" : "text-muted-foreground"}`}>{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" className="flex-1 py-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Training Location */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Where do you train?</h1>
            <p className="text-muted-foreground mb-8 text-sm">This determines what equipment we include in your workouts.</p>
            
            <div className="grid gap-3">
              {[
                { id: "home", title: "At Home", desc: "Bodyweight, bands, or minimal equipment" },
                { id: "gym", title: "At a Gym", desc: "Full access to machines and free weights" },
                { id: "both", title: "Both", desc: "Mix of home and gym workouts" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    location === item.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-surface hover:border-border/80 hover:bg-secondary"
                  }`}
                >
                  <p className={`font-bold ${location === item.id ? "text-foreground" : "text-foreground"}`}>{item.title}</p>
                  <p className={`text-sm mt-1 ${location === item.id ? "text-primary/80" : "text-muted-foreground"}`}>{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-10 flex gap-3">
              <Button variant="outline" className="flex-1 py-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                variant="primary" 
                className="flex-2 py-6" 
                onClick={handleNext}
                disabled={!location}
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Preferences */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Any dietary preferences?</h1>
            <p className="text-muted-foreground mb-8 text-sm">We'll tailor your meal plans to these choices.</p>
            
            <div className="grid gap-3">
              {[
                { id: "none", title: "None", desc: "I eat everything" },
                { id: "vegetarian", title: "Vegetarian", desc: "No meat or fish" },
                { id: "vegan", title: "Vegan", desc: "100% plant-based" },
                { id: "keto", title: "Keto", desc: "High fat, very low carb" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setStep(6);
                    handleComplete();
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all border-border bg-surface hover:border-border/80 hover:bg-secondary`}
                >
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="text-sm mt-1 text-muted-foreground">{item.desc}</p>
                </button>
              ))}
            </div>

            <div className="mt-10 flex gap-3">
              <Button variant="outline" className="flex-1 py-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                variant="primary" 
                className="flex-2 py-6" 
                onClick={() => {
                  setStep(6);
                  handleComplete();
                }}
              >
                Skip & Create Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Generating Plan (Loading) */}
        {step === 6 && (
          <div className="animate-in fade-in zoom-in-95 duration-700 py-12 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center relative shadow-xl">
                {loading ? (
                  <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
                ) : (
                  <CheckCircle2 className="w-10 h-10 text-primary-foreground animate-in zoom-in duration-300" />
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {loading ? "Building your plan..." : "Your plan is ready!"}
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {loading 
                ? "Calculating macros and setting up your first week of workouts." 
                : "Redirecting to your new dashboard."}
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}
