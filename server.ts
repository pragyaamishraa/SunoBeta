import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Lazy GoogleGenAI Initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Resilient Model Fallback Ladder
const MODEL_FALLBACK_LADDER = [
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
];

const RECOVERABLE_STATUS_CODES = [404, 429, 500, 503];

async function generateContentWithFallback(
  contents: string | any[],
  systemInstruction?: string
): Promise<{ text: string; modelUsed: string }> {
  const client = getAIClient();
  if (!client) {
    throw new Error("NO_API_KEY");
  }

  let lastError: unknown = null;

  for (const model of MODEL_FALLBACK_LADDER) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: systemInstruction
          ? { systemInstruction }
          : undefined,
      });

      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      const statusCode = err?.status || err?.statusCode || err?.response?.status;
      const isRecoverable = RECOVERABLE_STATUS_CODES.includes(Number(statusCode));
      console.warn(`Model ${model} failed (status: ${statusCode}). Recoverable: ${isRecoverable}`);
      if (!isRecoverable && statusCode && statusCode !== 0) {
        // If it's a hard auth error, don't waste time retrying all models
        if (statusCode === 401 || statusCode === 403) {
          throw err;
        }
      }
      // Continue to next model in the fallback ladder
    }
  }

  throw lastError || new Error("All fallback models exhausted");
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// API: Daily Digital Safety & Tech Tip
app.get("/api/daily-tip", (_req, res) => {
  const tips = [
    {
      id: "tip-1",
      topic: "The Golden Rule of Bank OTPs",
      summary: "Your One-Time Password (OTP) is like the physical key to your house lock.",
      analogy: "If a stranger stands outside your door and asks for the front door key, you would never hand it over. An OTP works the exact same way.",
      action: "Never read aloud or forward a 4-digit or 6-digit code to anyone, even if they claim to be calling from your bank.",
      category: "Banking Safety",
    },
    {
      id: "tip-2",
      topic: "What Exactly Is 'The Cloud'?",
      summary: "Think of the Cloud as a safe bank deposit locker for your digital photos.",
      analogy: "Instead of keeping all your family albums in one wooden trunk at home (which might get damaged if you drop your phone), your photos are stored in a secure fireproof vault run by Google or Apple.",
      action: "If you get a new phone tomorrow, all your grandchildren's pictures will safely reappear when you log in.",
      category: "Tech Demystified",
    },
    {
      id: "tip-3",
      topic: "Spotting Urgent Urgency Scams",
      summary: "Scammers always try to make you panic so you act before thinking.",
      analogy: "Phrases like 'Your electricity will be cut off tonight at 9 PM' or 'Account blocked within 2 hours' are designed to trigger fear. Legitimate utility companies send postal notices or give weeks of warning.",
      action: "Whenever a message says you must act in minutes, pause, drink a sip of water, and call your family helper first.",
      category: "Scam Shield",
    },
    {
      id: "tip-4",
      topic: "Cleaning Up Phone Storage Safely",
      summary: "Why your phone says 'Storage Almost Full'.",
      analogy: "Imagine an old letterbox where newspapers keep piling up. WhatsApp 'Good Morning' picture cards and forwarded videos fill up the letterbox over months.",
      action: "You can safely delete forwarded videos from WhatsApp groups without losing your personal family camera photos.",
      category: "Device Health",
    },
  ];

  // Rotate based on day of month
  const dayIndex = new Date().getDate() % tips.length;
  res.json(tips[dayIndex]);
});

// API: Decode Screen, Message, or Scam Check
app.post("/api/analyze-screen-or-message", async (req, res) => {
  // Defensive Payload Ingestion (Null-Safe Destructuring)
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const rawContent = typeof body.content === "string" ? body.content.trim() : "";
  const contextType = typeof body.contextType === "string" ? body.contextType : "general";
  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : null;
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "image/jpeg";

  if (!rawContent && !imageBase64) {
    return res.status(400).json({
      error: "Please provide the message, link, or upload an image screenshot for Suno Beta to check.",
    });
  }

  // Safe bounds check
  const sanitizedContent = rawContent.slice(0, 4000);

  const systemInstruction = `You are "Suno Beta", a loving, respectful, patient digital companion and scam protector for senior citizens (grandparents and elders).
Your job is to analyze any confusing message, SMS, email, screenshot, dialog box, or link that a senior received.

GUIDELINES FOR YOUR RESPONSE:
1. Speak with extreme warmth, respect, patience, and dignity. Never use patronizing words or difficult tech jargon.
2. Clearly assess safety:
   - "scam_danger": Definite scam, phishing, fraud, fake bank/utility alert, lottery, malicious link.
   - "caution": Suspicious, marketing spam, unfamiliar subscription, or asking for unnecessary permissions.
   - "safe": Legitimate system message, genuine family chat, standard receipt, or benign notification.
3. Provide a safety score from 0 (guaranteed scam) to 100 (completely safe).
4. Give a clear, reassuring headline.
5. Explain in plain English what this message or screenshot is actually asking or showing without any tech jargon.
6. Provide concrete, reassuring next steps (e.g. "Do NOT click the blue link", "Delete the message", "Call your daughter Pragya or husband Santosh").
7. Highlight key red flags or reassuring points in plain words.
8. Provide a spoken audio script (warm, clear, conversational 2-3 sentences to read aloud).

Format your response as a valid, parsable JSON object with these EXACT keys:
{
  "verdict": "scam_danger" | "caution" | "safe",
  "safetyScore": number (0 to 100),
  "headline": string,
  "plainEnglishMeaning": string,
  "actionSteps": string[],
  "redFlags": string[],
  "spokenScript": string
}
Do not enclose in markdown code fences if possible, or use standard raw json.`;

  try {
    const promptText = `Analyze this message, SMS, or screenshot received by a senior citizen (Context: ${contextType}):\n\n"""\n${
      sanitizedContent || "Please read and analyze the text and UI elements in the attached screenshot/image."
    }\n"""`;

    let contentsPayload: any = promptText;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");
      contentsPayload = [
        promptText,
        {
          inlineData: {
            mimeType: mimeType.startsWith("image/") ? mimeType : "image/jpeg",
            data: cleanBase64,
          },
        },
      ];
    }

    const result = await generateContentWithFallback(contentsPayload, systemInstruction);

    // Parse JSON safely
    let parsedData: any = null;
    try {
      const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      // Fallback structured parser
      parsedData = {
        verdict: result.text.toLowerCase().includes("scam") || result.text.toLowerCase().includes("fraud") ? "scam_danger" : "caution",
        safetyScore: result.text.toLowerCase().includes("scam") ? 15 : 60,
        headline: "Analysis Complete",
        plainEnglishMeaning: result.text.slice(0, 300),
        actionSteps: ["Do not click any links inside the message", "Speak with your family helper to double check"],
        redFlags: ["Unsolicited urgent request"],
        spokenScript: "Suno Beta has reviewed this message. Please be cautious and do not share any codes or passwords.",
      };
    }

    return res.json({
      success: true,
      data: parsedData,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    console.error("AI Analysis error:", err);

    // Provide an intelligent, high-quality rule-based fallback if API key is missing or quota exhausted
    const isLikelyScam =
      /otp|bank|kyc|block|suspend|lottery|prize|winner|password|debit|credit|cvv|urgent|pan|link|click here|apk|install|electricity.*cut/i.test(
        sanitizedContent
      );

    const fallbackResponse = {
      verdict: isLikelyScam ? "scam_danger" : "caution",
      safetyScore: isLikelyScam ? 10 : 70,
      headline: isLikelyScam
        ? "⚠️ Warning: This appears to be a fraudulent or suspicious message"
        : "ℹ️ Please proceed with care and verify the sender",
      plainEnglishMeaning: isLikelyScam
        ? "This message uses urgent words like 'account suspended', 'OTP', or 'immediate action' to make you panic. Real banks and government offices do not threaten immediate disconnection over text."
        : "This message appears to be a standard notification or newsletter. However, never share passwords or personal financial numbers.",
      actionSteps: isLikelyScam
        ? [
            "Do NOT click any link or phone number inside the text.",
            "Never share your OTP, PIN, or banking passwords.",
            "Delete the message and inform your family or bank directly.",
          ]
        : [
            "Check who the sender is before replying.",
            "If it asks for payment or personal details, verify with family first.",
          ],
      redFlags: isLikelyScam
        ? [
            "Creates artificial panic with immediate deadlines",
            "Asks you to click an unverified link or call an unknown phone number",
            "Mentions banking credentials or KYC updates via text",
          ]
        : ["Unknown or marketing sender"],
      spokenScript: isLikelyScam
        ? "Please do not worry, but do not click on any links in this message. Real banks never ask for your passwords or OTP over text message. You can safely delete it."
        : "This message does not seem immediately dangerous, but please remember never to give out private bank details or passcodes.",
    };

    return res.json({
      success: true,
      data: fallbackResponse,
      modelUsed: "built-in-safety-engine",
    });
  }
});

// API: Ask Suno (Patience Companion for Senior Questions)
app.post("/api/ask-suno", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const rawQuestion = typeof body.question === "string" ? body.question.trim() : "";
  const topic = typeof body.topic === "string" ? body.topic : "general";
  const language = typeof body.language === "string" ? body.language.toLowerCase() : "en";

  if (!rawQuestion) {
    return res.status(400).json({ error: "Please enter your question for Suno Beta." });
  }

  const sanitizedQuestion = rawQuestion.slice(0, 1500);

  const LANGUAGE_NAMES: Record<string, string> = {
    en: "English",
    hi: "Hindi (हिन्दी)",
    bn: "Bengali (বাংলা)",
    mr: "Marathi (मराठी)",
    ta: "Tamil (தமிழ்)",
    te: "Telugu (తెలుగు)",
    gu: "Gujarati (ગુજરાતી)",
    kn: "Kannada (ಕನ್ನಡ)",
    ml: "Malayalam (മലയാളം)",
    pa: "Punjabi (ਪੰਜਾਬੀ)",
    or: "Odia (ଓଡ଼ିଆ)",
  };

  const targetLangName = LANGUAGE_NAMES[language] || "English";

  const systemInstruction = `You are "Suno Beta", a caring, respectful, patient digital companion specifically built for senior citizens (grandparents and elders like Mradula Mishra).
The word "Beta" means child or younger helper in Hindi/Urdu, and "Suno" means listen. You speak like a dedicated, loving grandson or granddaughter who is delighted to help their grandparent navigate technology without feeling hurried or foolish.

CRITICAL MULTILINGUAL REQUIREMENT:
The user selected language: ${targetLangName} (code: "${language}").
You MUST write all textual fields (greeting, simpleExplanation, steps title, steps instruction, steps tip, safetyReminder, spokenSummary) in ${targetLangName}.
If language is "hi", use natural respectful Hindi with Devanagari script.
If language is "bn", use Bengali script.
If language is "mr", use Marathi in Devanagari script.
If language is "ta", use Tamil script.
If language is "te", use Telugu script.
If language is "gu", use Gujarati script.
If language is "kn", use Kannada script.
If language is "ml", use Malayalam script.
If language is "pa", use Punjabi (Gurmukhi) script.
If language is "or", use Odia script.
If language is "en", use clear English with warm Indian familial touches (Namaste, Beta).

KEY RULES:
- Never make them feel tech-illiterate. Validate their curiosity and celebrate every step.
- Use simple, vivid physical-world analogies (telephones, bank tellers, letters, kitchen recipes).
- Avoid tech jargon. If you must use a word like 'download' or 'app', explain it in 3 simple words.
- Break instructions into numbered, big, simple steps with large spacing.
- Provide a reassuring tip for safety at the end.
- Return a JSON object with this exact schema:
{
  "greeting": string,
  "simpleExplanation": string,
  "steps": Array<{ "stepNumber": number, "title": string, "instruction": string, "tip": string }>,
  "safetyReminder": string,
  "spokenSummary": string
}`;

  try {
    const prompt = `Target Language: ${targetLangName}\nTopic: ${topic}\nElder's Question/Request: "${sanitizedQuestion}"`;
    const result = await generateContentWithFallback(prompt, systemInstruction);

    let parsedData: any = null;
    try {
      const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        greeting: language === "hi"
          ? "नमस्ते! चिंता बिल्कुल न करें, मैं आपके साथ हूँ।"
          : language === "bn"
          ? "নমস্কার! কোনো চিন্তা করবেন না, আমি সাহায্য করছি।"
          : language === "mr"
          ? "नमस्कार! अजिबात काळजी करू नका, मी समजावून सांगतो."
          : language === "ta"
          ? "வணக்கம்! கவலைப்பட வேண்டாம், நான் உதவுகிறேன்."
          : language === "te"
          ? "నమస్కారం! ఎలాంటి ఆందోళన వద్దు, నేను మీకు సహాయం చేస్తాను."
          : "Namaste! I am right here with you, and this is very easy once we break it down.",
        simpleExplanation: result.text.slice(0, 300),
        steps: [
          {
            stepNumber: 1,
            title: language === "hi" ? "पहला कदम" : "Step 1",
            instruction: language === "hi" ? "आराम से एक गहरी सांस लें और स्क्रीन पर देखें।" : "Take a comfortable breath and look at your screen.",
            tip: language === "hi" ? "कोई जल्दबाज़ी नहीं है।" : "There is never any rush.",
          },
          {
            stepNumber: 2,
            title: language === "hi" ? "दूसरा कदम" : "Step 2",
            instruction: language === "hi" ? "दिए गए विकल्प को धीरे से चुनें।" : "Follow the on-screen prompt gently.",
            tip: language === "hi" ? "कोई भी संशय हो तो मुझसे पूछें।" : "Ask Suno if any button looks unfamiliar.",
          },
        ],
        safetyReminder: language === "hi"
          ? "ध्यान रखें: अपना 4 या 6 अंकों का बैंक पिन कभी किसी को न बताएं।"
          : "Remember: never share your 4-digit or 6-digit bank PIN with anyone.",
        spokenSummary: language === "hi"
          ? "मैंने आपके लिए आसान कदम तैयार कर दिए हैं। आराम से एक-एक करके इन्हें देखें।"
          : "I have prepared the steps for you. Take your time, and follow each step one by one.",
      };
    }

    return res.json({
      success: true,
      data: parsedData,
      modelUsed: result.modelUsed,
    });
  } catch (err: any) {
    console.error("Ask Suno error:", err);

    // Multilingual Fallback response if API key is not active
    const fallbackByLang: Record<string, any> = {
      hi: {
        greeting: "नमस्ते! बिल्कुल चिंता न करें—आपने बहुत अच्छा सवाल पूछा है, हम इसे कदम-दर-कदम समझेंगे।",
        simpleExplanation: `तकनीक कभी-कभी मुश्किल लग सकती है क्योंकि फोन में कई छोटे बटन होते हैं। "${sanitizedQuestion.slice(0, 50)}" को हम बिल्कुल आसान बना देंगे।`,
        steps: [
          {
            stepNumber: 1,
            title: "स्क्रीन पर मुख्य बटन देखें",
            instruction: "ज्यादातर ऐप में मुख्य काम जैसे संदेश भेजना या पुष्टि करना नीले या हरे बटन से होता है।",
            tip: "यदि कुछ समझ न आए तो होम बटन दबाकर वापस आ सकते हैं।",
          },
          {
            stepNumber: 2,
            title: "नाम या नंबर दोबारा जांचें",
            instruction: "भेजने या कॉल करने से पहले स्क्रीन के ऊपर अपने परिजन का नाम या फोटो देख लें।",
            tip: "दो सेकंड रुककर देखना गलतियों से बचाता है।",
          },
          {
            stepNumber: 3,
            title: "निश्चिंत होकर आगे बढ़ें",
            instruction: "आप बहुत अच्छा सीख रहे हैं, और हर कदम आपको आत्मनिर्भर बना रहा है!",
            tip: "आप सुनो बेटा से जितनी बार चाहें पूछ सकते हैं।",
          },
        ],
        safetyReminder: "सुरक्षा नियम: अगर कोई स्क्रीन बैंक पिन, पासवर्ड या अज्ञात फाइल डाउनलोड करने को कहे, तो रुक जाएं।",
        spokenSummary: "चिंता बिल्कुल न करें। मैंने आपके लिए सब कुछ आसान शब्दों में लिख दिया है। आराम से करें।",
      },
      bn: {
        greeting: "নমস্কার! একদম চিন্তা করবেন না—আমরা ধাপে ধাপে এটি সহজ করে নেব।",
        simpleExplanation: `ফোন চালানো একদম সহজ। "${sanitizedQuestion.slice(0, 50)}" সম্পর্কে স্পষ্ট নির্দেশ নিচে দেওয়া হলো।`,
        steps: [
          {
            stepNumber: 1,
            title: "মূল বোতামটি লক্ষ্য করুন",
            instruction: "অধিকাংশ অ্যাপে সবুজ বা নীল রঙের বোতাম দিয়ে মূল কাজ সম্পন্ন হয়।",
            tip: "কোনো সন্দেহ হলে হোম বোতাম চেপে ফিরে আসতে পারেন।",
          },
          {
            stepNumber: 2,
            title: "নাম ও নম্বর যাচাই করুন",
            instruction: "পাঠানোর আগে পরিবারের সদস্যের ছবি বা নাম দেখে নিন।",
            tip: "একটু দেখে নিলে ভুল এড়ানো যায়।",
          },
        ],
        safetyReminder: "মনে রাখবেন: নিজের ওটিপি বা ব্যাঙ্ক পিন কখনো কাউকে জানাবেন না।",
        spokenSummary: "আমি আপনার জন্য পদক্ষেপগুলি সাজিয়ে দিয়েছি। শান্তভাবে অনুসরণ করুন।",
      },
      mr: {
        greeting: "नमस्कार! अजिबात काळजी करू नका—आपण हे टप्प्याटप्प्याने अगदी सोपे करूया.",
        simpleExplanation: `तंत्रज्ञानाचा वापर करणे सोपे आहे. "${sanitizedQuestion.slice(0, 50)}" बद्दलचे सोपे टप्पे खालीलप्रमाणे आहेत.`,
        steps: [
          {
            stepNumber: 1,
            title: "रंगीत बटण शोधा",
            instruction: "कॉल किंवा पाठवण्यासाठी सामान्यतः निळे किंवा हिरवे बटण असते.",
            tip: "काही अडचण आल्यास होम बटण दाबून मागे येऊ शकता.",
          },
          {
            stepNumber: 2,
            title: "नाव व्यवस्थित तपासा",
            instruction: "बटण दाबण्यापूर्वी स्क्रीनवर नाव आणि क्रमांक पुन्हा एकदा तपासून घ्या.",
            tip: "दोन सेकंद थांबल्याने चूक टळते.",
          },
        ],
        safetyReminder: "सुरक्षा नियम: आपला बँक पिन किंवा ओटीपी कधीही कोणाला सांगू नका.",
        spokenSummary: "मी आपल्यासाठी सोपे टप्पे तयार केले आहेत. आरामात एक-एक करून पूर्ण करा.",
      },
      ta: {
        greeting: "வணக்கம்! கவலைப்பட வேண்டாம்—நாம் இதனை மிக எளிதாகப் புரிந்து கொள்ளலாம்.",
        simpleExplanation: `தொழில்நுட்பம் கடினமானது அல்ல. "${sanitizedQuestion.slice(0, 50)}" க்கான எளிய வழிமுறைகள் இதோ.`,
        steps: [
          {
            stepNumber: 1,
            title: "முதன்மை பட்டனைப் பார்க்கவும்",
            instruction: "பொதுவாக அழைப்பு விடுக்க அல்லது அனுப்ப நீலம் அல்லது பச்சை பட்டன் இருக்கும்.",
            tip: "சந்தேகம் இருந்தால் ஹோம் பட்டனை அழுத்தித் திரும்பலாம்.",
          },
          {
            stepNumber: 2,
            title: "பெயர் மற்றும் எண்ணை சரிபார்க்கவும்",
            instruction: "அனுப்பும் முன் மேலே உள்ள உறவினரின் பெயர் சரியாக உள்ளதா எனப் பார்க்கவும்.",
            tip: "ஒருமுறை கவனிப்பது தவறுகளைத் தவிர்க்கும்.",
          },
        ],
        safetyReminder: "பாதுகாப்பு குறிப்பு: உங்கள் வங்கி பின் அல்லது OTP ஐ யாரிடமும் பகிராதீர்கள்.",
        spokenSummary: "உங்களுக்காக எளிய படிகளைத் தயார் செய்துள்ளேன். அமைதியாகப் பின்பற்றுங்கள்.",
      },
      te: {
        greeting: "నమస్కారం! ఎలాంటి ఆందోళన వద్దు—మనం దీనిని చాలా సులభంగా నేర్చుకోవచ్చు.",
        simpleExplanation: `సాంకేతికత చాలా సులభం. "${sanitizedQuestion.slice(0, 50)}" గురించి సులభమైన దశలు ఇక్కడ ఉన్నాయి.`,
        steps: [
          {
            stepNumber: 1,
            title: "ప్రధాన బటన్‌ను గమనించండి",
            instruction: "సాధారణంగా నిర్ధారణ కోసం నీలం లేదా ఆకుపచ్చ బటన్ ఉంటుంది.",
            tip: "ఏదైనా సందేహం ఉంటే హోమ్ బటన్ నొక్కి వెనక్కి రావచ్చు.",
          },
          {
            stepNumber: 2,
            title: "పేరును సరిచూసుకోండి",
            instruction: "పంపే ముందు స్క్రీన్ పై భాగంలో పేరు సరిగ్గా ఉందో లేదో చూడండి.",
            tip: "రెండు సెకన్లు గమనిస్తే పొరపాట్లు జరగవు.",
          },
        ],
        safetyReminder: "భద్రతా సూచన: మీ బ్యాంక్ పిన్ లేదా ఓటీపీని ఎవరితోనూ పంచుకోవద్దు.",
        spokenSummary: "మీ కోసం సులభమైన దశలను సిద్ధం చేశాను. నిదానంగా అనుసరించండి.",
      },
    };

    const fallbackResponse = fallbackByLang[language] || {
      greeting: "Namaste! Don't worry at all—you asked a wonderful question, and we will take it step by step.",
      simpleExplanation: `Technology can often seem complicated because apps are designed with too many tiny buttons. Let's make "${sanitizedQuestion.slice(0, 50)}" simple and stress-free.`,
      steps: [
        {
          stepNumber: 1,
          title: "Look for the green or blue button",
          instruction: "Most phones use bright colored buttons for the main action like calling, sending, or confirming.",
          tip: "If you are unsure, you can always tap the Home circle or swipe up to go back safely.",
        },
        {
          stepNumber: 2,
          title: "Double-check the person's name or number",
          instruction: "Before tapping Send or Call, look at the top of the screen to make sure it is your family member's photo or name.",
          tip: "Taking three extra seconds saves accidental messages.",
        },
        {
          stepNumber: 3,
          title: "Celebrate your accomplishment",
          instruction: "You are learning something brand new, and every single step makes you more digitally independent!",
          tip: "You can ask Suno Beta as many times as you like.",
        },
      ],
      safetyReminder: "Safety Rule: If any screen asks you for your bank PIN, password, or to install an unfamiliar file, stop and ask Suno first.",
      spokenSummary: "Do not worry at all. I have laid out the steps clearly for you. Take your time, and remember you are doing great.",
    };

    return res.json({
      success: true,
      data: fallbackResponse,
      modelUsed: "built-in-companion-engine",
    });
  }
});

// API: Tech Jargon Demystifier
app.post("/api/simplify-jargon", async (req, res) => {
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const rawTerm = typeof body.term === "string" ? body.term.trim() : "";

  if (!rawTerm) {
    return res.status(400).json({ error: "Please enter a tech word to explain." });
  }

  const prompt = `Explain the tech term "${rawTerm.slice(0, 100)}" to an 75-year-old grandmother or grandfather.
Provide:
1. Real-world physical analogy (e.g. comparing to bank passbook, telegram, landline, front door key).
2. What it actually means in 2 simple sentences.
3. Does it cost money or is it dangerous?
4. What button or action they usually see.

Return JSON:
{
  "term": string,
  "everydayAnalogy": string,
  "plainExplanation": string,
  "isDangerousOrPaid": string,
  "commonAction": string
}`;

  try {
    const result = await generateContentWithFallback(
      prompt,
      "You are Suno Beta, senior digital companion. Be warm, respectful, and crystal clear."
    );
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    return res.json({ success: true, data: parsed, modelUsed: result.modelUsed });
  } catch (err: any) {
    const termLower = rawTerm.toLowerCase();
    const fallbackDictionary: Record<string, any> = {
      otp: {
        term: "OTP (One-Time Password)",
        everydayAnalogy: "Like a wax seal on an official envelope, or a secret handshake valid for only 5 minutes.",
        plainExplanation: "It is a short secret code sent to your phone to prove that you are the real person making the transaction.",
        isDangerousOrPaid: "It is 100% free, but NEVER tell it to anyone on a phone call. Giving an OTP to a caller is like giving them the keys to your jewelry box.",
        commonAction: "Look at the SMS message, read the 6 numbers, type it into your banking app, and keep it private.",
      },
      cloud: {
        term: "The Cloud",
        everydayAnalogy: "A safe bank locker in the sky for your family photos and documents.",
        plainExplanation: "Instead of saving everything only on your small phone piece of glass, a backup copy is kept safely in a giant computer vault.",
        isDangerousOrPaid: "Usually free for normal usage. If your phone gets lost or wet, all your precious memories stay safe.",
        commonAction: "When your phone asks 'Back up to Google Drive or iCloud?', you can comfortably choose Yes.",
      },
      cookies: {
        term: "Cookies",
        everydayAnalogy: "A coat-check ticket at a theater or a bookmark placed in your reading novel.",
        plainExplanation: "A tiny note a website leaves in your browser so it remembers who you are and keeps your language preference.",
        isDangerousOrPaid: "Completely free and standard. They do not steal your money, though you can choose 'Reject All Marketing' if you prefer fewer advertisements.",
        commonAction: "You can tap 'Accept Necessary' or 'Agree' to make the popup go away.",
      },
    };

    const matched = fallbackDictionary[termLower] || {
      term: rawTerm,
      everydayAnalogy: "Like an electric appliance switch with a clear purpose once you know what it does.",
      plainExplanation: `"${rawTerm}" is just a computer industry word for a routine digital task. You do not need to memorize the name—just what it helps you do.`,
      isDangerousOrPaid: "Usually standard. Always check if a credit card number is asked before proceeding.",
      commonAction: "When this word appears, you can tap Read Aloud or ask Suno to walk you through it.",
    };

    return res.json({ success: true, data: matched, modelUsed: "built-in-dictionary" });
  }
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Suno Beta server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
