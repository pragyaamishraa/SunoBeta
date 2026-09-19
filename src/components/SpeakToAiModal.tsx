import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Globe,
  Radio,
  HelpCircle,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations';
import { speechManager } from '../utils/speech';
import { speechRecognitionManager } from '../utils/recognition';
import { AskSunoResponse } from '../types';

interface SpeakToAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const SpeakToAiModal: React.FC<SpeakToAiModalProps> = ({
  isOpen,
  onClose,
  initialLanguage = 'en',
  onLanguageChange,
}) => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(initialLanguage);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [response, setResponse] = useState<AskSunoResponse | null>(null);
  const [isSpeakingResult, setIsSpeakingResult] = useState(false);
  const [executedTaskNotice, setExecutedTaskNotice] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync with prop changes
  useEffect(() => {
    if (initialLanguage) {
      setCurrentLang(initialLanguage);
    }
  }, [initialLanguage]);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsub = speechManager.subscribe((speaking) => {
      setIsSpeakingResult(speaking);
    });
    return () => unsub();
  }, []);

  // Stop listening or speaking when modal closes
  useEffect(() => {
    if (!isOpen) {
      speechRecognitionManager.stop();
      speechManager.stop();
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Language-specific voice prompt samples for seniors
  const sampleVoiceTasks: Record<SupportedLanguage, Array<{ label: string; prompt: string }>> = {
    en: [
      { label: 'Check electricity bill', prompt: 'Check my electricity bill and explain if it is safe to pay' },
      { label: 'Verify bank SMS', prompt: 'Someone sent an SMS asking for my bank OTP. Is this a scam?' },
      { label: 'Send WhatsApp photo', prompt: 'How do I send photos of my garden to my daughter Pragya on WhatsApp?' },
      { label: 'Call family contact', prompt: 'Call my daughter Pragya Mishra or husband Santosh Mishra' },
    ],
    hi: [
      { label: 'बिजली बिल की जांच करें', prompt: 'मेरा बिजली बिल चेक करो और बताओ क्या इसे भरना सुरक्षित है?' },
      { label: 'बैंक संदेश की जांच', prompt: 'मुझे बैंक से ओटीपी मांगने का मैसेज आया है, क्या यह धोखा है?' },
      { label: 'व्हाट्सएप फोटो भेजें', prompt: 'व्हाट्सएप पर बेटी प्रज्ञा को बगीचे की फोटो कैसे भेजूं?' },
      { label: 'परिवार से संपर्क', prompt: 'मेरी बेटी प्रज्ञा मिश्रा या पति संतोष मिश्रा से बात कराओ' },
    ],
    bn: [
      { label: 'বিদ্যুৎ বিল পরীক্ষা', prompt: 'আমার বিদ্যুৎ বিল পরীক্ষা করে বলো এটা দেওয়া নিরাপদ কিনা' },
      { label: 'ব্যাঙ্ক ওটিপি যাচাই', prompt: 'ব্যাঙ্কের ওটিপি চেয়ে মেসেজ এসেছে, এটা কি জালিয়াতি?' },
      { label: 'ছবি পাঠানো', prompt: 'হোয়াটসঅ্যাপে আমার মেয়ের কাছে ছবি কীভাবে পাঠাব?' },
    ],
    mr: [
      { label: 'वीज बिल तपासा', prompt: 'माझे वीज बिल तपासा आणि पैसे भरणे सुरक्षित आहे का सांगा' },
      { label: 'बँक मेसेज तपासा', prompt: 'मला बँकेकडून ओटीपी मागण्यासाठी मेसेज आला आहे, ही फसवणूक आहे का?' },
      { label: 'व्हॉट्सॲप फोटो', prompt: 'व्हॉट्सॲपवर मुलीला फोटो कसा पाठवायचा?' },
    ],
    ta: [
      { label: 'மின் கட்டணம் சரிபார்', prompt: 'எனது மின்சார கட்டணத்தை சரிபார்த்து விளக்கம் கூறவும்' },
      { label: 'வங்கி OTP சரிபார்', prompt: 'எனக்கு வங்கி OTP கேட்கும் செய்தி வந்துள்ளது, இது மோசடியா?' },
      { label: 'வாட்ஸ்அப் புகைப்படம்', prompt: 'வாட்ஸ்அப்பில் மகளுக்கு புகைப்படம் அனுப்புவது எப்படி?' },
    ],
    te: [
      { label: 'కరెంట్ బిల్లు చూడండి', prompt: 'నా విద్యుత్ బిల్లును తనిఖీ చేసి అది సురక్షితమో కాదో చెప్పండి' },
      { label: 'బ్యాంక్ మెసేజ్ తనిఖీ', prompt: 'నాకు ఓటీపీ అడుగుతూ మెసేజ్ వచ్చింది, ఇది మోసమా?' },
      { label: 'ఫోటో పంపడం', prompt: 'వాట్సాప్‌లో నా కుమార్తెకు ఫోటో ఎలా పంపాలి?' },
    ],
    gu: [
      { label: 'લાઈટ બિલ ચકાસો', prompt: 'મારું વીજળી બિલ તપાસો અને જણાવો કે ચૂકવવું સુરક્ષિત છે કે નહીં' },
      { label: 'બેંક OTP મેસેજ', prompt: 'બેંકમાંથી OTP માંગતો સંદેશ મળ્યો છે, શું આ છેતરપિંડી છે?' },
    ],
    kn: [
      { label: 'ವಿದ್ಯುತ್ ಬಿಲ್ ಪರಿಶೀಲಿಸಿ', prompt: 'ನನ್ನ ವಿದ್ಯುತ್ ಬಿಲ್ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸುರಕ್ಷಿತವೇ ಎಂದು ತಿಳಿಸಿ' },
      { label: 'ಬ್ಯಾಂಕ್ ಸಂದೇಶ ಪರಿಶೀಲನೆ', prompt: 'ನನಗೆ ಬ್ಯಾಂಕ್ ಓಟಿಪಿ ಕೇಳುವ ಸಂದೇಶ ಬಂದಿದೆ, ಇದು ವಂಚನೆಯೇ?' },
    ],
    ml: [
      { label: 'വൈദ്യുതി ബിൽ പരിശോധിക്കുക', prompt: 'എന്റെ വൈദ്യുതി ബിൽ പരിശോധിച്ച് നൽകാൻ സുരക്ഷിതമാണോ എന്ന് പറയുക' },
      { label: 'ബാങ്ക് സന്ദേശം', prompt: 'ബാങ്ക് ഒടിപി ചോദിച്ച് ഒരു മെസ്സേജ് വന്നിട്ടുണ്ട്, ഇത് തട്ടിപ്പാണോ?' },
    ],
    pa: [
      { label: 'ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਚੈੱਕ ਕਰੋ', prompt: 'ਮੇਰਾ ਬਿਜਲੀ ਦਾ ਬਿੱਲ ਚੈੱਕ ਕਰੋ ਅਤੇ ਦੱਸੋ ਕੀ ਇਹ ਭਰਨਾ ਸੁਰੱਖਿਅਤ ਹੈ?' },
      { label: 'ਬੈਂਕ ਸੁਨੇਹਾ ਪੜਤਾਲ', prompt: 'ਮੈਨੂੰ ਬੈਂਕ ਦਾ ਓਟੀਪੀ ਮੰਗਣ ਵਾਲਾ ਸੁਨੇਹਾ ਆਇਆ ਹੈ, ਕੀ ਇਹ ਧੋਖਾ ਹੈ?' },
    ],
    or: [
      { label: 'ବିଜୁଳି ବିଲ୍ ଯାଞ୍ଚ କରନ୍ତୁ', prompt: 'ମୋ ବିଜୁଳି ବିଲ୍ ଯାଞ୍ଚ କରି କୁହନ୍ତୁ ଏହା ଦେବା ସୁରକ୍ଷିତ କି?' },
      { label: 'ବ୍ୟାଙ୍କ ଓଟିପି ମେସେଜ୍', prompt: 'ମୋତେ ବ୍ୟାଙ୍କ ଓଟିପି ମାଗୁଥିବା ମେସେଜ୍ ଆସିଛି, ଏହା ଠକାମି କି?' },
    ],
  };

  const currentSampleTasks = sampleVoiceTasks[currentLang] || sampleVoiceTasks.en;

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    speechManager.setLanguage(lang);
    onLanguageChange?.(lang);
    // Announce language change to senior
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (langObj) {
      speechManager.speak(
        lang === 'en'
          ? 'Voice language set to English. Talk to Beta whenever you are ready.'
          : `आवाज़ की भाषा ${langObj.native} पर सेट कर दी गई है। बोलकर पूछें।`,
        0.85,
        lang
      );
    }
  };

  const handleToggleVoiceRecording = () => {
    if (isListening) {
      speechRecognitionManager.stop();
      setIsListening(false);
      return;
    }

    speechManager.stop();
    setErrorMsg(null);
    setInterimText('');

    const started = speechRecognitionManager.start({
      language: currentLang,
      continuous: false,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setInterimText(transcript);
        if (isFinal) {
          setInputText(transcript);
          setIsListening(false);
          // Automatically submit once speech finishes for effortless senior UX
          executeAskSuno(transcript, currentLang);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMsg(err);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!started) {
      setErrorMsg('Microphone is not supported in this browser. Please type below or tap an example.');
    }
  };

  const executeAskSuno = async (questionText: string, langToUse: SupportedLanguage) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMsg(null);
    setExecutedTaskNotice(null);

    // Detect actionable senior intents (e.g. check bill, call family, emergency, scam check)
    const lower = trimmed.toLowerCase();
    if (lower.includes('call') || lower.includes('phone') || lower.includes('फोन') || lower.includes('कॉल') || lower.includes('प्रज्ञा') || lower.includes('सन्तोष') || lower.includes('সন্তোষ') || lower.includes('family')) {
      setExecutedTaskNotice('Task recognized: Connecting with Family Care — Daughter Pragya Mishra & Husband Santosh Mishra');
    } else if (lower.includes('bill') || lower.includes('बिजली') || lower.includes('बिल') || lower.includes('বিল')) {
      setExecutedTaskNotice('Task recognized: Reviewing Domestic Electricity Bill (Due in 2 days)');
    } else if (lower.includes('scam') || lower.includes('otp') || lower.includes('धोखा') || lower.includes('পাসওয়ার্ড')) {
      setExecutedTaskNotice('Task recognized: Security scam analysis & fraud prevention');
    }

    try {
      const res = await fetch('/api/ask-suno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          language: langToUse,
          topic: 'senior-voice-task',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to connect to Suno.');
      }

      setResponse(data.data);

      // Automatically speak the response in the chosen language at gentle senior pace
      const textToSpeak =
        data.data?.spokenSummary ||
        data.data?.greeting + '. ' + data.data?.simpleExplanation;

      if (textToSpeak) {
        speechManager.speak(textToSpeak, 0.85, langToUse);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not fetch response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (inputText.trim()) {
      executeAskSuno(inputText, currentLang);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-stone-300 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with High-Contrast Senior Typography */}
        <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#93C572] text-emerald-950 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Talk to Beta
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  Voice Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300">
                Ask anything in your mother tongue. Beta listens and answers aloud.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            aria-label="Close voice assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 11 Indian Languages Voice Bar */}
        <div className="p-3.5 bg-stone-100 border-b border-stone-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-rose-600" />
              <span>Speaking & Listening Language:</span>
            </span>
            <span className="text-xs font-bold text-rose-950 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {currentLangObj.native} ({currentLangObj.name})
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSel = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    isSel
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-200'
                  }`}
                  aria-pressed={isSel}
                >
                  <span>{lang.native}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6" ref={scrollRef}>
          {/* Big Senior-Friendly Microphone Button */}
          <div className="text-center py-4 bg-[#F8F8F5] rounded-3xl border border-stone-200/80 p-6">
            <div className="relative inline-block mb-3">
              {isListening && (
                <span className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping" />
              )}
              <button
                onClick={handleToggleVoiceRecording}
                disabled={isLoading}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-md relative z-10 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105'
                    : 'bg-[#93C572] hover:bg-[#85B864] text-emerald-950 hover:scale-105 ring-8 ring-[#93C572]/25 font-bold'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Tap to speak'}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-stone-950">
              {isListening
                ? 'Listening to you now... speak naturally'
                : 'Tap the green microphone to speak'}
            </p>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {isListening
                ? 'Speak in ' + currentLangObj.native + ' — Beta understands.'
                : 'No typing needed. Just speak like you talk to family.'}
            </p>

            {/* Live Audio Waveform Animation when recording */}
            {isListening && (
              <div className="flex items-center justify-center space-x-1.5 h-8 mt-3">
                <span className="w-1.5 h-3 bg-rose-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-8 bg-rose-600 rounded-full animate-pulse delay-150" />
                <span className="w-1.5 h-5 bg-rose-500 rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-7 bg-rose-600 rounded-full animate-pulse delay-200" />
                <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-pulse" />
              </div>
            )}

            {/* Real-time transcribed text preview */}
            {(interimText || inputText) && (
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-stone-300 text-left">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  You said:
                </span>
                <p className="text-base font-semibold text-stone-900 leading-relaxed">
                  "{interimText || inputText}"
                </p>
              </div>
            )}
          </div>

          {/* Quick Clickable Tasks in Selected Indian Language */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2.5">
              Or tap a sample request in {currentLangObj.native}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentSampleTasks.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(t.prompt);
                    executeAskSuno(t.prompt, currentLang);
                  }}
                  className="p-3 rounded-2xl bg-white hover:bg-rose-50/60 border border-stone-300 text-left transition-all hover:border-rose-300 group"
                >
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-rose-950">
                    {t.label}
                  </span>
                  <span className="text-xs text-stone-600 block mt-0.5 line-clamp-1">
                    "{t.prompt}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Notice if Any */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold flex items-start space-x-2">
              <span className="shrink-0 font-bold">⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Action Task Banner (if recognized) */}
          {executedTaskNotice && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{executedTaskNotice}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-rose-500 animate-spin mx-auto" />
              <p className="text-base font-bold text-stone-900">
                Suno Beta is thinking with patience...
              </p>
              <p className="text-xs text-stone-600">
                Translating and organizing steps in {currentLangObj.native}
              </p>
            </div>
          )}

          {/* Spoken AI Answer Box */}
          {response && !isLoading && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-300 shadow-sm space-y-5 animate-fade-in">
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 uppercase tracking-wider">
                    Suno Beta Response ({currentLangObj.native})
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-stone-950 mt-1">
                    {response.greeting}
                  </h4>
                </div>

                {/* Voice Replay Button */}
                <button
                  onClick={() => {
                    if (isSpeakingResult) {
                      speechManager.stop();
                    } else {
                      speechManager.speak(
                        response.spokenSummary ||
                          `${response.greeting}. ${response.simpleExplanation}`,
                        0.85,
                        currentLang
                      );
                    }
                  }}
                  className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0 ${
                    isSpeakingResult
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                  }`}
                  aria-label={isSpeakingResult ? 'Stop speaking' : 'Listen aloud'}
                >
                  {isSpeakingResult ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span className="hidden sm:inline">Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Listen Aloud</span>
                    </>
                  )}
                </button>
              </div>

              {/* Plain Meaning */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-base text-stone-900 font-medium leading-relaxed">
                  {response.simpleExplanation}
                </p>
              </div>

              {/* Numbered Steps */}
              {response.steps && response.steps.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Steps to take:
                  </span>
                  <div className="space-y-2.5">
                    {response.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                            {st.stepNumber}
                          </span>
                          <span className="font-bold text-stone-900 text-sm sm:text-base">
                            {st.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 pl-7 leading-relaxed font-medium">
                          {st.instruction}
                        </p>
                        {st.tip && (
                          <p className="text-[11px] text-stone-500 pl-7 italic">
                            💡 {st.tip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Reminder */}
              {response.safetyReminder && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Elder Safety Note: </span>
                    <span>{response.safetyReminder}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Typing Fallback Bar with Integrated Mic */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center space-x-2 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualSubmit();
              }}
              placeholder="Hi, How may I help you?"
              className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#93C572] font-medium placeholder:text-stone-400"
            />
            <button
              type="button"
              onClick={handleToggleVoiceRecording}
              disabled={isLoading}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                  : 'bg-[#EAF5E4] text-emerald-950 border border-[#93C572]/60 hover:bg-[#D6ECCB]'
              }`}
              title={isListening ? 'Stop listening' : 'Tap to speak your question'}
              aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            onClick={handleManualSubmit}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#93C572] hover:bg-[#85B864] text-emerald-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50 shrink-0 shadow-2xs border border-[#7CB05B]/60"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
