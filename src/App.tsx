import React, { useState, useEffect } from 'react';
import { UserPreferences, TextSize, ThemeMode } from './types';
import { Header } from './components/Header';
import { HeroChapter } from './components/chapters/HeroChapter';
import { AttentionChapter } from './components/chapters/AttentionChapter';
import { UnderstandChapter } from './components/chapters/UnderstandChapter';
import { VisualGuideChapter } from './components/chapters/VisualGuideChapter';
import { LanguageVoiceChapter } from './components/chapters/LanguageVoiceChapter';
import { IndependenceChapter } from './components/chapters/IndependenceChapter';
import { TrustChapter } from './components/chapters/TrustChapter';
import { ReturnToActionChapter } from './components/chapters/ReturnToActionChapter';
import { ScamDecoder } from './components/ScamDecoder';
import { InteractiveGuides } from './components/InteractiveGuides';
import { AskSunoCompanion } from './components/AskSunoCompanion';
import { JargonDictionary } from './components/JargonDictionary';
import { SafetyDrillSimulator } from './components/SafetyDrillSimulator';
import { FamilyCareConnect } from './components/FamilyCareConnect';
import { SpeakToAiModal } from './components/SpeakToAiModal';
import { Footer } from './components/Footer';
import { SupportedLanguage, TRANSLATIONS } from './data/translations';
import { speechManager } from './utils/speech';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('suno_user_preferences');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return {
      textSize: 'standard',
      themeMode: 'warm',
      autoReadAloud: false,
      speechSpeed: 0.85,
    };
  });

  // Selected language state - across 11 Indian languages + English
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('suno_current_language');
      if (savedLang && savedLang in TRANSLATIONS) {
        return savedLang as SupportedLanguage;
      }
    }
    return 'en';
  });

  const [activeChapter, setActiveChapter] = useState<string>('chapter-hero');
  const [activeModalFeature, setActiveModalFeature] = useState<string | null>(null);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [askSunoContext, setAskSunoContext] = useState<string>('');

  // Synchronize language with speechManager and localStorage
  useEffect(() => {
    speechManager.setLanguage(currentLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('suno_current_language', currentLanguage);
    }
  }, [currentLanguage]);

  // Save preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suno_user_preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Track active chapter during scroll
  useEffect(() => {
    const handleScroll = () => {
      const chapterIds = [
        'chapter-hero',
        'chapter-attention',
        'chapter-understand',
        'chapter-visual-guide',
        'chapter-voice',
        'chapter-independence',
        'chapter-trust',
        'chapter-action',
      ];

      for (const id of chapterIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveChapter(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const handleScrollToChapter = (chapterId: string) => {
    setActiveChapter(chapterId);
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAskSunoWithContext = (context: string) => {
    setAskSunoContext(context);
    setActiveModalFeature('ask-suno');
  };

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    speechManager.setLanguage(lang);
  };

  // Get active translation dictionary
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Compute CSS sizing class based on font scale
  const getTextSizeClass = (size: TextSize) => {
    switch (size) {
      case 'large':
        return 'text-[1.08rem] leading-relaxed';
      case 'extra-large':
        return 'text-[1.2rem] leading-loose';
      case 'grandparent':
        return 'text-[1.32rem] leading-loose font-medium';
      default:
        return 'text-base leading-normal';
    }
  };

  // Compute theme wrapper class
  const getThemeClass = (mode: ThemeMode) => {
    switch (mode) {
      case 'high-contrast':
        return 'bg-white text-black contrast-125';
      case 'soft-evening':
        return 'bg-stone-900 text-stone-100 dark-theme';
      default:
        return 'bg-[#F8F8F5] text-stone-950';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-200 ${getThemeClass(
        preferences.themeMode
      )} ${getTextSizeClass(preferences.textSize)}`}
      style={{
        fontSize:
          preferences.textSize === 'grandparent'
            ? '1.25rem'
            : preferences.textSize === 'extra-large'
            ? '1.15rem'
            : preferences.textSize === 'large'
            ? '1.05rem'
            : '1rem',
      }}
    >
      {/* Sticky Minimal Header with 11 Indian Languages Dropdown */}
      <Header
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
        onOpenSpeakToAi={() => setActiveModalFeature('speak-to-ai')}
        activeSection={activeChapter}
        onScrollToChapter={handleScrollToChapter}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Main Scroll-Driven Storytelling Experience */}
      <main className="flex-1">
        {/* SECTION 1: INTRO / HERO FOR MRADULA MISHRA */}
        <HeroChapter
          onScrollToChapter={handleScrollToChapter}
          t={t}
          language={currentLanguage}
        />

        {/* SECTION 2: "WHAT NEEDS YOUR ATTENTION?" */}
        <AttentionChapter
          onUnderstandBill={() => handleScrollToChapter('chapter-understand')}
          t={t}
          language={currentLanguage}
        />

        {/* SECTION 3: "WHEN SOMETHING DOESN'T MAKE SENSE" */}
        <UnderstandChapter t={t} language={currentLanguage} />

        {/* SECTION 4: "SHOW ME WHERE" (SPATIAL / VISUAL GUIDANCE) */}
        <VisualGuideChapter t={t} language={currentLanguage} />

        {/* SECTION 5: 11-LANGUAGE + VOICE CHAPTER */}
        <LanguageVoiceChapter
          t={t}
          language={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
        />

        {/* SECTION 6: INDEPENDENCE (PRODUCT PHILOSOPHY) */}
        <IndependenceChapter t={t} />

        {/* SECTION 7: TRUST (DEEP INDIGO/CHARCOAL DARK CHAPTER) */}
        <TrustChapter t={t} />

        {/* SECTION 8: RETURN TO ACTION */}
        <ReturnToActionChapter
          onOpenUnderstand={() => setActiveModalFeature('scam-decoder')}
          onOpenSpeak={() => setActiveModalFeature('speak-to-ai')}
          t={t}
        />
      </main>

      {/* Interactive Tool Modal Tray (When senior clicks to use full feature) */}
      {activeModalFeature && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity overflow-y-auto"
          onClick={() => setActiveModalFeature(null)}
        >
          <div
            className="w-full max-w-4xl my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setActiveModalFeature(null)}
                className="px-4 py-2 rounded-xl bg-white text-stone-900 border border-stone-300 font-bold text-xs shadow-md hover:bg-stone-100"
              >
                ✕ Close Window
              </button>
            </div>

            {activeModalFeature === 'scam-decoder' && <ScamDecoder />}
            {activeModalFeature === 'guides' && (
              <InteractiveGuides onAskSunoWithContext={handleAskSunoWithContext} />
            )}
            {activeModalFeature === 'ask-suno' && (
              <AskSunoCompanion
                initialQuestion={askSunoContext}
                currentLanguage={currentLanguage}
                onLanguageChange={handleSelectLanguage}
              />
            )}
            {activeModalFeature === 'jargon' && <JargonDictionary />}
            {activeModalFeature === 'drill' && <SafetyDrillSimulator />}
          </div>
        </div>
      )}

      {/* Speak to AI Dedicated Multilingual Voice Assistant Modal */}
      <SpeakToAiModal
        isOpen={activeModalFeature === 'speak-to-ai'}
        onClose={() => setActiveModalFeature(null)}
        initialLanguage={currentLanguage}
        onLanguageChange={handleSelectLanguage}
      />

      {/* Family Helper SOS Modal */}
      {isFamilyModalOpen && (
        <FamilyCareConnect
          isOpenAsModal={true}
          onCloseModal={() => setIsFamilyModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectSection={(sec) => {
          setActiveModalFeature(sec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
      />
    </div>
  );
}
