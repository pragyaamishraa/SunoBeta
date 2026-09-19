# Suno Beta — GenAI Senior Digital Companion & Safety Shield

**Suno Beta** is an evaluation-grade, senior-first GenAI digital companion designed to empower older adults to understand, navigate, and safely complete everyday digital tasks independently, with patience and dignity.

Built specifically with and for seniors, the application bridges the digital literacy divide through physical-world analogies, high-contrast typography, voice-first interaction across 11 Indian regional languages, and an intelligent scam protection engine powered by the Gemini API.

---

## 🎯 The Problem

Over 150 million senior citizens in India and emerging economies are being pushed into mandatory digitization—from electricity bills and banking OTPs to telemedicine and family communication. However:
1. **Hostile UX & Micro-Copy**: Modern mobile applications use condensed interfaces, ephemeral dialogs, and unexplained technical jargon (*"cloud sync"*, *"cookies"*, *"2FA"*).
2. **Aggressive Digital Fraud**: Cybercriminals systematically target seniors with panic-inducing threats (*"Electricity will be disconnected at 9:30 PM"*, *"Bank KYC blocked"*).
3. **Fear of Looking Foolish**: Elders often hesitate to repeatedly ask busy family members for assistance, resulting in isolation or unintentional financial loss.

---

## 💡 The Solution

**Suno Beta** serves as an always-available, patient digital helper. The name embodies the design philosophy: **"Suno"** (Listen with respect) and **"Beta"** (A loving child or younger helper in Hindi/Urdu). 

Key pillars:
- **Zero-Panic Scam & Screen Decoder**: Real-time evaluation of suspicious SMS, WhatsApp forwards, or screenshot images into immediate, color-coded safety verdicts and plain-language guidance.
- **Physical-World Analogies**: Abstract concepts translated into familiar physical objects (e.g., *The Cloud* = *A bank locker in the sky*; *OTP* = *A single-use wax seal on an envelope*).
- **Multilingual Voice-First Access**: Native voice recognition and synthetic audio playback across English and 11 Indian languages (Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Odia).
- **One-Touch Family Safety Net**: Instant WhatsApp alerts and direct phone connections to trusted family members and national emergency helplines (1930 Cyber Helpline, 14567 Elderline).
- **Safety Practice Drill**: A sandbox environment where seniors can build muscle memory spotting fraudulent messages without fear of consequences.

---

## 🏗️ Architecture & Engineering Design

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Layer (React 19)                    │
│  ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │   Senior Accessibility   │   │   Multilingual Voice-First │  │
│  │   • 3-Tier Font Zoom     │   │   • 11 Indian Languages    │  │
│  │   • WCAG AAA Contrast    │   │   • Web Speech Synthesis   │  │
│  │   • 44px+ Touch Targets  │   │   • Speech Recognition     │  │
│  └──────────────────────────┘   └────────────────────────────┘  │
│  ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │   Interactive Chapters   │   │   Privacy & State Engine   │  │
│  │   • Independence Tasks   │   │   • Client-Side Isolation  │  │
│  │   • Scam Safety Drill    │   │   • Zero PII Hardcoding    │  │
│  │   • Jargon Demystifier   │   │   • Local Storage Backup   │  │
│  └──────────────────────────┘   └────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Proxied REST APIs (/api/*)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express 4.21 Server Engine                  │
│  ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │   Defensive Ingestion    │   │   OWASP Security Headers   │  │
│  │   • Ordering Guarantees  │   │   • X-Content-Type-Options │  │
│  │   • Null-Safe Destruct.  │   │   • Strict-Origin Referrer │  │
│  │   • 2MB Body Parser      │   │   • In-Memory Rate Limiter │  │
│  └──────────────────────────┘   └────────────────────────────┘  │
│  ┌──────────────────────────┐   ┌────────────────────────────┐  │
│  │   Prompt Injection Shield│   │   Resilient Fallback Ladder│  │
│  │   • Fence Neutralization │   │   1. gemini-3.6-flash      │  │
│  │   • System Tag Stripping │   │   2. gemini-3.1-flash-lite │  │
│  │   • Length Constraints   │   │   3. gemini-flash-latest   │  │
│  │                          │   │   4. gemini-3.7-flash      │  │
│  └──────────────────────────┘   └────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Private GoogleGenAI SDK
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│               Google Gemini Multimodal AI Engine                │
│            (Vision Screenshot Analysis + GenAI Reasoning)       │
└─────────────────────────────────────────────────────────────────┘
```

### Performance & Efficiency Optimizations
- **Vendor Code Splitting**: Custom Rollup manual chunking isolates `motion` and `lucide-react` into independent vendor bundles, maintaining sub-120kB core entry bundles.
- **Cache-Control & ETag**: Static asset pipeline configured with `maxAge: 1d` and ETags for instant repeat visits.
- **In-Memory Rate Limiting**: Token-bucket sliding window rate limiter protects backend endpoints against rapid requests (OWASP A04).

---

## 🛡️ Agentic Threat Modeling (The 5 Threat Zones)

| Threat Zone | Potential Vector / Scenario | Implemented Countermeasure |
| :--- | :--- | :--- |
| **1. Input Surfaces** | Malicious payloads in user prompts, pasted phishing SMS, or uploaded images attempting XSS or command injection. | Strict input bounds checking (max 4,000 chars), React DOM safe text encoding, and null-safe defensive payload destructuring. |
| **2. Planning & Reasoning** | Prompt injection attempting to jailbreak the senior assistant persona or extract internal instructions. | Input sanitization neutralizing markdown fence characters (`"""`), stripping system tags, and structured JSON parsing. |
| **3. Tool Execution & API** | DoS, SSRF, or credential extraction through brute-force API requests. | Backend in-memory rate limiter (90 req/min per IP), payload size limits (2MB), and zero arbitrary execution sinks. |
| **4. Memory & State** | Cross-user data leakage, storage tampering, or exposure of personal phone numbers. | Client-side isolation for family contact lists, removal of all real PII, and complete scrubbing of sensitive identifiers. |
| **5. Inter-System Communication**| Gemini API key leakage or MITM token interception. | Server-side proxying ensuring API keys are never sent to the browser; automated 4-tier model fallback ladder (`gemini-3.6-flash` → `gemini-3.1-flash-lite` → `gemini-flash-latest` → `gemini-3.7-flash`). |

---

## ♿ Senior Accessibility Standards (WCAG AAA)

- **Contrast Compliance**: Primary action buttons (such as the *Talk to Beta* header trigger) use authentic pista green (`#93C572`) paired with dark emerald text (`#022c22`), achieving a **7.2:1 contrast ratio** that surpasses the WCAG AAA threshold.
- **Touch Target Fidelity**: All interactive controls, cards, and buttons enforce a minimum **44px × 44px** touch target.
- **3-Tier Font Zoom Engine**: Standard (16px), Large (18px), and Grandparent Zoom (20px body / 36px heading) without clipping or horizontal overflow.
- **Cognitive Pacing**: Natural speech synthesis set to a calm, relaxed cadence (0.85x speed) with clear pauses between instructions.

---

## 🧪 Comprehensive Automated & Manual Testing

### Automated Vitest Suite (`npm test`)
The project includes automated unit and integration tests passing in CI:
- **`tests/scam-decoder.test.ts`**: Verifies scam heuristic regexes, power cutoff threats, bank KYC phishing, OTP traps, and benign family message handling.
- **`tests/translations.test.ts`**: Validates localization coverage across all 11 Indian regional languages and checks required dictionary keys.
- **`tests/api-security.test.ts`**: Tests the Gemini fallback ladder, defensive null-handling, prompt injection neutralization, and helpline integrity.
- **`tests/accessibility.test.ts`**: Mathematically computes luminance and validates WCAG AAA contrast ratios and touch target dimensions.

### Functional Stability Walkthrough Matrix
- **TC-01: Font Zoom & High-Contrast Mode**: Cycle through Text Sizes; verify body text scales up to Grandparent Zoom without horizontal breakage.
- **TC-02: Scam & Message Analysis**: Input sample electricity disconnection SMS; confirm the AI flags `scam_danger`, displays plain-language rationale, and offers audio playback.
- **TC-03: Interactive Step Walkthrough**: Select WhatsApp guide, step through all 4 steps, verify step completion dots and final confetti celebration.
- **TC-04: Ask Suno Voice & Text**: Submit a question about phone storage; verify the structured step breakdown, physical analogy, and safety reminder.
- **TC-05: Jargon Demystifier**: Search "OTP" and verify that physical analogy and common action cards render with audio support.
- **TC-06: Safety Practice Sandbox**: Complete the 4-question drill and confirm accurate score tallying.
- **TC-07: Family Care Connect**: Verify default family helpers load with clean demo data. Test WhatsApp safety alert prefill, direct phone dial, adding a custom helper, and reset to defaults.
- **TC-08: 11 Indian Languages Voice Synthesis**: Select Bengali, Marathi, Tamil, Telugu, Odia, etc., and verify that speech narration, greeting, and chapter audio speak in the authentic regional language.
- **TC-09: Talk to Beta Voice Assistant**: Tap "Talk to Beta" (pista green `#93C572`, 7.2:1 AAA contrast). Speak or select a task; confirm live waveform feedback, speech transcription, and spoken audio response.
- **TC-10: Verified Senior Helplines (1930 / 14567 / 112)**: Open Family Care and tap the Cyber Fraud (1930) or Elderline (14567) helpline cards to verify direct phone call initiation.
- **TC-11: Multimodal Screenshot Inspection**: Drag-and-drop or select an image screenshot of a suspicious message in the Scam Decoder; verify image thumbnail renders, base64 payload transmits to Gemini vision, and full plain-English analysis returns.

---

## 🛠️ Environment & Prerequisites

1. **Google Cloud SDK (`gcloud` CLI)**: Installed and authenticated (`gcloud auth login`).
2. **Node.js**: Version 20.x or higher with npm.
3. **Google Cloud Project**: An active GCP project with billing enabled.

Enable necessary Google Cloud APIs:
```bash
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com
```

---

## 🔐 Secret Management Setup

Do **not** commit actual API keys to the repository. Operational credentials are managed dynamically using Google Cloud Secret Manager.

```bash
# 1. Create the Secret in Secret Manager
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# 2. Add your Gemini API Key as a secret version
echo -n "YOUR_ACTUAL_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 3. Grant the Cloud Run default service account Secret Accessor permission
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')

gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🗄️ Firestore Security Rules (For User Data Isolation)

If persisting user activity or custom family preferences to Firestore, enforce strict owner-bound rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/interactions/{interactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 Google Cloud Run Deployment Flow

Deploy the containerized full-stack application directly to Cloud Run:

```bash
# 1. Build and deploy container to Cloud Run
gcloud run deploy suno-beta \
  --source . \
  --region asia-east1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest \
  --port 3000

# 2. Apply Mandatory Campaign Labeling for Challenge Verification
gcloud run services update suno-beta \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region asia-east1
```

---

## 💻 Local Development & Quick Start

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add GEMINI_API_KEY to .env

# 3. Run typecheck & automated tests
npm run lint
npm test

# 4. Start local full-stack development server (Port 3000)
npm run dev
```
