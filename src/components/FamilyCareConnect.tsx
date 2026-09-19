import React, { useState, useEffect } from 'react';
import { TrustedContact } from '../types';
import { PhoneCall, UserPlus, Heart, X, Check, PhoneForwarded, MessageSquare, AlertOctagon, Trash2, RotateCcw, ShieldAlert } from 'lucide-react';
import { speechManager } from '../utils/speech';

interface FamilyCareConnectProps {
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

const DEFAULT_CONTACTS: TrustedContact[] = [
  {
    id: '1',
    name: 'Pragya Mishra (Daughter)',
    phoneNumber: '+91 93364 29982',
    relation: 'Daughter',
  },
  {
    id: '2',
    name: 'Santosh Mishra (Husband)',
    phoneNumber: '+91 94155 68099',
    relation: 'Husband',
  },
];

export const FamilyCareConnect: React.FC<FamilyCareConnectProps> = ({
  isOpenAsModal = false,
  onCloseModal,
}) => {
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('suno_trusted_contacts');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If stored contacts only contained old demo contacts Rohan/Priya, upgrade to Pragya & Santosh
          const hasOldData = parsed.some((c: TrustedContact) => 
            c.name?.includes('Rohan') || c.name?.includes('Priya')
          );
          if (hasOldData) {
            return DEFAULT_CONTACTS;
          }
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_CONTACTS;
  });

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [sosSentMessage, setSosSentMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suno_trusted_contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    // Clean phone number
    let cleanPhone = newPhone.trim();
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91 ${cleanPhone}`;
    }

    const newContact: TrustedContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phoneNumber: cleanPhone,
      relation: newRelation.trim() || 'Family',
    };

    setContacts((prev) => [...prev, newContact]);
    setNewName('');
    setNewPhone('');
    setNewRelation('');
    setIsAdding(false);
    speechManager.speak(`Saved ${newContact.name} to your trusted care contacts.`);
  };

  const handleDeleteContact = (id: string, name: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    speechManager.speak(`Removed ${name} from your trusted contacts.`);
  };

  const handleResetDefaults = () => {
    setContacts(DEFAULT_CONTACTS);
    speechManager.speak('Reset contacts to daughter Pragya Mishra and husband Santosh Mishra.');
  };

  const handleTriggerSOS = (contact: TrustedContact) => {
    const rawDigits = contact.phoneNumber.replace(/[^0-9]/g, '');
    const prefilledText = encodeURIComponent(
      `Hello ${contact.relation || 'Beta'}, I am on Suno Beta. I received an alert or need your quick help checking a digital message or transaction before I proceed.`
    );
    const whatsappUrl = `https://wa.me/${rawDigits}?text=${prefilledText}`;

    setSosSentMessage(
      `Suno Beta prepared an alert for ${contact.name}. You can send it instantly via WhatsApp or direct SMS.`
    );
    speechManager.speak(`Prepared quick alert for ${contact.name}. Please stay calm, we are here.`);

    // Open WhatsApp in a separate tab or trigger SMS
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const content = (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200/80 shadow-sm relative space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Family Care & Emergency Protection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Family Care Connect
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            One-touch check-in with your daughter Pragya, husband Santosh, or verified emergency helplines.
          </p>
        </div>

        {isOpenAsModal && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* SOS Feedback Message */}
      {sosSentMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border border-emerald-200 text-xs sm:text-sm flex items-start space-x-2.5 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{sosSentMessage}</p>
          </div>
          <button
            onClick={() => setSosSentMessage(null)}
            className="text-emerald-700 text-xs hover:underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Trusted Contacts List */}
      <div className="space-y-3">
        {contacts.map((contact, idx) => {
          const rawDigits = contact.phoneNumber.replace(/[^0-9]/g, '');
          const whatsappUrl = `https://wa.me/${rawDigits}?text=${encodeURIComponent(
            `Hello ${contact.relation || 'Beta'}, I am on Suno Beta. I received a suspicious message or bill and need your quick check-in.`
          )}`;

          return (
            <div
              key={contact.id}
              className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-stone-50"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-stone-950 text-base sm:text-lg">
                    {contact.name}
                  </span>
                  {idx === 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                      Primary Helper
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                  {contact.phoneNumber} • {contact.relation}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Direct Phone Call */}
                <a
                  href={`tel:${contact.phoneNumber}`}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs sm:text-sm font-bold hover:bg-stone-100 transition-colors shadow-2xs"
                  aria-label={`Call ${contact.name}`}
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Phone</span>
                </a>

                {/* WhatsApp Quick Message */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs"
                  aria-label={`Send WhatsApp to ${contact.name}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Notify for Help (1-touch alert) */}
                <button
                  onClick={() => handleTriggerSOS(contact)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs sm:text-sm font-bold transition-colors shadow-2xs"
                  aria-label={`Notify ${contact.name} for help`}
                >
                  <PhoneForwarded className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Notify for Help</span>
                </button>

                {/* Delete button (only if more than 1 contact) */}
                {contacts.length > 1 && (
                  <button
                    onClick={() => handleDeleteContact(contact.id, contact.name)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    aria-label={`Remove ${contact.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Contact Form & Reset Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-indigo-700 hover:text-indigo-900 p-1"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add another family member or trusted helper</span>
          </button>
        ) : (
          <form onSubmit={handleAddContact} className="w-full p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-stone-900">Add New Trusted Family Member</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pragya Mishra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm bg-white font-medium text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9336429982"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm bg-white font-medium text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Daughter / Husband"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm bg-white font-medium text-stone-900"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-700 text-white text-xs font-bold hover:bg-indigo-800 transition-colors shadow-2xs"
              >
                Save Family Contact
              </button>
            </div>
          </form>
        )}

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors"
          title="Reset to Pragya Mishra and Santosh Mishra"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Family Defaults</span>
        </button>
      </div>

      {/* Official Emergency Helplines (National Safety Net) */}
      <div className="pt-4 border-t border-stone-200">
        <div className="flex items-center space-x-2 text-stone-700 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Verified Senior & Cyber Helplines (Toll-Free, 24/7)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="tel:1930"
            className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 hover:bg-amber-100/70 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-amber-950">Cyber Fraud Helpline</div>
              <div className="text-xs text-amber-800">Financial fraud & unauthorized OTPs</div>
            </div>
            <span className="font-extrabold text-amber-900 text-sm px-2.5 py-1 bg-amber-200/70 rounded-lg">
              1930
            </span>
          </a>

          <a
            href="tel:14567"
            className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 hover:bg-blue-100/70 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-blue-950">Elderline (Senior Helpline)</div>
              <div className="text-xs text-blue-800">Ministry of Social Justice & Care</div>
            </div>
            <span className="font-extrabold text-blue-900 text-sm px-2.5 py-1 bg-blue-200/70 rounded-lg">
              14567
            </span>
          </a>

          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 hover:bg-rose-100/70 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-rose-950">National Emergency</div>
              <div className="text-xs text-rose-800">Police, Ambulance, Immediate Safety</div>
            </div>
            <span className="font-extrabold text-rose-900 text-sm px-2.5 py-1 bg-rose-200/70 rounded-lg">
              112
            </span>
          </a>
        </div>
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity overflow-y-auto"
        onClick={onCloseModal}
      >
        <div className="max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="family" className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {content}
    </section>
  );
};
