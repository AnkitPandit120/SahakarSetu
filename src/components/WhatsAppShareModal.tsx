import React, { useState, useMemo } from 'react';
import {
  X,
  Send,
  Phone,
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { ChatMessage, Language, UserProfile } from '../types';
import {
  cleanWhatsAppPhoneNumber,
  formatChatForWhatsApp,
  createWhatsAppShareUrl,
  downloadChatTranscriptFile
} from '../utils/whatsappUtils';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  language: Language;
  user: UserProfile | null;
}

const COUNTRY_CODES = [
  { code: '91', country: 'India (+91)', flag: '🇮🇳' },
  { code: '977', country: 'Nepal (+977)', flag: '🇳🇵' },
  { code: '880', country: 'Bangladesh (+880)', flag: '🇧🇩' },
  { code: '971', country: 'UAE (+971)', flag: '🇦🇪' },
  { code: '966', country: 'Saudi Arabia (+966)', flag: '🇸🇦' },
  { code: '1', country: 'USA / Canada (+1)', flag: '🇺🇸' },
  { code: '44', country: 'United Kingdom (+44)', flag: '🇬🇧' },
  { code: '61', country: 'Australia (+61)', flag: '🇦🇺' },
  { code: '65', country: 'Singapore (+65)', flag: '🇸🇬' }
];

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  messages,
  language,
  user
}) => {
  const isHi = language === 'hi';

  const [countryCode, setCountryCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [includeSources, setIncludeSources] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-fill user phone if available on initial open
  React.useEffect(() => {
    if (user?.mobile && !phoneNumber) {
      setPhoneNumber(user.mobile.replace(/\D/g, '').slice(-10));
    }
  }, [user]);

  // Generate formatted WhatsApp text based on current options
  const formattedText = useMemo(() => {
    return formatChatForWhatsApp(messages, {
      includeSources,
      language,
      customNote: customNote.trim()
    });
  }, [messages, includeSources, language, customNote]);

  if (!isOpen) return null;

  const handleSendToNumber = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const validation = cleanWhatsAppPhoneNumber(phoneNumber, countryCode);

    if (!validation.isValid) {
      setValidationError(
        validation.error ||
          (isHi
            ? 'कृपया एक मान्य मोबाइल नंबर दर्ज करें।'
            : 'Please enter a valid phone number.')
      );
      return;
    }

    const shareUrl = createWhatsAppShareUrl(validation.formattedNumber, formattedText);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareGeneral = () => {
    const shareUrl = createWhatsAppShareUrl('', formattedText);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTranscript = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadChatTranscriptFile(
      messages,
      `SahakarSetu-Chat-Transcript-${timestamp}.txt`,
      { includeSources, language, customNote }
    );
  };

  const charCount = formattedText.length;
  const isLargeText = charCount > 3500;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="whatsapp-share-modal"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header with WhatsApp Brand Identity */}
        <div className="bg-[#128C7E] text-white p-5 sm:p-6 relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
              {/* WhatsApp SVG Icon */}
              <svg
                className="w-6 h-6 fill-current text-white"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.18-.175.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.234-.244-.588-.493-.508-.677-.518-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.14 4.544.718.31 1.278.495 1.716.634.721.23 1.378.197 1.897.12.577-.087 1.78-.727 2.03-1.43.251-.703.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.545 2 2.08 6.465 2.08 11.96c0 1.838.497 3.562 1.365 5.05L2 22l5.147-1.352a9.92 9.92 0 004.893 1.272c5.495 0 9.96-4.465 9.96-9.96S17.535 2 12.04 2zm0 18.173a8.21 8.21 0 01-4.19-1.144l-.3-.178-3.115.818.832-3.036-.195-.312a8.22 8.22 0 01-1.262-4.36c0-4.54 3.693-8.233 8.23-8.233 4.537 0 8.23 3.693 8.23 8.233 0 4.54-3.693 8.232-8.23 8.232z" />
              </svg>
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                {isHi ? 'व्हाट्सएप पर पूरी बातचीत भेजें' : 'Send Full Chat to WhatsApp'}
              </h3>
              <p className="text-emerald-100 text-xs mt-0.5 font-medium">
                {isHi
                  ? 'नंबर टाइप करें या किसी भी संपर्क/ग्रुप को वैधानिक सारांश भेजें'
                  : 'Type a mobile number or select any WhatsApp contact/group'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-emerald-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Phone Number Input Form */}
          <form onSubmit={handleSendToNumber} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isHi ? 'प्राप्तकर्ता का व्हाट्सएप नंबर' : 'Recipient WhatsApp Phone Number'}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {isHi ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
                </span>
              </label>

              <div className="flex gap-2">
                {/* Country Code Select */}
                <div className="relative shrink-0 w-32">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="w-full h-11 pl-2.5 pr-6 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} +{c.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-4 pointer-events-none" />
                </div>

                {/* Mobile Number Input */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    id="whatsapp-phone-input"
                    value={phoneNumber}
                    onChange={e => {
                      setPhoneNumber(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    placeholder={isHi ? 'उदा. 9876543210' : 'e.g. 9876543210'}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] transition-all"
                  />
                  {phoneNumber && (
                    <button
                      type="button"
                      onClick={() => setPhoneNumber('')}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Validation error message */}
              {validationError && (
                <div className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Custom Note/Reference (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isHi ? 'विशेष संदेश या संदर्भ (वैकल्पिक)' : 'Custom Note or Reference (Optional)'}</span>
                </span>
              </label>
              <input
                type="text"
                value={customNote}
                onChange={e => setCustomNote(e.target.value)}
                placeholder={
                  isHi
                    ? 'उदा. पर्थक ऋण सब्सिडी नियम व किसान सहायता संदर्भ'
                    : 'e.g. Forwarding PACS crop loan rules to Secretary'
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366]"
              />
            </div>

            {/* Formatting Options */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={e => setIncludeSources(e.target.checked)}
                  className="rounded border-slate-300 text-[#128C7E] focus:ring-[#25D366] w-4 h-4"
                />
                <span>{isHi ? 'वैधानिक धाराएं व सरकारी लिंक शामिल करें' : 'Include Statutory Acts & Official Citations'}</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {messages.length} {isHi ? 'संदेश' : 'messages'}
              </span>
            </div>

            {/* Primary Action Button: Send directly to typed number */}
            <button
              type="submit"
              id="whatsapp-send-direct-btn"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>
                {phoneNumber.trim()
                  ? isHi
                    ? `+${countryCode} ${phoneNumber.trim()} पर व्हाट्सएप भेजें`
                    : `Send to +${countryCode} ${phoneNumber.trim()} on WhatsApp`
                  : isHi
                  ? 'व्हाट्सएप चैट खोलें व भेजें'
                  : 'Open WhatsApp & Send Full Chat'}
              </span>
            </button>
          </form>

          {/* Secondary Quick Action Buttons Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
            {/* Share to Any WhatsApp Contact (picker) */}
            <button
              type="button"
              onClick={handleShareGeneral}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#128C7E] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/80 cursor-pointer"
              title="Share to any WhatsApp Contact / Group"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'अन्य संपर्क चुनें' : 'Pick Any Contact'}</span>
            </button>

            {/* Copy Formatted Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isHi ? 'कॉपी हो गया!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isHi ? 'टेक्स्ट कॉपी करें' : 'Copy Text'}</span>
                </>
              )}
            </button>

            {/* Download Transcript .txt */}
            <button
              type="button"
              onClick={handleDownloadTranscript}
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHi ? 'फाइल डाउनलोड (.txt)' : 'Download (.txt)'}</span>
            </button>
          </div>

          {/* WhatsApp Message Preview Box */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{isHi ? 'व्हाट्सएप संदेश पूर्वावलोकन' : 'WhatsApp Message Preview'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                {showFullPreview
                  ? isHi ? 'संक्षिप्त करें' : 'Collapse'
                  : isHi ? 'पूरा पूर्वावलोकन देखें' : 'View Full Preview'}
              </button>
            </div>

            {/* Simulated WhatsApp Bubble Container */}
            <div className="bg-[#EFEAE2] p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner">
              <div
                className={`bg-white rounded-xl p-3 text-[11px] font-sans text-slate-800 leading-relaxed shadow-xs whitespace-pre-wrap font-mono overflow-y-auto ${
                  showFullPreview ? 'max-h-64' : 'max-h-28'
                }`}
              >
                {formattedText}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
                <span>
                  {charCount} {isHi ? 'वर्ण (Characters)' : 'characters'}
                </span>
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isHi ? 'वैधानिक रूप से स्वरूपित' : 'Statutory Formatted'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
            <span>{isHi ? 'मोबाइल और वेब दोनों व्हाट्सएप समर्थित' : 'Supports WhatsApp Web & Mobile App'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer text-xs"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
