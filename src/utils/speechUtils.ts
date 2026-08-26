import { Language } from '../types';

export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  lang: string;
  name: string;
}

// Acronym and legal abbreviations dictionary for fluent speech synthesis in English and regional languages
const SPOKEN_NORMALIZATIONS: Record<string, string> = {
  'PACS': 'P.A.C.S. Primary Agricultural Credit Society',
  'PMFBY': 'P.M. Fasal Bima Yojana',
  'KCC': 'Kisan Credit Card',
  'CRCS': 'Central Registrar of Cooperative Societies',
  'NABARD': 'Nabard National Bank for Agriculture and Rural Development',
  'MSCS': 'Multi State Cooperative Societies',
  'DCCB': 'District Central Cooperative Bank',
  'StCB': 'State Cooperative Bank',
  'FPO': 'Farmer Producer Organization',
  'SHG': 'Self Help Group',
  '₹': 'Rupees ',
  'Rs.': 'Rupees ',
  'e.g.': 'for example',
  'i.e.': 'that is',
  'etc.': 'and so on',
  'w.r.t.': 'with respect to',
  'u/s': 'under section',
  'Sec.': 'Section',
  'Cl.': 'Clause',
  'Art.': 'Article',
  'Govt.': 'Government',
  'Min.': 'Ministry of',
  'Co-op': 'Cooperative',
  'co-op': 'cooperative',
};

// Clean markdown, abbreviations, legal citations, and symbols for natural, fluent speech flow
export function cleanTextForSpeech(rawText: string, lang: Language = 'en'): string {
  if (!rawText) return '';

  let text = rawText
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove bold and italic markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown bullet points and numbering with clear pause
    .replace(/^\s*[-*•]\s+/gm, '. ')
    .replace(/^\s*\d+\.\s+/gm, '. ')
    // Remove code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Expand mathematical and currency symbols
    .replace(/%/g, ' percent')
    .replace(/&/g, ' and ')
    .replace(/\//g, ' or ')
    .replace(/\+/g, ' plus ');

  // English-specific normalizations for acronyms and statutory references
  if (lang === 'en') {
    Object.entries(SPOKEN_NORMALIZATIONS).forEach(([abbr, expansion]) => {
      const regex = new RegExp(`\\b${abbr}\\b`, 'g');
      text = text.replace(regex, expansion);
    });
  }

  // Smooth out punctuation pauses
  return text
    // Replace multiple newlines or semicolon lists with clean sentence boundaries
    .replace(/;\s*/g, '. ')
    .replace(/\n+/g, '. ')
    // Ensure commas have trailing space for natural breath pauses
    .replace(/,([^\s])/g, ', $1')
    // Ensure clean sentence dots
    .replace(/\.{2,}/g, '.')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./g, '.')
    .trim();
}

// Map portal language code to BCP-47 speech tags
export function getLanguageCode(lang: Language): string {
  switch (lang) {
    case 'hi':
      return 'hi-IN';
    case 'mr':
      return 'mr-IN';
    case 'bn':
      return 'bn-IN';
    case 'en':
    default:
      return 'en-IN';
  }
}

// Find the highest quality, most natural sounding neural / natural browser voice
export function getBestVoice(lang: Language): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = getLanguageCode(lang).toLowerCase();
  const langPrefix = targetLang.split('-')[0];

  // Preference list for premium natural / neural voices
  const naturalKeywords = [
    'natural',
    'neural',
    'google',
    'premium',
    'enhanced',
    'siri',
    'veena',
    'neerja',
    'swara',
    'madhur',
    'kalpana',
    'hemant',
    'ananya',
    'geeta'
  ];

  // Score available voices based on language precision and neural quality
  const scoredVoices = voices.map((voice) => {
    let score = 0;
    const vLang = voice.lang.toLowerCase();
    const vName = voice.name.toLowerCase();

    // Language matching
    if (vLang === targetLang) {
      score += 100;
    } else if (vLang.replace('_', '-').startsWith(targetLang)) {
      score += 80;
    } else if (vLang.startsWith(langPrefix)) {
      score += 50;
    }

    // Natural / Neural voice priority
    for (const keyword of naturalKeywords) {
      if (vName.includes(keyword)) {
        score += 25;
      }
    }

    // Indian regional accent affinity
    if (vName.includes('india') || vLang.includes('in')) {
      score += 15;
    }

    // Prefer non-local or online high-quality synthesizers if available
    if (voice.localService === false) {
      score += 10;
    }

    // Default flag
    if (voice.default && (vLang.startsWith(langPrefix) || lang === 'en')) {
      score += 5;
    }

    return { voice, score };
  });

  scoredVoices.sort((a, b) => b.score - a.score);

  if (scoredVoices.length > 0 && scoredVoices[0].score > 0) {
    return scoredVoices[0].voice;
  }

  // Fallback to first available
  return voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) || voices[0] || null;
}

// Split long text into fluent conversational sentence chunks so SpeechSynthesis never clips or rushes
function splitIntoFluentChunks(text: string, maxLength = 160): string[] {
  if (!text) return [];
  // Split on full stops, exclamation, question marks, or double breaks
  const rawSentences = text.match(/[^.!?।\n]+[.!?।\n]+/g) || [text];
  const chunks: string[] = [];

  let currentChunk = '';
  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length < maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + trimmed;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (trimmed.length > maxLength) {
        // Break on commas or conjunctions if a single sentence is exceedingly long
        const parts = trimmed.split(/,\s*/);
        let subChunk = '';
        for (const p of parts) {
          if (subChunk.length + p.length < maxLength) {
            subChunk += (subChunk ? ', ' : '') + p;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = p;
          }
        }
        if (subChunk) currentChunk = subChunk;
      } else {
        currentChunk = trimmed;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks.length > 0 ? chunks : [text];
}

export class PortalSpeaker {
  private static isCurrentlySpeaking = false;
  private static onStateChangeListeners: Set<(isSpeaking: boolean, currentMessageId?: string) => void> = new Set();
  private static activeMessageId: string | null = null;
  private static currentChunks: string[] = [];
  private static chunkIndex = 0;
  private static abortController: boolean = false;

  public static subscribe(listener: (isSpeaking: boolean, currentMessageId?: string) => void): () => void {
    this.onStateChangeListeners.add(listener);
    listener(this.isCurrentlySpeaking, this.activeMessageId || undefined);
    return () => {
      this.onStateChangeListeners.delete(listener);
    };
  }

  private static notify(isSpeaking: boolean, messageId?: string) {
    this.isCurrentlySpeaking = isSpeaking;
    this.activeMessageId = isSpeaking ? (messageId || null) : null;
    this.onStateChangeListeners.forEach(listener => listener(isSpeaking, this.activeMessageId || undefined));
  }

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public static speak(
    text: string,
    lang: Language,
    messageId?: string,
    rate = 0.95,
    onEndCallback?: () => void,
    onErrorCallback?: (err: any) => void
  ): void {
    if (!this.isSupported()) {
      console.warn('Speech synthesis is not supported on this device/browser.');
      return;
    }

    // Cancel any ongoing speech first
    this.stop();
    this.abortController = false;

    const cleaned = cleanTextForSpeech(text, lang);
    if (!cleaned) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Divide into smooth, natural sentence chunks to eliminate robotic clipping and ensure natural pauses
    this.currentChunks = splitIntoFluentChunks(cleaned);
    this.chunkIndex = 0;

    const voice = getBestVoice(lang);
    const targetLangCode = getLanguageCode(lang);

    // Fluent rate: 0.92x to 0.98x provides natural human cadence in Indian languages
    const fluentRate = lang === 'en' ? Math.max(0.85, Math.min(rate, 1.1)) : Math.max(0.8, Math.min(rate * 0.92, 1.0));
    const fluentPitch = 1.02; // Warm, friendly pitch

    const playNextChunk = () => {
      if (this.abortController) {
        this.notify(false);
        return;
      }

      if (this.chunkIndex >= this.currentChunks.length) {
        this.notify(false);
        if (onEndCallback) onEndCallback();
        return;
      }

      const chunkText = this.currentChunks[this.chunkIndex];
      this.chunkIndex++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.lang = targetLangCode;
      utterance.rate = fluentRate;
      utterance.pitch = fluentPitch;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.notify(true, messageId);
      };

      utterance.onend = () => {
        // Natural mini-pause (120ms) between sentences for human-like fluency
        if (!this.abortController && this.chunkIndex < this.currentChunks.length) {
          setTimeout(playNextChunk, 120);
        } else {
          this.notify(false);
          if (onEndCallback) onEndCallback();
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis chunk error:', e);
        }
        if (!this.abortController && this.chunkIndex < this.currentChunks.length) {
          setTimeout(playNextChunk, 100);
        } else {
          this.notify(false);
          if (onErrorCallback) onErrorCallback(e);
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech playback trigger failed:', e);
        this.notify(false);
      }
    };

    playNextChunk();
  }

  public static pause(): void {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public static resume(): void {
    if (this.isSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public static stop(): void {
    this.abortController = true;
    this.currentChunks = [];
    this.chunkIndex = 0;
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Safe catch
      }
    }
    this.notify(false);
  }

  public static getActiveMessageId(): string | null {
    return this.activeMessageId;
  }

  public static isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }
}

