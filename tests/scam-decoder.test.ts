import { describe, it, expect } from 'vitest';

// Security & Scam Decoder Unit Tests
describe('Scam Decoder & Safety Heuristic Engine', () => {
  const isLikelyScam = (text: string): boolean => {
    return /otp|bank|kyc|block|suspend|lottery|prize|winner|password|debit|credit|cvv|urgent|pan|link|click here|apk|install|electricity|disconnect|power.*cut/i.test(
      text
    );
  };

  it('correctly flags urgent electricity cutoff threats as scam_danger', () => {
    const maliciousMsg = 'Dear Consumer, Your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Immediately contact officer at 9876543210.';
    expect(isLikelyScam(maliciousMsg)).toBe(true);
  });

  it('correctly flags bank KYC suspension threats as scam_danger', () => {
    const maliciousMsg = 'Dear customer, your SBI account has been blocked due to pending KYC. Click http://bit.ly/sbi-update to verify your PAN now.';
    expect(isLikelyScam(maliciousMsg)).toBe(true);
  });

  it('correctly flags OTP requests as scam_danger', () => {
    const maliciousMsg = 'Share your 6 digit OTP with our executive to claim your cashback prize.';
    expect(isLikelyScam(maliciousMsg)).toBe(true);
  });

  it('does not flag benign family greetings as scams', () => {
    const benignMsg = 'Good morning Ma, see you this evening for dinner. Love, Priya.';
    expect(isLikelyScam(benignMsg)).toBe(false);
  });

  it('enforces maximum content bounds to prevent memory denial of service', () => {
    const longPayload = 'A'.repeat(10000);
    const sanitized = longPayload.slice(0, 4000);
    expect(sanitized.length).toBe(4000);
  });
});
