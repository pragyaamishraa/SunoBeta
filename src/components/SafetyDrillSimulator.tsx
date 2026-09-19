import React, { useState } from 'react';
import { SAFETY_DRILL_QUESTIONS } from '../data/guidesAndJargon';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { speechManager } from '../utils/speech';
import confetti from 'canvas-confetti';

export const SafetyDrillSimulator: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQuestion = SAFETY_DRILL_QUESTIONS[currentIndex];
  const isFinished = answeredCount >= SAFETY_DRILL_QUESTIONS.length;

  const handleAnswer = (isScamChoice: boolean) => {
    if (showFeedback) return;

    setUserAnswer(isScamChoice);
    setShowFeedback(true);

    const isCorrect = isScamChoice === currentQuestion.isScam;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnsweredCount((prev) => prev + 1);

    const voiceFeedback = isCorrect
      ? `Spot on. You correctly recognized this was ${currentQuestion.isScam ? 'a scam' : 'a safe message'}. ${currentQuestion.seniorLesson}`
      : `Good try. In fact, this message was ${currentQuestion.isScam ? 'a scam' : 'safe'}. Remember: ${currentQuestion.seniorLesson}`;

    speechManager.speak(voiceFeedback);

    if (isCorrect && currentIndex === SAFETY_DRILL_QUESTIONS.length - 1) {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    setShowFeedback(false);
    if (currentIndex < SAFETY_DRILL_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setUserAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredCount(0);
  };

  return (
    <section id="drill" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Risk-Free Practice</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Safety Practice Drill
        </h2>
        <p className="mt-2 text-base text-stone-600">
          Practice spotting scam tricks without any fear of clicking the wrong thing.
        </p>
      </div>

      {/* Main Elevated Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-sm relative">
        {/* Progress & Score */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Scenario {currentIndex + 1} of {SAFETY_DRILL_QUESTIONS.length}
          </span>
          <div className="px-3 py-1 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700">
            Score: {score} / {answeredCount} Correct
          </div>
        </div>

        {!isFinished ? (
          <div className="py-6 space-y-6">
            {/* Simulated Incoming Message */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Incoming {currentQuestion.channel} from {currentQuestion.sender}
                </span>
                <button
                  onClick={() => speechManager.speak(currentQuestion.messageText)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                  aria-label="Listen to message text"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200/60">
                <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
                  "{currentQuestion.messageText}"
                </p>
              </div>
            </div>

            {/* Prompt */}
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-stone-900">
                What should you do with this message?
              </h3>
            </div>

            {/* Two Choices */}
            {!showFeedback ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleAnswer(true)}
                  className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-950 font-medium text-sm sm:text-base flex flex-col items-center justify-center space-y-1.5 transition-all shadow-2xs"
                >
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                  <span className="font-semibold">Scam Alert • Delete & Block</span>
                  <span className="text-xs text-rose-700">This looks like a fraud trick</span>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 font-medium text-sm sm:text-base flex flex-col items-center justify-center space-y-1.5 transition-all shadow-2xs"
                >
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span className="font-semibold">Safe & Legitimate Message</span>
                  <span className="text-xs text-emerald-700">Standard notice or genuine alert</span>
                </button>
              </div>
            ) : (
              /* Feedback */
              <div className="space-y-4 animate-fade-in">
                <div
                  className={`p-5 rounded-2xl border flex items-start space-x-3.5 ${
                    userAnswer === currentQuestion.isScam
                      ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                  }`}
                >
                  {userAnswer === currentQuestion.isScam ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-sm sm:text-base">
                    <h4 className="font-semibold">
                      {userAnswer === currentQuestion.isScam
                        ? 'Correct Call!'
                        : 'Good Practice Attempt'}
                    </h4>
                    <p className="leading-relaxed">{currentQuestion.seniorLesson}</p>
                  </div>
                </div>

                <div className="text-right pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm transition-all"
                  >
                    Next Practice Scenario →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="py-10 text-center space-y-4 max-w-sm mx-auto">
            <h4 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Drill Finished
            </h4>
            <p className="text-sm text-stone-600">
              You scored {score} out of {SAFETY_DRILL_QUESTIONS.length} correct. Every drill strengthens your digital peace of mind.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-stone-900 text-white font-medium rounded-xl text-sm inline-flex items-center space-x-2 hover:bg-stone-800"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
