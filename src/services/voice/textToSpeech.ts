import { VoiceConfig } from './types.ts';

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speak(text: string, config: Partial<VoiceConfig> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        return reject(new Error('SpeechSynthesis is not supported in this browser environment.'));
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.language || 'en-US';
      utterance.rate = config.rate ?? 1.0;
      utterance.pitch = config.pitch ?? 1.0;
      utterance.volume = config.volume ?? 1.0;

      // Select voice matching language if available
      const voices = this.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        // Don't reject if cancelled manually
        if (e.error === 'canceled' || e.error === 'interrupted') {
          resolve();
        } else {
          reject(new Error(`Speech error: ${e.error}`));
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const ttsService = new TextToSpeechService();
