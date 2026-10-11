export interface VoiceConfig {
  language: string; // BCP 47 language tag, e.g. 'en-US', 'hi-IN', 'bn-IN'
  rate?: number;
  pitch?: number;
  volume?: number;
}

export type VoiceStatus = 'idle' | 'speaking' | 'listening' | 'error' | 'unsupported';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export interface VoiceServiceInterface {
  isSupported(): boolean;
  speak(text: string, options?: Partial<VoiceConfig>): Promise<void>;
  stopSpeaking(): void;
  startListening(onResult: (result: SpeechRecognitionResult) => void, onError?: (err: string) => void): void;
  stopListening(): void;
  getVoices(): SpeechSynthesisVoice[];
}
