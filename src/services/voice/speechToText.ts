import { SpeechRecognitionResult } from './types.ts';

// Declare Web Speech API types for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechToTextService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    language: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (errorMsg: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = language || 'en-US';

    this.recognition.onresult = (event: any) => {
      const lastIndex = event.results.length - 1;
      const result = event.results[lastIndex];
      const transcript = result[0]?.transcript || '';
      const confidence = result[0]?.confidence || 0;
      const isFinal = result.isFinal || false;

      onResult({
        transcript,
        confidence,
        isFinal,
      });
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError?.(event.error || 'Speech recognition error occurred.');
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e: any) {
      this.isListening = false;
      onError?.(e.message || 'Could not start microphone');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop error
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const sttService = new SpeechToTextService();
