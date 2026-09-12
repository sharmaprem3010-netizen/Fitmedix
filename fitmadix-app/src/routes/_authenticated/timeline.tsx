import { createFileRoute } from "@tanstack/react-router";
import { Activity, Clock, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { usePageIntro } from "@/hooks/usePageIntro";

export const Route = createFileRoute("/_authenticated/timeline")({
  component: TimelinePage,
});

function TimelinePage() {
  const { autoSpeak, language, setLocalCommandHandler } = useAccessibility();
  
  const intro = language.startsWith("en") 
    ? "You are in Timeline. Say 'Read my timeline' to hear your recent activities."
    : language.startsWith("hi")
      ? "आप टाइमलाइन पर हैं। अपनी हाल की गतिविधियां सुनने के लिए 'मेरी टाइमलाइन पढ़ें' बोलें।"
      : "আপনি টাইমলাইনে আছেন। আপনার সাম্প্রতিক কার্যকলাপ শুনতে 'আমার টাইমলাইন পড়ুন' বলুন।";
      
  usePageIntro(intro);

  const mockTimeline = [
    { time: "08:00 AM", title: "Medicines", desc: "Took Metformin 500mg", type: "medicine" },
    { time: "09:30 AM", title: "Nutrition", desc: "Logged 2 Rotis and Dal (450 kcal)", type: "nutrition" },
    { time: "02:00 PM", title: "Symptoms", desc: "Reported mild headache", type: "symptom" },
    { time: "06:00 PM", title: "Workout", desc: "Completed Upper Body Split (45 mins)", type: "workout" },
  ];

  const handleReadTimeline = () => {
    const summary = language.startsWith("en") 
      ? "Today, you took Metformin at 8 AM, ate 2 rotis and dal at 9:30, reported a mild headache at 2 PM, and completed an upper body workout at 6 PM. Great job staying active!"
      : language.startsWith("hi")
        ? "आज, आपने सुबह 8 बजे मेटफॉर्मिन ली, 9:30 बजे 2 रोटी और दाल खाई, दोपहर 2 बजे हल्का सिरदर्द दर्ज किया, और शाम 6 बजे कसरत पूरी की।"
        : "আজ, আপনি সকাল ৮টায় মেটফর্মিন নিয়েছেন, ৯:৩০ এ ২ রুটি ও ডাল খেয়েছেন, ২টায় মাথাব্যথা রিপোর্ট করেছেন এবং ৬টায় ব্যায়াম শেষ করেছেন।";
    autoSpeak(summary);
  };

  useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      if (/read|timeline|summary|tell me|पढ़ो|পড়ুন/.test(lower)) {
        handleReadTimeline();
        return true;
      }
      return false;
    });
    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, autoSpeak, language]);

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-500" />
            {language.startsWith("en") ? "Health Timeline" : language.startsWith("hi") ? "स्वास्थ्य इतिहास" : "স্বাস্থ্য টাইমলাইন"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language.startsWith("en") ? "A unified view of your symptoms, activities, and logs over time." : "समय के साथ आपकी गतिविधियों का दृश्य।"}
          </p>
        </div>
        <button 
          onClick={handleReadTimeline}
          className="bg-purple-500 text-white hover:bg-purple-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
        >
          <PlayCircle className="w-5 h-5" />
          Listen
        </button>
      </header>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
        {mockTimeline.map((item, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-900 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Clock className="w-5 h-5" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-800 bg-zinc-950 shadow">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-white">{item.title}</div>
                <time className="font-mono text-xs text-zinc-500">{item.time}</time>
              </div>
              <div className="text-zinc-400">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
