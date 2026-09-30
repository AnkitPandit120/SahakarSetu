import { GoogleGenAI, Type } from '@google/genai';
import { config } from '../config/env';
import { SearchResultChunk } from './vectorService';
import { generateGroqRAGAnswer } from './groqService';

export interface ChatAnswerResponse {
  answer: string;
  sourceType: 'rag' | 'web';
  sources: Array<{
    title: string;
    authority: string;
    page?: number | string;
    section?: string;
    driveUrl?: string;
    officialUrl?: string;
    sourceType?: 'rag' | 'web';
  }>;
  followUpQuestions: string[];
}

/**
 * Synthesize grounded RAG answer from retrieved chunks using Gemini
 */
export async function generateGroundedRAGAnswer(
  question: string,
  language: string,
  chunks: SearchResultChunk[]
): Promise<ChatAnswerResponse> {
  const key = config.geminiApiKey;
  const langName =
    language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

  // Format context cleanly with exact page and section references
  const contextString = chunks
    .map((c, i) => {
      return `[DOCUMENT ${i + 1}]
File Name: ${c.fileName}
Category: ${c.category}
Authority: ${c.authority}
Page Number: ${c.pageNumber}
Section / Clause: ${c.section || c.clause || c.heading || 'General Provisions'}
Google Drive Link: ${c.driveUrl}
Official Link: ${c.officialUrl || 'https://cooperation.gov.in'}
Content:
${c.text}`;
    })
    .join('\n\n---\n\n');

  if (key) {
    try {
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: { headers: { 'User-Agent': 'sahakar-setu-rag-generation' } }
      });

      const systemPrompt = `You are the official public-service legal & cooperative assistant for "SahakarSetu" (Government of India Cooperative Governance & Rural Legal Portal).

CRITICAL DIRECTIVES:
1. Target Audience: Farmers, cooperative members, rural citizens, PACS committee members, women SHGs, and artisans.
2. Tone: Clear, plain-language, structured, respectful, objective, and authoritative.
3. Language: Respond in ${langName}. Write naturally and fluently in ${langName}.
4. STRICT GROUNDING: Answer the user's question using ONLY the provided Google Drive RAG passages below.
5. NO HALLUCINATION: Never invent section numbers, act names, clauses, deadlines, or monetary amounts. If a detail is missing from the context, state that it is not specified in the document.
6. CITE SOURCES: Explicitly refer to the document name, section number, and page number in your text where applicable.
7. Return clean structured JSON with 'answer', 'sources' and 'followUpQuestions'.

RETRIEVED GOOGLE DRIVE RAG CONTEXT:
${contextString}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: 'The comprehensive, plain language answer strictly grounded in the RAG context.'
              },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    authority: { type: Type.STRING },
                    page: { type: Type.STRING },
                    section: { type: Type.STRING },
                    driveUrl: { type: Type.STRING },
                    officialUrl: { type: Type.STRING }
                  },
                  required: ['title', 'authority']
                }
              },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['answer', 'sources']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.answer) {
        // Map and enrich sources with exact Drive and Page references
        const mappedSources = chunks.slice(0, 3).map(c => ({
          title: c.fileName,
          authority: c.authority,
          page: c.pageNumber,
          section: c.section || c.clause || 'General Provisions',
          driveUrl: c.driveUrl,
          officialUrl: c.officialUrl || c.driveUrl,
          sourceType: 'rag' as const
        }));

        return {
          answer: parsed.answer,
          sourceType: 'rag',
          sources: mappedSources,
          followUpQuestions: parsed.followUpQuestions || [
            'What documents are needed for this?',
            'What is the statutory procedure?',
            'Who is the designated officer?'
          ]
        };
      }
    } catch (err: any) {
      console.warn('Gemini RAG synthesis error, attempting Groq fallback:', err?.message);
    }
  }

  // 2. High-reliability Groq LLM Failover
  if (config.groqApiKey) {
    try {
      const groqAnswer = await generateGroqRAGAnswer(question, language, chunks);
      if (groqAnswer) {
        return groqAnswer;
      }
    } catch (groqErr: any) {
      console.warn('Groq RAG synthesis error, falling back to deterministic synthesizer:', groqErr?.message);
    }
  }

  // 3. Final fallback: High-reliability deterministic synthesis
  return generateDeterministicSynthesis(question, language, chunks);
}

/**
 * Deterministic fallback synthesis when API is offline
 */
function generateDeterministicSynthesis(
  question: string,
  language: string,
  chunks: SearchResultChunk[]
): ChatAnswerResponse {
  const topChunk = chunks[0];
  const lang = language || 'en';

  const answers: Record<string, string> = {
    en: `Based on your verified Google Drive knowledge document "${topChunk.fileName}" (${topChunk.section || 'General Provisions'}, Page ${topChunk.pageNumber}):\n\n${topChunk.text}\n\nThis information is directly verified from your cooperative records in Google Drive.`,
    hi: `आपके गूगल ड्राइव ज्ञान दस्तावेज़ "${topChunk.fileName}" (${topChunk.section || 'प्रावधान'}, पृष्ठ ${topChunk.pageNumber}) के अनुसार:\n\n${topChunk.text}\n\nयह जानकारी सीधे आपके गूगल ड्राइव के अभिलेखों से सत्यापित की गई है।`,
    mr: `तुमच्या गुगल ड्राईव्हमधील दस्तऐवज "${topChunk.fileName}" (${topChunk.section || 'तरतूद'}, पृष्ठ ${topChunk.pageNumber}) नुसार:\n\n${topChunk.text}\n\nही माहिती थेट गुगल ड्राईव्हमधील नोंदींवरून घेण्यात आली आहे.`,
    bn: `আপনার গুগল ড্রাইভের নথি "${topChunk.fileName}" (${topChunk.section || 'ধারা'}, পৃষ্ঠা ${topChunk.pageNumber}) অনুযায়ী:\n\n${topChunk.text}\n\nএই তথ্যটি সরাসরি গুগল ড্রাইভ ফোল্ডার থেকে সংগৃহীত।`
  };

  const mappedSources = chunks.slice(0, 3).map(c => ({
    title: c.fileName,
    authority: c.authority,
    page: c.pageNumber,
    section: c.section || c.clause || 'General Section',
    driveUrl: c.driveUrl,
    officialUrl: c.officialUrl || c.driveUrl,
    sourceType: 'rag' as const
  }));

  return {
    answer: answers[lang] || answers.en,
    sourceType: 'rag',
    sources: mappedSources,
    followUpQuestions: [
      `What other sections are in ${topChunk.fileName}?`,
      'What are the compliance deadlines?',
      'Who is the nodal officer?'
    ]
  };
}

/**
 * Honest no-hallucination fallback message
 */
export function getNoReliableSourceResponse(language: string = 'en'): ChatAnswerResponse {
  const messages: Record<string, string> = {
    en: "I couldn't find a reliable source for this specific question in your Google Drive knowledge base or verified government portals. Please verify your query or refer to the official Ministry of Cooperation portal.",
    hi: 'मुझे आपके गूगल ड्राइव ज्ञानकोष या आधिकारिक सरकारी पोर्टलों में इस विशिष्ट प्रश्न के लिए कोई सत्यापित स्रोत नहीं मिला। कृपया प्रश्न को पुनः जांचें या सहकारिता मंत्रालय के पोर्टल पर संपर्क करें।',
    mr: 'मला तुमच्या गुगल ड्राईव्हमधील दस्तऐवजांमध्ये किंवा अधिकृत शासकीय पोर्टल्सवर या प्रश्नासाठी खात्रीशीर संदर्भ आढळला नाही. कृपया प्रश्न पुन्हा तपासा किंवा सहकार निबंधक कार्यालयाशी संपर्क साधा.',
    bn: 'আপনার গুগল ড্রাইভ ফোল্ডারে বা সরকারি পোর্টালে এই সুনির্দিষ্ট প্রশ্নের জন্য নির্ভরযোগ্য কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে পুনরায় সঠিক নথি যোগ করুন বা আধিকারিক পোর্টালে যোগাযোগ করুন।'
  };

  return {
    answer: messages[language] || messages.en,
    sourceType: 'rag',
    sources: [],
    followUpQuestions: [
      'What documents are indexed in my Google Drive?',
      'What are the rules of PACS membership?',
      'What is the crop insurance 72-hour reporting rule?'
    ]
  };
}
