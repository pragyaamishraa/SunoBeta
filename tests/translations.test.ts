import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../src/data/translations';

describe('Multilingual Localization & Senior Accessibility', () => {
  it('supports all 11 Indian regional languages plus English', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(11);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('bn');
    expect(codes).toContain('mr');
    expect(codes).toContain('ta');
    expect(codes).toContain('te');
    expect(codes).toContain('gu');
    expect(codes).toContain('kn');
    expect(codes).toContain('ml');
    expect(codes).toContain('pa');
    expect(codes).toContain('or');
  });

  it('contains complete translation dictionary keys for every supported language', () => {
    const requiredKeys = [
      'tagline',
      'greeting',
      'greetingSubtitle',
      'voiceGreetingBtn',
      'listenSummary',
      'speakSunoBtn',
      'step1Title',
      'step2Title',
      'step3Title',
      'step4Title',
    ];

    for (const lang of SUPPORTED_LANGUAGES) {
      const dict = TRANSLATIONS[lang.code];
      expect(dict, `Dictionary for language "${lang.code}" must exist`).toBeDefined();
      for (const key of requiredKeys) {
        expect((dict as any)[key], `Key "${key}" must be present in ${lang.code}`).toBeDefined();
        expect(typeof (dict as any)[key]).toBe('string');
      }
    }
  });

  it('verifies the English speak button is branded as "Talk to Beta"', () => {
    expect(TRANSLATIONS.en.speakSunoBtn).toBe('Talk to Beta');
  });
});
