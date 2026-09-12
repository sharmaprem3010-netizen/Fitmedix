import { createFileRoute } from "@tanstack/react-router";
import { FileText, UploadCloud, FileSpreadsheet, Loader2, PlayCircle, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAccessibility } from "@/components/AccessibilityProvider";
import { usePageIntro } from "@/hooks/usePageIntro";

export const Route = createFileRoute("/_authenticated/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const { autoSpeak, language, setLocalCommandHandler, voiceMode } = useAccessibility();
  
  const intro = language.startsWith("en") 
    ? "You are in Medical Reports. You can upload a PDF or image of your lab report to get a simplified summary."
    : language.startsWith("hi")
      ? "आप रिपोर्ट पृष्ठ पर हैं। आप अपनी लैब रिपोर्ट अपलोड कर सकते हैं।"
      : "আপনি রিপোর্ট পৃষ্ঠায় আছেন। আপনি আপনার ল্যাব রিপোর্ট আপলোড করতে পারেন।";
      
  usePageIntro(intro);

  const [isUploading, setIsUploading] = useState(false);
  const [analyzedReport, setAnalyzedReport] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local Voice Handler for "Read Report" or "Upload"
  useEffect(() => {
    setLocalCommandHandler((text: string) => {
      const lower = text.toLowerCase();
      
      if (/upload|file|upload report|अपलोड/.test(lower) && !analyzedReport && !isUploading) {
        // Trigger file input
        fileInputRef.current?.click();
        return true;
      }
      
      if (/read|summary|listen|tell me|पढ़ो|পড়ুন/.test(lower) && analyzedReport) {
        handleReadSummary();
        return true;
      }

      return false; 
    });
    return () => setLocalCommandHandler(null);
  }, [setLocalCommandHandler, analyzedReport, isUploading, language]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      autoSpeak(language.startsWith("en") ? "Processing your report..." : "रिपोर्ट प्रोसेस हो रही है...");
      
      // Mock Analysis Delay
      setTimeout(() => {
        setIsUploading(false);
        setAnalyzedReport({
          fileName: file.name,
          summary: "Your Complete Blood Count (CBC) is mostly normal, but your Hemoglobin is slightly low, indicating mild anemia.",
          summaryHi: "आपका पूरा रक्त परीक्षण (सीबीसी) सामान्य है, लेकिन आपका हीमोग्लोबिन थोड़ा कम है, जो हल्के एनीमिया का संकेत देता है।",
          summaryBn: "আপনার সিবিসি স্বাভাবিক, কিন্তু হিমোগ্লোবিন সামান্য কম।",
          highLow: [
            { name: "Hemoglobin", value: "11.2 g/dL", status: "Low", range: "12.0 - 15.5" },
            { name: "WBC", value: "6.5 x10^9/L", status: "Normal", range: "4.5 - 11.0" }
          ],
          questions: [
            "Should I take an iron supplement?",
            "Are there specific foods I should eat to boost hemoglobin?"
          ]
        });
        
        const doneMsg = language.startsWith("en") ? "Analysis complete. Say 'Read summary' to listen." : "विश्लेषण पूरा हुआ। 'सारांश पढ़ें' बोलें।";
        autoSpeak(doneMsg);
      }, 3000);
    }
  };

  const handleReadSummary = () => {
    if (!analyzedReport) return;
    const text = language.startsWith("en") ? analyzedReport.summary 
               : language.startsWith("hi") ? analyzedReport.summaryHi 
               : analyzedReport.summaryBn;
    autoSpeak(text);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          {language.startsWith("en") ? "Medical Reports" : language.startsWith("hi") ? "मेडिकल रिपोर्ट" : "মেডিকেল রিপোর্ট"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language.startsWith("en") ? "Upload tests for a simplified, easy-to-understand breakdown." : "सरल जानकारी के लिए परीक्षण अपलोड करें।"}
        </p>
      </header>

      {!analyzedReport && !isUploading && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/50 hover:border-primary bg-card/50 hover:bg-card transition-colors rounded-3xl p-12 text-center cursor-pointer flex flex-col items-center justify-center min-h-75"
        >
          <UploadCloud className="w-16 h-16 text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-2">Tap to Upload Report</h2>
          <p className="text-muted-foreground">PDF or Image (JPG, PNG)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,image/*" 
            onChange={handleFileUpload}
          />
        </div>
      )}

      {isUploading && (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-75">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-2">Analyzing Report...</h2>
          <p className="text-muted-foreground">Extracting medical data securely</p>
        </div>
      )}

      {analyzedReport && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-primary" />
                  Analysis Results
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">{analyzedReport.fileName}</p>
              </div>
              <button 
                onClick={handleReadSummary}
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Listen
              </button>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-5 mb-8">
              <p className="text-lg leading-relaxed">
                {language.startsWith("en") ? analyzedReport.summary : language.startsWith("hi") ? analyzedReport.summaryHi : analyzedReport.summaryBn}
              </p>
            </div>

            <h3 className="text-xl font-bold mb-4">Important Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {analyzedReport.highLow.map((item: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl border ${item.status === 'Low' || item.status === 'High' ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-background'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{item.name}</span>
                    <span className={`text-sm font-bold px-2 py-1 rounded-md ${item.status === 'Low' || item.status === 'High' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <span className="text-sm text-muted-foreground mb-1">Range: {item.range}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4">Questions to ask your doctor</h3>
            <ul className="space-y-3 mb-6">
              {analyzedReport.questions.map((q: string, i: number) => (
                <li key={i} className="flex gap-3 items-start bg-background p-4 rounded-xl border border-border">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold mt-0.5">{i+1}</div>
                  <p>{q}</p>
                </li>
              ))}
            </ul>

            <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl flex gap-3 mt-8">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <p className="text-sm">This is an AI-generated summary for informational purposes only. Do not make medical decisions without consulting a doctor.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setAnalyzedReport(null)}
            className="w-full py-4 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            Upload Another Report
          </button>
        </div>
      )}
    </div>
  );
}
