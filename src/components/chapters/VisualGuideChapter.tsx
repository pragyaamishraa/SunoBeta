import React, { useState } from 'react';
import { MousePointer2, Hospital } from 'lucide-react';
import { speechManager } from '../../utils/speech';
import { TranslationDictionary, SupportedLanguage } from '../../data/translations';

interface VisualGuideChapterProps {
  t: TranslationDictionary;
  language: SupportedLanguage;
}

export const VisualGuideChapter: React.FC<VisualGuideChapterProps> = ({ t, language }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: t.step1Title,
      detail: t.step1Detail,
    },
    {
      num: 2,
      title: t.step2Title,
      detail: t.step2Detail,
    },
    {
      num: 3,
      title: t.step3Title,
      detail: t.step3Detail,
    },
    {
      num: 4,
      title: t.step4Title,
      detail: t.step4Detail,
    },
  ];

  const handleStepClick = (stepNum: number) => {
    setActiveStep(stepNum);
    const step = steps.find((s) => s.num === stepNum);
    if (step) {
      speechManager.speak(`Step ${step.num}: ${step.title}. ${step.detail}`, 0.85, language);
    }
  };

  return (
    <section id="chapter-visual-guide" className="py-20 sm:py-28 bg-[#F0EFEA] border-y border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-3">
            <MousePointer2 className="w-3.5 h-3.5 text-indigo-700" />
            <span>{t.visualGuideBadge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 leading-tight">
            {t.visualGuideHeading}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-stone-700 font-medium leading-relaxed">
            {t.visualGuideDesc}
          </p>
        </div>

        {/* Full-Width Visual Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: 4 Step Interactive Checklist */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
              {t.followAlongLabel}
            </span>

            {steps.map((st) => {
              const isSelected = activeStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => handleStepClick(st.num)}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-start space-x-4 ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
                      : 'bg-white/80 border-stone-300 hover:bg-white hover:border-stone-400 shadow-2xs'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-indigo-700 text-white border-indigo-800'
                        : 'bg-stone-100 text-stone-800 border-stone-300'
                    }`}
                  >
                    {st.num}
                  </span>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-950 text-base sm:text-lg">
                        {st.title}
                      </h4>
                      {isSelected && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {t.currentActionBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-stone-600 leading-relaxed">
                      {st.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Simulated Hospital Portal */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-300 shadow-sm relative overflow-hidden">
            {/* Browser Chrome */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-bold text-stone-700 ml-2">
                  https://city-care-portal.org/appointments
                </span>
              </div>
              <span className="text-xs font-bold text-stone-600">{t.simulatedPortalTag}</span>
            </div>

            {/* Portal Content */}
            <div className="mt-5 p-6 rounded-2xl bg-[#FAFAFA] border border-stone-200 space-y-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Hospital className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-stone-950 text-base">City Care Hospital & Clinics</h5>
                    <p className="text-xs font-semibold text-stone-600">Online Patient Booking</p>
                  </div>
                </div>

                {/* Target 1: Book Appointment */}
                <div className="relative">
                  <div className="px-4 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs">
                    {t.bookAppointmentBtn}
                  </div>
                  {activeStep === 1 && (
                    <div className="absolute -top-3 -right-3 flex items-center space-x-1 animate-pulse">
                      <span className="w-7 h-7 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-indigo-200">
                        1
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields: Hospital branch selection */}
              <div className="space-y-4">
                <div className="relative p-3.5 rounded-xl bg-white border border-stone-300">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    {t.selectBranchLabel}
                  </label>
                  <div className="text-sm font-semibold text-stone-950 flex items-center justify-between">
                    <span>Central Metro Healthcare Pavilion</span>
                    <span className="text-stone-400">▼</span>
                  </div>

                  {activeStep === 2 && (
                    <div className="absolute -top-3 -right-3 flex items-center space-x-1 animate-pulse">
                      <span className="w-7 h-7 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-indigo-200">
                        2
                      </span>
                    </div>
                  )}
                </div>

                {/* Form Field: Doctor Selection */}
                <div className="relative p-3.5 rounded-xl bg-white border border-stone-300">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    {t.selectSpecialistLabel}
                  </label>
                  <div className="text-sm font-semibold text-stone-950 flex items-center justify-between">
                    <span>Dr. A. Mehta (Senior Cardiologist)</span>
                    <span className="text-stone-400">▼</span>
                  </div>

                  {activeStep === 3 && (
                    <div className="absolute -top-3 -right-3 flex items-center space-x-1 animate-pulse">
                      <span className="w-7 h-7 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-indigo-200">
                        3
                      </span>
                    </div>
                  )}
                </div>

                {/* Form Field: Time slot */}
                <div className="relative p-3.5 rounded-xl bg-white border border-stone-300">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                    {t.chooseTimeLabel}
                  </label>
                  <div className="flex gap-2 text-xs font-bold">
                    <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-300">10:00 AM</span>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-950 border border-indigo-400">11:30 AM</span>
                    <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-300">03:30 PM</span>
                  </div>

                  {activeStep === 4 && (
                    <div className="absolute -top-3 -right-3 flex items-center space-x-1 animate-pulse">
                      <span className="w-7 h-7 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-indigo-200">
                        4
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Guide Caption */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center space-x-1.5">
                <MousePointer2 className="w-3.5 h-3.5 text-indigo-700" />
                <span>Senior Navigation Guide Active</span>
              </span>
              <span>Visual Assist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
