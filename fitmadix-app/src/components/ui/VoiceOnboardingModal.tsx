import React, { useEffect, useState } from "react";
import { useAccessibility, type Language } from "@/components/AccessibilityProvider";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { Volume2 } from "lucide-react";

const SUPPORTED_LANGUAGES: { code: Language; flag: string; label: string; greeting: string; nameInNative: string }[] = [
  { code: "en-IN", flag: "🇬🇧", label: "English", greeting: "Language set to English. Welcome to Fitmadix.", nameInNative: "English" },
  { code: "hi-IN", flag: "🇮🇳", label: "हिंदी", greeting: "भाषा हिंदी सेट हो गई है। फिटमेडिक्स में आपका स्वागत है।", nameInNative: "हिंदी" },
  { code: "bn-IN", flag: "🇮🇳", label: "বাংলা", greeting: "ভাষা বাংলা সেট করা হয়েছে। ফিটমেডিক্সে স্বাগতম।", nameInNative: "বাংলা" },
  { code: "te-IN", flag: "🇮🇳", label: "తెలుగు", greeting: "భాష తెలుగుకు సెట్ చేయబడింది. ఫిట్మెడిక్స్ కు స్వాగతం.", nameInNative: "తెలుగు" },
  { code: "mr-IN", flag: "🇮🇳", label: "मराठी", greeting: "भाषा मराठी सेट केली आहे. फिटमेडिक्स मध्ये आपले स्वागत आहे.", nameInNative: "मराठी" },
  { code: "ta-IN", flag: "🇮🇳", label: "தமிழ்", greeting: "மொழி தமிழ் அமைக்கப்பட்டுள்ளது. பிட்மெடிக்ஸ் க்கு வரவேற்கிறோம்.", nameInNative: "தமிழ்" },
  { code: "ur-IN", flag: "🇮🇳", label: "اردو", greeting: "زبان اردو سیٹ کر دی گئی ہے۔ فٹ میڈکس میں خوش آمدید۔", nameInNative: "اردو" },
  { code: "gu-IN", flag: "🇮🇳", label: "ગુજરાતી", greeting: "ભાષા ગુજરાતી સેટ થઈ ગઈ છે. ફિટમેડિક્સ માં તમારું સ્વાગત છે.", nameInNative: "ગુજરાતી" },
  { code: "kn-IN", flag: "🇮🇳", label: "ಕನ್ನಡ", greeting: "ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಹೊಂದಿಸಲಾಗಿದೆ. ಫಿಟ್ಮೆಡಿಕ್ಸ್ ಗೆ ಸ್ವಾಗತ.", nameInNative: "ಕನ್ನಡ" },
  { code: "ml-IN", flag: "🇮🇳", label: "മലയാളം", greeting: "ഭാഷ മലയാളമായി സജ്ജീകരിച്ചിരിക്കുന്നു. ഫിറ്റ്മെഡിക്സിലേക്ക് സ്വാഗതം.", nameInNative: "മലയാളം" },
  { code: "pa-IN", flag: "🇮🇳", label: "ਪੰਜਾਬੀ", greeting: "ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਸੈੱਟ ਕੀਤੀ ਗਈ ਹੈ। ਫਿਟਮੈਡਿਕਸ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ।", nameInNative: "ਪੰਜਾਬੀ" },
  { code: "or-IN", flag: "🇮🇳", label: "ଓଡ଼ିଆ", greeting: "ଭାଷା ଓଡ଼ିଆ ସେଟ୍ କରାଯାଇଛି। ଫିଟମେଡିକ୍ସ କୁ ସ୍ଵାଗତ।", nameInNative: "ଓଡ଼ିଆ" },
];

export function VoiceOnboardingModal() {
  const { voiceMode, lowLiteracyMode, hasCompletedVoiceOnboarding, setHasCompletedVoiceOnboarding, setLanguage, stopSpeaking } = useAccessibility();
  const { speak } = useTextToSpeech();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if ((voiceMode || lowLiteracyMode) && !hasCompletedVoiceOnboarding) {
      setIsOpen(true);
      // Wait a moment for modal to render before speaking
      const timer = setTimeout(() => {
        speak("Which language would you like to use?", "en-IN");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voiceMode, lowLiteracyMode, hasCompletedVoiceOnboarding, speak]);

  if (!isOpen) return null;

  const handleListen = (e: React.MouseEvent, lang: typeof SUPPORTED_LANGUAGES[0]) => {
    e.stopPropagation();
    stopSpeaking();
    speak(lang.nameInNative, lang.code);
  };

  const handleSelect = (lang: typeof SUPPORTED_LANGUAGES[0]) => {
    stopSpeaking();
    setLanguage(lang.code);
    setHasCompletedVoiceOnboarding(true);
    setIsOpen(false);
    
    // Greeting in selected language
    setTimeout(() => {
      speak(lang.greeting, lang.code);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="bg-card border-2 border-primary rounded-3xl p-6 sm:p-8 max-w-3xl w-full text-center space-y-8 shadow-2xl my-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Choose Language
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div key={lang.code} className="flex gap-2 w-full">
              <button 
                onClick={() => handleSelect(lang)}
                className="flex-1 bg-zinc-800/50 hover:bg-zinc-700 border-2 border-zinc-700/50 hover:border-primary rounded-2xl p-4 text-xl sm:text-2xl font-bold transition-all flex items-center justify-center gap-3 focus:ring-4 focus:ring-primary focus:outline-none"
                aria-label={`Select ${lang.label}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
              <button
                onClick={(e) => handleListen(e, lang)}
                className="w-16 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-2 border-blue-500/20 hover:border-blue-500 rounded-2xl flex items-center justify-center transition-all focus:ring-4 focus:ring-blue-500 focus:outline-none shrink-0"
                aria-label={`Listen to ${lang.label}`}
              >
                <Volume2 className="w-8 h-8" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
