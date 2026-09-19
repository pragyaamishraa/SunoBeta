// Voice Narration Utility for Suno Beta supporting Indian languages
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/translations';

// Name keywords for Indian voices in common browsers and operating systems
const REGIONAL_VOICE_KEYWORDS: Record<SupportedLanguage, string[]> = {
  en: ['en-in', 'india', 'veena', 'rishi', 'ravi', 'kavya', 'english india'],
  hi: ['hi-in', 'hindi', 'kalpana', 'hemant', 'madhur', 'swara', 'devnagari', 'hi_in'],
  bn: ['bn-in', 'bn-bd', 'bengali', 'bangla', 'tapan', 'bashkar', 'bn_in'],
  mr: ['mr-in', 'marathi', 'aarohi', 'manohar', 'mr_in'],
  ta: ['ta-in', 'ta-lk', 'tamil', 'valluvar', 'iniya', 'ta_in'],
  te: ['te-in', 'telugu', 'chitra', 'mohan', 'te_in'],
  gu: ['gu-in', 'gujarati', 'dhwani', 'niranjan', 'gu_in'],
  kn: ['kn-in', 'kannada', 'sapna', 'gagan', 'kn_in'],
  ml: ['ml-in', 'malayalam', 'midhun', 'sobhana', 'ml_in'],
  pa: ['pa-in', 'punjabi', 'gurmukhi', 'raavi', 'pa_in'],
  or: ['or-in', 'odia', 'oriya', 'or_in'],
};

class SpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();
  private currentLanguage: SupportedLanguage = 'en';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          // voices reloaded into browser cache
        };
      }
    }
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public subscribe(listener: (isSpeaking: boolean) => void) {
    this.listeners.add(listener);
    listener(this.isSpeakingState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isSpeakingState));
  }

  public isAvailable(): boolean {
    return Boolean(this.synth);
  }

  /**
   * Find best matching voice for any of the 11 supported languages
   */
  public findBestVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    const targetLocale = (langConfig?.speechLocale || 'en-IN').toLowerCase();
    const langCode = lang.toLowerCase();
    const keywords = REGIONAL_VOICE_KEYWORDS[lang] || [langCode];

    // 1. Exact locale match (e.g. "te-IN" === "te-IN")
    const exactVoice = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === targetLocale);
    if (exactVoice) return exactVoice;

    // 2. Language code prefix match on voice.lang (e.g. "te", "bn", "mr", "ta")
    const prefixVoice = voices.find((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === langCode || vLang.startsWith(`${langCode}-`);
    });
    if (prefixVoice) return prefixVoice;

    // 3. Name or identifier keyword match (e.g. name contains "Telugu", "Tamil", "Bengali", "Marathi", etc.)
    const keywordVoice = voices.find((v) => {
      const vName = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase();
      return keywords.some((kw) => vName.includes(kw) || vLang.includes(kw));
    });
    if (keywordVoice) return keywordVoice;

    // 4. If target is Hindi or an Indic language without specific voice installed in the browser:
    // Try Hindi voice as close Indic phonology fallback before generic English
    if (lang !== 'hi' && lang !== 'en') {
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi')
      );
      if (hindiVoice) return hindiVoice;
    }

    // 5. Indian English voice (clear Indian cadence and pronunciation)
    const indianEnglishVoice = voices.find((v) => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      return vLang.includes('en-in') || vName.includes('india') || vName.includes('indian');
    });
    if (indianEnglishVoice) return indianEnglishVoice;

    // 6. Any English voice
    const englishVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (englishVoice) return englishVoice;

    // 7. Default first voice
    return voices[0] || null;
  }

  public speak(
    text: string,
    rate: number = 0.85,
    specificLang?: SupportedLanguage
  ): void {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.stop();

    if (!text || text.trim() === '') return;

    const langToUse = specificLang || this.currentLanguage;
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === langToUse);
    const targetLocale = langConfig ? langConfig.speechLocale : 'en-IN';

    // Clean text of markdown, bracket symbols, emojis, and extra spacing
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate; // Gentle pacing for senior comprehension
    utterance.pitch = 1.0;
    utterance.lang = targetLocale;

    const voice = this.findBestVoice(langToUse);
    if (voice) {
      utterance.voice = voice;
      // If using fallback voice, set appropriate lang to prevent browser silence
      if (!voice.lang.toLowerCase().startsWith(langToUse)) {
        utterance.lang = voice.lang;
      }
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis note:', e);
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Unable to trigger speech playback:', err);
      this.isSpeakingState = false;
      this.notify();
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('Cancel speech error:', err);
      }
      this.isSpeakingState = false;
      this.currentUtterance = null;
      this.notify();
    }
  }
}

export const speechManager = new SpeechManager();
