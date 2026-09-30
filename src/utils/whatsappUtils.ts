import { ChatMessage, Language } from '../types';

export interface WhatsAppFormatOptions {
  includeSources?: boolean;
  language?: Language;
  customNote?: string;
  portalName?: string;
}

/**
 * Normalizes and validates a phone number with country code for WhatsApp wa.me API
 */
export function cleanWhatsAppPhoneNumber(phone: string, countryCode: string = '91'): {
  isValid: boolean;
  formattedNumber: string;
  displayNumber: string;
  error?: string;
} {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      formattedNumber: '',
      displayNumber: '',
      error: 'Please enter a phone number'
    };
  }

  // Remove all non-digits except a leading plus
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');
  let cc = countryCode.replace(/\D/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // If user entered a 10-digit number without country code
  if (cleaned.length === 10 && !cleaned.startsWith(cc)) {
    cleaned = `${cc}${cleaned}`;
  }

  // Validate length (standard international phone numbers are between 8 and 15 digits)
  if (cleaned.length < 8 || cleaned.length > 16) {
    return {
      isValid: false,
      formattedNumber: cleaned,
      displayNumber: `+${cleaned}`,
      error: 'Invalid phone number length. Please enter a valid mobile number.'
    };
  }

  return {
    isValid: true,
    formattedNumber: cleaned,
    displayNumber: `+${cleaned}`
  };
}

/**
 * Formats the entire conversation messages into an elegant, readable WhatsApp markdown message
 */
export function formatChatForWhatsApp(
  messages: ChatMessage[],
  options: WhatsAppFormatOptions = {}
): string {
  const {
    includeSources = true,
    language = 'en',
    customNote = '',
    portalName = 'SahakarSetu (सहकार सेतु)'
  } = options;

  const isHi = language === 'hi';
  const now = new Date();
  const dateStr = now.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString(isHi ? 'hi-IN' : 'en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const lines: string[] = [];

  // Official Header
  lines.push(`🏛️ *${portalName}*`);
  lines.push(`_${isHi ? 'सहकारिता मंत्रालय एवं वैधानिक सहायता पोर्टल' : 'Ministry of Cooperation & Statutory Legal Assistance'}_`);
  lines.push(`📅 *${isHi ? 'दिनांक' : 'Date'}:* ${dateStr} • ${timeStr}`);
  if (customNote.trim()) {
    lines.push(`📌 *${isHi ? 'विशेष टिप्पणी' : 'Note'}:* ${customNote.trim()}`);
  }
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);

  // Filter out system or empty messages
  const convo = messages.filter(m => m.text && m.text.trim().length > 0);

  if (convo.length === 0) {
    lines.push(`_No chat messages recorded._`);
  } else {
    let qIndex = 1;
    let aIndex = 1;

    for (let i = 0; i < convo.length; i++) {
      const msg = convo[i];

      if (msg.role === 'user') {
        lines.push(``);
        lines.push(`👤 *Q${qIndex}:* ${msg.text.trim()}`);
        qIndex++;
      } else if (msg.role === 'assistant') {
        lines.push(``);
        const ansText = msg.structured?.answer || msg.text || '';
        lines.push(`🤖 *${isHi ? 'वैधानिक उत्तर' : 'Statutory Answer'} [A${aIndex}]:*`);
        lines.push(ansText.trim());

        // Structured important notes if available
        if (msg.structured?.importantNotes && msg.structured.importantNotes.length > 0) {
          lines.push(``);
          lines.push(`📌 *${isHi ? 'महत्वपूर्ण वैधानिक शर्तें व निर्देश' : 'Important Rules & Statutory Notes'}:*`);
          msg.structured.importantNotes.forEach(note => {
            lines.push(`• ${note.trim()}`);
          });
        }

        // Sources & Citations from msg.structured?.sources
        const sources = msg.structured?.sources;
        if (includeSources && sources && sources.length > 0) {
          lines.push(``);
          lines.push(`📜 *${isHi ? 'सत्यापित स्रोत व धाराएं' : 'Verified Citations'}:*`);
          sources.slice(0, 3).forEach((src, sIdx) => {
            const secStr = src.section ? ` (${src.section})` : '';
            lines.push(`${sIdx + 1}. *${src.documentName || src.title}*${secStr}`);
            if (src.officialUrl && src.officialUrl.startsWith('http')) {
              lines.push(`   🔗 ${src.officialUrl}`);
            }
          });
        }

        aIndex++;
        lines.push(`━━━━━━━━━━━━━━━━━━━━`);
      }
    }
  }

  // Footer Disclaimer
  lines.push(``);
  lines.push(`🇮🇳 _${isHi ? 'सहकार सेतु पोर्टल द्वारा जनहित में सत्यापित एवं प्रेषित' : 'Verified & Exported from SahakarSetu Statutory Portal'}_`);
  lines.push(`🌐 https://cooperation.gov.in`);

  return lines.join('\n');
}

/**
 * Builds the WhatsApp direct send URL
 */
export function createWhatsAppShareUrl(phoneNumber: string | undefined, text: string): string {
  const encodedText = encodeURIComponent(text);
  
  if (phoneNumber && phoneNumber.trim()) {
    const cleanNum = phoneNumber.trim().replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=${encodedText}`;
  }
  
  // General share picker
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Triggers a download of the full chat as a .txt file
 */
export function downloadChatTranscriptFile(
  messages: ChatMessage[],
  filename: string = 'SahakarSetu-Chat-Transcript.txt',
  options: WhatsAppFormatOptions = {}
): void {
  const content = formatChatForWhatsApp(messages, options);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
