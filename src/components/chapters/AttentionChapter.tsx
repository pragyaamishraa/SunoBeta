import React, { useState } from 'react';
import { AlertCircle, Calendar, ShieldCheck, Check, Clock, Volume2, ArrowRight } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { TranslationDictionary, SupportedLanguage } from '../../data/translations';

interface AttentionChapterProps {
  onUnderstandBill: () => void;
  t: TranslationDictionary;
  language: SupportedLanguage;
}

export const AttentionChapter: React.FC<AttentionChapterProps> = ({ onUnderstandBill, t, language }) => {
  const [reminded, setReminded] = useState(false);

  const handleRemindMe = () => {
    setReminded(true);
    speechManager.speak(t.remindSetConfirm, 0.85, language);
    setTimeout(() => setReminded(false), 5000);
  };

  const handleListenSummary = () => {
    speechManager.speak(
      `${t.attentionHeading} ${t.attentionDesc} ${t.billTitle}: 1,840.`,
      0.85,
      language
    );
  };

  return (
    <section id="chapter-attention" className="py-20 sm:py-28 bg-[#F3F2EE] border-y border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.attentionChapterBadge}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
              {t.attentionHeading}
            </h2>

            <p className="text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
              {t.attentionDesc}
            </p>

            <div className="pt-2">
              <button
                onClick={handleListenSummary}
                className="inline-flex items-center space-x-2 text-stone-800 hover:text-indigo-900 font-bold text-sm"
              >
                <Volume2 className="w-4 h-4 text-indigo-700" />
                <span>{t.listenSummary}</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Contrast Priority Cards */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Attention Card: Electricity Bill */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-stone-300 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {t.attentionCardTag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight mt-3">
                    {t.billTitle}
                  </h3>
                  <p className="text-sm font-semibold text-stone-600 mt-1">
                    {t.billProvider}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    {t.amountDueLabel}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold text-stone-950 font-mono">
                    ₹1,840
                  </span>
                </div>
              </div>

              {reminded && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{t.remindSetConfirm}</span>
                </div>
              )}

              {/* Action Buttons with High-Contrast Text */}
              <div className="mt-7 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-3">
                <button
                  onClick={onUnderstandBill}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-base shadow-sm transition-all"
                >
                  <span>{t.understandBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRemindMe}
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-950 border border-stone-300 font-bold text-base transition-all shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-stone-600" />
                  <span>{t.remindMeBtn}</span>
                </button>
              </div>
            </div>

            {/* Secondary Queued Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Doctor Appointment */}
              <div className="bg-white rounded-2xl p-5 border border-stone-300 shadow-2xs flex items-center justify-between h-full">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-950 text-base">
                      {t.doctorApptTitle}
                    </h4>
                    <p className="text-xs font-semibold text-stone-600">
                      {t.doctorApptSubtitle}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 shrink-0 ml-2">
                  Confirmed
                </span>
              </div>

              {/* Bank Notification */}
              <div className="bg-white rounded-2xl p-5 border border-stone-300 shadow-2xs flex items-center justify-between h-full">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-950 text-base">
                      {t.bankNotifTitle}
                    </h4>
                    <p className="text-xs font-semibold text-stone-600">
                      {t.bankNotifSubtitle}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded-md border border-stone-200 shrink-0 ml-2">
                  Reviewed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
