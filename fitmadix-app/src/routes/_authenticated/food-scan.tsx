import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Leaf,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useCamera } from "@/hooks/use-camera";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { analyzeFood } from "@/lib/food-scanner.functions";
import { SpeakButton } from "@/components/SpeakButton";

export const Route = createFileRoute("/_authenticated/food-scan")({
  component: FoodScanPage,
});

type FoodResult = {
  items: string[];
  healthRating: "good" | "okay" | "improve";
  advice: string;
  calories_estimate: string;
  nutrients: { protein: string; fiber: string; carbs: string };
  suggestion: string;
};

const ratingConfig = {
  good: {
    emoji: "🟢",
    label: "Great Choice!",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  okay: {
    emoji: "🟡",
    label: "Not Bad",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  improve: {
    emoji: "🔴",
    label: "Could Be Better",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

const nutrientLabels: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function NutrientBar({ label, level }: { label: string; level: string }) {
  const widths: Record<string, string> = { low: "w-1/4", medium: "w-2/4", high: "w-3/4" };
  const colors: Record<string, string> = {
    low: "bg-red-400",
    medium: "bg-amber-400",
    high: "bg-emerald-400",
  };
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${widths[level] ?? "w-2/4"} ${colors[level] ?? "bg-amber-400"}`}
        />
      </div>
      <span className="w-14 text-xs text-right text-muted-foreground">
        {nutrientLabels[level] ?? level}
      </span>
    </div>
  );
}

function FoodScanPage() {
  const { videoRef, isStreaming, photoDataUrl, capture, reset, startCamera, error: camError } = useCamera();
  const { speak } = useTextToSpeech();
  const analyze = useServerFn(analyzeFood);

  const [result, setResult] = useState<FoodResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"camera" | "preview" | "result">("camera");

  const handleCapture = () => {
    const dataUrl = capture();
    if (dataUrl) {
      setStep("preview");
    }
  };

  const handleAnalyze = async () => {
    if (!photoDataUrl) return;
    setLoading(true);
    setStep("result");
    try {
      const res = await analyze({ data: { imageBase64: photoDataUrl } });
      setResult(res as FoodResult);
      if (res.advice) {
        speak(res.advice);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to analyze food");
      setStep("preview");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep("camera");
    reset();
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            to="/chat"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">🍽️ Diet Scanner</h1>
            <p className="text-xs text-muted-foreground">
              Take a photo of your food — AI will give diet advice
            </p>
          </div>
        </div>

        {/* Camera Step */}
        {step === "camera" && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            {isStreaming ? (
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full"
                />
                {/* Viewfinder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[60%] w-[80%] rounded-3xl border-2 border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                </div>
                <button
                  onClick={handleCapture}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 grid h-16 w-16 place-items-center rounded-full bg-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Take photo"
                >
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-300" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-10">
                {camError ? (
                  <div className="text-center">
                    <p className="text-sm text-destructive">{camError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
                    >
                      <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                      <Leaf className="h-10 w-10" />
                    </div>
                    <h2 className="text-lg font-semibold">Scan Your Meal</h2>
                    <p className="max-w-sm text-center text-sm text-muted-foreground">
                      Point your camera at your food. The AI will tell you how healthy it is and
                      give friendly advice.
                    </p>
                    <button
                      onClick={startCamera}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
                    >
                      <Camera className="h-4 w-4" /> Open Camera
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && photoDataUrl && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <img
              src={photoDataUrl}
              alt="Captured food"
              className="w-full rounded-2xl"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                ↩️ Retake
              </button>
              <button
                onClick={handleAnalyze}
                className="flex-1 rounded-full bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                🔍 Analyze
              </button>
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === "result" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card py-16 shadow-elegant">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing your meal...</p>
              </div>
            ) : result ? (
              <>
                {/* Health Rating */}
                <div
                  className={`rounded-3xl border ${ratingConfig[result.healthRating].border} ${ratingConfig[result.healthRating].bg} p-6 text-center`}
                >
                  <span className="text-4xl">{ratingConfig[result.healthRating].emoji}</span>
                  <h2
                    className={`mt-2 text-xl font-semibold ${ratingConfig[result.healthRating].color}`}
                  >
                    {ratingConfig[result.healthRating].label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {result.calories_estimate}
                  </p>
                </div>

                {/* Detected Items */}
                {result.items.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      🍱 Detected Items
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.items.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nutrients */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    📊 Nutrition Breakdown
                  </h3>
                  <div className="space-y-3">
                    <NutrientBar label="Protein" level={result.nutrients.protein} />
                    <NutrientBar label="Fiber" level={result.nutrients.fiber} />
                    <NutrientBar label="Carbs" level={result.nutrients.carbs} />
                  </div>
                </div>

                {/* Advice */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">💡 Advice</h3>
                    <SpeakButton text={result.advice} />
                  </div>
                  <p className="mt-2 text-sm text-foreground">{result.advice}</p>
                </div>

                {/* Suggestion */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-foreground">✨ Tip</h3>
                    <SpeakButton text={result.suggestion} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{result.suggestion}</p>
                </div>

                {/* Actions */}
                <button
                  onClick={handleReset}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Camera className="h-4 w-4" /> Scan Another Meal
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
