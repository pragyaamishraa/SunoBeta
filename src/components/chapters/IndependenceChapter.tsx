import React from 'react';
import { Compass, CheckCircle2 } from 'lucide-react';
import { TranslationDictionary } from '../../data/translations';

interface IndependenceChapterProps {
  t: TranslationDictionary;
}

export const IndependenceChapter: React.FC<IndependenceChapterProps> = ({ t }) => {
  const pillars = [
    {
      word: t.pillar1Title,
      desc: t.pillar1Desc,
    },
    {
      word: t.pillar2Title,
      desc: t.pillar2Desc,
    },
    {
      word: t.pillar3Title,
      desc: t.pillar3Desc,
    },
    {
      word: t.pillar4Title,
      desc: t.pillar4Desc,
    },
  ];

  return (
    <section id="chapter-independence" className="py-24 sm:py-36 bg-[#F8F8F5] relative overflow-hidden transition-colors">
      {/* Subtle Atmospheric Light Behind Typography */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 pointer-events-none glow-subtle" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-6">
          <Compass className="w-3.5 h-3.5 text-indigo-700" />
          <span>{t.independenceBadge}</span>
        </div>

        {/* The Big Thesis Statement */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-[1.2] max-w-4xl mx-auto">
          {t.independenceThesis}
        </h2>

        <p className="mt-6 text-lg sm:text-2xl text-stone-700 font-medium max-w-2xl mx-auto leading-relaxed">
          {t.independenceSubtext}
        </p>

        {/* 4 Pillars Layout */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left items-stretch">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-stone-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-full"
            >
              <div>
                <span className="text-xs font-mono font-bold text-indigo-700 block mb-2">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl font-bold text-stone-950 tracking-tight">
                  {pillar.word}
                </h3>
                <p className="mt-3 text-sm font-semibold text-stone-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Senior Dignity First</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
