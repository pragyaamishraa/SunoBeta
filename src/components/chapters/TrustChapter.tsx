import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import { TranslationDictionary } from '../../data/translations';

interface TrustChapterProps {
  t: TranslationDictionary;
}

export const TrustChapter: React.FC<TrustChapterProps> = ({ t }) => {
  const steps = [
    { label: t.chain1Title, desc: t.chain1Desc },
    { label: t.chain2Title, desc: t.chain2Desc },
    { label: t.chain3Title, desc: t.chain3Desc },
    { label: t.chain4Title, desc: t.chain4Desc },
    { label: t.chain5Title, desc: t.chain5Desc },
  ];

  return (
    <section id="chapter-trust" className="py-24 sm:py-32 bg-[#121418] text-white relative overflow-hidden transition-colors">
      {/* Subtle Indigo Atmospheric Glow in Dark Chapter */}
      <div className="absolute inset-0 pointer-events-none glow-dark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-700/60 mb-4">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.trustBadge}</span>
          </div>

          {/* High-Contrast White Heading on Genuine Dark Canvas */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {t.trustHeading}
          </h2>

          <p className="mt-4 text-lg sm:text-xl text-stone-300 font-medium leading-relaxed">
            {t.trustDesc}
          </p>
        </div>

        {/* The 5-Step Integrity Chain */}
        <div className="bg-stone-900/90 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-6">
            {t.safeChainTitle}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 block mb-1">
                    STEP 0{idx + 1}
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {st.label}
                  </h4>
                  <p className="text-xs font-medium text-stone-300 mt-2 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <span>Guaranteed</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Examples Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Review Before Submitting</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                Every payment amount, recipient name, or form field is shown in 24px high-contrast typography before final submission.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Sensitive Actions</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                Suno asks for explicit two-touch confirmation for any transaction above ₹500 or any setting that shares location.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Protect Personal Information</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
                Your One-Time Passwords (OTPs) and account PINs are never stored, transmitted, or requested by Suno.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
