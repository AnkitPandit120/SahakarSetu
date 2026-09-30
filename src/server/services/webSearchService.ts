import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';
import { isHinglishText } from './geminiService';

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
  isInternetFallback?: boolean;
  disclaimer?: string;
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
  'pib.gov.in',
  'indiacode.nic.in',
  'nalsa.gov.in',
  'ecourts.gov.in',
  'sci.gov.in',
  'lawmin.gov.in',
  'mha.gov.in',
  'egazette.gov.in',
  'bprd.nic.in'
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
 * Perform trusted web search with Gemini search grounding for all cooperative, legal, statutory, and government queries
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

    const isHinglish = language === 'en' && isHinglishText(query);
    const langName =
      language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

    let langDirective = `3. LANGUAGE MATCHING:
   - Respond in ${langName}. If the user asked in Devanagari Hindi, respond in fluent Hindi. If in English, respond in English.`;

    if (language === 'hi') {
      langDirective = `3. LANGUAGE MANDATE (CRITICAL):
   - The user selected HINDI (हिंदी).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN FLUENT, ACCESSIBLE HINDI in Devanagari script (देवनागरी लिपि). Do not use English or Latin script.`;
    } else if (language === 'mr') {
      langDirective = `3. LANGUAGE MANDATE:
   - The user selected MARATHI (मराठी).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN MARATHI in Devanagari script.`;
    } else if (language === 'bn') {
      langDirective = `3. LANGUAGE MANDATE:
   - The user selected BENGALI (বাংলা).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN BENGALI in Bengali script.`;
    } else if (isHinglish) {
      langDirective = `3. LANGUAGE & SCRIPT DIRECTIVE (CRITICAL):
   - The user asked in HINGLISH (Hindi written using English/Latin alphabets): "${query}".
   - YOU MUST WRITE THE ENTIRE RESPONSE IN NATURAL, CLEAR HINGLISH (Latin script / English letters).
   - DO NOT USE DEVANAGARI SCRIPT (हिंदी लिपि). Write in conversational, easy-to-read Hinglish.`;
    }

    const systemPrompt = `You are an expert legal researcher and statutory assistant for Indian Law, Government of India regulations, Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC), Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC, Indian Constitution (Article 226, 32), Cooperative & Civil laws, Police/FIR procedures, Consumer Protection, and Citizen Rights.

When the user asks any question related to laws, sections (Dhara / Section), police cases, FIRs, court procedures, writ petitions, bail, government schemes, or citizen rights:
1. Explain what the provision or section means in clear, accessible language.
   - If the query mentions a section like "Dhara 226", clarify whether it refers to:
     a) Article 226 of the Constitution of India (Power of High Courts to issue Writs like Habeas Corpus, Mandamus, Quashing FIRs, etc.), OR
     b) Section 226 of BNS / IPC (or trial procedures in Sessions Court under CrPC/BNSS).
2. Detail the essential steps a citizen should take (e.g. obtaining a certified copy of the FIR/complaint, consulting an advocate, reaching out to National Legal Services Authority / DLSA helpline 15100 for free legal aid, applying for anticipatory/regular bail, or filing a High Court quashing petition).
3. Structure the response cleanly with clear headings, bullet points, and practical action items.
${langDirective}
4. Provide official references and portal links (such as indiacode.nic.in, nalsa.gov.in, ecourts.gov.in, cooperation.gov.in).
5. MANDATORY ADVISORY: Include a clear advisory that this explanation is for legal awareness and informational purposes, and for individual court defense or police cases, consulting a certified advocate is strongly advised.`;

    let response: any = null;
    let usedSearchTool = true;

    // Try primary model with Google Search Grounding tool
    const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: query,
          config: {
            systemInstruction: systemPrompt,
            tools: [{ googleSearch: {} }]
          }
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        const errMsg = String(err?.message || err);
        const isQuotaOrBusy = errMsg.includes('429') || errMsg.includes('503') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
        console.warn(`[Web Grounding] Model ${modelName} with Search Grounding returned: ${errMsg}. ${isQuotaOrBusy ? 'Trying fallback...' : ''}`);
        if (isQuotaOrBusy) {
          await new Promise(r => setTimeout(r, 400));
          continue;
        }
        break;
      }
    }

    // If Search Grounding tool quota is exhausted (429) or tool not available, fallback to direct model generation without the tool
    if (!response || !response.text) {
      usedSearchTool = false;
      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: query,
            config: {
              systemInstruction: `${systemPrompt}\n\nNote: Provide comprehensive legal and statutory guidance based on verified Indian laws and official procedures, citing official portals (indiacode.nic.in, nalsa.gov.in, ecourts.gov.in, cooperation.gov.in).`
            }
          });
          if (response && response.text) {
            break;
          }
        } catch (genErr: any) {
          console.warn(`[Web Grounding Fallback] Model ${modelName} direct generation error:`, genErr?.message);
        }
      }
    }

    let text = response?.text || '';
    if (!text || text.trim().length === 0) {
      return {
        hasAnswer: false,
        sources: []
      };
    }

    // Prepare clear legal awareness & internet source disclaimer
    let disclaimer = 'Legal Advisory & Source Disclaimer: This explanation is provided for general legal awareness and information based on public statutory records and Indian laws. For specific court proceedings, police FIRs, or legal defense, consulting a certified advocate or District Legal Services Authority (DLSA / NALSA Helpline: 15100) is strongly recommended.';
    if (language === 'hi') {
      disclaimer = 'विधिक सलाह एवं अस्वीकरण (Legal Disclaimer): यह जानकारी भारतीय विधि, संबंधित अधिनियमों एवं सार्वजनिक अभिलेखों के आधार पर विधिक जागरूकता हेतु प्रदान की गई है। किसी भी सक्रिय पुलिस प्राथमिकी (FIR), न्यायालयीन बचाव या मुकदमों के संबंध में पंजीकृत अधिवक्ता (Advocate) अथवा जिला विधिक सेवा प्राधिकरण (DLSA / NALSA निःशुल्क हेल्पलाइन: 15100) से विधिक परामर्श अवश्य प्राप्त करें।';
    } else if (language === 'mr') {
      disclaimer = 'कायदेशीर अस्वीकरण: ही माहिती भारतीय कायदे आणि सार्वजनिक नियमांच्या आधारे जनजागृतीसाठी दिली आहे. न्यायालयीन खटले किंवा पोलीस प्रकरणांसाठी कृपया अधिकृत वकिलांचा किंवा मोफत विधी सेवा प्राधिकरणाचा (NALSA 15100) सल्ला घ्या.';
    } else if (language === 'bn') {
      disclaimer = 'আইনি দাবিত্যাগ: এই তথ্যটি সাধারণ আইনি সচেতনতার জন্য প্রস্তুত করা হয়েছে। আদালতের মামলা বা এফআইআরের ক্ষেত্রে অনুগ্রহ করে একজন যোগ্য আইনজীবী বা বিনামূল্যে আইনি সহায়তা কেন্দ্র (NALSA 15100)-এর পরামর্শ নিন।';
    } else if (isHinglish) {
      disclaimer = 'Legal Advisory & Disclaimer: Yeh jankari Indian laws aur statutory provisions ke aadhar par legal awareness ke liye provide ki gayi hai. Kisi bhi active FIR, court trial ya police inquiry ke mamle me registered advocate ya NALSA Free Legal Aid (Helpline: 15100) se consult karein.';
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
        const title = chunk.web.title || 'Official Government / Web Source';
        const isGov = isTrustedGovernmentDomain(uri);

        sources.push({
          title,
          authority: isGov ? 'Verified Government Portal' : 'Public Web Reference',
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
      isInternetFallback: true,
      disclaimer,
      sources: sources.slice(0, 4),
      followUpQuestions: [
        'How do I verify this on the official government portal?',
        'Which government authority or department oversees this rule?',
        'What documents or forms are officially prescribed by law?'
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
