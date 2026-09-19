import React, { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Volume2, Copy, Check, ArrowRight, Upload, FileText, RefreshCw, X, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { ScamAnalysisResult } from '../types';
import { speechManager } from '../utils/speech';

export const ScamDecoder: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [contextType, setContextType] = useState('sms');
  const [uploadedImage, setUploadedImage] = useState<{
    base64: string;
    name: string;
    mimeType: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleMessages = [
    {
      label: 'Electricity Cutoff SMS',
      type: 'sms',
      text: 'URGENT: Dear consumer, your electricity connection will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Immediately call electricity officer at 9876543210 to avoid disconnection.',
    },
    {
      label: 'Bank KYC Blocked Link',
      type: 'sms',
      text: 'Dear Customer, your SBI NetBanking account is suspended today due to missing PAN/Aadhaar KYC. Please click immediately on http://bit.ly/sbi-verify-kyc-today to avoid permanent account block and penalty.',
    },
    {
      label: 'WhatsApp Prize Draw',
      type: 'whatsapp',
      text: 'CONGRATULATIONS!! Your mobile number has been selected as the 1st prize winner of $25,000 in International Mobile Lottery. Send your bank passbook photo and $25 processing fee to release payment immediately.',
    },
    {
      label: 'Doctor Appointment (Safe)',
      type: 'sms',
      text: 'Reminder: Your appointment with Dr. Mehta at City Care Clinic is confirmed for tomorrow, Thursday at 10:30 AM. Please arrive 15 minutes before time. No prior payment required.',
    },
  ];

  const handleSelectSample = (sample: typeof sampleMessages[0]) => {
    setInputText(sample.text);
    setContextType(sample.type);
    setUploadedImage(null);
    setErrorMsg(null);
  };

  const processFile = (file: File) => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedImage({
          base64,
          name: file.name,
          mimeType: file.type || 'image/jpeg',
        });
        setErrorMsg(null);
      };
      reader.onerror = () => {
        setErrorMsg('Failed to read uploaded image. Please try again.');
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target?.result as string);
        setErrorMsg(null);
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Please upload an image (PNG, JPG, WebP) or plain text screenshot.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !uploadedImage) {
      setErrorMsg('Please paste a message or upload an image screenshot for Suno Beta to check.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-screen-or-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: inputText,
          contextType,
          imageBase64: uploadedImage?.base64,
          mimeType: uploadedImage?.mimeType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to inspect message.');
      }

      setResult({
        ...data.data,
        sourceText: inputText || `[Analyzed Screenshot: ${uploadedImage?.name}]`,
        checkedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      if (data.data?.spokenScript) {
        speechManager.speak(data.data.spokenScript);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to check message right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyForFamily = () => {
    if (!result) return;
    const summary = `*Suno Beta Safety Check*\nVerdict: ${result.verdict.toUpperCase()}\nHeadline: ${result.headline}\nExplanation: ${result.plainEnglishMeaning}\nMessage: "${result.sourceText}"`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppAlertFamily = () => {
    if (!result) return;
    const summary = encodeURIComponent(
      `Hello, Suno Beta checked this message for me:\n*Verdict:* ${result.verdict.toUpperCase()}\n*Headline:* ${result.headline}\n*Meaning:* ${result.plainEnglishMeaning}\nPlease check this with me when you are free.`
    );
    // WhatsApp sharing with family helper
    const url = `https://wa.me/?text=${summary}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="scam-decoder" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Multimodal Message & Screenshot Shield</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Check a Message or Bill
        </h2>
        <p className="mt-2 text-base text-stone-600">
          Paste any confusing text, link, or drag-and-drop a screenshot. Suno Beta will analyze it calmly without rush.
        </p>
      </div>

      {/* Main Elevated Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-sm relative space-y-6">
        {/* Sample Presets */}
        <div>
          <span className="text-xs font-semibold text-stone-500 block mb-2.5">
            Or test with a common real-world message:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone & Text Input Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 transition-all p-2 ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-stone-200 bg-stone-50/40'
          }`}
        >
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste the SMS, WhatsApp message, or website link here (or drag and drop a screenshot image)..."
            className="w-full p-4 rounded-xl border-none text-stone-900 text-base sm:text-lg placeholder:text-stone-400 focus:ring-0 bg-transparent resize-y leading-relaxed font-medium"
            aria-label="Message content or screenshot text to verify"
          />

          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="absolute right-4 top-4 text-xs font-semibold text-stone-400 hover:text-stone-700 px-2 py-1 bg-white rounded-lg border border-stone-200"
            >
              Clear Text
            </button>
          )}

          {/* Uploaded Image Thumbnail Preview */}
          {uploadedImage && (
            <div className="m-3 p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between animate-fade-in shadow-2xs">
              <div className="flex items-center space-x-3">
                <img
                  src={uploadedImage.base64}
                  alt="Uploaded screenshot"
                  className="w-14 h-14 object-cover rounded-lg border border-stone-200"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{uploadedImage.name}</span>
                  </div>
                  <div className="text-xs text-stone-500">
                    Ready for Multimodal Vision Inspection
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUploadedImage(null)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                title="Remove image"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Controls & Drag Hint */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-1">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Upload Screenshot or Bill Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-stone-400 hidden sm:inline">
              Drag & Drop file supported
            </span>
          </div>
          <span>Confidential & Private • Gemini Vision Enabled</span>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-sm font-semibold border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-base shadow-sm transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking safety with Gemini...</span>
              </>
            ) : (
              <>
                <span>Check message safety</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Analysis Result Card */}
        {result && (
          <div className="mt-8 pt-8 border-t border-stone-100 animate-fade-in space-y-6">
            {/* Verdict Banner */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition-all flex items-start space-x-4 ${
                result.verdict === 'scam_danger'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : result.verdict === 'caution'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {result.verdict === 'scam_danger' && (
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                )}
                {result.verdict === 'caution' && (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
                {result.verdict === 'safe' && (
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {result.verdict === 'scam_danger'
                      ? 'Likely Fraud / Scam'
                      : result.verdict === 'caution'
                      ? 'Proceed With Caution'
                      : 'Legitimate & Safe'}
                  </span>
                  <span className="text-xs text-stone-500">• Checked at {result.checkedAt}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {result.headline}
                </h3>
              </div>

              <button
                onClick={() => speechManager.speak(result.spokenScript)}
                className="shrink-0 p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 shadow-2xs"
                title="Listen to explanation"
                aria-label="Read explanation aloud"
              >
                <Volume2 className="w-4 h-4 text-indigo-700" />
              </button>
            </div>

            {/* Plain English Meaning */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                What this message means in plain words:
              </h4>
              <p className="text-base sm:text-lg text-stone-900 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200 font-medium">
                {result.plainEnglishMeaning}
              </p>
            </div>

            {/* Recommended Action Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                What you should do:
              </h4>
              <div className="space-y-2">
                {result.actionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-white border border-stone-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base text-stone-800 font-semibold">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags Observed */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Key clues noticed:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.redFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200"
                    >
                      • {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar (Share with Family Helper) */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyForFamily}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Copied report for family</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-stone-600" />
                      <span>Copy summary</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppAlertFamily}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs"
                  aria-label="Send check report to family helper on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to Family (WhatsApp)</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setInputText('');
                  setUploadedImage(null);
                  setResult(null);
                }}
                className="text-xs sm:text-sm text-stone-500 hover:text-stone-900 font-bold"
              >
                Check another message
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
