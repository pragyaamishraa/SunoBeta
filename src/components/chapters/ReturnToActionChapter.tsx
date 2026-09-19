import React from 'react';
import { ArrowRight, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../../data/translations';

interface ReturnToActionProps {
  onOpenUnderstand: () => void;
  onOpenSpeak: () => void;
  t: TranslationDictionary;
}

export const ReturnToActionChapter: React.FC<ReturnToActionProps> = ({
  onOpenUnderstand,
  onOpenSpeak,
  t,
}) => {
  return (
    <section id="chapter-action" className="py-24 sm:py-32 bg-[#F8F8F5] transition-colors border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
          <span>{t.actionBadge}</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 leading-tight">
          {t.actionHeading}
        </h2>

        <p className="mt-4 text-xl sm:text-2xl text-stone-700 font-medium max-w-xl mx-auto leading-relaxed">
          {t.actionDesc}
        </p>

        {/* The Two Primary Action Gateways */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenUnderstand}
            className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-base sm:text-lg shadow-sm transition-all hover:translate-y-0.5"
          >
            <span>{t.helpUnderstandBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenSpeak}
            className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-950 border border-stone-300 font-bold text-base sm:text-lg transition-all shadow-2xs"
          >
            <MessageSquare className="w-5 h-5 text-indigo-700" />
            <span>{t.speakSunoBtn}</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-stone-600">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.privacyGuarantee}</span>
          </span>
        </div>
      </div>
    </section>
  );
};
