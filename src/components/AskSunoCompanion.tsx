import React, { useState } from 'react';
import { MessageSquare, Mic, MicOff, Volume2, Sparkles, Send, ArrowRight, ShieldCheck, HeartHandshake, RefreshCw, Globe } from 'lucide-react';
import { AskSunoResponse } from '../types';
import { speechManager } from '../utils/speech';
import { speechRecognitionManager } from '../utils/recognition';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/translations';

interface AskSunoProps {
  initialQuestion?: string;
  currentLanguage?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const AskSunoCompanion: React.FC<AskSunoProps> = ({
  initialQuestion,
  currentLanguage = 'en',
  onLanguageChange,
}) => {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskSunoResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(currentLanguage);

  const popularQuestions: Record<SupportedLanguage, string[]> = {
    en: [
      'My phone screen is suddenly too dim to read',
      'Someone called asking for my 6-digit bank OTP, what should I do?',
      'How do I send photos of my garden to my daughter on WhatsApp?',
      'Why does my phone say "Storage almost full"? Did I break it?',
      'What does "System Update" mean? Will it delete my pictures?',
    ],
    hi: [
      'मेरी फोन स्क्रीन अचानक बहुत धीमी/धुंधली हो गई है',
      'किसी ने कॉल करके 6 अंकों का बैंक ओटीपी मांगा, क्या करूं?',
      'व्हाट्सएप पर बेटी को बगीचे की तस्वीरें कैसे भेजूं?',
      'फोन में "स्टोरेज फुल" क्यों आ रहा है? क्या फोन खराब हो गया?',
      '"सिस्टम अपडेट" क्या होता है? क्या फोटो डिलीट हो जाएंगी?',
    ],
    bn: [
      'ফোনের পর্দা হঠাৎ অন্ধকার হয়ে গেছে কেন?',
      'ব্যাঙ্কের ওটিপি চেয়ে ফোন এসেছে, কী করব?',
      'হোয়াটসঅ্যাপে ছবি কীভাবে পাঠাব?',
    ],
    mr: [
      'माझ्या फोनचा प्रकाश अचानक मंद झाला आहे',
      'बँक ओटीपी विचारण्यासाठी फोन आला आहे, काय करू?',
      'व्हॉट्सॲपवर फोटो कसा पाठवू?',
    ],
    ta: [
      'தொலைபேசி திரை திடீரென மங்கலாகிவிட்டது',
      'வங்கி OTP கேட்டு போன் வந்தது, என்ன செய்வது?',
      'வாட்ஸ்அப்பில் படம் அனுப்புவது எப்படி?',
    ],
    te: [
      'ఫోన్ స్క్రీన్ అకస్మాత్తుగా డిమ్ అయిపోయింది',
      'బ్యాంక్ ఓటీపీ అడుగుతూ ఫోన్ వచ్చింది, ఏం చేయాలి?',
      'వాట్సాప్‌లో ఫోటో ఎలా పంపాలి?',
    ],
    gu: [
      'મારા ફોનની સ્ક્રીન અચાનક ઝાંખી થઈ ગઈ છે',
      'બેંક OTP માંગતો ફોન આવ્યો છે, શું કરવું?',
    ],
    kn: [
      'ನನ್ನ ಫೋನ್ ಪರದೆ ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಮಂದವಾಗಿದೆ',
      'ಬ್ಯಾಂಕ್ ಓಟಿಪಿ ಕೇಳಿ ಕರೆ ಬಂದಿದೆ, ಏನು ಮಾಡಬೇಕು?',
    ],
    ml: [
      'ഫോൺ സ്‌ക്രീൻ പെട്ടെന്ന് ഇരുണ്ടതായി',
      'ബാങ്ക് ഒടിപി ചോദിച്ച് കോൾ വന്നു, എന്തുചെയ്യണം?',
    ],
    pa: [
      'ਫੋਨ ਦੀ ਸਕਰੀਨ ਅਚਾਨਕ ਬਹੁਤ ਮੱਧਮ ਹੋ ਗਈ ਹੈ',
      'ਬੈਂਕ ਦਾ ਓਟੀਪੀ ਮੰਗਣ ਲਈ ਫੋਨ ਆਇਆ, ਕੀ ਕਰਾਂ?',
    ],
    or: [
      'ମୋ ଫୋନ୍ ସ୍କ୍ରିନ୍ ହଠାତ୍ ଅନ୍ଧାର ହୋଇଗଲା',
      'ବ୍ୟାଙ୍କ ଓଟିପି ମାଗି ଫୋନ୍ ଆସିଛି, କଣ କରିବି?',
    ],
  };

  const currentQuestions = popularQuestions[selectedLang] || popularQuestions.en;

  const handleToggleMic = () => {
    if (isListening) {
      speechRecognitionManager.stop();
      setIsListening(false);
      return;
    }

    speechManager.stop();
    setErrorMsg(null);

    const started = speechRecognitionManager.start({
      language: selectedLang,
      continuous: false,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setQuestion(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSubmitQuestion(transcript);
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
      setErrorMsg('Microphone is not supported in this browser. Please type your question.');
    }
  };

  const handleSubmitQuestion = async (qText?: string) => {
    const textToSubmit = qText || question;
    if (!textToSubmit.trim()) {
      setErrorMsg('Please ask or type your question for Suno Beta.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ask-suno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSubmit,
          language: selectedLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer.');
      }

      setResponse(data.data);

      if (data.data?.spokenSummary) {
        speechManager.speak(data.data.spokenSummary, 0.85, selectedLang);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to Suno right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang);
    speechManager.setLanguage(lang);
    onLanguageChange?.(lang);
  };

  return (
    <section id="ask-suno" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-medium mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
          <span>Patient Everyday Guidance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Ask Suno in Everyday Words
        </h2>
        <p className="mt-2 text-base text-stone-600">
          No question is silly or too basic. Speak or type your thoughts and Suno will explain step-by-step.
        </p>
      </div>

      {/* Main Elevated Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-sm relative">
        {/* Language Selector Tabs */}
        <div className="mb-6 p-3 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-700 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-rose-600" />
              <span>Response & Voice Language:</span>
            </span>
            <span className="text-xs font-semibold text-rose-950 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.native}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang.code === selectedLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLangChange(lang.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition-colors border ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {lang.native}
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Question Chips */}
        <div className="mb-6">
          <span className="text-xs font-medium text-stone-500 block mb-2.5">
            Common questions elders ask:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(q);
                  handleSubmitQuestion(q);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100/80 hover:bg-stone-200/70 text-stone-700 text-xs font-medium text-left transition-all"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* Input Field with Integrated Mic */}
        <div className="relative">
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type or speak what you are trying to do, or what is confusing you on your phone..."
            className="w-full p-4 sm:p-5 pr-14 rounded-2xl border border-stone-200 text-stone-900 text-base sm:text-lg placeholder:text-stone-400 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all bg-stone-50/50 resize-y leading-relaxed"
            aria-label="Question for Suno"
          />

          <button
            onClick={handleToggleMic}
            className={`absolute right-3.5 top-3.5 p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak your question'}
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 text-rose-700 text-sm font-medium border border-rose-200/80">
            {errorMsg}
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleToggleMic}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <Mic className="w-4 h-4 text-emerald-700" />
            <span>{isListening ? 'Listening now...' : '🎙 Talk to Beta'}</span>
          </button>

          <button
            onClick={() => handleSubmitQuestion()}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#93C572] hover:bg-[#85B864] text-emerald-950 font-bold text-base shadow-sm border border-[#7CB05B]/60 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Thinking with patience...</span>
              </>
            ) : (
              <>
                <span>Ask question</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Response Box */}
        {response && (
          <div className="mt-8 pt-8 border-t border-stone-100 animate-fade-in space-y-6">
            {/* Greeting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                <span className="font-semibold text-stone-900 text-lg sm:text-xl">
                  {response.greeting}
                </span>
              </div>
              <button
                onClick={() => speechManager.speak(response.spokenSummary || response.simpleExplanation, 0.85, selectedLang)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                aria-label="Read answer aloud"
              >
                <Volume2 className="w-4 h-4 text-rose-600" />
                <span>Listen in {SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.native}</span>
              </button>
            </div>

            {/* Simple Explanation */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
              <p className="text-base sm:text-lg text-stone-800 leading-relaxed">
                {response.simpleExplanation}
              </p>
            </div>

            {/* Numbered Steps */}
            {response.steps && response.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Easy steps to follow:
                </h4>
                <div className="space-y-2.5">
                  {response.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className="p-4 rounded-2xl bg-white border border-stone-200/70 space-y-1.5"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-semibold text-xs flex items-center justify-center border border-rose-200">
                          {st.stepNumber}
                        </span>
                        <h5 className="font-semibold text-stone-900 text-base">
                          {st.title}
                        </h5>
                      </div>
                      <p className="text-sm sm:text-base text-stone-700 pl-8 leading-relaxed">
                        {st.instruction}
                      </p>
                      {st.tip && (
                        <p className="text-xs text-stone-500 pl-8 italic">
                          💡 Note: {st.tip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Reminder */}
            {response.safetyReminder && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Elder Safety Reminder: </span>
                  <span>{response.safetyReminder}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
