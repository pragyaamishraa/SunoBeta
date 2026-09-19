import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';
import { Shield, PhoneCall, VolumeX, Sliders, Globe, ChevronDown, Check, Mic } from 'lucide-react';
import { speechManager } from '../utils/speech';
import { AccessibilityModal } from './AccessibilityModal';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  onOpenFamilyModal: () => void;
  onOpenSpeakToAi?: () => void;
  activeSection: string;
  onScrollToChapter: (chapterId: string) => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  preferences,
  onUpdatePreferences,
  onOpenFamilyModal,
  onOpenSpeakToAi,
  activeSection,
  onScrollToChapter,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    return speechManager.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chapters = [
    { id: 'chapter-hero', label: 'Home' },
    { id: 'chapter-attention', label: 'Priorities' },
    { id: 'chapter-understand', label: 'Safety Check' },
    { id: 'chapter-visual-guide', label: 'Task Guides' },
    { id: 'chapter-trust', label: 'Trust & Privacy' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-200/90 bg-[#F8F8F5]/95 backdrop-blur-md transition-colors">
        {/* Progress bar */}
        <div
          className="h-0.5 bg-indigo-600 transition-all duration-150 absolute bottom-0 left-0"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
              <button
                onClick={() => onScrollToChapter('chapter-hero')}
                className="flex items-center space-x-2.5 sm:space-x-3 text-left focus:outline-hidden focus:ring-2 focus:ring-indigo-700 rounded-xl p-1 transition-opacity hover:opacity-90"
                aria-label="Suno, Beta Home"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span id="app-header-title" className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 whitespace-nowrap">
                    Suno, Beta
                  </span>
                  <span className="hidden 2xl:inline-block text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                    Digital Companion
                  </span>
                </div>
              </button>

              {/* Quiet Chapter Progress Bar for Wide Desktops */}
              <nav className="hidden 2xl:flex items-center space-x-1" aria-label="Chapter Navigation">
                {chapters.map((ch) => {
                  const isActive = activeSection === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => onScrollToChapter(ch.id)}
                      className={`h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-stone-200/90 text-stone-950 font-bold'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100'
                      }`}
                    >
                      {ch.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Utility Controls - Perfectly aligned uniform heights and single-line labels */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              {/* Voice Playing Indicator / Stop Button */}
              {isSpeaking && (
                <button
                  onClick={() => speechManager.stop()}
                  className="h-9 sm:h-10 px-2.5 sm:px-3 bg-rose-50 text-rose-900 border border-rose-300 rounded-xl hover:bg-rose-100 font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 flex items-center space-x-1.5 transition-all animate-pulse"
                  title="Stop reading aloud"
                  aria-label="Stop reading aloud"
                >
                  <VolumeX className="w-4 h-4 text-rose-700 shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">Stop Voice</span>
                </button>
              )}

              {/* Comprehensive 11-Language Dropdown Selector */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="h-9 sm:h-10 inline-flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-xl px-2.5 sm:px-3 border border-stone-300 text-xs sm:text-sm text-stone-950 font-bold whitespace-nowrap shrink-0 transition-all shadow-2xs"
                  aria-label="Select website language"
                  aria-expanded={isLangDropdownOpen}
                >
                  <Globe className="w-4 h-4 text-indigo-700 shrink-0" />
                  <span className="whitespace-nowrap">{currentLangObj.native}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border border-stone-300 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 mb-1">
                      Choose Your Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onSelectLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-950 font-bold'
                              : 'text-stone-800 hover:bg-stone-100'
                          }`}
                        >
                          <div className="flex items-baseline space-x-2">
                            <span className="text-sm font-bold text-stone-950">{lang.native}</span>
                            <span className="text-xs text-stone-500">({lang.name})</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Talk to Beta AI Voice Assistant Button in Pista Green */}
              {onOpenSpeakToAi && (
                <button
                  id="header-talk-to-beta-btn"
                  onClick={onOpenSpeakToAi}
                  className="h-9 sm:h-10 flex items-center space-x-1.5 px-3 sm:px-3.5 bg-[#93C572] hover:bg-[#85B864] active:bg-[#77AB56] text-emerald-950 border border-[#7CB05B]/60 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-800"
                  aria-label="Talk to Beta voice assistant"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
                  <span className="whitespace-nowrap">Talk to Beta</span>
                </button>
              )}

              {/* Accessibility Modal Trigger */}
              <button
                onClick={() => setIsAccessModalOpen(true)}
                className="h-9 sm:h-10 flex items-center space-x-1.5 px-2.5 sm:px-3 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all shadow-2xs"
                aria-label="Display and accessibility settings"
              >
                <Sliders className="w-4 h-4 text-stone-800 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Comfort</span>
                {preferences.textSize !== 'standard' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-700 shrink-0" />
                )}
              </button>

              {/* Family Quick Connect */}
              <button
                onClick={onOpenFamilyModal}
                className="h-9 sm:h-10 flex items-center space-x-1.5 px-3 sm:px-3.5 bg-stone-950 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap shrink-0 transition-all shadow-xs"
                aria-label="Family and Emergency Contacts"
              >
                <PhoneCall className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                <span className="whitespace-nowrap">Family Care</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Accessibility Preferences Modal */}
      <AccessibilityModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={onUpdatePreferences}
      />
    </>
  );
};
