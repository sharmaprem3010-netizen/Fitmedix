import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Loader2,
  RefreshCw,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Clock,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { useCamera } from "@/hooks/use-camera";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { analyzePrescription } from "@/lib/prescription-reader.functions";
import { SpeakButton } from "@/components/SpeakButton";

export const Route = createFileRoute("/_authenticated/prescription")({
  component: PrescriptionPage,
});

type Medicine = {
  name: string;
  dosage: string;
  timing: string;
  withFood: boolean;
  explanation: string;
};

type PrescriptionResult = {
  medicines: Medicine[];
  summary: string;
  warnings: string;
  nextSteps: string;
};

function TimingIcon({ timing }: { timing: string }) {
  const iconClass = "h-6 w-6";
  switch (timing) {
    case "morning":
      return <Sun className={`${iconClass} text-amber-400`} />;
    case "evening":
    case "night":
      return <Moon className={`${iconClass} text-indigo-400`} />;
    case "afternoon":
      return <Sunset className={`${iconClass} text-orange-400`} />;
    case "morning_and_night":
      return (
        <div className="flex gap-1">
          <Sun className="h-5 w-5 text-amber-400" />
          <Moon className="h-5 w-5 text-indigo-400" />
        </div>
      );
    case "three_times_daily":
      return (
        <div className="flex gap-1">
          <Sunrise className="h-4 w-4 text-amber-400" />
          <Sun className="h-4 w-4 text-orange-400" />
          <Moon className="h-4 w-4 text-indigo-400" />
        </div>
      );
    default:
      return <Clock className={`${iconClass} text-muted-foreground`} />;
  }
}

function TimingLabel({ timing }: { timing: string }) {
  const labels: Record<string, string> = {
    morning: "🌅 Morning",
    afternoon: "☀️ Afternoon",
    evening: "🌆 Evening",
    night: "🌙 Night",
    morning_and_night: "🌅 Morning + 🌙 Night",
    three_times_daily: "3× Daily",
  };
  return <span className="text-sm font-medium">{labels[timing] ?? timing}</span>;
}

function PrescriptionPage() {
  const { videoRef, isStreaming, photoDataUrl, capture, reset, startCamera, error: camError } = useCamera();
  const { speak } = useTextToSpeech();
  const analyze = useServerFn(analyzePrescription);

  const [result, setResult] = useState<PrescriptionResult | null>(null);
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
      setResult(res);
      // Auto-speak the summary
      if (res.summary) {
        speak(res.summary);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to analyze prescription");
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
            <h1 className="text-xl font-semibold tracking-tight">📋 Prescription Reader</h1>
            <p className="text-xs text-muted-foreground">
              Take a photo of your prescription — AI will explain it
            </p>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-border bg-chart-4/5 p-4 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
          <p>
            <span className="font-medium text-foreground">Important:</span> This AI reads
            prescriptions for informational purposes only. Always follow your doctor's exact
            instructions and verify with your pharmacist.
          </p>
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
                  style={{ transform: "scaleX(1)" }}
                />
                {/* Glowing viewfinder overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[70%] w-[85%] rounded-2xl border-2 border-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                </div>
                <button
                  onClick={handleCapture}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 grid h-16 w-16 place-items-center rounded-full bg-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Take photo"
                >
                  <div className="h-12 w-12 rounded-full border-4 border-gray-300" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-10">
                {camError ? (
                  <div className="text-center">
                    <p className="text-sm text-destructive">{camError}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
                    >
                      <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid h-20 w-20 place-items-center rounded-3xl bg-accent text-accent-foreground">
                      <Camera className="h-10 w-10" />
                    </div>
                    <h2 className="text-lg font-semibold">Scan Your Prescription</h2>
                    <p className="max-w-sm text-center text-sm text-muted-foreground">
                      Hold your prescription steady in good lighting. The AI will read and explain
                      each medicine.
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
              alt="Captured prescription"
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
                ✨ Analyze
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
                <p className="text-sm text-muted-foreground">Reading your prescription...</p>
              </div>
            ) : result ? (
              <>
                {/* Summary Card */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold">📋 Summary</h2>
                    <SpeakButton text={result.summary} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{result.summary}</p>
                </div>

                {/* Medicines */}
                {result.medicines.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      💊 Medicines ({result.medicines.length})
                    </h3>
                    {result.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-base font-semibold">{med.name}</h4>
                          <SpeakButton
                            text={`${med.name}. ${med.dosage}. ${med.explanation}. Take it ${med.timing.replace(/_/g, " ")}${med.withFood ? ", after eating food" : ""}.`}
                          />
                        </div>
                        <p className="mt-1 text-xs text-primary font-medium">{med.dosage}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{med.explanation}</p>

                        {/* Visual timing + food indicators */}
                        <div className="mt-4 flex items-center gap-4 rounded-xl bg-secondary/50 p-3">
                          <div className="flex items-center gap-2">
                            <TimingIcon timing={med.timing} />
                            <TimingLabel timing={med.timing} />
                          </div>
                          {med.withFood && (
                            <div className="flex items-center gap-1.5 text-sm text-accent-foreground">
                              <UtensilsCrossed className="h-4 w-4" />
                              <span>After food</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {result.warnings && result.warnings !== "None" && (
                  <div className="rounded-2xl border border-chart-4/30 bg-chart-4/5 p-5">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-chart-4" />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">⚠️ Warnings</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{result.warnings}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-semibold text-foreground">👣 What to do next</h4>
                    <SpeakButton text={result.nextSteps} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{result.nextSteps}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    <Camera className="h-4 w-4" /> Scan Another
                  </button>
                  <Link
                    to="/chat"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    💬 Ask Doctor
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
