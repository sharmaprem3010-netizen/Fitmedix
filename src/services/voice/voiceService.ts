import { VoiceConfig, VoiceServiceInterface, SpeechRecognitionResult } from './types.ts';
import { ttsService } from './textToSpeech.ts';
import { sttService } from './speechToText.ts';

export class VoiceService implements VoiceServiceInterface {
  public isSupported(): boolean {
    return ttsService.isSupported();
  }

  public isSpeechRecognitionSupported(): boolean {
    return sttService.isSupported();
  }

  public async speak(text: string, options?: Partial<VoiceConfig>): Promise<void> {
    return ttsService.speak(text, options);
  }

  public stopSpeaking(): void {
    ttsService.stop();
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (err: string) => void,
    language = 'en-US'
  ): void {
    sttService.startListening(language, onResult, onError);
  }

  public stopListening(): void {
    sttService.stopListening();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return ttsService.getVoices();
  }
}

export const voiceService = new VoiceService();
