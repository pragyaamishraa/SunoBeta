import React, { useState } from 'react';
import { TASK_GUIDES } from '../data/guidesAndJargon';
import { TaskGuide } from '../types';
import { Video, Receipt, Pill, ShieldAlert, Volume2, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';
import { speechManager } from '../utils/speech';
import confetti from 'canvas-confetti';

interface InteractiveGuidesProps {
  onAskSunoWithContext: (context: string) => void;
}

export const InteractiveGuides: React.FC<InteractiveGuidesProps> = ({ onAskSunoWithContext }) => {
  const [selectedGuide, setSelectedGuide] = useState<TaskGuide>(TASK_GUIDES[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isGuideFinished, setIsGuideFinished] = useState(false);

  const currentStep = selectedGuide.steps[currentStepIndex];

  const handleSelectGuide = (guide: TaskGuide) => {
    setSelectedGuide(guide);
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsGuideFinished(false);
  };

  const handleNextStep = () => {
    const nextSet = new Set(completedSteps);
    nextSet.add(currentStepIndex);
    setCompletedSteps(nextSet);

    if (currentStepIndex < selectedGuide.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsGuideFinished(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      speechManager.speak(
        `Wonderful job. You have completed the guide for ${selectedGuide.title}.`
      );
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsGuideFinished(false);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());
    setIsGuideFinished(false);
  };

  const handleReadCurrentStep = () => {
    if (currentStep) {
      const textToRead = currentStep.audioText || `${currentStep.title}. ${currentStep.instruction}. Helpful tip: ${currentStep.actionHint || ''}`;
      speechManager.speak(textToRead);
    }
  };

  const getGuideIcon = (name: string) => {
    switch (name) {
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Receipt':
        return <Receipt className="w-4 h-4" />;
      case 'Pill':
        return <Pill className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <section id="guides" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Step-by-Step Walkthroughs</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Guided Tasks, One Step at a Time
        </h2>
        <p className="mt-2 text-base text-stone-600">
          Clear visual walkthroughs for everyday digital tasks. No rush, no timer.
        </p>
      </div>

      {/* Guide Tabs Selector (Refined Horizontal Scroll) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {TASK_GUIDES.map((guide) => {
          const isSelected = selectedGuide.id === guide.id;
          return (
            <button
              key={guide.id}
              onClick={() => handleSelectGuide(guide)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border flex items-center space-x-2 shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>{getGuideIcon(guide.iconName)}</span>
              <span>{guide.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-sm relative">
        {/* Guide Meta Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {selectedGuide.category} • ~{selectedGuide.estimatedMinutes} Minutes
            </span>
            <h3 className="text-2xl font-semibold text-stone-900 tracking-tight mt-1">
              {selectedGuide.title}
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              {selectedGuide.description}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-stone-50 p-2 rounded-2xl border border-stone-200/60">
            {selectedGuide.steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-indigo-600 ring-2 ring-indigo-200 scale-110'
                    : completedSteps.has(idx)
                    ? 'bg-emerald-500'
                    : 'bg-stone-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        {!isGuideFinished ? (
          <div className="py-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Step {currentStepIndex + 1} of {selectedGuide.steps.length}
              </span>
              <button
                onClick={handleReadCurrentStep}
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100/80 px-3 py-1.5 rounded-xl transition-colors"
                aria-label="Read step aloud"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Read step</span>
              </button>
            </div>

            {/* Instruction Box */}
            <div className="space-y-3">
              <h4 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                {currentStep.title}
              </h4>
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
                {currentStep.instruction}
              </p>
            </div>

            {/* Visual Screen Representation */}
            {currentStep.visualNote && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-600">
                <span className="font-semibold text-stone-800">Screen Note: </span>
                {currentStep.visualNote}
              </div>
            )}

            {/* Helpful Practical Tip */}
            {currentStep.actionHint && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-indigo-900">
                <span className="font-semibold text-indigo-950">💡 Helpful Tip: </span>
                {currentStep.actionHint}
              </div>
            )}

            {/* Step Controls */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNextStep}
                className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-sm shadow-indigo-600/20 transition-all"
              >
                <span>
                  {currentStepIndex === selectedGuide.steps.length - 1 ? 'Finish Guide' : 'Next Step'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Guide Completed
            </h4>
            <p className="text-sm sm:text-base text-stone-600">
              You've walked through all the steps for <strong>{selectedGuide.title}</strong>. Take your time to practice on your own device.
            </p>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={handleRestart}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review from Step 1</span>
              </button>

              <button
                onClick={() => onAskSunoWithContext(`I just completed the guide for ${selectedGuide.title}, but I have a question about it.`)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs sm:text-sm font-medium hover:bg-stone-800"
              >
                <span>Ask Suno a Question</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
