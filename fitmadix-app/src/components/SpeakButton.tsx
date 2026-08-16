import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";

interface SpeakButtonProps {
  text: string;
  lang?: "en-IN" | "hi-IN" | "bn-IN";
  className?: string;
}

/**
 * A small, reusable speaker button that reads text aloud using browser TTS.
 * Shows a pulsing animation while speaking.
 */
export function SpeakButton({ text, lang = "en-IN", className = "" }: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();

  if (!isSupported) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-all hover:bg-secondary ${
        isSpeaking ? "animate-pulse text-primary" : "text-muted-foreground hover:text-foreground"
      } ${className}`}
      aria-label={isSpeaking ? "Stop speaking" : "Read aloud"}
      title={isSpeaking ? "Stop" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
