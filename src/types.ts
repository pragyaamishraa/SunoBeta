export type TextSize = 'standard' | 'large' | 'extra-large' | 'grandparent';
export type ThemeMode = 'warm' | 'high-contrast' | 'soft-evening';

export interface UserPreferences {
  textSize: TextSize;
  themeMode: ThemeMode;
  autoReadAloud: boolean;
  speechSpeed: number; // 0.8 to 1.0
}

export type SafetyVerdict = 'scam_danger' | 'caution' | 'safe';

export interface ScamAnalysisResult {
  verdict: SafetyVerdict;
  safetyScore: number;
  headline: string;
  plainEnglishMeaning: string;
  actionSteps: string[];
  redFlags: string[];
  spokenScript: string;
  checkedAt?: string;
  sourceText?: string;
}

export interface TaskStep {
  stepNumber: number;
  title: string;
  instruction: string;
  visualNote?: string;
  actionHint?: string;
  audioText?: string;
}

export interface TaskGuide {
  id: string;
  title: string;
  category: 'Family & Calling' | 'Health & Bills' | 'Everyday Phone' | 'Safety';
  iconName: string;
  estimatedMinutes: number;
  prerequisites: string[];
  description: string;
  steps: TaskStep[];
}

export interface AskSunoResponse {
  greeting: string;
  simpleExplanation: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    instruction: string;
    tip: string;
  }>;
  safetyReminder: string;
  spokenSummary: string;
}

export interface JargonItem {
  id: string;
  term: string;
  category: 'Security' | 'Internet' | 'Phone Basics' | 'Payments';
  everydayAnalogy: string;
  plainExplanation: string;
  isDangerousOrPaid: string;
  commonAction: string;
}

export interface SafetyDrillQuestion {
  id: string;
  sender: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Browser Popup';
  messageText: string;
  isScam: boolean;
  scamType?: string;
  clues: string[];
  seniorLesson: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phoneNumber: string;
  notes?: string;
}

export interface DailyTip {
  id: string;
  topic: string;
  summary: string;
  analogy: string;
  action: string;
  category: string;
}
