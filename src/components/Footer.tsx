import React from 'react';
import { Shield, Heart } from 'lucide-react';

interface FooterProps {
  onSelectSection?: (section: string) => void;
  onOpenFamilyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection, onOpenFamilyModal }) => {
  return (
    <footer className="mt-20 border-t border-stone-200/70 bg-[#F8F8F5] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-stone-900 tracking-tight">Suno, Beta</span>
              <span className="text-xs text-stone-500 block">
                Empowering seniors with respectful, patient digital guidance.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-stone-600">
            {onSelectSection && (
              <>
                <button
                  onClick={() => onSelectSection('scam-decoder')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Scam Decoder
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectSection('guides')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Task Guides
                </button>
                <span>•</span>
                <button
                  onClick={() => onSelectSection('jargon')}
                  className="hover:text-stone-900 transition-colors"
                >
                  Tech Glossary
                </button>
                <span>•</span>
              </>
            )}
            {onOpenFamilyModal && (
              <button
                onClick={onOpenFamilyModal}
                className="hover:text-stone-900 font-medium transition-colors"
              >
                Family Care SOS
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/60 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Suno, Beta. Built with care for elders and families.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with accessibility, restraint, and dignity</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
