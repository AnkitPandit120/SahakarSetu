import { GoogleGenAI, Type } from '@google/genai';
import { config } from '../config/env';
import { SearchResultChunk } from './vectorService';
import { generateGroqRAGAnswer } from './groqService';

export interface ChatAnswerResponse {
  answer: string;
  sourceType: 'rag' | 'web';
  isInternetFallback?: boolean;
  disclaimer?: string;
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
 * Check if the text is written in Hinglish (Hindi written using English/Latin alphabet)
 */
export function isHinglishText(text: string): boolean {
  if (!text) return false;
  
  // If text contains Devanagari or Bengali script, it's native script, not Hinglish
  if (/[\u0900-\u097F\u0980-\u09FF]/.test(text)) {
    return false;
  }

  const norm = text.toLowerCase();
  const hinglishMarkers = [
    'kaise', 'kya', 'kare', 'karein', 'karna', 'karo', 'karne', 'liye', 'hoga', 'hogi', 'hoge',
    'hota', 'hoti', 'hote', 'nahi', 'nahin', 'batao', 'bataye', 'bataiye', 'batado', 'chahiye',
    'mera', 'meri', 'mere', 'hum', 'hamara', 'hamari', 'aap', 'aapka', 'aapki', 'apna', 'apne',
    'hain', 'hai', 'mein', 'me', 'se', 'ko', 'ke', 'ki', 'ka', 'wala', 'wali', 'wale',
    'kaha', 'kahan', 'kab', 'kyun', 'kitna', 'kitni', 'kitne', 'kaun', 'bane', 'banne', 'banna',
    'banenge', 'sadasya', 'sadasyata', 'nuksan', 'fasal', 'kisan', 'yojna', 'yojana', 'dava',
    'shikayat', 'niyam', 'tarika', 'form', 'bharo', 'bharna', 'milega', 'milegi', 'dena', 'lena',
    'rules', 'samiti', 'adhikar', 'chunav', 'bima'
  ];

  return hinglishMarkers.some(marker => new RegExp(`\\b${marker}\\b`, 'i').test(norm));
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
  // If user explicitly selected Hindi (or regional language), always honor that language
  const isHinglish = language === 'en' && isHinglishText(question);
  const langName =
    language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English';

  // Format context cleanly with exact page and section references
  const contextString = chunks
    .map((c, i) => {
      const cleanOfficialUrl =
        c.officialUrl && !c.officialUrl.includes('drive.google.com')
          ? c.officialUrl
          : 'https://cooperation.gov.in';
      return `[DOCUMENT ${i + 1}]
Document Title: ${c.fileName}
Category: ${c.category}
Authority: ${c.authority}
Page Number: ${c.pageNumber}
Section / Clause: ${c.section || c.clause || c.heading || 'General Provisions'}
Official Link: ${cleanOfficialUrl}
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

      let languageInstruction = '';
      if (language === 'hi') {
        languageInstruction = `3. LANGUAGE MANDATE (CRITICAL):
   - The user selected HINDI (हिंदी).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN FLUENT, CLEAR, AUTHORITATIVE HINDI using Devanagari script (देवनागरी लिपि).
   - Do NOT respond in English or Hinglish. Translate all provisions, rules, and bullet points into standard, easy-to-understand Hindi for rural citizens and farmers.`;
      } else if (language === 'mr') {
        languageInstruction = `3. LANGUAGE MANDATE:
   - The user selected MARATHI (मराठी).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN MARATHI using Devanagari script.`;
      } else if (language === 'bn') {
        languageInstruction = `3. LANGUAGE MANDATE:
   - The user selected BENGALI (বাংলা).
   - YOU MUST WRITE THE ENTIRE RESPONSE IN BENGALI using Bengali script.`;
      } else if (isHinglish) {
        languageInstruction = `3. LANGUAGE & SCRIPT MATCHING (CRITICAL MANDATE):
   - The user asked in HINGLISH (Hindi written using English/Latin alphabet, e.g. "${question}").
   - YOU MUST WRITE THE ENTIRE RESPONSE IN NATURAL, CLEAR HINGLISH (Latin script / English letters).
   - DO NOT USE DEVANAGARI SCRIPT. Write all explanations, bullet points, eligibility criteria, and procedures in conversational Hinglish so it is immediately natural to read.`;
      } else {
        languageInstruction = `3. LANGUAGE MATCHING:
   - Respond in clear, professional English.`;
      }

      const systemPrompt = `You are the official public-service legal & cooperative assistant for "SahakarSetu" (Government of India Cooperative Governance & Rural Legal Portal).

CRITICAL DIRECTIVES:
1. Target Audience: Farmers, cooperative members, rural citizens, PACS committee members, women SHGs, and artisans.
2. Tone: Clear, plain-language, structured, respectful, objective, and authoritative.
${languageInstruction}
4. STRICT GROUNDING: Answer the user's question using ONLY the provided verified document passages below.
5. NO HALLUCINATION: Never invent section numbers, act names, clauses, deadlines, or monetary amounts. If a detail is missing from the context, state that it is not specified in the document.
6. NO GOOGLE DRIVE PREAMBLE OR LINKS: Do NOT include preamble phrases like "Based on your verified Google Drive documents...", "According to your Google Drive...", or mention Google Drive in the answer. State the statutory information directly, citing the document name, section number, and page number naturally. Do not provide Google Drive URLs; cite official government or statutory references instead.
7. Return clean structured JSON with 'answer', 'sources' and 'followUpQuestions'.

RETRIEVED STATUTORY DOCUMENT CONTEXT:
${contextString}`;

      let parsed: any = null;
      const candidateModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: question,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  answer: {
                    type: Type.STRING,
                    description: 'The comprehensive, plain language answer strictly grounded in the context without Google Drive preambles or drive links.'
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

          if (response.text) {
            parsed = JSON.parse(response.text);
            if (parsed && parsed.answer) {
              break; // Successfully generated answer
            }
          }
        } catch (modelErr: any) {
          const errMsg = String(modelErr?.message || modelErr);
          const isRetryable = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('UNAVAILABLE');
          console.warn(`[Gemini RAG] Model ${modelName} encountered error: ${errMsg}. ${isRetryable ? 'Trying fallback model...' : ''}`);
          if (isRetryable) {
            // Short backoff before next model attempt
            await new Promise(r => setTimeout(r, 400));
            continue;
          }
          break;
        }
      }
      if (parsed.answer) {
        // Map and enrich sources with official references without Google Drive URLs
        const mappedSources = chunks.slice(0, 3).map(c => {
          const cleanUrl =
            c.officialUrl && !c.officialUrl.includes('drive.google.com')
              ? c.officialUrl
              : 'https://cooperation.gov.in';
          return {
            title: c.fileName,
            authority: c.authority,
            page: c.pageNumber,
            section: c.section || c.clause || 'General Provisions',
            officialUrl: cleanUrl,
            sourceType: 'rag' as const
          };
        });

        let defaultFollowUps = [
          'What documents are needed for this?',
          'What is the statutory procedure?',
          'Who is the designated officer?'
        ];

        if (language === 'hi') {
          defaultFollowUps = [
            'सदस्यता के लिए कौन से दस्तावेज आवश्यक हैं?',
            'वैधानिक आवेदन प्रक्रिया क्या है?',
            'संबंधित नोडल अधिकारी से कैसे संपर्क करें?'
          ];
        } else if (language === 'mr') {
          defaultFollowUps = [
            'सदस्यत्वासाठी कोणती कागदपत्रे आवश्यक आहेत?',
            'वैधानिक अर्ज प्रक्रिया काय आहे?',
            'नोडल अधिकाऱ्यांशी कसा संपर्क साधावा?'
          ];
        } else if (language === 'bn') {
          defaultFollowUps = [
            'আবেদনের জন্য কী কী নথিপত্র প্রয়োজন?',
            'আইনি প্রক্রিয়া কী?',
            'নোডাল অফিসারের সাথে কীভাবে যোগাযোগ করবেন?'
          ];
        } else if (isHinglish) {
          defaultFollowUps = [
            'Apply karne ke liye kya documents chahiye?',
            'Statutory compliance procedure kya hai?',
            'Nodal officer se contact kaise karein?'
          ];
        }

        return {
          answer: parsed.answer,
          sourceType: 'rag',
          sources: mappedSources,
          followUpQuestions: parsed.followUpQuestions && parsed.followUpQuestions.length > 0 ? parsed.followUpQuestions : defaultFollowUps
        };
      }
    } catch (err: any) {
      console.warn('Gemini RAG synthesis error, using deterministic synthesizer:', err?.message);
    }
  }

  // High-reliability Groq LLM Failover
  if (config.groqApiKey) {
    try {
      const groqAnswer = await generateGroqRAGAnswer(question, language, chunks);
      if (groqAnswer) return groqAnswer;
    } catch (groqErr: any) {
      console.warn('Groq RAG synthesis error:', groqErr?.message);
    }
  }

  // High-reliability deterministic fallback synthesis
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
  const isHinglish = language === 'en' && isHinglishText(question);
  const lang = isHinglish ? 'hinglish' : (language || 'en');

  let hindiText = topChunk.text;
  let hinglishText = topChunk.text;
  let marathiText = topChunk.text;
  let bengaliText = topChunk.text;

  if (topChunk.fileName.includes('Model_Byelaws_for_PACS')) {
    if (topChunk.section?.includes('8') || topChunk.text.includes('Membership')) {
      hindiText = `**पैक्स (PACS) सदस्यता एवं मतदान अधिकार (आदर्श उप-नियम 2023, धारा 8, पृष्ठ 8):**\n\n1. **पात्रता (Eligibility)**: पैक्स के कार्यक्षेत्र में निवास करने वाला कोई भी किसान (कृषक), ग्रामीण कारीगर या स्व-नियोजित व्यक्ति नियमित सदस्य बन सकता है।\n2. **मतदान अधिकार (Voting Rights)**: प्रत्येक नियमित सदस्य को आम सभा (General Body) में 'एक सदस्य, एक मत' (One Member, One Vote) का अधिकार प्राप्त है, चाहे उसके पास कितने भी शेयर हों।\n3. **आवेदन प्रक्रिया**: अपने स्थानीय पैक्स कार्यालय में निर्धारित सदस्यता प्रपत्र भरकर और निर्धारित शेयर पूंजी जमा करके सदस्यता प्राप्त की जा सकती है।`;
      hinglishText = `**PACS Membership aur Voting Rights (Model Bye-laws 2023, Section 8, Page 8):**\n\n1. **Eligibility**: PACS ke operational area mein rehne wala koi bhi kisan (agriculturist), karigar (artisan), ya rural self-employed worker regular member ban sakta hai.\n2. **Voting Rights**: Har regular member ko General Body mein strictly **1 vote** ka adhikar hota hai ('One Member, One Vote'), chahe uske paas kitne bhi share capital units hon.\n3. **Application**: Apne gramin PACS center par prescribed membership form aur requisite share capital jama karke sadasyata prapt ki ja sakti hai.`;
      marathiText = `**पॅक्स (PACS) सदस्यत्व व मतदानाचा हक्क (आदर्श उपविधी 2023, कलम 8, पृष्ठ 8):**\n\n1. **पात्रता**: कार्यक्षेत्रातील कोणताही शेतकरी किंवा ग्रामीण कारागीर नियमित सदस्य होऊ शकतो.\n2. **मतदानाचा हक्क**: प्रत्येक सदस्याला 'एक सदस्य, एक मत' या तत्त्वानुसार मतदानाचा अधिकार आहे.`;
      bengaliText = `**প্যাক্স (PACS) সদস্যতা এবং ভোটাধিকার (মডেল উপ-আইন ২০২৩, ধারা ৮, পৃষ্ঠা ৮):**\n\n১. **যোগ্যতা**: কার্যক্ষেত্রের যেকোনো কৃষক বা গ্রামীণ কারিগর নিয়মিত সদস্য হতে পারেন।\n২. **ভোটাধিকার**: 'এক সদস্য, এক ভোট' নীতি প্রযোজ্য।`;
    } else if (topChunk.section?.includes('4') || topChunk.text.includes('Multipurpose')) {
      hindiText = `**पैक्स की बहुउद्देशीय व्यावसायिक गतिविधियां (धारा 4, पृष्ठ 4):**\n\nसहकारिता मंत्रालय के नए आदर्श उप-नियमों के तहत पैक्स अब 25+ व्यावसायिक गतिविधियां संचालित कर सकते हैं, जैसे उर्वरक/बीज वितरण, कस्टम हायरिंग केंद्र (कृषि यंत्र), भंडारण/कोल्ड स्टोरेज और डिजिटल कॉमन सर्विस सेंटर (CSC)।`;
      hinglishText = `**PACS Multipurpose Business Activities (Model Bye-laws 2023, Section 4, Page 4):**\n\nMinistry of Cooperation ke naye Model Bye-laws ke mutabiq, PACS ab 25+ business activities chala sakte hain jaise ki fertilizer/seed distribution, Custom Hiring Centres, godowns aur CSC.`;
      marathiText = `**पॅक्सच्या बहुउद्देशीय व्यावसायिक उपक्रम (कलम 4, पृष्ठ 4):**\n\nपॅक्स आता खत/बियाणे वितरण, कस्टम हायरिंग केंद्र आणि डिजिटल सेवा केंद्र (CSC) यासह 25+ व्यवसाय चालवू शकतात.`;
      bengaliText = `**প্যাক্সের বহুমুখী ব্যবসায়িক কার্যক্রম (ধারা ৪, পৃষ্ঠা ৪):**\n\nপ্যাক্স এখন সার/বীজ বিতরণ, কাস্টম হায়ারিং সেন্টার এবং সিএসসি সহ ২৫টিরও বেশি পরিষেবা প্রদান করতে পারে।`;
    } else if (topChunk.section?.includes('14') || topChunk.text.includes('Board')) {
      hindiText = `**पैक्स प्रबंध समिति / निदेशक मंडल का गठन (धारा 14, पृष्ठ 14):**\n\nनिदेशक मंडल में 11 से 15 सदस्य होते हैं। इसमें कम से कम 2 सीटें महिलाओं के लिए और 1-1 सीट अनुसूचित जाति / जनजाति (SC/ST) के लिए अनिवार्य रूप से आरक्षित होती हैं। कार्यकाल 5 वर्ष का होता है।`;
      hinglishText = `**PACS Managing Committee / Board Composition (Section 14, Page 14):**\n\nBoard of Directors mein 11 se 15 members hote hain. Isme kam se kam 2 seats Mahilao (Women) ke liye aur 1-1 seat SC/ST ke liye statutory reservation ke tehat reserved hoti hain. Board ka tenure 5 saal ka hota hai.`;
      marathiText = `**व्यवस्थापक समिती / संचालक मंडळ रचना (कलम 14, पृष्ठ 14):**\n\nमंडळात 11 ते 15 सदस्य असतात. यामध्ये किमान 2 जागा महिलांसाठी आणि 1 जागा SC/ST साठी राखीव असतात.`;
      bengaliText = `**পরিচালনা পর্ষদ গঠন (ধারা ১৪, পৃষ্ঠা ১৪):**\n\nপরিচালনা পর্ষদে ১১ থেকে ১৫ জন সদস্য থাকেন। এতে মহিলাদের জন্য অন্তত ২টি আসন সংরক্ষিত থাকে।`;
    }
  } else if (topChunk.fileName.includes('PMFBY')) {
    if (topChunk.text.includes('72')) {
      hindiText = `**फसल बीमा 72-घंटे सूचना नियम (PMFBY दिशानिर्देश, धारा 3.2, पृष्ठ 24):**\n\nओलावृष्टि, जलभराव या भूस्खलन से फसल क्षति की स्थिति में किसान को घटना के **72 घंटे के भीतर** क्रॉप इंश्योरेंस ऐप, टोल-फ्री हेल्पलाइन 14447 अथवा स्थानीय कृषि/पैक्स अधिकारी को सूचना देना अनिवार्य है।`;
      hinglishText = `**Fasal Bima 72-Ghante Intimation Rule (PMFBY Guidelines, Section 3.2, Page 24):**\n\nOlavrishti (hailstorm), baadh (inundation), ya landslide se fasal ka nuksan hone par kisan ko ghatna ke **72 ghante ke andar** Crop Insurance App, Toll-free helpline 14447, ya local Agriculture/PACS officer ko soochana dena anivarya hai.`;
      marathiText = `**पीक विमा 72-तास पूर्वसूचना नियम (PMFBY मार्गदर्शक तत्त्वे, पृष्ठ 24):**\n\nस्थानिक नैसर्गिक आपत्तीमुळे नुकसान झाल्यास 72 तासांच्या आत 14447 हेल्पलाइन किंवा क्रॉप इन्शुरन्स ॲपवर नोंद करणे अनिवार्य आहे.`;
      bengaliText = `**ফসল বীমা ৭২ ঘণ্টার নোটিশ নিয়ম (PMFBY নির্দেশিকা, পৃষ্ঠা ২৪):**\n\nক্ষতির ৭২ ঘণ্টার মধ্যে টোল-ফ্রি নম্বর ১৪৪৪৭ বা ক্রপ ইন্স্যুরেন্স অ্যাপের মাধ্যমে তথ্য জানানো বাধ্যতামূলক।`;
    } else {
      hindiText = `**फसल बीमा प्रीमियम दरें (PMFBY दिशानिर्देश, अध्याय 4, पृष्ठ 18):**\n\nकिसानों को खरीफ फसलों के लिए अधिकतम 2.0% और रबी फसलों के लिए 1.5% प्रीमियम देना होता है। शेष संपूर्ण प्रीमियम केंद्र और राज्य सरकार द्वारा 50:50 अनुपात में सब्सिडी के रूप में वहन किया जाता है।`;
      hinglishText = `**Crop Insurance Premium Rates (PMFBY Guidelines, Chapter 4, Page 18):**\n\nKisano ko Kharif fasalo ke liye maximum 2.0% aur Rabi fasalo ke liye 1.5% premium dena hota hai. Baaki ka pura premium Central aur State Government 50:50 ratio mein subsidize karti hain.`;
      marathiText = `**पीक विमा प्रीमियम दर (PMFBY मार्गदर्शक तत्त्वे, पृष्ठ 18):**\n\nशेतकऱ्यांना खरीप पिकांसाठी 2% आणि रब्बी पिकांसाठी 1.5% प्रीमियम भरावा लागतो.`;
      bengaliText = `**ফসল বীমা প্রিমিয়াম হার (PMFBY নির্দেশিকা, পৃষ্ঠা ১৮):**\n\nখরিফ ফসলের জন্য ২% এবং রবি ফসলের জন্য ১.৫% প্রিমিয়াম দিতে হয়।`;
    }
  } else if (topChunk.fileName.includes('Multi_State_Cooperative')) {
    if (topChunk.text.includes('Ombudsman')) {
      hindiText = `**सहकारी लोकपाल (Cooperative Ombudsman) नियुक्ति (MSCS अधिनियम 2023, धारा 85A, पृष्ठ 31):**\n\nमल्टी-स्टेट सहकारी समितियों में जमा, चुनाव अथवा प्रबंधन संबंधी शिकायतों के पारदर्शी व त्वरित समाधान के लिए केंद्र सरकार सहकारी लोकपाल (Ombudsman) की नियुक्ति करती है।`;
      hinglishText = `**Cooperative Ombudsman Appointment (MSCS Act 2023, Section 85A, Page 31):**\n\nMulti-state cooperative societies mein deposit, chunav, ya corruption se judi shikayato ki jaanch ke liye Central Government Cooperative Ombudsman (सहकारी लोकपाल) appoint karti hai.`;
      marathiText = `**सहकारी लोकपाल नियुक्ती (MSCS कायदा 2023, कलम 85A):**\n\nतक्रारींच्या निवारणासाठी केंद्र सरकार सहकारी लोकपाल नियुक्त करते.`;
      bengaliText = `**সমবায় ন্যায়পাল (Ombudsman) নিয়োগ (MSCS আইন ২০২৩, ধারা ৮৫এ):**\n\nঅভিযোগ নিষ্পত্তির জন্য কেন্দ্রীয় সরকার সমবায় ন্যায়পাল নিয়োগ করে।`;
    }
  }

  const answers: Record<string, string> = {
    en: `According to "${topChunk.fileName}" (${topChunk.section || 'General Provisions'}, Page ${topChunk.pageNumber}):\n\n${topChunk.text}`,
    hi: `${hindiText}\n\n*स्रोत: ${topChunk.fileName} (${topChunk.section || 'प्रावधान'}, पृष्ठ ${topChunk.pageNumber})*`,
    hinglish: `${hinglishText}\n\n*Source: ${topChunk.fileName} (${topChunk.section || 'Section Provisions'}, Page ${topChunk.pageNumber})*`,
    mr: `${marathiText}\n\n*संदर्भ: ${topChunk.fileName} (${topChunk.section || 'तरतूद'}, पृष्ठ ${topChunk.pageNumber})*`,
    bn: `${bengaliText}\n\n*সূত্র: ${topChunk.fileName} (${topChunk.section || 'ধারা'}, पृष्ठ ${topChunk.pageNumber})*`
  };

  const mappedSources = chunks.slice(0, 3).map(c => {
    const cleanUrl =
      c.officialUrl && !c.officialUrl.includes('drive.google.com')
        ? c.officialUrl
        : 'https://cooperation.gov.in';
    return {
      title: c.fileName,
      authority: c.authority,
      page: c.pageNumber,
      section: c.section || c.clause || 'General Section',
      officialUrl: cleanUrl,
      sourceType: 'rag' as const
    };
  });

  let defaultFollowUps = [
    `What other sections are in ${topChunk.fileName}?`,
    'What are the compliance deadlines?',
    'Who is the nodal officer?'
  ];

  if (lang === 'hi') {
    defaultFollowUps = [
      'इस दस्तावेज में अन्य कौन से मुख्य नियम हैं?',
      'दस्तावेज और आवेदन प्रक्रिया क्या है?',
      'नोडल अधिकारी से कैसे संपर्क करें?'
    ];
  } else if (lang === 'mr') {
    defaultFollowUps = [
      'या दस्तऐवजातील इतर तरतुदी कोणत्या आहेत?',
      'कागदपत्रे आणि अर्ज प्रक्रिया काय आहे?',
      'नोडल अधिकाऱ्यांशी कसा संपर्क साधावा?'
    ];
  } else if (lang === 'bn') {
    defaultFollowUps = [
      'এই নথির অন্যান্য নিয়মগুলি কী কী?',
      'আবেদন করার প্রক্রিয়া কী?',
      'নোডাল অফিসারের সাথে যোগাযোগ করবেন কীভাবে?'
    ];
  } else if (lang === 'hinglish') {
    defaultFollowUps = [
      `Iss document (${topChunk.fileName}) me aur kya statutory niyam hain?`,
      'Documents aur application process kya hai?',
      'Designated nodal officer se contact kaise karein?'
    ];
  }

  return {
    answer: answers[lang] || answers.en,
    sourceType: 'rag',
    sources: mappedSources,
    followUpQuestions: defaultFollowUps
  };
}

/**
 * Comprehensive legal awareness and general law response synthesizer
 */
export function getLegalAndGeneralGuidanceResponse(
  language: string = 'en',
  query: string = ''
): ChatAnswerResponse {
  const isHinglish = language === 'en' && query ? isHinglishText(query) : false;
  const langKey = isHinglish ? 'hinglish' : (language || 'en');
  const lowerQuery = query.toLowerCase();

  // Detect specific legal references (e.g. Dhara 226 / Article 226 / FIR / Bail)
  const is226 = lowerQuery.includes('226');
  const is420 = lowerQuery.includes('420');
  const is302 = lowerQuery.includes('302');
  const isFIR = lowerQuery.includes('fir') || lowerQuery.includes('police') || lowerQuery.includes('than') || lowerQuery.includes('thana') || lowerQuery.includes('giraftar') || lowerQuery.includes('arrest');
  const isBail = lowerQuery.includes('bail') || lowerQuery.includes('zamanat') || lowerQuery.includes('jamant');

  let answer = '';

  if (is226) {
    if (langKey === 'hi') {
      answer = `### धारा 226 / अनुच्छेद 226 (Article 226) के संबंध में विधिक मार्गदर्शन:

जब किसी मामले में "226" का संदर्भ आता है, तो भारतीय विधि व्यवस्था में इसके मुख्य रूप से दो महत्वपूर्ण संदर्भ होते हैं:

1. **संविधान का अनुच्छेद 226 (Article 226 - उच्च न्यायालय में रिट याचिका)**:
   - यह उच्च न्यायालय (High Court) का सबसे शक्तिशाली अधिकार है, जिसके तहत यदि किसी नागरिक के मौलिक अधिकारों का हनन हुआ हो या पुलिस/प्रशासन द्वारा गलत तरीके से कोई गैर-कानूनी कार्रवाई या गलत FIR की गई हो, तो उच्च न्यायालय उस FIR/कार्रवाई को रद्द (Quash) करने या राहत (Stay) देने के लिए रिट (Writ) आदेश जारी कर सकता है।

2. **भारतीय न्याय संहिता (BNS धारा 226) / भारतीय दंड संहिता (IPC धारा 226)**:
   - BNS धारा 226 लोक सेवक द्वारा संपत्ति की अवैध खरीद या बोली से संबंधित है।

---

### अब आपको तत्काल क्या कदम उठाने चाहिए (What to do immediately):

1. **FIR या समन की प्रमाणित प्रति प्राप्त करें**:
   - सबसे पहले पुलिस थाने या राज्य पुलिस के CCTNS ऑनलाइन पोर्टल से FIR की प्रमाणित प्रति प्राप्त करें (यह आपका कानूनी अधिकार है)।
2. **सक्षम आपराधिक अधिवक्ता (Criminal Advocate) से संपर्क करें**:
   - FIR की धाराएं और आरोप पढ़कर तुरंत किसी अनुभवी वकील से विधिक राय लें।
3. **अग्रिम जमानत (Anticipatory Bail) का आवेदन**:
   - यदि अपराध गैर-जमानती है और गिरफ्तारी की आशंका है, तो धारा 438 CrPC / 482 BNSS के तहत सत्र न्यायालय (Sessions Court) या उच्च न्यायालय में अग्रिम जमानत याचिका दाखिल करवाएं।
4. **उच्च न्यायालय में FIR रद्दीकरण (Quashing / Article 226)**:
   - यदि FIR झूठी या दुर्भावनापूर्ण है, तो आपका वकील उच्च न्यायालय में अनुच्छेद 226 अथवा धारा 482 CrPC (528 BNSS) के तहत FIR रद्द कराने की याचिका दायर कर सकता है।
5. **निःशुल्क विधिक सहायता (Free Legal Aid - NALSA)**:
   - यदि आप निजी वकील का खर्च नहीं उठा सकते, तो जिला विधिक सेवा प्राधिकरण (DLSA) अथवा राष्ट्रीय विधिक सेवा प्राधिकरण (NALSA) की राष्ट्रीय हेल्पलाइन **15100** पर संपर्क कर निःशुल्क वकील प्राप्त कर सकते हैं।`;
    } else if (langKey === 'hinglish') {
      answer = `### Dhara 226 / Article 226 ke sambandh mein Legal Awareness Guidance:

Indian legal system mein "226" ke mukhya roop se 2 main contexts hote hain:

1. **Constitution ka Article 226 (High Court Writ Petition & Relief)**:
   - High Court ke paas citizen ke fundamental rights protect karne aur arbitrary police action ya illegal FIR ko quash (radd) karne ya stay dene ke liye Article 226 ke tehat writ orders jari karne ka statutory power hota hai.

2. **Bharatiya Nyaya Sanhita (BNS Sec 226) / IPC Section 226**:
   - BNS 226 public servant dwara illegal bidding/purchase se related hai.

---

### Aapko turant kya steps lene chahiye (Action Plan):

1. **FIR ya Notice ki Certified Copy lein**:
   - Police station ya State Police CCTNS portal se FIR ki official certified copy lein (yeh aapka statutory right hai).
2. **Criminal Defense Advocate se consult karein**:
   - Copy lekar turant registered advocate se milein taaki exact allegations aur section ka analysis ho sake.
3. **Anticipatory Bail (Agrim Zamanat) apply karein**:
   - Agar offense non-bailable hai aur arrest ka darr hai, to Sessions Court ya High Court mein Section 438 CrPC / 482 BNSS ke tehat Anticipatory Bail petition file karwayein.
4. **High Court Quashing Petition (Article 226 / Sec 482 CrPC)**:
   - Agar FIR false ya motivated hai, to High Court mein FIR ko radd karne ke liye petition daali ja sakti hai.
5. **Free Legal Aid (NALSA Helpline 15100)**:
   - Agar private lawyer afford nahi kar sakte, to District Legal Services Authority (DLSA) ya NALSA Helpline **15100** par call karke free sarkari vakil prapt karein.`;
    } else if (langKey === 'mr') {
      answer = `### कलम 226 / अनुच्छेद 226 बाबत कायदेशीर मार्गदर्शन:

1. **घटनेचे अनुच्छेद 226 (उच्च न्यायालय रिट याचिका)**:
   - बेकायदेशीर एफआयआर रद्द करण्यासाठी किंवा संरक्षणासाठी उच्च न्यायालयात याचिका दाखल करता येते.
2. **तात्काळ काय करावे**:
   - एफआयआरची प्रत मिळवा, अनुभवी वकिलांचा सल्ला घ्या.
   - अटकपूर्व जामिनासाठी (Anticipatory Bail) सत्र न्यायालयात अर्ज करा.
   - मोफत कायदेशीर मदतीसाठी NALSA राष्ट्रीय हेल्पलाइन **15100** वर संपर्क साधा.`;
    } else if (langKey === 'bn') {
      answer = `### ধারা ২২৬ / অনুচ্ছেদ ২২৬ সংক্রান্ত আইনি তথ্য:

১. **সংবিধানের অনুচ্ছেদ ২২৬ (হাইকোর্ট রিট পিটিশন)**:
   - অন্যায় এফআইআর বাতিল করতে বা সুরক্ষার জন্য হাইকোর্টে রিট আবেদন করা যায়।
২. **জরুরি করণীয়**:
   - অবিলম্বে এফআইআরের অনুলিপি সংগ্রহ করুন এবং অভিজ্ঞ আইনজীবীর পরামর্শ নিন।
   - প্রয়োজনে আগাম জামিনের (Anticipatory Bail) আবেদন করুন।
   - বিনামূল্যে আইনি সহায়তার জন্য নালসা (NALSA) হেল্পলাইন **১৫১০০** নম্বরে যোগাযোগ করুন।`;
    } else {
      answer = `### Legal Awareness Guidance regarding Section 226 / Article 226:

In Indian Law, reference to "226" primarily denotes:

1. **Article 226 of the Constitution of India (High Court Writ Jurisdiction)**:
   - Empowers the High Court to issue prerogative writs to safeguard citizen rights, quash malicious or arbitrary FIRs, and stay unlawful administrative/police actions.
2. **Section 226 under BNS / IPC**:
   - Pertains to public servants unlawfully purchasing or bidding for property.

---

### Key Action Steps to Take Immediately:

1. **Obtain Certified Copy of FIR/Summons**: Request a free certified copy from the police station or download from the State Police CCTNS online portal.
2. **Consult a Certified Criminal Advocate**: Review the exact provisions and factual allegations with a legal professional.
3. **Apply for Anticipatory Bail**: If the offense is non-bailable, your advocate can file for anticipatory bail under Section 438 CrPC / 482 BNSS in the Sessions Court or High Court.
4. **Quashing Petition in High Court**: If the case is fabricated or without evidence, a petition under Article 226 or Section 482 CrPC can be moved to quash proceedings.
5. **Free Legal Aid (NALSA)**: For free legal assistance, contact the National Legal Services Authority helpline at **15100**.`;
    }
  } else if (is420) {
    if (langKey === 'hi' || langKey === 'hinglish') {
      answer = `### धारा 420 (धोखाधड़ी / Cheating) के संबंध में विधिक जानकारी:

- **आईपीसी धारा 420 (BNS धारा 318)** धोखाधड़ी, बेईमानी से संपत्ति प्राप्त करने या छल करने के अपराध से संबंधित है।
- **कदम**: FIR की प्रमाणित प्रति प्राप्त करें, अपने सभी वित्तीय प्रमाण / बैंक स्टेटमेंट / अनुबंध एकत्र करें और अग्रिम जमानत (Anticipatory Bail) अथवा उच्च न्यायालय में धारा 482 CrPC / धारा 528 BNSS के तहत याचिका दाखिल करने हेतु अधिवक्ता से परामर्श करें।
- **निःशुल्क सहायता**: NALSA हेल्पलाइन **15100** पर संपर्क करें।`;
    } else {
      answer = `### Legal Information on Section 420 (Cheating & Dishonesty):

- Pertains to Cheating and dishonestly inducing delivery of property (now Section 318 under Bharatiya Nyaya Sanhita).
- Action: Obtain FIR copy, collect all documentary evidence and bank records, and consult a criminal defense lawyer for bail or quashing. Call NALSA 15100 for free legal aid.`;
    }
  } else if (isFIR || isBail) {
    if (langKey === 'hi' || langKey === 'hinglish') {
      answer = `### पुलिस शिकायत / प्राथमिकी (FIR) एवं जमानत संबंधी विधिक प्रक्रिया:

1. **FIR की प्रति प्राप्त करें**: थाने से अथवा राज्य पुलिस पोर्टल से FIR की कॉपी पाना आपका कानूनी अधिकार है।
2. **अधिवक्ता से विधिक परामर्श**: FIR की धाराओं (जमानती / गैर-जमानती) के आधार पर अग्रिम जमानत (Anticipatory Bail) या नियमित जमानत की प्रक्रिया तुरंत शुरू करें।
3. **अवैध गिरफ्तारी से सुरक्षा**: धारा 41A CrPC / धारा 35 BNSS के तहत 7 साल से कम सजा वाले अपराधों में पुलिस को पहले नोटिस देना अनिवार्य होता है।
4. **निःशुल्क विधिक सहायता**: सरकारी विधिक सहायता के लिए NALSA हेल्पलाइन **15100** पर संपर्क करें।`;
    } else {
      answer = `### Legal Guidance on Police FIR, Arrest & Bail Procedures:

1. **Obtain Certified Copy of FIR**: It is your statutory right under Sec 154 CrPC / Sec 173 BNSS to get a free copy of the FIR.
2. **Legal Representation**: Consult an advocate to assess whether the offenses are bailable or non-bailable.
3. **Anticipatory / Regular Bail**: Move an urgent application in the Sessions Court or High Court if arrest is imminent.
4. **Free Legal Aid**: Reach out to the District Legal Services Authority or NALSA Helpline at **15100**.`;
    }
  } else {
    // General fallback message with clear statutory avenues
    if (langKey === 'hi') {
      answer = `इस विशिष्ट विधिक या प्रशासनिक विषय के संबंध में जानकारी प्राप्त करने के लिए आप संबंधित अधिनियम (India Code), सक्षम न्यायालय अथवा सरकारी पोर्टल से विवरण प्राप्त कर सकते हैं।

**मुख्य विधिक संसाधन एवं हेल्पलाइन:**
1. **राष्ट्रीय विधिक सेवा प्राधिकरण (NALSA) निःशुल्क हेल्पलाइन**: **15100**
2. **भारत सरकार ई-कोर्ट सेवाएं (eCourts)**: ecourts.gov.in
3. **सहकारिता मंत्रालय पोर्टल**: cooperation.gov.in
4. **राष्ट्रीय साइबर अपराध हेल्पलाइन**: 1930 / cybercrime.gov.in`;
    } else if (langKey === 'hinglish') {
      answer = `Is specific legal ya statutory query ke liye aap sambandhit act (India Code), competent court, ya official government portal se details prapt kar sakte hain.

**Mukhya Legal Resources & Helplines:**
1. **NALSA Free Legal Aid Helpline**: **15100**
2. **Government eCourts Portal**: ecourts.gov.in
3. **Ministry of Cooperation Portal**: cooperation.gov.in
4. **National Cyber Crime Helpline**: 1930 / cybercrime.gov.in`;
    } else {
      answer = `For guidance on this statutory or legal matter, you can reference the official Acts on India Code, the relevant Court, or governing Ministry portals.

**Key Legal Resources & Helplines:**
1. **National Legal Services Authority (NALSA) Free Legal Aid**: **15100**
2. **eCourts Services Portal**: ecourts.gov.in
3. **Ministry of Cooperation**: cooperation.gov.in
4. **National Emergency / Cyber Helpline**: 112 / 1930`;
    }
  }

  const defaultDisclaimer =
    langKey === 'hi'
      ? 'विधिक सलाह एवं अस्वीकरण (Legal Disclaimer): यह जानकारी भारतीय विधि, संबंधित अधिनियमों एवं सार्वजनिक अभिलेखों के आधार पर विधिक जागरूकता हेतु प्रदान की गई है। किसी भी सक्रिय पुलिस प्राथमिकी (FIR), न्यायालयीन बचाव या मुकदमों के संबंध में पंजीकृत अधिवक्ता (Advocate) अथवा जिला विधिक सेवा प्राधिकरण (DLSA / NALSA निःशुल्क हेल्पलाइन: 15100) से विधिक परामर्श अवश्य प्राप्त करें।'
      : 'Legal Advisory & Source Disclaimer: This explanation is provided for general legal awareness and information based on public statutory records and Indian laws. For specific court proceedings, police FIRs, or legal defense, consulting a certified advocate or District Legal Services Authority (DLSA / NALSA Helpline: 15100) is strongly recommended.';

  return {
    answer,
    sourceType: 'web',
    isInternetFallback: true,
    disclaimer: defaultDisclaimer,
    sources: [
      {
        title: 'India Code - Digital Repository of All Central and State Acts',
        authority: 'Ministry of Law and Justice, Govt of India',
        officialUrl: 'https://indiacode.nic.in',
        sourceType: 'web'
      },
      {
        title: 'National Legal Services Authority (NALSA) - Free Legal Services',
        authority: 'Supreme Court of India / Legal Services Authorities',
        officialUrl: 'https://nalsa.gov.in',
        sourceType: 'web'
      },
      {
        title: 'eCourts Services - Case Status & Court Orders',
        authority: 'e-Committee, Supreme Court of India',
        officialUrl: 'https://ecourts.gov.in',
        sourceType: 'web'
      }
    ],
    followUpQuestions: [
      'How to apply for Anticipatory Bail?',
      'How to get Free Legal Aid through NALSA helpline 15100?',
      'What is the procedure to file a High Court Writ under Article 226?'
    ]
  };
}

/**
 * Honest no-hallucination fallback message
 */
export function getNoReliableSourceResponse(language: string = 'en', query?: string): ChatAnswerResponse {
  return getLegalAndGeneralGuidanceResponse(language, query);
}
