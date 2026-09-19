import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Volume2, RefreshCw } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { TranslationDictionary, SupportedLanguage } from '../../data/translations';

interface UnderstandChapterProps {
  t: TranslationDictionary;
  language: SupportedLanguage;
}

export const UnderstandChapter: React.FC<UnderstandChapterProps> = ({ t, language }) => {
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState<{
    plainMeaning: string;
    steps: string[];
    spokenScript: string;
  } | null>(null);

  // Dynamic values defaulting to translated dictionary
  const currentPlainMeaning = analysisOutput?.plainMeaning || t.plainMeaningText;
  const currentSteps = analysisOutput?.steps || [t.step1, t.step2, t.step3];
  const currentSpoken = analysisOutput?.spokenScript || `${currentPlainMeaning} ${currentSteps.join('. ')}`;

  const handleRunLiveAnalysis = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-screen-or-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: text,
          contextType: 'document',
        }),
      });
      const data = await res.json();
      if (data.data) {
        setAnalysisOutput({
          plainMeaning: data.data.plainEnglishMeaning,
          steps: data.data.actionSteps,
          spokenScript: data.data.spokenScript,
        });
        speechManager.speak(data.data.spokenScript, 0.85, language);
      }
    } catch {
      // Keep existing
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReadAloud = () => {
    speechManager.speak(currentSpoken, 0.85, language);
  };

  return (
    <section id="chapter-understand" className="py-20 sm:py-28 bg-[#F8F8F5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
            <span>{t.understandChapterBadge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
            {t.understandHeading}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
            {t.understandDesc}
          </p>
        </div>

        {/* Side-by-Side Comparison Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: The Confusing Original Document / Screenshot */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-stone-300 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  {t.originalNoticeBadge}
                </span>
                <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  {t.legaleseTag}
                </span>
              </div>

              {/* Document Simulator */}
              <div className="mt-5 p-5 rounded-2xl bg-stone-100/90 border border-stone-300 text-stone-900 font-mono text-xs sm:text-sm leading-relaxed space-y-3">
                <div className="text-stone-500 text-xs font-bold uppercase">
                  {t.noticeRef}
                </div>
                <p className="text-stone-950 font-medium">
                  "{t.noticeOriginalSample}"
                </p>
              </div>

              {/* Interactive Try-it Input */}
              <div className="mt-5 pt-4 border-t border-stone-200">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  {t.testAnotherLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Type or paste any notice here..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-950 bg-white placeholder:text-stone-500 focus:ring-2 focus:ring-indigo-700"
                  />
                  <button
                    onClick={() => handleRunLiveAnalysis(customInput || t.noticeOriginalSample)}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : t.decodeBtn}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-600">
              <span>Sample: Bank Clearing Notice</span>
              <span className="text-indigo-800 font-bold">Encrypted & Private</span>
            </div>
          </div>

          {/* TRANSITION ARROW (Centered Indicator) */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-900 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>

          {/* RIGHT: Suno Beta's Simplified Interpretation & Action Steps */}
          <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/90 via-white to-stone-50 rounded-3xl p-7 sm:p-9 border border-indigo-300 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-indigo-200/80">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                    {t.sunoInterpTitle}
                  </span>
                </div>
                <button
                  onClick={handleReadAloud}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-stone-300 text-stone-950 font-bold text-xs hover:bg-stone-50 shadow-2xs"
                  aria-label="Read interpretation aloud in current language"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-700" />
                  <span>{t.readAloudBtn}</span>
                </button>
              </div>

              {/* Plain Meaning */}
              <div className="mt-5 p-5 rounded-2xl bg-white border border-indigo-200 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                  {t.plainMeaningLabel}
                </span>
                <p className="text-xl sm:text-2xl font-bold text-stone-950 leading-snug">
                  "{currentPlainMeaning}"
                </p>
              </div>

              {/* Numbered Steps */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  {t.actionStepsHeading}
                </h4>
                <div className="space-y-2.5">
                  {currentSteps.map((st, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-stone-200/90 flex items-start space-x-3 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
                        {st}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center space-x-1 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.noJargonTag}</span>
              </span>
              <span>{t.checkedTimeTag}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
