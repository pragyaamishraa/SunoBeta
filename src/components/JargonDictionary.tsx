import React, { useState } from 'react';
import { JARGON_ITEMS } from '../data/guidesAndJargon';
import { JargonItem } from '../types';
import { Search, Sparkles, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import { speechManager } from '../utils/speech';

export const JargonDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customTerm, setCustomTerm] = useState('');
  const [customResult, setCustomResult] = useState<JargonItem | null>(null);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);

  const categories = ['All', 'Security', 'Internet', 'Phone Basics', 'Payments'];

  const filteredItems = JARGON_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainExplanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.everydayAnalogy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLookupCustomTerm = async () => {
    if (!customTerm.trim()) return;

    setIsLoadingCustom(true);
    try {
      const res = await fetch('/api/simplify-jargon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: customTerm }),
      });

      const data = await res.json();
      if (data.data) {
        setCustomResult({
          id: `custom-${Date.now()}`,
          category: 'Internet',
          term: data.data.term || customTerm,
          everydayAnalogy: data.data.everydayAnalogy || '',
          plainExplanation: data.data.plainExplanation || '',
          isDangerousOrPaid: data.data.isDangerousOrPaid || '',
          commonAction: data.data.commonAction || '',
        });
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsLoadingCustom(false);
    }
  };

  const handleReadItem = (item: JargonItem) => {
    speechManager.speak(
      `${item.term}. In everyday terms, think of it like: ${item.everydayAnalogy}. Plain meaning: ${item.plainExplanation}. Is it dangerous or does it cost money? ${item.isDangerousOrPaid}. What to do: ${item.commonAction}`
    );
  };

  return (
    <section id="jargon" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Physical World Analogies</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Tech Words in Everyday Language
        </h2>
        <p className="mt-2 text-base text-stone-600">
          Understand terms like OTP, The Cloud, and Cookies through physical things you already know.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search words like 'OTP', 'Cloud', 'Bluetooth'..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-stone-900 text-sm sm:text-base placeholder:text-stone-400 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all bg-stone-50/50"
            aria-label="Search glossary"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {item.category}
                </span>
                <button
                  onClick={() => handleReadItem(item)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-indigo-600 hover:bg-stone-50 transition-colors"
                  aria-label={`Read ${item.term} aloud`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-stone-900 tracking-tight">
                {item.term}
              </h3>

              {/* Physical Analogy Card */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-xs sm:text-sm text-indigo-950">
                <span className="font-semibold text-indigo-900">Physical Analogy: </span>
                <span>"{item.everydayAnalogy}"</span>
              </div>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {item.plainExplanation}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex items-start space-x-1.5 text-stone-600">
                <span className="font-semibold text-stone-800">Is it safe?</span>
                <span>{item.isDangerousOrPaid}</span>
              </div>
              <div className="flex items-start space-x-1.5 text-stone-600">
                <span className="font-semibold text-stone-800">What to do:</span>
                <span>{item.commonAction}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Term Lookup */}
      <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <h3 className="text-lg font-semibold text-stone-900 tracking-tight mb-1">
          Heard another confusing tech word?
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mb-4">
          Type any unfamiliar word and Suno Beta will explain it with an everyday analogy.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={customTerm}
            onChange={(e) => setCustomTerm(e.target.value)}
            placeholder="e.g. Incognito, Cache, Two-Factor Authentication..."
            className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 text-sm text-stone-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 bg-stone-50/50"
          />
          <button
            onClick={handleLookupCustomTerm}
            disabled={isLoadingCustom}
            className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoadingCustom ? 'Explaining...' : 'Explain with Analogy'}
          </button>
        </div>

        {customResult && (
          <div className="mt-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-900 text-base">{customResult.term}</h4>
              <button
                onClick={() => handleReadItem(customResult)}
                className="p-1 rounded-lg text-stone-400 hover:text-indigo-600"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
              💡 <strong>Analogy:</strong> "{customResult.everydayAnalogy}"
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">
              {customResult.plainExplanation}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
