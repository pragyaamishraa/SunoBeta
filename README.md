# Suno, Beta — GenAI Senior Digital Companion & Safety Shield

Suno, Beta is a production-grade, elder-centric web application and safety shield designed to help senior citizens understand, navigate, and complete everyday digital tasks independently and with dignity. Built specifically for desktop and tablet screens with high-contrast, large-format typography, voice narration, physical-world analogies, and an intelligent scam protection engine powered by the Gemini API.

---

## 🛡️ Agentic Threat Modeling (5 Threat Zones)

| Threat Zone | Potential Vector / Scenario | Countermeasure & Implemented Control |
| :--- | :--- | :--- |
| **1. Input Surfaces** | Malicious payloads in user input or pasted phishing text attempting prompt injection or cross-site scripting (XSS). | Strict input bounds checking (max 4,000 characters), sanitized HTML rendering via standard React DOM escapes, defensive null-safe destructuring on backend endpoints. |
| **2. Planning & Reasoning** | Jailbreaking the senior helper persona or bypassing safety instructions to produce misleading advice. | System instruction sandboxing, strict structured JSON schema outputs, fallback classification heuristic rules if model responses diverge. |
| **3. Tool Execution / API** | SSRF or unauthenticated API exhaustion through automated scraping of `/api/analyze-screen-or-message`. | Server-side rate bounds, payload validation (`express.json({ limit: '2mb' })`), no dynamic arbitrary code execution. |
| **4. Memory & State** | Cross-user data contamination or accidental leaks of personal phone numbers. | Local client-side isolation (`localStorage` for trusted family contacts), zero server-side logging of personal telephone numbers or passwords. |
| **5. Inter-System Communication** | Gemini API key leakage or MITM token interception. | Zero browser-exposed API keys; all Gemini interactions proxied through secure backend Express routes; resilient multi-model fallback ladder (`gemini-3.6-flash` → `gemini-3.1-flash-lite` → `gemini-flash-latest` → `gemini-3.7-flash`). |

---

## 📋 Features & Architecture

- **Scam & Screen Decoder**: Senior citizens can paste suspicious SMS messages, WhatsApp prize alerts, or electricity cutoff threats to receive immediate color-coded safety verdicts, plain-English explanations, and spoken audio scripts.
- **Interactive Task Walkthroughs**: Visual step-by-step guides for video calling family on WhatsApp, paying electricity bills online, ordering prescription medications, and blocking robocallers. Includes progress tracking, audio narration, and celebration confetti.
- **Ask Suno Companion**: Conversational helper answering elders' questions without tech jargon, utilizing physical-world analogies (passbooks, lockboxes, and landlines).
- **Plain English Digital Glossary**: Demystifies confusing jargon like *The Cloud*, *OTP*, *Cookies*, *Bluetooth*, and *Two-Factor Authentication*.
- **Safety Practice Drill**: A zero-risk interactive sandbox where seniors can practice distinguishing between genuine alerts and fraud schemes.
- **Family Care Connect**: Quick-dial cards for family members and direct lines to national cyber fraud and senior citizen helplines.

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

## 🧪 Verification & Functional Stability Walkthroughs

Walkthrough test steps are provided in the documentation to ensure full functional stability:

- **TC-01: Font Zoom & High-Contrast Mode**: Verify that cycling through Text Sizes adjusts body sizing up to Grandparent Zoom (24px) and shifts contrast modes without UI breaking.
- **TC-02: Scam & Message Analysis**: Input sample electricity SMS and confirm the AI responds with red `scam_danger` verdict, plain-English explanation, and speech playback.
- **TC-03: Interactive Step Walkthrough**: Select WhatsApp guide, step through all 4 steps, verify step completion dots and final confetti celebration.
- **TC-04: Ask Suno Voice & Text**: Submit a question about phone storage, verifying the structured step breakdown and safety reminder.
- **TC-05: Jargon Demystifier**: Search "OTP" and verify that physical analogy and common action cards render with audio support.
- **TC-06: Safety Practice Sandbox**: Complete the 4-question drill and confirm accurate score tallying.
- **TC-07: Family Care Connect (Pragya Mishra & Santosh Mishra)**: Verify default family contacts load Daughter (Pragya Mishra: 9336429982) and Husband (Santosh Mishra: 9415568099). Test 1-touch WhatsApp pre-filled safety alert, direct phone dial, adding a custom helper, and reset to defaults.
- **TC-08: 11 Indian Languages Voice Synthesis**: Select Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), Telugu (తెలుగు), Odia (ଓଡ଼ିଆ), etc., and verify that speech narration, greeting, and chapter audio speak in the authentic regional language without defaulting to silent or strict English.
- **TC-09: Talk to Beta Voice Assistant (Pista Green & WCAG AAA Contrast)**: Tap the "Talk to Beta" button in the header (styled in authentic pista green `#93C572` with high-contrast `#022c22` dark emerald text exceeding 7.2:1 WCAG AAA standards). Speak or select a task in Hindi, Bengali, or English, confirm live waveform feedback and speech transcription, and verify that Beta executes the task and answers back with audio.
- **TC-10: Verified Senior Helplines (1930 / 14567 / 112)**: Open Family Care and tap the Cyber Fraud (1930) or Elderline (14567) helpline cards to verify direct phone call initiation.
- **TC-11: Multimodal Screenshot Inspection**: Drag-and-drop or select an image screenshot of a suspicious message in the Scam Decoder; verify image thumbnail renders, base64 payload transmits to Gemini vision, and full plain-English analysis returns.
