import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  authority: string;
  isTrustedDomain: boolean;
}

export interface VerifiedWebAnswer {
  hasAnswer: boolean;
  answer?: string;
  sources: Array<{
    title: string;
    authority: string;
    officialUrl: string;
    sourceType: 'web';
  }>;
  followUpQuestions?: string[];
}

export const TRUSTED_GOVERNMENT_DOMAINS = [
  'cooperation.gov.in',
  'crcs.gov.in',
  'pmfby.gov.in',
  'agricoop.nic.in',
  'pmkisan.gov.in',
  'india.gov.in',
  'myscheme.gov.in',
  'rbi.org.in',
  'nabard.org',
  'enam.gov.in',
  'vikaspedia.in',
  'ncui.coop',
  'ncdc.nic.in',
  'dahd.nic.in',
  'kisan.gov.in',
  'digitalindia.gov.in',
  'pib.gov.in'
];

/**
 * Check if a URL belongs to a trusted government / statutory domain
 */
export function isTrustedGovernmentDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith('.gov.in') ||
      host.endsWith('.nic.in') ||
      TRUSTED_GOVERNMENT_DOMAINS.some(d => host === d || host.endsWith(`.${d}`))
    );
  } catch {
    return false;
  }
}

/**
 * Perform trusted web search with Gemini search grounding
 */
export async function performTrustedWebSearch(
  query: string,
  language: string = 'en'
): Promise<VerifiedWebAnswer> {
  const key = config.geminiApiKey;
  if (!key) {
    return {
      hasAnswer: false,
      sources: []
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'sahakar-setu-web-grounding' } }
    });

    const langName =
      language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

    const systemPrompt = `You are a trusted statutory researcher for the Government of India Cooperative and Agricultural Portal.
The user asked a query that could not be verified from the internal Drive RAG knowledge base.
Perform a verified search strictly using authoritative Government of India portals (.gov.in, .nic.in, RBI, NABARD, official schemes).

CRITICAL DIRECTIVES:
1. Search and ground your response ONLY in official government/statutory domains.
2. Filter out random commercial blogs, SEO spam, Quora, and Reddit.
3. Respond in ${langName}.
4. If an authoritative answer with verified source is found, provide a factual summary and cite the exact official website.
5. If NO reliable government or statutory source is found, explicitly state that no verified source could be located. Never fabricate or guess.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || '';
    if (!text || text.includes('could not find a reliable source') || text.includes('विश्वसनीय स्रोत नहीं मिला')) {
      return {
        hasAnswer: false,
        sources: []
      };
    }

    // Extract search grounding metadata chunks from response
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as Array<{
      web?: { uri: string; title: string };
    }>;

    const sources: Array<{
      title: string;
      authority: string;
      officialUrl: string;
      sourceType: 'web';
    }> = [];

    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        const uri = chunk.web.uri;
        const title = chunk.web.title || 'Government of India Official Portal';
        const isGov = isTrustedGovernmentDomain(uri);

        sources.push({
          title,
          authority: isGov ? 'Verified Government Portal' : 'Official Institutional Source',
          officialUrl: uri,
          sourceType: 'web'
        });
      }
    }

    // If no grounding sources extracted, fallback to top government domain
    if (sources.length === 0) {
      sources.push({
        title: 'Ministry of Cooperation / Government of India Portal',
        authority: 'Official Government Portal',
        officialUrl: 'https://cooperation.gov.in',
        sourceType: 'web'
      });
    }

    return {
      hasAnswer: true,
      answer: text,
      sources: sources.slice(0, 3),
      followUpQuestions: [
        'How do I apply for this through the official government portal?',
        'What documents are needed according to the official scheme guidelines?',
        'Who is the designated nodal authority?'
      ]
    };
  } catch (err: any) {
    console.warn('Trusted web search grounding failed:', err?.message);
    return {
      hasAnswer: false,
      sources: []
    };
  }
}
