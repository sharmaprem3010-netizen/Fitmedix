import { createFileRoute } from "@tanstack/react-router";
import { Pill, CheckCircle2, Clock, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { usePageIntro } from "@/hooks/usePageIntro";

export const Route = createFileRoute("/_authenticated/medicines")({
  component: MedicinesPage,
});

type Step = "IDLE" | "ASK_NAME" | "ASK_DOSAGE" | "ASK_FREQ" | "CONFIRM";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
}

function MedicinesPage() {
  const { autoSpeak, setLocalCommandHandler, language, voiceMode } = useAccessibility();
  
  const intro = language.startsWith("en") 
    ? "You are in Medicines. Say 'Add medicine' to add a new prescription."
    : language.startsWith("hi")
      ? "आप दवा पृष्ठ पर हैं। नई दवा जोड़ने के लिए 'दवा जोड़ें' बोलें।"
      : "আপনি ওষুধ পৃষ্ঠায় আছেন। নতুন ওষুধ যোগ করতে 'ওষুধ যোগ করুন' বলুন।";
      
  usePageIntro(intro);

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [step, setStep] = useState<Step>("IDLE");
  const [currentMed, setCurrentMed] = useState<Partial<Medicine>>({});

  useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      
      if (step === "IDLE") {
        if (/add|new|joड़ें|যোগ করুন/.test(lower) && /medicine|pill|drug|दवा|ওষুধ/.test(lower)) {
          setStep("ASK_NAME");
          const q = language.startsWith("en") ? "What is the name of the medicine?" : 
                    language.startsWith("hi") ? "दवा का नाम क्या है?" : "ওষুধের নাম কি?";
          autoSpeak(q);
          return true;
        }
        return false;
      }
      
      if (step === "ASK_NAME") {
        setCurrentMed({ name: text });
        setStep("ASK_DOSAGE");
        const q = language.startsWith("en") ? "What is the dosage? For example, 500 milligrams." : 
                  language.startsWith("hi") ? "खुराक क्या है? उदाहरण के लिए, 500 मिलीग्राम।" : "ডোজ কি? উদাহরণস্বরূপ, 500 মিলিগ্রাম।";
        autoSpeak(q);
        return true;
      }

      if (step === "ASK_DOSAGE") {
        setCurrentMed(prev => ({ ...prev, dosage: text }));
        setStep("ASK_FREQ");
        const q = language.startsWith("en") ? "How often do you take it? For example, twice a day." : 
                  language.startsWith("hi") ? "आप इसे कितनी बार लेते हैं?" : "আপনি এটি কতবার নেন?";
        autoSpeak(q);
        return true;
      }

      if (step === "ASK_FREQ") {
        const freq = text;
        const newMed = { name: currentMed.name!, dosage: currentMed.dosage!, frequency: freq };
        setMedicines(prev => [...prev, newMed]);
        setCurrentMed({});
        setStep("IDLE");
        
        const q = language.startsWith("en") ? `Got it. Added ${newMed.name}, ${newMed.dosage}, ${newMed.frequency}.` : 
                  language.startsWith("hi") ? `समझ गया। ${newMed.name} जोड़ दिया गया है।` : `বুঝতে পেরেছি। ${newMed.name} যোগ করা হয়েছে।`;
        autoSpeak(q);
        return true;
      }

      return false; 
    });

    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, step, currentMed, autoSpeak, language]);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Pill className="w-8 h-8 text-primary" />
            {language.startsWith("en") ? "Medicines" : language.startsWith("hi") ? "दवाइयाँ" : "ওষুধ"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language.startsWith("en") ? "Manage your prescriptions and reminders." : "अपने नुस्खे प्रबंधित करें।"}
          </p>
        </div>
        {!voiceMode && (
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90">
            <Plus className="w-5 h-5" /> Add Manual
          </button>
        )}
      </header>

      <div className="space-y-6">
        {/* Status Area */}
        {step !== "IDLE" && (
          <div className="bg-card border-2 border-primary p-6 rounded-2xl text-center animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <h2 className="text-2xl font-bold text-primary mb-2">
              {step === "ASK_NAME" && (language.startsWith("en") ? "What is the name?" : "नाम क्या है?")}
              {step === "ASK_DOSAGE" && (language.startsWith("en") ? "What is the dosage?" : "खुराक क्या है?")}
              {step === "ASK_FREQ" && (language.startsWith("en") ? "How often?" : "कितनी बार?")}
            </h2>
            <p className="text-muted-foreground">Tap the microphone and speak</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {medicines.length === 0 ? (
            <div className="col-span-full border-2 border-dashed border-border rounded-2xl p-12 text-center text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{language.startsWith("en") ? "No medicines added yet. Say 'Add medicine'." : "अभी तक कोई दवा नहीं जोड़ी गई है।"}</p>
            </div>
          ) : (
            medicines.map((m, i) => (
              <div key={i} className="bg-card border border-border p-5 rounded-2xl flex items-start justify-between shadow-sm">
                <div>
                  <h3 className="text-xl font-bold">{m.name}</h3>
                  <p className="text-muted-foreground">{m.dosage}</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    {m.frequency}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
