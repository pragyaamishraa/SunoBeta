// Speech Recognition Utility for Suno Beta supporting 11 Indian Languages
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/translations';

export interface RecognitionOptions {
  language?: SupportedLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private isListeningState = false;

  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition
    );
  }

  public isListening(): boolean {
    return this.isListeningState;
  }

  public start(options: RecognitionOptions): boolean {
    if (!SpeechRecognitionManager.isSupported()) {
      options.onError?.('Speech recognition is not supported in this browser. Please type your question.');
      return false;
    }

    this.stop();

    try {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      this.recognition = new SpeechRecognitionClass();

      const langCode = options.language || 'en';
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      const speechLocale = langConfig ? langConfig.speechLocale : 'en-IN';

      this.recognition.lang = speechLocale;
      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListeningState = true;
        options.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        if (fullText) {
          options.onResult(fullText, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListeningState = false;
        let userFriendlyMsg = 'Could not catch your voice clearly. Please try again.';
        if (event.error === 'not-allowed') {
          userFriendlyMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          userFriendlyMsg = 'No speech was detected. Please speak closer to your microphone.';
        } else if (event.error === 'network') {
          userFriendlyMsg = 'Voice connection issue. Please check your internet or type your question.';
        }
        options.onError?.(userFriendlyMsg);
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
        options.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      this.isListeningState = false;
      options.onError?.('Unable to open microphone. Please type your question.');
      return false;
    }
  }

  public stop(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListeningState = false;
  }
}

export const speechRecognitionManager = new SpeechRecognitionManager();
