import React from 'react';
import { ShieldCheck, BookOpen, MessageSquare, Sparkles, ArrowRight, Volume2, Calendar, AlertCircle, CheckCircle2, Clock, Upload } from 'lucide-react';
import { speechManager } from '../utils/speech';
import { DailyTip } from '../types';

interface HeroBannerProps {
  onSelectSection: (section: string) => void;
  dailyTip: DailyTip | null;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectSection, dailyTip }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleVoiceWelcome = () => {
    speechManager.speak(
      "Good morning, Mradula Mishra. Take a comfortable breath. Suno Beta is here with total patience whenever you need help with a message, a bill, or a video call."
    );
  };

  return (
    <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
      {/* Subtle Atmospheric Light Behind Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none glow-subtle" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-stone-200/60 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate} • Calm Morning</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 tracking-tight leading-tight">
              Good morning, Mradula Mishra.
            </h1>
            <p className="mt-2 text-base sm:text-lg text-stone-600 font-normal">
              Here is what matters today. Take your time, there is no hurry.
            </p>
          </div>

          <button
            onClick={handleVoiceWelcome}
            className="self-start md:self-auto inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-700 bg-white border border-stone-200/80 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-2xs"
            aria-label="Listen to voice greeting"
          >
            <Volume2 className="w-4 h-4 text-indigo-600" />
            <span>Voice Greeting</span>
          </button>
        </div>

        {/* Asymmetric Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PRIMARY ACTION: "Help Me Understand" (Visual Hero - 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40 border border-indigo-100/90 shadow-sm relative overflow-hidden group">
            {/* Atmospheric Background Glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-4">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/80 border border-indigo-200/60 text-indigo-800 text-xs font-medium shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Primary Assistance</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
                Need help with something?
              </h2>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                Upload a screenshot, bill, letter, or paste an unfamiliar message. Suno Beta will explain it in plain everyday words and guide your next move.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-100/60 flex flex-wrap items-center gap-3 relative">
              <button
                onClick={() => onSelectSection('scam-decoder')}
                className="inline-flex items-center space-x-2.5 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm sm:text-base shadow-sm shadow-indigo-600/20 transition-all hover:translate-x-0.5"
              >
                <span>Help me understand</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectSection('ask-suno')}
                className="inline-flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white/90 hover:bg-white text-stone-800 border border-stone-200/80 font-medium text-sm sm:text-base transition-all shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-stone-500" />
                <span>Talk to Beta</span>
              </button>
            </div>
          </div>

          {/* QUIET TIMELINE / NEEDS ATTENTION (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              {/* Needs Attention Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Needs Attention</span>
                </div>
                <span className="text-xs text-stone-400">1 item</span>
              </div>

              {/* Attention Item */}
              <div className="py-3.5 flex items-start justify-between gap-3 border-b border-stone-100">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
                    Electricity Bill Confirmation
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Due in 2 days • ₹840 due
                  </p>
                </div>
                <button
                  onClick={() => onSelectSection('guides')}
                  className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Understand
                </button>
              </div>

              {/* Today's Schedule */}
              <div className="pt-4">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Today's Routine</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center space-x-3 text-xs sm:text-sm">
                    <span className="font-mono font-medium text-stone-400 w-12">09:00</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-700">Morning Blood Pressure Medication</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs sm:text-sm">
                    <span className="font-mono font-medium text-stone-400 w-12">16:30</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-stone-700">WhatsApp Video Call with Family</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Wisdom Quiet Callout */}
            {dailyTip && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-stone-500">
                    💡 Daily Wisdom • {dailyTip.category}
                  </span>
                  <button
                    onClick={() => speechManager.speak(`${dailyTip.topic}. ${dailyTip.summary}`)}
                    className="text-stone-400 hover:text-indigo-600 p-0.5"
                    aria-label="Listen to tip"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-medium">
                  {dailyTip.topic}
                </p>
                <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                  "{dailyTip.analogy}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Action Cards (Uniform Alignment & Height) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {/* Card 1: Check a message */}
          <button
            onClick={() => onSelectSection('scam-decoder')}
            className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all text-left group flex items-start space-x-4 h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-stone-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                Check a message
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Verify suspicious SMS or links before taking action.
              </p>
            </div>
          </button>

          {/* Card 2: Guided Steps */}
          <button
            onClick={() => onSelectSection('guides')}
            className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all text-left group flex items-start space-x-4 h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-stone-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                Show me what to do
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Step-by-step walkthroughs for everyday digital tasks.
              </p>
            </div>
          </button>

          {/* Card 3: Ask Suno */}
          <button
            onClick={() => onSelectSection('ask-suno')}
            className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all text-left group flex items-start space-x-4 h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-stone-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                Talk to Beta
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Ask any tech question in everyday, warm words.
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
