import { config } from '../config/env';

// Verified ElevenLabs premade voices that are fully accessible on the standard tier
export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'female' | 'male';
  accent: string;
  recommendedFor: string;
}

export const ELEVEN_VOICES: VoiceProfile[] = [
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah (Recommended)',
    gender: 'female',
    accent: 'Warm & Natural',
    recommendedFor: 'Multilingual Indic (Hindi, Marathi, Bengali, English)'
  },
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    gender: 'female',
    accent: 'Clear & Engaging',
    recommendedFor: 'Educational & Public Scheme Guidance'
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    gender: 'male',
    accent: 'Warm & Grounded',
    recommendedFor: 'Farmer & Advisory Guidance'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    gender: 'male',
    accent: 'Authoritative & Firm',
    recommendedFor: 'Statutory Rules & Legal Provisions'
  },
  {
    id: 'nPczCjzI2devNBz1zQrb',
    name: 'Brian',
    gender: 'male',
    accent: 'Deep & Comforting',
    recommendedFor: 'General Help & Grievance Redressal'
  }
];

export const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

/**
 * Clean text for natural speech synthesis
 */
export function cleanTextForTTS(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove bold and italic markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown bullet points and numbering with clean pause
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
    .replace(/₹/g, ' रुपये ')
    .replace(/Rs\./gi, ' रुपये ')
    .replace(/%/g, ' प्रतिशत ')
    .replace(/&/g, ' और ')
    .replace(/;\s*/g, '. ')
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./g, '.')
    .trim();
}

/**
 * Generate speech audio stream using ElevenLabs API
 */
export async function generateElevenLabsSpeech(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID
): Promise<Buffer> {
  const apiKey = config.elevenLabsApiKey;
  if (!apiKey) {
    throw new Error('ElevenLabs API key is not configured on the server.');
  }

  const cleanedText = cleanTextForTTS(text);
  if (!cleanedText) {
    throw new Error('Text to synthesize is empty after normalization.');
  }

  // ElevenLabs character ceiling per request
  const safeText = cleanedText.length > 2500 ? cleanedText.substring(0, 2490) + '...' : cleanedText;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=2`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: safeText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.50,
        similarity_boost: 0.80,
        style: 0.05,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
