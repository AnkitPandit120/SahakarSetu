import { config } from '../config/env';
import { SearchResultChunk } from './vectorService';
import { ChatAnswerResponse } from './geminiService';

/**
 * Call Groq chat completion API with JSON response format
 */
async function callGroqChat(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'llama-3.3-70b-versatile'
): Promise<string | null> {
  const apiKey = config.groqApiKey;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Groq API returned status ${response.status}:`, errorText);
      if (model !== 'llama-3.1-8b-instant') {
        return await callGroqChat(systemPrompt, userPrompt, 'llama-3.1-8b-instant');
      }
      return null;
    }

    const data: any = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.warn('Groq API invocation error:', err?.message || err);
    return null;
  }
}

/**
 * Synthesize grounded RAG answer using Groq as failover for Gemini
 */
export async function generateGroqRAGAnswer(
  question: string,
  language: string,
  chunks: SearchResultChunk[]
): Promise<ChatAnswerResponse | null> {
  const apiKey = config.groqApiKey;
  if (!apiKey) return null;

  const langName =
    language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

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

  const systemPrompt = `You are the official public-service legal & cooperative assistant for "SahakarSetu" (Government of India Cooperative Governance & Rural Legal Portal), acting as a high-reliability fallback engine.

CRITICAL DIRECTIVES:
1. Target Audience: Farmers, cooperative members, rural citizens, PACS committee members, women SHGs, and artisans.
2. Tone: Clear, plain-language, structured, respectful, objective, and authoritative.
3. Language: Respond in ${langName}. Write naturally and fluently in ${langName}.
4. STRICT GROUNDING: Answer the user's question using ONLY the provided Google Drive RAG passages below.
5. NO HALLUCINATION: Never invent section numbers, act names, clauses, deadlines, or monetary amounts. If a detail is missing from context, state that it is not specified.
6. CITE SOURCES: Explicitly cite document names, sections, and page numbers.
7. Output format: You MUST return a valid JSON object matching:
{
  "answer": "Comprehensive, plain language answer strictly grounded in the context.",
  "followUpQuestions": ["Question 1", "Question 2", "Question 3"]
}

RETRIEVED GOOGLE DRIVE RAG CONTEXT:
${contextString}`;

  const rawJson = await callGroqChat(systemPrompt, question);
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed.answer) return null;

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
      followUpQuestions: Array.isArray(parsed.followUpQuestions) && parsed.followUpQuestions.length > 0
        ? parsed.followUpQuestions
        : [
            'What documents are needed for this?',
            'What is the statutory procedure?',
            'Who is the designated officer?'
          ]
    };
  } catch (parseErr) {
    console.warn('Failed to parse Groq RAG JSON response:', parseErr);
    return null;
  }
}

/**
 * Groq fallback response for non-RAG statutory cooperative queries when web search is unavailable
 */
export async function generateGroqGeneralAnswer(
  question: string,
  language: string = 'en'
): Promise<ChatAnswerResponse | null> {
  const apiKey = config.groqApiKey;
  if (!apiKey) return null;

  const langName =
    language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

  const systemPrompt = `You are the trusted statutory researcher for SahakarSetu (Government of India Cooperative & Rural Legal Portal).
The internal Google Drive search did not find an exact matching indexed document.
Provide an objective, helpful answer strictly based on established Indian cooperative acts (Multi-State Co-operative Societies Act 2002, Model PACS Bye-laws, PMFBY, KCC, NABARD guidelines).
Respond in ${langName}.
Return valid JSON:
{
  "answer": "Plain-language factual statutory answer with advisory to check local Registrar of Cooperative Societies.",
  "sources": [
    { "title": "Ministry of Cooperation Portal", "authority": "Ministry of Cooperation, GoI", "officialUrl": "https://cooperation.gov.in" }
  ],
  "followUpQuestions": ["How to contact local cooperative registrar?", "What are the eligibility criteria?"]
}`;

  const rawJson = await callGroqChat(systemPrompt, question);
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed.answer) return null;

    return {
      answer: parsed.answer,
      sourceType: 'rag',
      sources: parsed.sources || [
        {
          title: 'Ministry of Cooperation Portal',
          authority: 'Ministry of Cooperation, GoI',
          officialUrl: 'https://cooperation.gov.in',
          sourceType: 'rag'
        }
      ],
      followUpQuestions: parsed.followUpQuestions || [
        'How can I apply for PACS membership?',
        'Where can I find my District Central Cooperative Bank?'
      ]
    };
  } catch {
    return null;
  }
}
