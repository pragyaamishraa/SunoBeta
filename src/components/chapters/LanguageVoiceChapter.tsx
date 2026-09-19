import React, { useState } from 'react';
import { Globe, Volume2, User, Bot } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { TranslationDictionary, SupportedLanguage, SUPPORTED_LANGUAGES } from '../../data/translations';

interface LanguageVoiceChapterProps {
  t: TranslationDictionary;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageVoiceChapter: React.FC<LanguageVoiceChapterProps> = ({
  t,
  language,
  onSelectLanguage,
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleSimulateConversation = () => {
    setIsPlayingVoice(true);
    speechManager.speak(t.sunoSpeechText, 0.85, language);
    setTimeout(() => setIsPlayingVoice(false), 5000);
  };

  return (
    <section id="chapter-voice" className="py-20 sm:py-28 bg-[#F8F8F5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-3">
            <Globe className="w-3.5 h-3.5 text-indigo-700" />
            <span>{t.voiceChapterBadge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
            {t.voiceHeading}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
            {t.voiceDesc}
          </p>
        </div>

        {/* 11 Indian Regional Languages Clickable Interactive Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-sm mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-4">
            {t.supportedLanguagesLabel}
          </span>
          <div className="flex flex-wrap gap-2.5 items-center">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    speechManager.speak(
                      lang.code === 'en'
                        ? 'Language switched to English.'
                        : `भाषा बदलकर ${lang.native} कर दी गई है।`,
                      0.85,
                      lang.code
                    );
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-stone-950 text-white border-stone-950 shadow-sm ring-2 ring-indigo-600/30'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 hover:border-stone-400'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Switch language to ${lang.name}`}
                >
                  <span className="text-sm">{lang.native}</span>
                  <span className={`text-xs ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    ({lang.name})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Interaction & Waveform Simulator */}
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-stone-300 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {t.spokenDialogueBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight mt-2">
                {t.speakToGrandsonTitle}
              </h3>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4 pt-4">
              {/* User Voice Bubble for Mradula Mishra */}
              <div className="flex items-start space-x-3.5 justify-end">
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border border-stone-300 text-right max-w-lg">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    {t.userSpeakerLabel}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-stone-950">
                    {t.userSpeechText}
                  </p>
                  <p className="text-xs font-semibold text-stone-600 mt-1 italic">
                    {t.userSpeechSubtext}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center font-bold shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Suno Voice Waveform Visualization */}
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center space-x-1.5 h-8">
                  <span className="w-1.5 h-3 bg-indigo-400 rounded-full animate-pulse" />
                  <span className="w-1.5 h-6 bg-indigo-600 rounded-full animate-pulse" />
                  <span className="w-1.5 h-8 bg-indigo-700 rounded-full animate-pulse" />
                  <span className="w-1.5 h-5 bg-indigo-600 rounded-full animate-pulse" />
                  <span className="w-1.5 h-7 bg-indigo-800 rounded-full animate-pulse" />
                  <span className="w-1.5 h-4 bg-indigo-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Suno Companion Voice Bubble */}
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold shrink-0 mt-1 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-300 max-w-lg">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                    {t.sunoSpeakerLabel}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-stone-950">
                    {t.sunoSpeechText}
                  </p>
                  <p className="text-xs font-semibold text-stone-700 mt-1 italic">
                    {t.sunoSpeechSubtext}
                  </p>

                  <div className="mt-3 pt-3 border-t border-indigo-200 flex items-center justify-between">
                    <button
                      onClick={handleSimulateConversation}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingVoice ? 'Speaking voice...' : t.listenVoiceBtn}</span>
                    </button>
                    <span className="text-xs font-semibold text-stone-600">
                      {t.pacedForSeniorsTag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
