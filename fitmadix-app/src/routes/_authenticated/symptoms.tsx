import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, AlertTriangle, CheckCircle2, Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { usePageIntro } from "@/hooks/usePageIntro";
import { VoiceButton } from "@/components/ui/VoiceButton";

export const Route = createFileRoute("/_authenticated/symptoms")({
  component: SymptomsPage,
});

function SymptomsPage() {
  const { autoSpeak, setLocalCommandHandler, language, voiceMode } = useAccessibility();
  
  const intro = language.startsWith("en") 
    ? "You are in Symptoms. You can describe your symptoms by voice. Say what you are feeling."
    : language.startsWith("hi")
      ? "आप लक्षण पृष्ठ पर हैं। आप बोलकर अपने लक्षण बता सकते हैं।"
      : "আপনি উপসর্গ পৃষ্ঠায় আছেন। আপনি কথা বলে আপনার উপসর্গ বর্ণনা করতে পারেন।";
      
  usePageIntro(intro);

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      
      // Basic NLP Extraction
      const found: string[] = [];
      if (/fever|बुखार|জ্বর|temperature|hot/.test(lower)) found.push("Fever");
      if (/headache|head ache|सिरदर्द|মাথাব্যथा/.test(lower)) found.push("Headache");
      if (/cough|खांसी|কাশি/.test(lower)) found.push("Cough");
      if (/pain|ache|दर्द|ব্যথা/.test(lower)) found.push("Pain");
      if (/nausea|vomit|उल्टी|বমি/.test(lower)) found.push("Nausea");

      if (!analyzed && found.length > 0) {
        setSymptoms(prev => Array.from(new Set([...prev, ...found])));
        
        // Follow up logic
        if (found.includes("Fever") && !followUp) {
          const q = language.startsWith("en") ? "How many days have you had this fever?" : 
                    language.startsWith("hi") ? "आपको यह बुखार कितने दिनों से है?" : "আপনার এই জ্বর কত দিন ধরে?";
          setFollowUp(q);
          autoSpeak(q);
          return true; // handled
        } else if (followUp) {
          // They answered the follow up
          setFollowUp(null);
          setAnalyzed(true);
          const disclaimer = language.startsWith("en") 
            ? "Thank you. Based on this, you should rest and stay hydrated. Remember, I am an AI, not a medical professional. Please consult a physician if symptoms persist."
            : language.startsWith("hi")
              ? "धन्यवाद। आपको आराम करना चाहिए। याद रखें, मैं एआई हूँ, डॉक्टर नहीं।"
              : "ধন্যবাদ। আপনার বিশ্রাম নেওয়া উচিত। মনে রাখবেন, আমি এআই, ডাক্তার নই।";
          autoSpeak(disclaimer);
          return true; // handled
        } else {
          setAnalyzed(true);
          const disclaimer = language.startsWith("en") 
            ? "I have noted your symptoms. Remember, I am an AI, not a medical professional. Please consult a physician if symptoms persist."
            : "मैंने आपके लक्षणों को नोट कर लिया है। कृपया डॉक्टर से सलाह लें।";
          autoSpeak(disclaimer);
          return true;
        }
      } else if (!analyzed && found.length === 0) {
        const msg = language.startsWith("en") ? "I didn't catch specific symptoms. Can you describe them again?" : "कृपया अपने लक्षणों का फिर से वर्णन करें।";
        autoSpeak(msg);
        return true;
      }
      
      // If we are already analyzed and they say "add medicine" it falls through to global intents
      return false; 
    });

    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, analyzed, followUp, autoSpeak, language]);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-primary" />
          {language.startsWith("en") ? "Symptom Checker" : language.startsWith("hi") ? "लक्षण जांच" : "উপসর্গ পরীক্ষক"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language.startsWith("en") ? "Describe what you're feeling for AI guidance." : "मार्गदर्शन के लिए बताएं कि आप कैसा महसूस कर रहे हैं।"}
        </p>
      </header>

      <div className="space-y-6">
        {/* Status Area */}
        <div className="bg-card border border-border p-6 rounded-2xl">
          {analyzed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-6 h-6" />
                <h2 className="text-xl font-bold">Analysis Complete</h2>
              </div>
              <ul className="list-disc pl-5">
                {symptoms.map(s => <li key={s} className="text-lg">{s}</li>)}
              </ul>
              <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                <p className="font-medium text-sm leading-relaxed">
                  Important: Fitmadix is an AI and cannot diagnose medical conditions. 
                  This information is for guidance only. If you are experiencing an emergency, contact healthcare professionals immediately.
                </p>
              </div>
            </div>
          ) : followUp ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-primary mb-4">{followUp}</h2>
              <p className="text-muted-foreground">Tap the microphone to reply</p>
            </div>
          ) : (
             <div className="text-center py-8">
              <Mic className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">
                {language.startsWith("en") ? "What are you feeling?" : language.startsWith("hi") ? "आप क्या महसूस कर रहे हैं?" : "আপনি কী অনুভব করছেন?"}
              </h2>
              <p className="text-muted-foreground">
                {language.startsWith("en") ? "Say 'I have a fever and headache'" : "बोलें 'मुझे बुखार है'"}
              </p>
            </div>
          )}
        </div>
        
        {/* We rely on the global voice button, but we can show a hint here if they don't have voiceMode on */}
        {!voiceMode && (
          <div className="text-center p-4 bg-secondary rounded-xl text-sm text-muted-foreground">
            Please enable Voice-First mode in Settings to use the symptom checker, or use the microphone button below.
          </div>
        )}
      </div>
    </div>
  );
}
