import React, { useState } from 'react';
import { UserPreferences, TextSize, ThemeMode } from '../types';
import { Sliders, X, Check, Eye, Type, Volume2 } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  const textSizeOptions: { id: TextSize; label: string; desc: string }[] = [
    { id: 'standard', label: 'Standard', desc: '16px comfortable default' },
    { id: 'large', label: 'Large', desc: '18px increased readability' },
    { id: 'extra-large', label: 'Extra Large', desc: '20px enhanced clarity' },
    { id: 'grandparent', label: 'Max Zoom', desc: '24px extra large senior zoom' },
  ];

  const themeOptions: { id: ThemeMode; label: string; desc: string }[] = [
    { id: 'warm', label: 'Warm Ivory', desc: 'Default calm, eye-friendly light palette' },
    { id: 'high-contrast', label: 'High Contrast', desc: 'Pure black & white for maximum edge contrast' },
    { id: 'soft-evening', label: 'Soft Evening', desc: 'Dark charcoal mode for low-light environments' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-300 shadow-2xl relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center border border-indigo-200">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="accessibility-modal-title" className="text-xl font-bold text-stone-950 tracking-tight">
                Display & Comfort
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-600">
                Adjust font size, contrast, and voice pacing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6">
          {/* Text Size Control */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-stone-950 font-bold text-sm">
              <Type className="w-4 h-4 text-indigo-700" />
              <span>Text Size</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {textSizeOptions.map((opt) => {
                const isSelected = preferences.textSize === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdatePreferences({ textSize: opt.id })}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-stone-950 shadow-xs ring-2 ring-indigo-600/20'
                        : 'bg-white border-stone-300 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-950">{opt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-700 shrink-0" />}
                    </div>
                    <span className="text-xs font-semibold text-stone-600 mt-1">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme & Contrast Control */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-stone-950 font-bold text-sm">
              <Eye className="w-4 h-4 text-indigo-700" />
              <span>Contrast & Lighting</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {themeOptions.map((opt) => {
                const isSelected = preferences.themeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdatePreferences({ themeMode: opt.id })}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-stone-950 shadow-xs ring-2 ring-indigo-600/20'
                        : 'bg-white border-stone-300 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-stone-950">{opt.label}</div>
                      <div className="text-xs font-semibold text-stone-600">{opt.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-700 shrink-0 ml-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Pace Setting */}
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-stone-950 font-bold text-sm">
              <Volume2 className="w-4 h-4 text-indigo-700" />
              <span>Voice Narration Pace</span>
            </div>
            <div className="flex items-center space-x-3 bg-stone-100 p-3.5 rounded-2xl border border-stone-300">
              <span className="text-xs font-bold text-stone-700">Calm & Slow</span>
              <input
                type="range"
                min="0.7"
                max="1.0"
                step="0.05"
                value={preferences.speechSpeed}
                onChange={(e) => onUpdatePreferences({ speechSpeed: parseFloat(e.target.value) })}
                className="flex-1 accent-indigo-700 cursor-pointer"
                aria-label="Speech speed"
              />
              <span className="text-xs font-bold text-stone-700">Standard</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white font-bold rounded-xl text-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
