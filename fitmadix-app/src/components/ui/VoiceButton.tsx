import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, Play, Pause, Settings, BookOpen, Volume2 } from "lucide-react";
import { useAccessibility } from "../AccessibilityProvider";
import { Button } from "./AppButton";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface VoiceButtonProps {
  onResult: (text: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export function VoiceButton({ onResult, isProcessing = false, className = "" }: VoiceButtonProps) {
  const { 
    language, 
    autoSpeak, 
    isSpeaking, 
    stopSpeaking, 
    voiceMode, 
    readPage,
    isListeningVoice,
    startListeningVoice,
    stopListeningVoice,
    voiceError,
    transcript
  } = useAccessibility();
  const navigate = useNavigate();
  
  const langLabels: Record<string, any> = {
    "en-IN": { tapToSpeak: "Tap to Speak", listening: "I'm listening...", processing: "Understanding...", stopSpeaking: "Stop Speaking", speaking: "Fitmadix is speaking", error: "Please try again", readPage: "Read Page", settings: "Settings" },
    "hi-IN": { tapToSpeak: "बोलने के लिए टैप करें", listening: "सुन रहा हूँ...", processing: "समझ रहा हूँ...", stopSpeaking: "बोलना बंद करें", speaking: "फिटमेडिक्स बोल रहा है", error: "कृपया पुनः प्रयास करें", readPage: "पेज पढ़ें", settings: "सेटिंग्स" },
    "bn-IN": { tapToSpeak: "কথা বলার জন্য ট্যাপ করুন", listening: "শুনছি...", processing: "বুঝতে পারছি...", stopSpeaking: "থামুন", speaking: "ফিটমেডিক্স কথা বলছে", error: "আবার চেষ্টা করুন", readPage: "পৃষ্ঠা পড়ুন", settings: "সেটিংস" },
    "ta-IN": { tapToSpeak: "பேச தட்டவும்", listening: "கேட்கிறது...", processing: "சிந்திக்கிறது...", stopSpeaking: "நிறுத்து", speaking: "ஃபிட்மெடிக்ஸ் பேசுகிறது", error: "மீண்டும் முயற்சிக்கவும்", readPage: "படிக்கவும்", settings: "அமைப்புகள்" },
  };

  const getLabel = (key: string, fallback: string) => langLabels[language]?.[key] || fallback;

  useEffect(() => {
    if (transcript && !isListeningVoice) {
      onResult(transcript);
    }
  }, [transcript, isListeningVoice, onResult]);

  const toggleListening = () => {
    if (isListeningVoice) {
      stopListeningVoice();
    } else {
      startListeningVoice();
    }
  };

  const isBigMode = voiceMode;
  
  if (isSpeaking) {
    return (
      <div className={`flex w-full justify-center gap-4 ${className}`}>
        <button
          type="button"
          onClick={stopSpeaking}
          aria-label={getLabel("stopSpeaking", "Stop Speaking")}
          aria-live="polite"
          className={`flex flex-col items-center justify-center gap-3 rounded-4xl bg-blue-500/20 text-blue-500 border border-blue-500/50 hover:bg-blue-500/30 transition-all ${isBigMode ? "p-8 w-full shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-pulse" : "p-4"}`}
        >
          <Square className={isBigMode ? "w-12 h-12" : "w-6 h-6"} fill="currentColor" aria-hidden="true" />
          {isBigMode && <span className="text-2xl font-bold">{getLabel("speaking", "Fitmadix is speaking")}</span>}
        </button>
      </div>
    )
  }

  const renderMainButton = () => (
    <button
      type="button"
      onClick={toggleListening}
      disabled={isProcessing}
      aria-label={isListeningVoice ? "Stop Listening" : "Start Listening"}
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-2 rounded-4xl transition-all border-4 
        ${voiceError 
          ? "bg-amber-500/20 text-amber-500 border-amber-500" 
          : isListeningVoice 
            ? "bg-red-500 text-white border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
            : isProcessing
              ? "bg-zinc-800 text-zinc-400 border-zinc-700"
              : "bg-primary text-primary-foreground border-primary hover:scale-105 shadow-xl hover:shadow-primary/30"
        } 
        ${isBigMode ? "p-8 flex-1 min-h-50" : "p-4 rounded-full"}
        disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed`}
    >
      {isProcessing ? (
        <Loader2 className={`animate-spin ${isBigMode ? "w-16 h-16" : "w-6 h-6"}`} aria-hidden="true" />
      ) : isListeningVoice ? (
        <Square className={`${isBigMode ? "w-16 h-16" : "w-6 h-6"}`} fill="currentColor" aria-hidden="true" />
      ) : (
        <Mic className={`${isBigMode ? "w-16 h-16" : "w-6 h-6"}`} aria-hidden="true" />
      )}
      
      {isBigMode && !isProcessing && !isListeningVoice && !voiceError && (
        <span className="text-2xl sm:text-3xl font-bold mt-4 tracking-tight">{getLabel("tapToSpeak", "Tap to Speak")}</span>
      )}
      {isBigMode && isListeningVoice && (
        <span className="text-xl sm:text-2xl font-bold mt-4 tracking-tight">{getLabel("listening", "I'm listening...")}</span>
      )}
      {isBigMode && isProcessing && (
        <span className="text-xl sm:text-2xl font-bold mt-4 tracking-tight">{getLabel("processing", "Understanding...")}</span>
      )}
      {isBigMode && voiceError && (
        <span className="text-xl font-bold mt-4 tracking-tight">{voiceError}</span>
      )}
    </button>
  );

  if (!isBigMode) {
    return <div className={className}>{renderMainButton()}</div>;
  }

  return (
    <div className={`flex w-full max-w-4xl mx-auto gap-4 items-stretch ${className}`}>
      <button
        onClick={readPage}
        aria-label={getLabel("readPage", "Read Page")}
        className="w-32 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-2 border-zinc-700 hover:border-primary rounded-4xl flex flex-col items-center justify-center gap-3 transition-all focus:ring-4 focus:ring-primary focus:outline-none shrink-0"
      >
        <Volume2 className="w-10 h-10 text-primary" aria-hidden="true" />
        <span className="text-lg font-bold leading-tight px-2 text-center">{getLabel("readPage", "Read")}</span>
      </button>

      {renderMainButton()}

      <button
        onClick={() => navigate({ to: "/accessibility" })}
        aria-label={getLabel("settings", "Settings")}
        className="w-32 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-2 border-zinc-700 hover:border-primary rounded-4xl flex flex-col items-center justify-center gap-3 transition-all focus:ring-4 focus:ring-primary focus:outline-none shrink-0"
      >
        <Settings className="w-10 h-10 text-zinc-400" aria-hidden="true" />
        <span className="text-lg font-bold leading-tight px-2 text-center">{getLabel("settings", "Settings")}</span>
      </button>
    </div>
  );
}
