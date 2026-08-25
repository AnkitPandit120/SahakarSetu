import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { VERIFIED_KNOWLEDGE_DOCUMENTS, searchKnowledgeBase } from './src/data/knowledgeBase';
import { CATEGORIES } from './src/data/categories';
import { VERIFIED_SCHEMES, VERIFIED_SERVICES } from './src/data/schemesAndServices';
import { StructuredAnswer, SourceItem, Language } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !!ai,
    knowledgeDocumentsCount: VERIFIED_KNOWLEDGE_DOCUMENTS.length,
    timestamp: new Date().toISOString()
  });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Schemes endpoint
app.get('/api/schemes', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...VERIFIED_SCHEMES];

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(s =>
      s.name.en.toLowerCase().includes(q) ||
      s.name.hi.toLowerCase().includes(q) ||
      s.shortDescription.en.toLowerCase().includes(q) ||
      s.ministry.en.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// Services endpoint
app.get('/api/services', (req, res) => {
  const { category } = req.query;
  let filtered = [...VERIFIED_SERVICES];
  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }
  res.json(filtered);
});

// Knowledge base sources endpoint
app.get('/api/sources', (req, res) => {
  res.json(VERIFIED_KNOWLEDGE_DOCUMENTS);
});

// Chat & Query RAG endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', categoryId } = req.body as { message: string; language: Language; categoryId?: string };

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Step 1: Query Normalization & RAG Knowledge Retrieval
    const ragResults = searchKnowledgeBase(message);
    const topMatches = ragResults.slice(0, 3);

    // Build context string from knowledge base
    let contextString = '';
    if (topMatches.length > 0) {
      contextString = topMatches.map((item, idx) => {
        return `[Source ${idx + 1}]
Document: ${item.doc.title} (${item.doc.yearOrVersion})
Authority: ${item.doc.authority}
Official URL: ${item.doc.officialUrl}
Section/Clause: ${item.sectionMatch?.section || 'General'} - ${item.sectionMatch?.title || ''}
Content: ${item.sectionMatch?.content || item.doc.description}`;
      }).join('\n\n');
    }

    // Step 2: Attempt Gemini API execution with dynamic intelligent generation
    if (ai) {
      try {
        const systemPrompt = `You are the authoritative, trustworthy public-service legal & cooperative assistant for "SahakarSetu" (Government of India Cooperative Governance & Rural Legal Portal).

CRITICAL DIRECTIVES:
1. Target Audience: Farmers, cooperative members, rural citizens, PACS staff, artisans, women SHGs, and rural stakeholders.
2. Tone: Highly clear, respectful, plain-language, structured, professional, helpful, and completely objective. Never use marketing hype.
3. Language: Respond in the user's requested language (${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'bn' ? 'Bengali' : 'English'}). Write naturally and fluently in the selected language.
4. Source-First principle: Ground your answer in official Indian laws, acts, schemes, or rules (e.g., MSCS Act 2023, Model PACS Bye-laws 2023, PMFBY, Kisan Credit Card, PM-KISAN, NABARD guidelines, Consumer Protection Act, Land Revenue Codes, etc.).
5. If the question matches the provided Knowledge Base context below, use it as a primary reference. If the question is outside the provided local context, use your comprehensive knowledge of Indian agricultural and cooperative laws, government schemes, and citizen rights.
6. Structured format is mandatory. Provide:
   - answer: A direct, specific, comprehensive explanation answering the user's specific query. Never give generic boilerplate.
   - importantNotes: Array of 2-4 crucial conditions, deadlines (e.g. 72 hours for PMFBY), eligibility criteria, step-by-step procedures, or required documents.
   - sources: List of 1-3 cited official sources with documentName, section/clause, authority, and officialUrl.
   - followUpQuestions: 3 diverse, high-value follow-up questions tailored specifically to what the user just asked.

VERIFIED KNOWLEDGE BASE CONTEXT:
${contextString || 'No direct local statutory match found. Answer using authoritative Indian cooperative/agricultural laws and policies (e.g., MSCS Act, Model PACS Bye-laws, PMFBY, KCC, PM-KISAN, CRCS, NABARD, State Cooperative Acts).'}
`;

        const generateWithModel = async (modelName: string) => {
          return await ai.models.generateContent({
            model: modelName,
            contents: message,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  answer: {
                    type: Type.STRING,
                    description: 'The plain language, structured answer to the question.'
                  },
                  importantNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Key conditions, deadlines, exceptions, or warnings.'
                  },
                  sources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        authority: { type: Type.STRING },
                        documentName: { type: Type.STRING },
                        section: { type: Type.STRING },
                        pageNumber: { type: Type.STRING },
                        officialUrl: { type: Type.STRING },
                        sourceType: {
                          type: Type.STRING,
                          enum: ['KNOWLEDGE_BASE', 'GOVERNMENT_PORTAL', 'VERIFIED_WEB']
                        }
                      },
                      required: ['title', 'authority', 'documentName', 'officialUrl', 'sourceType']
                    }
                  },
                  followUpQuestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['answer', 'importantNotes', 'sources']
              }
            }
          });
        };

        const geminiPromise = (async () => {
          try {
            return await generateWithModel('gemini-3.1-flash-lite-preview');
          } catch (e1) {
            console.warn('Primary model failed, trying gemini-3.1-flash-lite:', e1);
            return await generateWithModel('gemini-3.1-flash-lite');
          }
        })();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 15000)
        );

        const geminiResponse: any = await Promise.race([geminiPromise, timeoutPromise]);

        const parsed = JSON.parse(geminiResponse.text || '{}');
        const formattedSources: SourceItem[] = (parsed.sources || []).map((s: any, idx: number) => ({
          id: `src-${Date.now()}-${idx}`,
          title: s.title || s.documentName,
          authority: s.authority || 'Ministry of Cooperation / Government of India',
          documentName: s.documentName || 'Official Statutory Guidelines',
          section: s.section || 'Applicable Provisions',
          pageNumber: s.pageNumber || '',
          officialUrl: s.officialUrl || 'https://cooperation.gov.in',
          sourceType: (s.sourceType as any) || 'KNOWLEDGE_BASE'
        }));

        // If Gemini returned sources or none, supplement with top RAG match if available
        if (formattedSources.length === 0 && topMatches.length > 0) {
          const topDoc = topMatches[0];
          formattedSources.push({
            id: `src-${topDoc.doc.id}`,
            title: topDoc.doc.title,
            authority: topDoc.doc.authority,
            documentName: topDoc.doc.title,
            section: topDoc.sectionMatch?.section || 'Relevant Section',
            pageNumber: 'Official Publication',
            officialUrl: topDoc.doc.officialUrl,
            sourceType: 'KNOWLEDGE_BASE'
          });
        }

        const structuredAnswer: StructuredAnswer = {
          answer: parsed.answer,
          importantNotes: parsed.importantNotes || [],
          sources: formattedSources,
          sourceType: topMatches.length > 0 ? 'KNOWLEDGE_BASE' : 'GOVERNMENT_PORTAL',
          categoryId,
          followUpQuestions: parsed.followUpQuestions || [
            'What documents are required?',
            'Who is eligible?',
            'Where can I submit the application?'
          ],
          legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
          language
        };

        return res.json(structuredAnswer);
      } catch (geminiErr) {
        console.warn('Gemini API query completed with fallback to verified RAG engine:', geminiErr);
        // Fallback to high-precision RAG engine below
      }
    }

    // Step 3: High-precision deterministic RAG fallback engine
    const fallbackAnswer = generateDeterministicRAGAnswer(message, language, topMatches, categoryId);
    return res.json(fallbackAnswer);

  } catch (err: any) {
    console.error('Server chat error:', err);
    res.status(500).json({
      error: 'An error occurred while processing your request. Please try again.'
    });
  }
});

// Deterministic multilingual fallback engine grounded in verified statutory database
function generateDeterministicRAGAnswer(
  query: string,
  lang: Language,
  matches: ReturnType<typeof searchKnowledgeBase>,
  categoryId?: string
): StructuredAnswer {
  const q = query.toLowerCase();

  // 1. PMFBY / Crop Insurance query
  if (q.includes('pmfby') || q.includes('crop insurance') || q.includes('बीमा') || q.includes('विमा') || q.includes('শস্য বীমা') || q.includes('loss') || q.includes('damage') || q.includes('नुकसान') || q.includes('नुकसानी')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) is the national crop insurance scheme providing comprehensive financial risk coverage to farmers against unavoidable natural calamities (drought, flood, unseasonal rainfall, hailstorm, cyclone, pests). Farmers pay a strictly capped nominal premium of 2.0% for Kharif crops, 1.5% for Rabi crops, and 5.0% for commercial/horticultural crops, while the Central and State Governments share 100% of the remaining premium cost.',
        important: [
          '72-Hour Loss Reporting Rule: In case of localized damage (hailstorm, inundation, landslide) or post-harvest losses, you MUST report the loss within 72 hours via the Crop Insurance App, Toll-free Helpline 14447, or your bank/PACS.',
          'Claim payout is calculated based on area-yield crop cutting experiments or localized joint field surveys, transferred directly to your bank account via Aadhaar DBT.',
          'Scheme is voluntary for all farmers (both loanee and non-loanee).'
        ],
        followUps: [
          'What documents are required to claim PMFBY insurance?',
          'How do I report crop loss within 72 hours on the mobile app?',
          'What are the premium cut-off dates for Kharif and Rabi?'
        ]
      },
      hi: {
        answer: 'प्रधानमंत्री फसल बीमा योजना (PMFBY) एक राष्ट्रीय फसल बीमा योजना है जो प्राकृतिक आपदाओं (सूखा, बाढ़, ओलावृष्टि, कीट रोग, बेमौसम बारिश) से फसल क्षति के विरुद्ध किसानों को वित्तीय सुरक्षा प्रदान करती है। किसानों को खरीफ फसलों के लिए केवल 2.0%, रबी फसलों के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5.0% का न्यूनतम प्रीमियम देना होता है। शेष संपूर्ण प्रीमियम केंद्र और राज्य सरकार मिलकर वहन करती हैं।',
        important: [
          '72 घंटे का नियम: ओलावृष्टि, जलभराव या कटाई उपरांत नुकसान की स्थिति में घटना के 72 घंटे के भीतर क्रॉप इंश्योरेंस ऐप, टोल-फ्री नंबर 14447 या बैंक/पैक्स को सूचित करना अनिवार्य है।',
          'बीमा दावा राशि सीधे आधार-लिंक बैंक खाते में डीबीटी (DBT) द्वारा जमा की जाती है।',
          'यह योजना सभी ऋणी और गैर-ऋणी किसानों के लिए स्वैच्छिक है।'
        ],
        followUps: [
          'फसल बीमा दावे के लिए कौन से दस्तावेज आवश्यक हैं?',
          'क्रॉप इंश्योरेंस ऐप पर 72 घंटे के भीतर नुकसान की सूचना कैसे दें?',
          'खरीफ और रबी के लिए बीमा की अंतिम तिथि क्या है?'
        ]
      },
      mr: {
        answer: 'प्रधानमंत्री पीक विमा योजना (PMFBY) ही नैसर्गिक आपत्ती, दुष्काळ, अतिवृष्टी, गारपीट आणि कीडरोगांमुळे होणाऱ्या पीक नुकसानीपासून शेतकऱ्यांना आर्थिक संरक्षण देणारी शासकीय योजना आहे. शेतकऱ्यांना खरीप पिकांसाठी केवळ २.०%, रब्बी पिकांसाठी १.५% आणि बागायती/व्यापारी पिकांसाठी ५.०% इतकाच विमा हप्ता भरावा लागतो. उर्वरित संपूर्ण विमा हप्ता शासन भरते.',
        important: [
          '७२ तासांचा नियम: गारपीट, पूर किंवा काढणीपश्चात नुकसान झाल्यास आपत्तीच्या ७२ तासांच्या आत पीक विमा ॲप किंवा टोल-फ्री १४४४७ वर नोंद करणे बंधनकारक आहे.',
          'नुकसान भरपाई थेट आधार संलग्न बँक खात्यात जमा केली जाते.',
          'कर्जदार आणि बिगर-कर्जदार अशा सर्व शेतकऱ्यांसाठी ही योजना उपलब्ध आहे.'
        ],
        followUps: [
          'पीक विमा क्लेम करण्यासाठी कोणती कागदपत्रे लागतात?',
          'मोबाईल ॲपवर ७२ तासांत नुकसानीची नोंद कशी करावी?',
          'खरीप आणि रब्बीसाठी अर्ज करण्याची शेवटची तारीख काय आहे?'
        ]
      },
      bn: {
        answer: 'প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY) হলো একটি জাতীয় ফসল বীমা প্রকল্প যা প্রাকৃতিক দুর্যোগ, খরা, বন্যা, শিলাবৃষ্টি ও পোকার আক্রমণে ফসল নষ্ট হলে কৃষকদের ক্ষতিপূরণ নিশ্চিত করে। কৃষকদের জন্য প্রিমিয়ামের হার খারিফ ফসলে মাত্র ২.০%, রবি ফসলে ১.৫% এবং বাণিজ্যিক ফসলে ৫.০%। অবশিষ্ট সম্পূর্ণ প্রিমিয়াম সরকার বহন করে।',
        important: [
          '৭২ ঘণ্টার নিয়ম: শিলাবৃষ্টি বা অতিরিক্ত বৃষ্টিতে ফসল নষ্ট হলে ৭২ ঘণ্টার মধ্যে ক্রপ ইন্স্যুরেন্স অ্যাপ বা টোল-ফ্রি ১৪৪৪৭ নম্বরে জানাতে হবে।',
          'বীমার ক্ষতিপূরণের অর্থ সরাসরি আধারের সাথে যুক্ত ব্যাঙ্ক অ্যাকাউন্টে জমা হয়।',
          'ঋণগ্রহীতা এবং সাধারণ সকল কৃষকের জন্য এই বীমা উন্মুক্ত।'
        ],
        followUps: [
          'ফসল বীমা দাবির জন্য কী কী নথি প্রয়োজন?',
          'অ্যাপের মাধ্যমে কীভাবে ৭২ ঘণ্টার মধ্যে ক্ষতিপূরণ জানাব?',
          'খারিফ ও রবি মরশুমের আবেদনের শেষ সময়সীমা কত?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-pmfby-guidelines',
          title: 'PMFBY Operational Guidelines',
          authority: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
          documentName: 'Pradhan Mantri Fasal Bima Yojana Operational Guidelines (Revised)',
          section: 'Chapter 4, Section 4.2 & Chapter 3, Section 3.2',
          pageNumber: 'Pages 18-24',
          officialUrl: 'https://pmfby.gov.in',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Statutory guidelines defining 72-hour localized loss reporting and farmer premium caps.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'agriculture-insurance',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 2. PACS Membership & Services query
  if (q.includes('pacs') || q.includes('member') || q.includes('membership') || q.includes('पैक्स') || q.includes('पॅक्स') || q.includes('প্যাকস') || q.includes('सभासद') || q.includes('সদস্য')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'To become a voting member of a Primary Agricultural Credit Society (PACS), a rural resident (farmer, agricultural labourer, artisan, or small entrepreneur) within the PACS area of operation must submit prescribed Form A, purchase at least one share capital, and pay the nominal admission fee (usually Rs 10 to Rs 50). Under the Model PACS Bye-laws 2023, PACS now operate as multipurpose village hubs providing short-term crop credit, subsidized fertilizers, warehousing, custom hiring centres, and Common Service Centre (CSC) digital facilities.',
        important: [
          'Democratic Principle: Every regular member has one vote in general body meetings irrespective of the number of shares held (Section 30, Multi-State / State Cooperative Societies Acts).',
          'Managing Committee must review membership applications within 30 days of submission.',
          'Members have statutory rights to inspect audited accounts, receive dividends, and contest elections.'
        ],
        followUps: [
          'What are the Model PACS Bye-laws introduced by the Ministry of Cooperation?',
          'What documents are needed to apply for PACS membership?',
          'How can I file a complaint if PACS rejects my membership application?'
        ]
      },
      hi: {
        answer: 'प्राथमिक कृषि साख समिति (PACS) का नियमित मतदान सदस्य बनने के लिए समिति के कार्यक्षेत्र में रहने वाले किसान, कृषि मजदूर, कारीगर या छोटे व्यवसायी को निर्धारित प्रपत्र-ए भरना होता है, न्यूनतम एक शेयर खरीदना होता है और प्रवेश शुल्क (10 से 50 रुपये) जमा करना होता है। सहकारिता मंत्रालय के मॉडल उप-नियमों (Model Bye-laws 2023) के तहत पैक्स अब खाद-बीज, रियायती फसली ऋण के अलावा कॉमन सर्विस सेंटर (CSC), भंडारण और कस्टम हायरिंग सेवाएं भी दे रहे हैं।',
        important: [
          'एक सदस्य, एक मत: प्रत्येक नियमित सदस्य को आम सभा में एक मत देने का वैधानिक अधिकार है, चाहे उसके पास कितने भी शेयर हों।',
          'प्रबंध समिति को आवेदन प्राप्त होने के 30 दिनों के भीतर निर्णय लेना अनिवार्य है।',
          'सदस्यों को ऑडिट रिपोर्ट देखने, लाभांश प्राप्त करने और चुनाव लड़ने का कानूनी अधिकार है।'
        ],
        followUps: [
          'पैक्स सदस्यता के लिए कौन से दस्तावेज आवश्यक हैं?',
          'सहकारिता मंत्रालय के नए मॉडल उप-नियमों से क्या लाभ हैं?',
          'यदि पैक्स सचिव सदस्यता देने से मना करे तो कहां शिकायत करें?'
        ]
      },
      mr: {
        answer: 'गावातील प्राथमिक कृषी पतसंस्थेचे (PACS) नियमित मतदार सभासद होण्यासाठी कार्यक्षेत्रातील शेतकरी, शेतमजूर किंवा कारागिराने विहित नमुन्यातील अर्ज भरून किमान एक शेअर खरेदी करणे व प्रवेश फी भरणे आवश्यक असते. सहकार मंत्रालयाच्या नवीन आदर्श उपविधी २०२३ नुसार पॅक्स आता केवळ कर्ज वाटप न करता खत विक्री, धान्य साठवणूक, शेती अवजारे भाडे आणि सीएससी (CSC) डिजिटल सेवा केंद्र म्हणून कार्यरत आहेत.',
        important: [
          'एक व्यक्ती एक मत: सहकारी संस्थेत प्रत्येक सभासदास समान मतदानाचा अधिकार असतो (कलम ३०, सहकारी संस्था कायदा).',
          'संचालक मंडळाने ३० दिवसांच्या आत सभासदत्व अर्जावर निर्णय घेणे बंधनकारक आहे.',
          'हिशोब तपासणे, लाभांश मिळवणे आणि निवडणूक लढवणे हा सभासदाचा कायदेशीर अधिकार आहे.'
        ],
        followUps: [
          'पॅक्स सभासद होण्यासाठी कोणती कागदपत्रे लागतात?',
          'पॅक्सच्या नवीन आदर्श उपविधीचे फायदे काय आहेत?',
          'सभासदत्व नाकारल्यास निबंधकांकडे कशी तक्रार करावी?'
        ]
      },
      bn: {
        answer: 'প্রাথমিক কৃষি সমবায় সমিতিতে (PACS) পূর্ণাঙ্গ ভোটাধিকার সদস্য হতে হলে সংশ্লিষ্ট এলাকার কৃষক, কৃষি শ্রমিক বা কারিগরকে নির্ধারিত ফর্ম পূরণ করে কমপক্ষে একটি শেয়ার ক্রয় এবং সামান্য প্রবেশ ফি প্রদান করতে হয়। কেন্দ্রীয় সমবায় মন্ত্রণালয়ের মডেল উপ-আইন ২০২৩ অনুযায়ী প্যাকস এখন সুলভ ঋণ ও সার বিতরণের পাশাপাশি কমন সার্ভিস সেন্টার (CSC), কোল্ড স্টোরেজ ও কৃষি যন্ত্রপাতি ভাড়ার কেন্দ্র হিসেবে পরিচালিত হচ্ছে।',
        important: [
          'এক সদস্য এক ভোট: শেয়ারের সংখ্যা যাই হোক না কেন, সাধারণ সভায় প্রতি সদস্যের একটিমাত্র ভোটের অধিকার থাকে।',
          'আবেদন জমা দেওয়ার ৩০ দিনের মধ্যে পরিচালনা কমিটিকে সিদ্ধান্ত নিতে হয়।',
          'নিরীক্ষিত হিসাব পরীক্ষা করা ও নির্বাচনে অংশগ্রহণের আইনি অধিকার রয়েছে।'
        ],
        followUps: [
          'প্যাকস সদস্যপদের জন্য কী কী নথি প্রয়োজন?',
          'মডেল উপ-আইনের নতুন সুযোগ-সুবিধা কী কী?',
          'প্যাকস সদস্যপদ না দিলে কীভাবে অভিযোগ দায়ের করবেন?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-pacs-model-byelaws',
          title: 'Model Bye-Laws for PACS (2023)',
          authority: 'Ministry of Cooperation, Government of India',
          documentName: 'Model Bye-Laws for Primary Agricultural Credit Societies',
          section: 'Clause 8 (Membership) & Clause 4 (Objectives)',
          pageNumber: 'Clauses 4, 8 & 14',
          officialUrl: 'https://cooperation.gov.in/pacs-model-byelaws',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Guidelines for transparent membership admission, digital computerization, and CSC multipurpose operations.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'pacs-services',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 3. Cooperative Rights, Elections & Legal Grievances
  if (q.includes('right') || q.includes('election') || q.includes('ombudsman') || q.includes('complaint') || q.includes('grievance') || q.includes('अधिकार') || q.includes('शिकायत') || q.includes('तक्रार') || q.includes('হক') || q.includes('অভিযোগ') || q.includes('ভোট')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'Under the Multi-State Co-operative Societies Act 2002 and its landmark 2023 Amendment, members hold democratic rights including: (1) One member, one vote principle regardless of shareholding, (2) Right to inspect books of accounts and audit reports, (3) Right to participate in the Annual General Meeting, (4) Direct grievance filing with the newly established Co-operative Ombudsman (Section 85A), and (5) Statutory arbitration under Section 84 for financial and administrative disputes.',
        important: [
          'Co-operative Ombudsman: Investigates corruption, non-refund of deposits, or election irregularities in Multi-State Societies.',
          'Co-operative Election Authority: Elections must be conducted independently and democratically with mandatory reservations for women and SC/ST board members.',
          'To file a grievance, members should first submit a written representation to the Society Secretary; if unresolved in 30 days, escalate to the District Deputy Registrar or crcs.gov.in.'
        ],
        followUps: [
          'How do I file a complaint on the CRCS grievance portal?',
          'What are the powers of the Cooperative Ombudsman under Section 85A?',
          'What is the procedure for arbitration under Section 84?'
        ]
      },
      hi: {
        answer: 'मल्टी-स्टेट सहकारी समिति अधिनियम 2002 और 2023 संशोधन के तहत सदस्यों को प्रमुख वैधानिक अधिकार प्राप्त हैं: (1) शेयर पूंजी के बावजूद एक सदस्य-एक मत का अधिकार, (2) लेखा बहियों और वार्षिक ऑडिट रिपोर्ट का निरीक्षण करने का अधिकार, (3) वार्षिक आम सभा में भाग लेने का अधिकार, (4) नवगठित सहकारी लोकपाल (धारा 85A) के समक्ष शिकायत दर्ज करने का अधिकार, और (5) धारा 84 के तहत विवादों में मध्यस्थता (Arbitration) का अधिकार।',
        important: [
          'सहकारी लोकपाल: जमा राशि न लौटाने, ऋण गबन या चुनावी अनियमितताओं की निष्पक्ष जांच करता है।',
          'सहकारी चुनाव प्राधिकरण: चुनाव स्वतंत्र रूप से कराता है जिसमें महिलाओं और एससी/एसटी के लिए सीटें आरक्षित होती हैं।',
          'शिकायत प्रक्रिया: पहले सचिव को लिखित आवेदन दें, 30 दिनों में समाधान न होने पर जिला उप निबंधक या crcs.gov.in पर ऑनलाइन अपील करें।'
        ],
        followUps: [
          'सीआरसीएस (CRCS) पोर्टल पर शिकायत कैसे दर्ज करें?',
          'सहकारी लोकपाल के क्या अधिकार हैं?',
          'धारा 84 के तहत मध्यस्थता की क्या प्रक्रिया है?'
        ]
      },
      mr: {
        answer: 'मल्टी-स्टेट सहकारी संस्था कायदा २००२ आणि २०२३ च्या सुधारणेनुसार सभासदांना महत्त्वाचे अधिकार आहेत: (१) एक सभासद एक मत हे लोकशाही तत्त्व, (२) लेखापरीक्षण अहवाल व हिशोब तपासण्याचा अधिकार, (३) वार्षिक सर्वसाधारण सभेत उपस्थित राहण्याचा हक्क, (४) सहकार लोकपाल (कलम ८५-अ) कडे थेट दाद मागण्याचा हक्क, आणि (५) कलम ८४ अंतर्गत लवादाकडे वाद निवारणाचा अधिकार.',
        important: [
          'सहकार लोकपाल: ठेवी परत न मिळणे किंवा भ्रष्टाचाराच्या तक्रारींवर कारवाई करण्याचे वैधानिक अधिकार.',
          'सहकारी निवडणूक प्राधिकरण: निवडणुका वेळेवर व पारदर्शक पद्धतीने घेणे बंधनकारक.',
          'तक्रार निवारण: आधी संस्थेला लेखी अर्ज द्यावा, ३० दिवसांत निवारण न झाल्यास जिल्हा उपनिबंधक किंवा crcs.gov.in वर तक्रार नोंदवावी.'
        ],
        followUps: [
          'सीआरसीएस पोर्टलवर ऑनलाइन तक्रार कशी करावी?',
          'सहकार लोकपालाचे वैधानिक अधिकार काय आहेत?',
          'संस्थेविरुद्ध लवादाकडे दाद कशी मागावी?'
        ]
      },
      bn: {
        answer: 'মাল্টি-স্টেট সমবায় সমিতি আইন ২০০২ এবং ২০২৩ সংশোধনী অনুসারে সদস্যদের মূল আইনি অধিকারসমূহ হলো: (১) শেয়ারের পরিমাণ নির্বিশেষে এক সদস্য এক ভোট নীতি, (২) সমিতির নিরীক্ষিত হিসাব ও অডিট রিপোর্ট পরিদর্শনের অধিকার, (৩) বার্ষিক সাধারণ সভায় বক্তব্য রাখার অধিকার, (৪) সমবায় ন্যায়পালের (ধারা ৮৫ক) কাছে সরাসরি অভিযোগ জানানোর অধিকার, এবং (৫) ধারা ৮৪ এর অধীনে সালিশির (Arbitration) মাধ্যমে বিরোধ নিষ্পত্তির অধিকার।',
        important: [
          'সমবায় ন্যায়পাল: আমানত ফেরত না পাওয়া বা অনিয়মের বিরুদ্ধে নিরপেক্ষ তদন্তের জন্য নিয়োজিত।',
          'নির্বাচন কর্তৃপক্ষ: পরিচালনা পর্ষদের নির্বাচন গণতান্ত্রিকভাবে নারী ও অনগ্রসর শ্রেণীর সংরক্ষণসহ অনুষ্ঠিত হয়।',
          'অভিযোগ পদ্ধতি: প্রথমে সমিতিতে লিখিত চিঠি দিন, ৩০ দিনে সুরাহা না হলে জেলা উপ-রেজিস্ট্রার বা crcs.gov.in এ অভিযোগ করুন।'
        ],
        followUps: [
          'সিআরসিএস পোর্টালে কীভাবে অভিযোগ দায়ের করবেন?',
          'সমবায় ন্যায়পালের ক্ষমতা ও এখতিয়ার কী?',
          'আইনের ৮৪ ধারায় সালিশির আবেদন কীভাবে করতে হয়?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-mscs-act-2023',
          title: 'Multi-State Co-operative Societies Act & Amendment 2023',
          authority: 'Ministry of Cooperation, Government of India',
          documentName: 'Multi-State Co-operative Societies (Amendment) Act, 2023',
          section: 'Section 30 (Member Rights), Section 45 & Section 85A (Ombudsman)',
          pageNumber: 'Sections 29, 30, 45, 84, 85A',
          officialUrl: 'https://cooperation.gov.in',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Statutory provisions for member democratic rights, audit transparency, election guidelines, and Ombudsman dispute resolution.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'cooperative-law',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 4. Kisan Credit Card (KCC) & Agricultural Credit
  if (q.includes('kcc') || q.includes('kisan credit') || q.includes('loan') || q.includes('credit card') || q.includes('कर्ज') || q.includes('ऋण') || q.includes('লোন') || q.includes('ক্রেডিট')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'The Kisan Credit Card (KCC) scheme provides farmers with single-window flexible credit for crop cultivation, post-harvest expenses, and allied activities (dairy, fishery, animal husbandry). Under the Interest Subvention Scheme (ISS), short-term loans up to Rs 3,00,000 are available at an effective interest rate of 4% p.a. (7% benchmark minus 3% for prompt repayment on or before due date).',
        important: [
          'Collateral-free limit: Crop loans up to Rs 1,60,000 require no mortgage or collateral security.',
          'Validity: KCC is valid for 5 years with a sanctioned revolving credit limit that increases automatically by 10% each year.',
          'Eligible: All landowning farmers, tenant farmers, oral lessees, and Self Help Groups (SHGs).'
        ],
        followUps: [
          'What documents are needed to apply for a KCC at PACS?',
          'How does the 3% prompt repayment interest subvention work?',
          'Can animal husbandry and dairy farmers get a KCC?'
        ]
      },
      hi: {
        answer: 'किसान क्रेडिट कार्ड (KCC) योजना किसानों को फसल बुवाई, कटाई उपरांत खर्चों और संबद्ध गतिविधियों (डेयरी, मत्स्य पालन) के लिए आसान ऋण प्रदान करती है। ब्याज सहायता योजना (ISS) के तहत 3,00,000 रुपये तक का अल्पकालिक फसली ऋण समय पर चुकाने पर मात्र 4% वार्षिक प्रभावी ब्याज दर पर मिलता है (7% सामान्य दर में से 3% त्वरित पुनर्भुगतान छूट)।',
        important: [
          'बिना गारंटी (कोलेटरल-मुक्त) ऋण: 1,60,000 रुपये तक के फसली ऋण के लिए किसी बंधक या जमीन गिरवी रखने की आवश्यकता नहीं है।',
          'वैधता: केसीसी 5 वर्षों के लिए वैध होता है और प्रत्येक वर्ष सीमा में 10% की स्वचालित वृद्धि होती है।',
          'पात्रता: सभी भू-स्वामी किसान, बटाईदार और स्वयं सहायता समूह (SHG) पात्र हैं।'
        ],
        followUps: [
          'केसीसी के लिए कौन से दस्तावेज जमा करने होते हैं?',
          '3% ब्याज छूट का लाभ कैसे मिलता है?',
          'क्या पशुपालन के लिए भी केसीसी बन सकता है?'
        ]
      },
      mr: {
        answer: 'किसान क्रेडिट कार्ड (KCC) योजना शेतकऱ्यांना पीक मशागत, खते-बियाणे आणि दुग्धव्यवसाय/मत्स्यपालनासाठी सुलभ कर्जपुरवठा करते. व्याज सवलत योजनेनुसार रु. ३,००,००० पर्यंतचे पीककर्ज वेळेत परतफेड केल्यास केवळ ४% दराने उपलब्ध होते (७% मूळ व्याजदरात ३% नियमित परतफेड प्रोत्साहन सवलत).',
        important: [
          'विनातारण कर्ज मर्यादा: रु. १,६०,००० पर्यंतच्या पीककर्जासाठी कोणतीही जमीन गहाण ठेवण्याची गरज नसते.',
          'कालावधी: केसीसी ५ वर्षांसाठी वैध असते आणि दरवर्षी कर्ज मर्यादेत १०% वाढ होते.',
          'पात्रता: सर्व खातेदार शेतकरी, कुळ शेतकरी आणि बचत गट पात्र आहेत.'
        ],
        followUps: [
          'केसीसी काढण्यासाठी कोणती कागदपत्रे लागतात?',
          '४% व्याजदराचा लाभ कसा मिळतो?',
          'पशुपालनासाठी केसीसी मर्यादा किती आहे?'
        ]
      },
      bn: {
        answer: 'কিষাণ ক্রেডিট কার্ড (KCC) প্রকল্পের মাধ্যমে কৃষকদের ফসল চাষ, সার-বীজ এবং পশুপালন/মৎস্যচাষের জন্য সহজ শর্তে ঋণ দেওয়া হয়। সময়মতো ঋণ পরিশোধ করলে বার্ষিক ৩,০০,০০০ টাকা পর্যন্ত ঋণ মাত্র ৪% সুদে পাওয়া যায় (৭% স্বাভাবিক হারের ওপর ৩% রিবেট)।',
        important: [
          'জামিনহীন ঋণ: ১,৬০,০০০ টাকা পর্যন্ত ফসলি ঋণের জন্য কোনো জমি বন্ধক রাখতে হয় না।',
          'মেয়াদ: কেসিসি কার্ড ৫ বছরের জন্য বৈধ এবং প্রতি বছর ১০% ঋণসীমা বৃদ্ধি পায়।',
          'যোগ্যতা: সমস্ত কৃষক, ভাগচাষী এবং স্বনির্ভর দল (SHG) আবেদন করতে পারেন।'
        ],
        followUps: [
          'কেসিসি আবেদনের জন্য কী কী নথিপত্র দরকার?',
          '৪% সুদের সুবিধার নিয়ম কী?',
          'পশুপালনের জন্য কেসিসি কীভাবে পাব?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-kcc-nabard',
          title: 'Master Circular on Kisan Credit Card (KCC) Scheme',
          authority: 'Reserve Bank of India (RBI) & NABARD',
          documentName: 'Kisan Credit Card Scheme & Interest Subvention Guidelines',
          section: 'Section 3 & Section 6 (Interest Subvention)',
          pageNumber: 'Sections 3, 6, 7',
          officialUrl: 'https://www.nabard.org',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Statutory guidelines defining 4% effective interest rate, credit scale of finance, and Rs 1.6 Lakh collateral waiver.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'finance-literacy',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 5. PM-KISAN Scheme
  if (q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('samman nidhi') || q.includes('सम्मान निधि') || q.includes('सन्मान निधी') || q.includes('সম্মান নিধি') || q.includes('6000') || q.includes('installment') || q.includes('हफ्ता')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector income support scheme providing Rs 6,000 per year to eligible landholding farmer families across India. The financial benefit is disbursed directly into bank accounts via DBT in three equal installments of Rs 2,000 every four months (April-July, August-November, December-March).',
        important: [
          'Mandatory Prerequisites: (1) Completed e-KYC on pmkisan.gov.in (via OTP, biometric, or Face Auth app), (2) Land record seeding with state land registry, and (3) Aadhaar-linked active bank account (NPCI DBT enabled).',
          'Ineligibility: Income tax payees, serving/retired government employees, institutional landholders, and constitutional post holders are excluded.',
          'Grievance: Use the PM-KISAN Portal Helpdesk or call Toll-free 155261 / 011-24300606.'
        ],
        followUps: [
          'How do I complete PM-KISAN e-KYC using Face Authentication?',
          'What should I do if my PM-KISAN installment is stopped due to land seeding?',
          'How can I check my name in the PM-KISAN beneficiary list?'
        ]
      },
      hi: {
        answer: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN) योजना के तहत पात्र भूमिधारक किसान परिवारों को प्रति वर्ष 6,000 रुपये की प्रत्यक्ष आर्थिक सहायता दी जाती है। यह राशि 2,000-2,000 रुपये की तीन समान किस्तों में हर चार महीने पर सीधे आधार लिंक बैंक खाते में डीबीटी (DBT) के माध्यम से जमा होती है।',
        important: [
          'अनिवार्य शर्तें: (1) pmkisan.gov.in पर e-KYC पूर्ण होना, (2) राज्य भूलेख पोर्टल से भूमि का सत्यापन (Land Seeding), और (3) बैंक खाते का आधार एवं एनपीसीआई (NPCI DBT) से सक्रिय जुड़ाव।',
          'अपात्रता: आयकर दाता, सरकारी कर्मचारी, संवैधानिक पदधारक और संस्थागत भूमि स्वामी इस योजना के पात्र नहीं हैं।',
          'हेल्पलाइन: किसी भी समस्या के लिए टोल-फ्री 155261 या 1800115526 पर संपर्क करें।'
        ],
        followUps: [
          'फेस ऑथेंटिकेशन से मोबाइल पर e-KYC कैसे करें?',
          'लैंड सीडिंग (Land Seeding) ठीक कराने की क्या प्रक्रिया है?',
          'पीएम किसान लाभार्थी सूची में अपना नाम कैसे देखें?'
        ]
      },
      mr: {
        answer: 'प्रधानमंत्री किसान सन्मान निधी (PM-KISAN) योजनेअंतर्गत पात्र शेतकरी कुटुंबांना प्रतिवर्ष रु. ६,००० ची आर्थिक मदत दिली जाते. ही रक्कम प्रत्येकी रु. २,००० च्या तीन हप्त्यांमध्ये दर चार महिन्यांनी थेट बँक खात्यात जमा होते.',
        important: [
          'आवश्यक अटी: (१) e-KYC पूर्ण असणे, (२) जमिनीची नोंद (Land Seeding) प्रमाणित असणे, आणि (३) बँक खाते आधारशी जोडलेले (NPCI DBT सक्षम) असणे.',
          'अपात्रता: आयकर भरणारे, सरकारी नोकरदार आणि संस्थात्मक जमीनधारक या योजनेस पात्र नाहीत.',
          'हेल्पलाइन: टोल-फ्री १५५२६१ किंवा १८००११५५२६.'
        ],
        followUps: [
          'मोबाईलवरून e-KYC कसे करावे?',
          'लँड सीडिंग प्रलंबित असल्यास काय करावे?',
          'लाभार्थी यादीमध्ये आपले नाव कसे तपासावे?'
        ]
      },
      bn: {
        answer: 'প্রধানমন্ত্রী কিষাণ সম্মান নিধি (PM-KISAN) প্রকল্পের আওতায় যোগ্য কৃষক পরিবারগুলিকে বছরে ৬,০০০ টাকা আর্থিক সহায়তা দেওয়া হয়। এই অর্থ ২,০০০ টাকা করে তিনটি কিস্তিতে প্রতি চার মাস অন্তর সরাসরি ব্যাঙ্ক অ্যাকাউন্টে জমা পড়ে।',
        important: [
          'আবশ্যিক শর্ত: (১) e-KYC সম্পন্ন করা, (২) জমির রেকর্ড যাচাই (Land Seeding), এবং (৩) ব্যাঙ্ক অ্যাকাউন্টে আধার ও NPCI DBT সক্রিয় থাকা।',
          'অনুপযুক্ততা: আয়কর প্রদানকারী ও সরকারি কর্মচারীরা এই সুবিধার আওতাভুক্ত নন।',
          'হেল্পলাইন: টোল-ফ্রি ১৫৫২৬১ বা ১৮০০১১৫৫২৬.'
        ],
        followUps: [
          'কীভাবে মোবাইলে e-KYC করবেন?',
          'ল্যান্ড সিডিং সমস্যা কীভাবে সমাধান করবেন?',
          'পিএম কিষাণ তালিকায় নাম আছে কিনা কীভাবে জানবেন?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-pm-kisan',
          title: 'PM-KISAN Operational Guidelines',
          authority: 'Ministry of Agriculture and Farmers Welfare, Govt of India',
          documentName: 'Pradhan Mantri Kisan Samman Nidhi Scheme Guidelines',
          section: 'Clause 2 (Benefits) & Clause 3 (e-KYC Mandatory Seeding)',
          pageNumber: 'Clauses 2, 3, 5',
          officialUrl: 'https://pmkisan.gov.in',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Guidelines for direct benefit transfer of Rs 6000/year, e-KYC authentication, and land eligibility verification.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'gov-schemes',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 6. Land Records, 7/12 Extract, and Mortgage Clearance
  if (q.includes('7/12') || q.includes('land') || q.includes('khasra') || q.includes('khatauni') || q.includes('extract') || q.includes('bhoomi') || q.includes('mortgage') || q.includes('noc') || q.includes('जमीन') || q.includes('सातबारा') || q.includes('खसरा') || q.includes('খতিয়ান') || q.includes('জমি')) {
    const answers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
      en: {
        answer: 'Agricultural land records (7/12 Extract, Khasra-Khatauni, RoR) are legal documents proving ownership, survey numbers, cultivated area, and existing financial liabilities. When availing cooperative crop loans, a statutory charge (Gehan/Mortgage) is marked on the record. Upon full loan repayment, the PACS Secretary issues a Loan Clearance Certificate and submits an online e-mutation application to remove the bank charge within 15 days.',
        important: [
          'Digital RoR: Digital signed extracts downloaded from state portals (Bhoomi, Mahabhulekh, AnyRoR, Banglarbhumi, UP Bhulekh) are legally valid for all bank/court purposes.',
          'NOC: Always collect physical stamped No Due Certificate (NDC) and Loan Discharge Slip from your cooperative society.',
          'Charge Removal: Ensure the Talathi/Patwari/Revenue Inspector formally removes the society charge from the RoR.'
        ],
        followUps: [
          'How can I get the bank charge removed from my 7/12 extract after repaying loan?',
          'Where can I download digitally signed land records online?',
          'What is the difference between Khasra and Khatauni?'
        ]
      },
      hi: {
        answer: 'कृषि भूलेख (खसरा-खतौनी / 7/12 / अधिकार अभिलेख) जमीन के मालिकाना हक, खसरा नंबर, क्षेत्रफल और उस पर दर्ज बैंक ऋण के वैधानिक प्रमाण होते हैं। पैक्स से ऋण लेते समय जमीन पर सहकारी प्रभार (गहन/बंधक) दर्ज किया जाता है। ऋण पूर्ण चुकता करने के बाद पैक्स सचिव से ऋण मुक्ति प्रमाण पत्र (NOC) प्राप्त कर 15 दिनों में ई-नामांतरण द्वारा जमीन से प्रभार हटवाया जा सकता है।',
        important: [
          'डिजिटल भूलेख: राज्य के भूलेख पोर्टल (UP Bhulekh, MP Bhulekh, Bihar Bhumi, AnyRoR) से डाउनलोड की गई डिजिटल हस्ताक्षरित खतौनी कानूनी रूप से पूरी तरह मान्य है।',
          'अदेयता प्रमाण पत्र: ऋण चुकता होते ही पैक्स से मुहर लगा अनापत्ति प्रमाण पत्र (NOC) अवश्य प्राप्त करें।',
          'प्रभार मुक्ति: पटवारी/लेखपाल द्वारा भूलेख से बैंक का नाम हटाने का रिकॉर्ड सुरक्षित रखें।'
        ],
        followUps: [
          'ऋण चुकाने के बाद खतौनी से बैंक बंधक कैसे हटवाएं?',
          'डिजिटल हस्ताक्षरित खसरा-खतौनी ऑनलाइन कैसे डाउनलोड करें?',
          'खसरा और खतौनी में क्या अंतर होता है?'
        ]
      },
      mr: {
        answer: 'कृषी जमीन महसूल अभिलेख (७/१२ उतारा, ८-अ) हे जमिनीची मालकी, गट क्रमांक, क्षेत्रफळ आणि त्यावर असलेल्या कर्जाच्या बोजाची अधिकृत नोंद असते. विकास सोसायटीकडून पीककर्ज घेताना जमिनीवर कर्जाचा बोजा चढवला जातो. संपूर्ण कर्जफेड केल्यानंतर सोसायटीकडून कर्जमुक्ती प्रमाणपत्र (NOC) घेऊन तलाठ्याकडे ई-फेरफार अर्ज करून बोजा कमी करता येतो.',
        important: [
          'डिजिटल सातबारा: महाभूलेख (Mahabhulekh) पोर्टलवरून डाऊनलोड केलेला डिजिटल स्वाक्षरी असलेला ७/१२ सर्व शासकीय व न्यायालयीन कामांसाठी ग्राह्य आहे.',
          'ना-हरकत प्रमाणपत्र: सोसायटीचे कर्ज पूर्ण भरल्यावर सही-शिक्क्याचे ना-हरकत प्रमाणपत्र (NOC) नक्की घ्यावे.',
          'बोजा कमी करणे: १५ दिवसांच्या आत ई-हक्क प्रणालीद्वारे ७/१२ वरून बोजा उतरवून घ्यावा.'
        ],
        followUps: [
          'कर्ज फेडल्यानंतर ७/१२ वरील बोजा कसा कमी करावा?',
          'डिजिटल स्वाक्षरीचा ७/१२ उतारा कसा डाऊनलोड करावा?',
          '८-अ खाते उतारा कशासाठी आवश्यक असतो?'
        ]
      },
      bn: {
        answer: 'জমির রেকর্ড (খতিয়ান, পরচা, দাগ নম্বর) হলো জমির মালিকানা, সীমানা এবং কোনো ঋণ আছে কিনা তার আইনি প্রমাণ। সমবায় সমিতি থেকে ঋণ নেওয়ার সময় রেকর্ডে মর্টগেজ বা দায় চিহ্নিত করা হয়। ঋণ সম্পূর্ণ পরিশোধের পর সমিতি থেকে নো-অবজেকশন সার্টিফিকেট (NOC) নিয়ে ভূমি সংস্কার দপ্তরে আবেদন করে দায়মুক্ত করতে হয়।',
        important: [
          'ডিজিটাল পরচা: বাংলারভূমি (Banglarbhumi) পোর্টাল থেকে ডাউনলোড করা ডিজিটাল স্বাক্ষরিত খতিয়ান আইনগতভাবে সম্পূর্ণ বৈধ।',
          'এনওসি: ঋণ পরিশোধের পর সমিতির রসিদ ও এনওসি সংরক্ষণ করুন।',
          'রেকর্ড সংশোধন: রাজস্ব দপ্তরে ই-মিউটেশন আবেদনের মাধ্যমে জমির রেকর্ড দায়মুক্ত করুন।'
        ],
        followUps: [
          'ঋণ পরিশোধের পর জমির খতিয়ান থেকে ব্যাংকের দায় কীভাবে মুছবেন?',
          'অনলাইনে ডিজিটাল পরচা কীভাবে ডাউনলোড করবেন?',
          'খতিয়ান ও দাগ নম্বরের মধ্যে পার্থক্য কী?'
        ]
      }
    };

    const resData = answers[lang] || answers.en;
    return {
      answer: resData.answer,
      importantNotes: resData.important,
      sources: [
        {
          id: 'src-land-records',
          title: 'Digital Land Records Modernization & Mortgage Guidelines',
          authority: 'Department of Land Resources & State Revenue Departments',
          documentName: 'Digital India Land Records Modernization Programme (DILRMP)',
          section: 'Rule 1 (Record of Rights) & Rule 3 (Discharge of Charge)',
          pageNumber: 'Rules 1, 2, 3',
          officialUrl: 'https://dilrmp.gov.in',
          sourceType: 'KNOWLEDGE_BASE',
          summary: 'Procedures for digital land verification, cooperative charge creation, and time-bound NOC discharge.'
        }
      ],
      sourceType: 'KNOWLEDGE_BASE',
      categoryId: categoryId || 'property-documents',
      followUpQuestions: resData.followUps,
      legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
      language: lang
    };
  }

  // 7. Default / General Query response grounded in knowledge base matches
  const topMatch = matches.length > 0 ? matches[0] : { doc: VERIFIED_KNOWLEDGE_DOCUMENTS[0], sectionMatch: undefined, score: 1 };
  const sectionTitle = topMatch.sectionMatch ? `${topMatch.sectionMatch.section}: ${topMatch.sectionMatch.title}` : 'General Guidelines';
  const sectionContent = topMatch.sectionMatch ? topMatch.sectionMatch.content : topMatch.doc.description;

  const defaultAnswers: Record<Language, { answer: string; important: string[]; followUps: string[] }> = {
    en: {
      answer: `According to verified provisions in the ${topMatch.doc.title}, ${sectionContent} This guidance is structured to assist cooperative members, farmers, and rural citizens under official rules established by the ${topMatch.doc.authority}.`,
      important: [
        'Always verify with official circulars and by-laws of your specific district or state cooperative registrar.',
        'Keep signed copies of all applications, receipts, and acknowledgment records for any statutory filings.',
        'Official government portals (cooperation.gov.in, pmfby.gov.in, pmkisan.gov.in) are the authoritative sources for latest schemes.'
      ],
      followUps: [
        'What are the eligibility conditions under this scheme/act?',
        'What documents are needed to apply?',
        'Where is the official government portal located?'
      ]
    },
    hi: {
      answer: `${topMatch.doc.title} के आधिकारिक प्रावधानों के अनुसार, ${sectionContent} यह मार्गदर्शन ${topMatch.doc.authority} द्वारा स्थापित नियमों के तहत सहकारी सदस्यों और किसानों की सहायता के लिए है।`,
      important: [
        'सदैव अपने राज्य या जिला सहकारी निबंधक के आधिकारिक उप-नियमों से भी पुष्टि करें।',
        'किसी भी आवेदन या शिकायत की मुहर लगी पावती प्रति सुरक्षित रखें।',
        'नवीनतम जानकारी के लिए आधिकारिक पोर्टल (cooperation.gov.in, pmfby.gov.in) पर जाएं।'
      ],
      followUps: [
        'इस योजना या कानून के तहत क्या पात्रता शर्तें हैं?',
        'आवेदन के लिए कौन से दस्तावेज आवश्यक हैं?',
        'आधिकारिक सरकारी पोर्टल का लिंक क्या है?'
      ]
    },
    mr: {
      answer: `${topMatch.doc.title} च्या अधिकृत नियमांनुसार, ${sectionContent} ही माहिती ${topMatch.doc.authority} च्या मार्गदर्शक तत्त्वांवर आधारित आहे.`,
      important: [
        'आपल्या स्थानिक जिल्हा उपनिबंधक कार्यालयातील उपविधींचीही खात्री करून घ्यावी.',
        'सर्व अर्ज व पावत्यांची पोहोच प्रत स्वतःकडे सुरक्षित ठेवावी.',
        'अधिकृत पोर्टल (cooperation.gov.in, pmfby.gov.in) वर नियमित माहिती तपासावी.'
      ],
      followUps: [
        'या नियमांनुसार कोणती कागदपत्रे लागतात?',
        'पात्रता निकष काय आहेत?',
        'अधिकृत सरकारी पोर्टल कोणते आहे?'
      ]
    },
    bn: {
      answer: `${topMatch.doc.title}-এর সরকারি বিধান অনুসারে, ${sectionContent} এই তথ্যটি ${topMatch.doc.authority}-এর নির্দেশিকার ওপর ভিত্তি করে প্রদান করা হলো।`,
      important: [
        'সর্বদা স্থানীয় সমবায় রেজিস্ট্রারের নির্দিষ্ট উপ-আইনের সাথেও মিলিয়ে নিন।',
        'যেকোনো আবেদনের প্রাপ্তি স্বীকার রসিদ সংরক্ষণ করুন।',
        'সর্বশেষ তথ্যের জন্য সরকারি পোর্টালে (cooperation.gov.in) নজর রাখুন।'
      ],
      followUps: [
        'এই বিষয়ের প্রয়োজনীয় নথিপত্র কী কী?',
        'আবেদনের যোগ্যতা ও শর্তাবলী কী?',
        'সরকারি পোর্টালের লিংক কোথায় পাওয়া যাবে?'
      ]
    }
  };

  const resData = defaultAnswers[lang] || defaultAnswers.en;
  return {
    answer: resData.answer,
    importantNotes: resData.important,
    sources: [
      {
        id: `src-${topMatch.doc.id}`,
        title: topMatch.doc.title,
        authority: topMatch.doc.authority,
        documentName: topMatch.doc.title,
        section: sectionTitle,
        pageNumber: 'Official Reference',
        officialUrl: topMatch.doc.officialUrl,
        sourceType: 'KNOWLEDGE_BASE',
        summary: topMatch.doc.description
      }
    ],
    sourceType: 'KNOWLEDGE_BASE',
    categoryId: categoryId || 'cooperative-law',
    followUpQuestions: resData.followUps,
    legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
    language: lang
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SahakarSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
