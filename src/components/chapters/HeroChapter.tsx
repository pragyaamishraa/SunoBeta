import React from 'react';
import { Volume2, ArrowDown, Shield } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { TranslationDictionary, SupportedLanguage } from '../../data/translations';

interface HeroChapterProps {
  onScrollToChapter: (chapterId: string) => void;
  t: TranslationDictionary;
  language: SupportedLanguage;
}

export const HeroChapter: React.FC<HeroChapterProps> = ({ onScrollToChapter, t, language }) => {
  const handleVoiceWelcome = () => {
    speechManager.speak(t.voiceGreetingText, 0.85, language);
  };

  return (
    <section id="chapter-hero" className="relative min-h-[85vh] flex flex-col justify-center pt-8 pb-16 overflow-hidden">
      {/* Subtle Indigo/Lavender Radial Gradient in Background */}
      <div className="absolute inset-0 pointer-events-none glow-subtle" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center flex flex-col items-center">
        {/* Brand Tagline */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 mb-8 shadow-2xs">
          <Shield className="w-4 h-4 text-indigo-800 shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase text-indigo-900">
            {t.tagline}
          </span>
        </div>

        {/* High-Contrast Personalized Greeting for Mradula Mishra */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-950 leading-[1.15] max-w-3xl">
          {t.greeting}
        </h1>

        {/* High-Contrast Subhead */}
        <p className="mt-6 text-xl sm:text-2xl text-stone-700 font-medium max-w-2xl leading-relaxed">
          {t.greetingSubtitle}
        </p>

        {/* Primary Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onScrollToChapter('chapter-attention')}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-base shadow-sm transition-all hover:translate-y-0.5"
          >
            <span>{t.prioritiesBtn}</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={handleVoiceWelcome}
            className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-bold text-base transition-all shadow-2xs"
            aria-label="Listen to voice greeting in current language"
          >
            <Volume2 className="w-5 h-5 text-indigo-700" />
            <span>{t.voiceGreetingBtn}</span>
          </button>
        </div>

        {/* Quiet scroll-down indicator */}
        <div className="mt-16 sm:mt-20 animate-bounce">
          <button
            onClick={() => onScrollToChapter('chapter-attention')}
            className="text-stone-500 hover:text-stone-900 flex flex-col items-center text-xs font-semibold uppercase tracking-wider"
            aria-label="Scroll to next section"
          >
            <span className="mb-1">{t.scrollExplore}</span>
            <ArrowDown className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
