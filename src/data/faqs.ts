import { Language } from '../types';

export interface FaqItem {
  id: string;
  category: 'pacs' | 'mscs' | 'schemes' | 'elections' | 'disputes' | 'general';
  question: Record<Language, string>;
  answer: Record<Language, string>;
  statutoryReference?: {
    actOrPolicy: string;
    sectionOrClause: string;
    officialUrl: string;
  };
  keyPoints?: Record<Language, string[]>;
  tags: string[];
  aiPrompt: Record<Language, string>;
}

export interface FaqCategory {
  id: 'all' | 'pacs' | 'mscs' | 'schemes' | 'elections' | 'disputes' | 'general';
  label: Record<Language, string>;
  iconName: string;
  description: Record<Language, string>;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'all',
    label: {
      en: 'All Questions',
      hi: 'सभी प्रश्न',
      mr: 'सर्व प्रश्न',
      bn: 'সকল প্রশ্ন'
    },
    iconName: 'HelpCircle',
    description: {
      en: 'Browse all frequently asked questions across cooperative governance and schemes',
      hi: 'सहकारी प्रशासन एवं योजनाओं से संबंधित सभी सामान्य प्रश्नों को ब्राउज़ करें',
      mr: 'सहकारी प्रशासन आणि योजनांशी संबंधित सर्व प्रश्न पहा',
      bn: 'সমবায় পরিচালনা ও প্রকল্প সম্পর্কিত সকল সাধারণ প্রশ্ন দেখুন'
    }
  },
  {
    id: 'pacs',
    label: {
      en: 'PACS & Model Bye-Laws',
      hi: 'पैक्स एवं मॉडल उप-नियम',
      mr: 'पॅक्स आणि मॉडेल पोटनियम',
      bn: 'প্যাকস ও মডেল উপ-আইন'
    },
    iconName: 'Building2',
    description: {
      en: 'Primary Agricultural Credit Societies bylaws, computerization, CSC & diversification',
      hi: 'प्राथमिक कृषि साख समितियां (PACS), उप-नियम, कम्प्यूटरीकरण, सीएससी व बहु-उद्देशीय सेवाएं',
      mr: 'प्राथमिक कृषी पतसंस्था (PACS), पोटनियम, संगणकीकरण, सीएससी व बहुउद्देशीय सेवा',
      bn: 'প্রাথমিক কৃষি ঋণ সমিতি (PACS), উপ-আইন, কম্পিউটারাইজেশন ও বহুমুখী সেবা'
    }
  },
  {
    id: 'mscs',
    label: {
      en: 'Multi-State Cooperatives (MSCS)',
      hi: 'बहु-राज्य सहकारी समितियां (MSCS)',
      mr: 'बहु-राज्य सहकारी संस्था (MSCS)',
      bn: 'মাল্টি-স্টেট সমবায় সমিতি (MSCS)'
    },
    iconName: 'Scale',
    description: {
      en: 'MSCS Act 2002/2023, CRCS online registration, governance, audits and member rights',
      hi: 'एमएससीएस अधिनियम 2002/2023, सीआरसीएस ऑनलाइन पंजीकरण, शासन, लेखा परीक्षा व सदस्य अधिकार',
      mr: 'एमएससीएस कायदा २००२/२०२३, सीआरसीएस नोंदणी, प्रशासन, ऑडिट व सभासद हक्क',
      bn: 'এমএসসিএস আইন ২০০২/২০২৩, সিআরসিএস নিবন্ধন, অডিট ও সদস্য অধিকার'
    }
  },
  {
    id: 'schemes',
    label: {
      en: 'Central Schemes & Subsidies',
      hi: 'केंद्रीय योजनाएं एवं सब्सिडी',
      mr: 'शासकीय योजना आणि अनुदान',
      bn: 'সরকারি প্রকল্প ও ভর্তুকি'
    },
    iconName: 'Sparkles',
    description: {
      en: 'Grain storage plan, NCDC financial assistance, KCC loan subvention and PMFBY insurance',
      hi: 'विश्व की सबसे बड़ी अनाज भंडारण योजना, एनसीडीसी वित्तीय सहायता, केसीसी ऋण व पीएमएफबीवाई',
      mr: 'धान्य साठवणूक योजना, एनसीडीसी कर्ज, केसीसी व्याज सवलत आणि पीक विमा',
      bn: 'শস্য মজুত প্রকল্প, এনসিডিসি আর্থিক সহায়তা, কেসিসি ঋণ ও ফসল বিমা'
    }
  },
  {
    id: 'elections',
    label: {
      en: 'Elections & Board Composition',
      hi: 'चुनाव एवं बोर्ड संरचना',
      mr: 'निवडणूक आणि संचालक मंडळ',
      bn: 'নির্বাচন ও বোর্ড গঠন'
    },
    iconName: 'Vote',
    description: {
      en: 'Cooperative Election Authority, reservation for SC/ST/Women, tenure and voting rules',
      hi: 'सहकारी चुनाव प्राधिकरण, महिला व अजा/अजजा आरक्षण, कार्यकाल एवं मतदान नियमावली',
      mr: 'सहकारी निवडणूक प्राधिकरण, महिला व मागासवर्गीय आरक्षण, संचालक कार्यकाळ व मतदान',
      bn: 'সমবায় নির্বাচন কর্তৃপক্ষ, মহিলা ও সংরক্ষিত আসন, কার্যকাল ও ভোটাধিকার'
    }
  },
  {
    id: 'disputes',
    label: {
      en: 'Dispute Resolution & Grievances',
      hi: 'विवाद समाधान एवं शिकायत निवारण',
      mr: 'तक्रार निवारण आणि लवाद',
      bn: 'বিরোধ নিষ্পত্তি ও অভিযোগ প্রতিকার'
    },
    iconName: 'ShieldAlert',
    description: {
      en: 'Arbitration under Section 84, filing complaints on CRCS portal, inquiry and recovery',
      hi: 'धारा 84 के तहत मध्यस्थता, सीआरसीएस पोर्टल पर शिकायत दर्ज करना, जांच एवं वसूली प्रक्रिया',
      mr: 'कलम ८४ अंतर्गत लवाद, सीआरसीएस तक्रार नोंदणी, चौकशी आणि वसुली प्रक्रिया',
      bn: 'ধারা ৮৪ অধীন সালিশি, সিআরসিএস পোর্টালে অভিযোগ ও তদন্ত প্রক্রিয়া'
    }
  },
  {
    id: 'general',
    label: {
      en: 'Portal & AI Sahayak Guide',
      hi: 'पोर्टल एवं एआई सहायक गाइड',
      mr: 'पोर्टल व एआय सहाय्यक माहिती',
      bn: 'পোর্টাল ও এআই সহায়ক নির্দেশিকা'
    },
    iconName: 'Bot',
    description: {
      en: 'How to use Sahakar Setu, statutory verification, voice assistant, and document viewer',
      hi: 'सहकार सेतु का उपयोग, वैधानिक सत्यापन, वॉइस सहायक और अधिनियम दस्तावेज़ देखने की विधि',
      mr: 'सहकार सेतू वापरण्याची पद्धत, कायदेशीर पडताळणी, व्हॉइस सहाय्यक व नियम तपासणे',
      bn: 'সহকার সেতু ব্যবহারের নিয়ম, আইনি যাচাইকরণ, ভয়েস সহকারী ও নথি দেখার নির্দেশিকা'
    }
  }
];

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-pacs-model-bylaws',
    category: 'pacs',
    question: {
      en: 'What are the Model Bye-Laws for PACS formulated by the Ministry of Cooperation?',
      hi: 'सहकारिता मंत्रालय द्वारा पैक्स (PACS) के लिए तैयार किए गए मॉडल उप-नियम (Model Bye-Laws) क्या हैं?',
      mr: 'सहकार मंत्रालयाने पॅक्ससाठी (PACS) तयार केलेले मॉडेल पोटनियम काय आहेत?',
      bn: 'সমবায় মন্ত্রক প্রণীত প্যাকসের (PACS) জন্য মডেল উপ-আইন কী?'
    },
    answer: {
      en: 'The Ministry of Cooperation formulated comprehensive Model Bye-Laws allowing Primary Agricultural Credit Societies (PACS) to diversify from mere credit disbursement into more than 25 viable economic and public service activities. Under these bye-laws, PACS can operate as Common Service Centers (CSC), set up Pradhan Mantri Kisan Samriddhi Kendras (PMKSK), open Jan Aushadhi Kendras, manage LPG/petrol outlets, operate cold storage/warehouses, provide custom hiring of agricultural machinery, and engage in dairy/fisheries businesses.',
      hi: 'सहकारिता मंत्रालय ने प्राथमिक कृषि साख समितियों (PACS) के लिए व्यापक मॉडल उप-नियम बनाए हैं। इसके तहत पैक्स केवल अल्पकालिक ऋण वितरण तक सीमित न रहकर 25 से अधिक आर्थिक गतिविधियों में विविधता ला सकती हैं। इसमें कॉमन सर्विस सेंटर (CSC), किसान समृद्धि केंद्र (उर्वरक/कीटनाशक वितरण), जन औषधि केंद्र, पेट्रोल पंप/एलपीजी एजेंसी, शीतगृह/वेयरहाउस और कृषि यंत्र किराए पर देने जैसी सेवाएं शामिल हैं।',
      mr: 'सहकार मंत्रालयाने पॅक्ससाठी (PACS) सर्वसमावेशक मॉडेल पोटनियम तयार केले आहेत. यामुळे पॅक्स केवळ पीककर्ज वाटपापुरती मर्यादित न राहता २५ पेक्षा जास्त आर्थिक व व्यावसायिक कामांमध्ये सक्षम बनू शकते. यामध्ये सीएससी (CSC) केंद्र, जन औषधी केंद्र, खत-बियाणे विक्री, कृषी अवजारे बँक आणि गोदाम व्यवस्थापन समाविष्ट आहे.',
      bn: 'সমবায় মন্ত্রক প্যাকসের (PACS) জন্য মডেল উপ-আইন প্রণয়ন করেছে যাতে প্যাকস কেবল ঋণ প্রদানের মধ্যে সীমাবদ্ধ না থেকে ২৫টিরও বেশি অর্থনৈতিক কাজ করতে পারে। এর মধ্যে সিএসসি কেন্দ্র, জন ঔষধি কেন্দ্র, সার ও বীজ বিতরণ এবং কোল্ড স্টোরেজ পরিচালনা অন্তর্ভুক্ত।'
    },
    statutoryReference: {
      actOrPolicy: 'Model Bye-Laws for PACS (2022-23)',
      sectionOrClause: 'Clauses 4 & 5 (Objects & Business Activities)',
      officialUrl: 'https://cooperation.gov.in'
    },
    keyPoints: {
      en: [
        'Enables PACS to diversify into 25+ business lines (CSC, Jan Aushadhi, Petrol pumps, Cold storage).',
        'State Governments are adopting these model bye-laws by amending their State Cooperative Societies Acts.',
        'Improves PACS financial viability and creates local rural employment.'
      ],
      hi: [
        'पैक्स को 25+ नए व्यावसायिक क्षेत्रों (CSC, जन औषधि, पेट्रोल पंप, कोल्ड स्टोरेज) में कार्य करने की अनुमति।',
        'राज्य सरकारें अपने राज्य सहकारी अधिनियमों में संशोधन करके इन मॉडल उप-नियमों को अपना रही हैं।',
        'पैक्स की वित्तीय स्थिरता में सुधार और ग्रामीण युवाओं के लिए स्थानीय रोजगार के अवसर।'
      ],
      mr: [
        'पॅक्सला २५ पेक्षा जास्त नव्या व्यवसायांची मुभा (सीएससी, जनऔषधी, कृषी अवजारे बँक).',
        'राज्य सरकारे आपल्या सहकारी कायद्यांत सुधारणा करून हे मॉडेल पोटनियम लागू करत आहेत.',
        'पॅक्सच्या उत्पन्नात वाढ आणि ग्रामीण भागात नव्या रोजगाराच्या संधी.'
      ],
      bn: [
        'প্যাকসকে ২৫টির বেশি নতুন ব্যবসায়িক ক্ষেত্রে কাজ করার সুযোগ প্রদান।',
        'রাজ্য সরকারগুলি তাদের সমবায় আইন সংশোধন করে এই মডেল উপ-আইন গ্রহণ করছে।',
        'প্যাকসের আর্থিক অবস্থার উন্নতি এবং গ্রামীণ কর্মসংস্থান সৃষ্টি।'
      ]
    },
    tags: ['PACS', 'Model Bye-Laws', 'CSC', 'Rural Business', 'Cooperative Reforms'],
    aiPrompt: {
      en: 'Explain in detail how a PACS can adopt the Model Bye-Laws and what 25 activities they can start.',
      hi: 'विस्तार से बताएं कि कोई पैक्स मॉडल उप-नियमों को कैसे अपना सकती है और वे कौन सी 25 गतिविधियां शुरू कर सकती हैं?',
      mr: 'पॅक्सने मॉडेल पोटनियम कसे स्वीकारावेत आणि ते कोणत्या २५ नव्या सेवा सुरू करू शकतात याबद्दल सविस्तर सांगा.',
      bn: 'একটি প্যাকস কীভাবে মডেল উপ-আইন গ্রহণ করতে পারে এবং কী কী ২৫টি নতুন কাজ শুরু করতে পারে তা বিস্তারিত বলুন।'
    }
  },
  {
    id: 'faq-pacs-csc-services',
    category: 'pacs',
    question: {
      en: 'How can a PACS function as a Common Service Center (CSC)?',
      hi: 'पैक्स (PACS) कॉमन सर्विस सेंटर (CSC) के रूप में कैसे कार्य कर सकती है?',
      mr: 'पॅक्स (PACS) कॉमन सर्व्हिस सेंटर (CSC) म्हणून कसे काम करू शकते?',
      bn: 'প্যাকস কীভাবে কমন সার্ভিস সেন্টার (CSC) হিসাবে কাজ করতে পারে?'
    },
    answer: {
      en: 'Under an MoU signed between the Ministry of Cooperation and the Ministry of Electronics & IT (MeitY), computerized PACS can be onboarded as Digital Seva Kendras (CSCs). Over 50,000 PACS across India are now delivering 300+ government-to-citizen (G2C) and business-to-citizen (B2C) e-services, including Aadhaar updates, PM-KISAN e-KYC, PAN card issuance, train/bus ticketing, insurance enrollment, and electricity bill payments.',
      hi: 'सहकारिता मंत्रालय और इलेक्ट्रॉनिक्स एवं आईटी मंत्रालय (MeitY) के बीच हस्ताक्षरित समझौते (MoU) के तहत कंप्यूटरीकृत पैक्स को सीएससी (डिजिटल सेवा केंद्र) के रूप में पंजीकृत किया जा रहा है। अब 50,000 से अधिक पैक्स ग्रामीण नागरिकों को 300 से अधिक ई-सेवाएं (जैसे आधार अपडेशन, पीएम-किसान ई-केवाईसी, पैन कार्ड, रेल टिकट, बिजली बिल भुगतान और बीमा) प्रदान कर रही हैं।',
      mr: 'सहकार मंत्रालय आणि इलेक्ट्रॉनिक्स व माहिती तंत्रज्ञान मंत्रालय यांच्यातील करारानुसार संगणकीकृत पॅक्सना सीएससी (CSC) केंद्राचा दर्जा देण्यात आला आहे. आता देशभरातील ५०,००० हून अधिक पॅक्स आधार अपडेट, पीएम-किसान ई-केवायसी, पॅन कार्ड, रेल्वे तिकीट आणि वीज बिल भरणा यासारख्या ३०० हून अधिक सेवा देत आहेत.',
      bn: 'সমবায় মন্ত্রক এবং তথ্যপ্রযুক্তি মন্ত্রকের চুক্তির অধীনে কম্পিউটারাইজড প্যাকসগুলিকে সিএসসি হিসেবে নথিভুক্ত করা হয়েছে। এর মাধ্যমে গ্রামবাসীরা আধার আপডেট, পিএম-কিষাণ কেওয়াইসি, প্যান কার্ড ও টিকিট বুকিংয়ের মতো ৩০০টির বেশি অনলাইন পরিষেবা পাচ্ছেন।'
    },
    statutoryReference: {
      actOrPolicy: 'MoC-MeitY PACS Onboarding Framework (2023)',
      sectionOrClause: 'Digital Seva Kendras Delivery Protocol',
      officialUrl: 'https://cooperation.gov.in'
    },
    keyPoints: {
      en: [
        'Over 300 digital citizen services available at village level through PACS.',
        'Generates non-credit commission income for PACS staff and secretaries.',
        'Farmers no longer need to travel to block/district headquarters for online documentation.'
      ],
      hi: [
        'गांव स्तर पर पैक्स के माध्यम से 300 से अधिक डिजिटल नागरिक सेवाएं उपलब्ध।',
        'पैक्स कर्मचारियों और समिति के लिए गैर-ऋण कमीशन आय का स्रोत।',
        'किसानों को ऑनलाइन प्रमाण-पत्र या ई-केवाईसी के लिए ब्लॉक या शहर जाने की आवश्यकता नहीं।'
      ],
      mr: [
        'गावातील शेतकऱ्यांना ३०० पेक्षा जास्त सरकारी व खाजगी डिजिटल सेवा उपलब्ध.',
        'पॅक्ससाठी कमिशन स्वरूपात नियमित उत्पन्नाचा नवा मार्ग.',
        'शेतकऱ्यांना तहसील किंवा जिल्ह्याला जाण्याची गरज उरली नाही.'
      ],
      bn: [
        'গ্রাম পর্যায়ে প্যাকসের মাধ্যমে ৩০০টির বেশি সরকারি ডিজিটাল পরিষেবা প্রদান।',
        'প্যাকসের জন্য কমিশন ভিত্তিক আয়ের নতুন সুযোগ।',
        'অনলাইন কাজের জন্য কৃষকদের ব্লক বা জেলা সদরে যাওয়ার প্রয়োজন কমেছে।'
      ]
    },
    tags: ['CSC', 'Digital Seva', 'PACS Computerization', 'e-KYC', 'Aadhaar'],
    aiPrompt: {
      en: 'What are the technical and infrastructural requirements for a PACS to start CSC operations?',
      hi: 'पैक्स में सीएससी सेवाएं शुरू करने के लिए क्या तकनीकी और अवसंरचनात्मक आवश्यकताएं हैं?',
      mr: 'पॅक्समध्ये सीएससी केंद्र सुरू करण्यासाठी कोणती उपकरणे व प्रक्रिया आवश्यक आहे?',
      bn: 'প্যাকসে সিএসসি পরিষেবা শুরু করার জন্য কী কী প্রযুক্তিগত ও পরিকাঠামোগত প্রয়োজনীয়তা রয়েছে?'
    }
  },
  {
    id: 'faq-mscs-registration-crcs',
    category: 'mscs',
    question: {
      en: 'How to register a Multi-State Cooperative Society on the CRCS Portal?',
      hi: 'सीआरसीएस (CRCS) पोर्टल पर बहु-राज्य सहकारी समिति (MSCS) का पंजीकरण कैसे करें?',
      mr: 'सीआरसीएस (CRCS) पोर्टलवर बहु-राज्य सहकारी संस्था (MSCS) ची नोंदणी कशी करावी?',
      bn: 'সিআরসিএস (CRCS) পোর্টালে মাল্টি-স্টেট সমবায় সমিতি কীভাবে নিবন্ধন করবেন?'
    },
    answer: {
      en: 'Registration of Multi-State Cooperative Societies is governed under Section 6 & 7 of the Multi-State Co-operative Societies Act, 2002 (amended in 2023). Applications are filed 100% online through the Central Registrar of Cooperative Societies (CRCS) portal (mscs.dac.gov.in). The application requires minimum membership from at least two states (e.g., at least 50 members from each state), approved proposed bye-laws, proof of share capital deposit, a viable business plan, and minutes of the promoters meeting.',
      hi: 'बहु-राज्य सहकारी समितियों का पंजीकरण बहु-राज्य सहकारी समिति अधिनियम, 2002 (2023 संशोधित) की धारा 6 और 7 के तहत होता है। आवेदन पूरी तरह से केंद्रीय पंजीयक (CRCS) के ऑनलाइन पोर्टल (mscs.dac.gov.in) पर किया जाता है। इसके लिए कम से कम दो राज्यों से न्यूनतम 50-50 सदस्यों का समर्थन, प्रस्तावित उप-नियम, अंशपूंजी (शेयर कैपिटल) का बैंक प्रमाण पत्र, व्यवहार्य व्यावसायिक योजना (Project Report) और प्रवर्तक बैठक का प्रस्ताव आवश्यक है।',
      mr: 'बहु-राज्य सहकारी संस्थांची नोंदणी एमएससीएस कायदा २००२ (२०२३ दुरुस्ती) च्या कलम ६ आणि ७ नुसार केली जाते. अर्ज पूर्णपणे केंद्रीय निबंधक (CRCS) च्या ऑनलाइन पोर्टलवर केला जातो. यासाठी किमान दोन राज्यांमधील प्रत्येकी ५० सदस्यांची यादी, प्रस्तावित उपनियम, भागभांडवल बँक प्रमाणपत्र आणि व्यावसायिक प्रकल्प अहवाल आवश्यक असतो.',
      bn: 'মাল্টি-স্টেট সমবায় সমিতির নিবন্ধন এমএসসিএস আইন ২০০২ (২০২৩ সংশোধিত)-এর ধারা ৬ ও ৭ অনুযায়ী হয়। আবেদনটি সম্পূর্ণ অনলাইনে সিআরসিএস পোর্টালে জমা দিতে হয়। এর জন্য অন্তত দুটি রাজ্য থেকে ন্যূনতম ৫০ জন করে সদস্যের তালিকা এবং শেয়ার ক্যাপিটালের প্রমাণ প্রয়োজন।'
    },
    statutoryReference: {
      actOrPolicy: 'Multi-State Co-operative Societies Act, 2002',
      sectionOrClause: 'Section 6 & 7 (Application for Registration & Registration)',
      officialUrl: 'https://mscs.dac.gov.in'
    },
    keyPoints: {
      en: [
        'Requires members residing in at least 2 different States/UTs.',
        'Applications submitted online on CRCS Portal with digital signature/e-Sign.',
        'Central Registrar issues registration certificate or requisition within prescribed statutory timeline.'
      ],
      hi: [
        'कम से कम 2 अलग-अलग राज्यों/केंद्र शासित प्रदेशों के निवासियों की सदस्यता अनिवार्य।',
        'सीआरसीएस पोर्टल पर डिजिटल हस्ताक्षर/ई-साइन के साथ ऑनलाइन आवेदन।',
        'केंद्रीय पंजीयक द्वारा वैधानिक समय-सीमा के भीतर पंजीकरण प्रमाण पत्र जारी किया जाता है।'
      ],
      mr: [
        'किमान २ वेगवेगळ्या राज्यांतील रहिवासी सदस्य असणे बंधनकारक.',
        'सीआरसीएस पोर्टलवर डिजिटल स्वाक्षरीसह ऑनलाइन अर्ज सादर करणे.',
        'विहित मुदतीत केंद्रीय निबंधकांकडून नोंदणी प्रमाणपत्र दिले जाते.'
      ],
      bn: [
        'কমপক্ষে ২টি ভিন্ন রাজ্যের অধিবাসী সদস্য থাকা বাধ্যতামূলক।',
        'ডিজিটাল স্বাক্ষরসহ সিআরসিএস পোর্টালে অনলাইনে আবেদন দাখিল।',
        'নির্দিষ্ট সময়সীমার মধ্যে কেন্দ্রীয় নিবন্ধক নিবন্ধন সনদ প্রদান করেন।'
      ]
    },
    tags: ['MSCS', 'CRCS Portal', 'Registration', 'Section 6', 'Section 7'],
    aiPrompt: {
      en: 'What are the step-by-step documents and capital requirements for registering an MSCS in agriculture or credit sector?',
      hi: 'कृषि या साख क्षेत्र में बहु-राज्य सहकारी समिति पंजीकृत करने के लिए चरणबद्ध दस्तावेज और पूंजी आवश्यकताएं क्या हैं?',
      mr: 'कृषी किंवा पतपुरवठा क्षेत्रात बहुराज्य सहकारी संस्था नोंदणीसाठी कोणती कागदपत्रे आणि भांडवल लागते?',
      bn: 'কৃষি বা ঋণ খাতে মাল্টি-স্টেট সমবায় সমিতি নিবন্ধনের জন্য প্রয়োজনীয় কাগজপত্র ও মূলধনের নিয়ম কী কী?'
    }
  },
  {
    id: 'faq-grain-storage-plan',
    category: 'schemes',
    question: {
      en: "What is the 'World's Largest Grain Storage Plan in the Cooperative Sector'?",
      hi: 'सहकारी क्षेत्र में "विश्व की सबसे बड़ी विकेंद्रीकृत अनाज भंडारण योजना" क्या है?',
      mr: 'सहकारी क्षेत्रातील "जगातील सर्वात मोठी विकेंद्रित धान्य साठवणूक योजना" काय आहे?',
      bn: 'সমবায় ক্ষেত্রে "বিশ্বের বৃহত্তম বিকেন্দ্রীকৃত খাদ্যশস্য মজুত প্রকল্প" কী?'
    },
    answer: {
      en: 'The Government of India approved the creation of decentralized grain storage capacity at the PACS level, converging multiple schemes including Agriculture Infrastructure Fund (AIF), Agricultural Marketing Infrastructure (AMI), Sub-Mission on Agricultural Mechanization (SMAM), and Mission for Integrated Development of Horticulture (MIDH). Under this plan, godowns (500 MT to 2000 MT capacity), custom hiring centers, primary processing units, and fair price shops are set up directly at PACS to eliminate post-harvest losses, enable distress-sale prevention, and connect farmers to procurement agencies like FCI and State Agencies.',
      hi: 'भारत सरकार ने पैक्स (PACS) स्तर पर विकेंद्रीकृत अनाज भंडारण क्षमता निर्माण हेतु इस महत्वाकांक्षी योजना को मंजूरी दी है। इसमें कृषि अवसंरचना कोष (AIF), कृषि विपणन अवसंरचना (AMI), कृषि यंत्रीकरण उप-मिशन (SMAM) जैसी केंद्रीय योजनाओं को एकीकृत किया गया है। इसके तहत पैक्स पर 500 से 2000 मीट्रिक टन क्षमता के आधुनिक गोदाम, कस्टम हायरिंग सेंटर और प्रसंस्करण इकाइयां स्थापित की जा रही हैं, ताकि किसान अपनी उपज का भंडारण कर उचित मूल्य प्राप्त कर सकें।',
      mr: 'भारत सरकारने पॅक्स (PACS) पातळीवर विकेंद्रित धान्य साठवणूक गोदामे उभारण्यासाठी ही योजना सुरू केली आहे. यामध्ये ॲग्रिकल्चर इन्फ्रास्ट्रक्चर फंड (AIF) आणि इतर योजनांचे एकत्रीकरण करण्यात आले आहे. याअंतर्गत ५०० ते २००० मेट्रिक टन क्षमतेची गोदामे थेट गावातील पॅक्सवर बांधली जात आहेत.',
      bn: 'ভারত সরকার প্যাকস পর্যায়ে বিকেন্দ্রীকৃত খাদ্যশস্য গুদাম নির্মাণের জন্য এই প্রকল্প অনুমোদন করেছে। এতে এআইএফ (AIF) সহ একাধিক প্রকল্প যুক্ত করা হয়েছে। এর আওতায় ৫০০ থেকে ২০০০ মেট্রিক টন ক্ষমতার গুদাম তৈরি করা হচ্ছে যাতে কৃষকরা ফসলের ন্যায্য দাম পান।'
    },
    statutoryReference: {
      actOrPolicy: 'National Cooperative Grain Storage Infrastructure Plan (2023)',
      sectionOrClause: 'Convergence Guidelines with AIF & AMI',
      officialUrl: 'https://cooperation.gov.in'
    },
    keyPoints: {
      en: [
        'Warehouses of 500 to 2000 MT capacity constructed directly at PACS premises.',
        'Offers 3% interest subvention under Agriculture Infrastructure Fund (AIF) loans.',
        'Prevents distress sales and drastically cuts grain transit/storage losses.'
      ],
      hi: [
        'पैक्स परिसर में 500 से 2000 मीट्रिक टन क्षमता के आधुनिक गोदामों का निर्माण।',
        'एग्रीकल्चर इन्फ्रास्ट्रक्चर फंड (AIF) के तहत 3% ब्याज छूट (सबवेंशन) की सुविधा।',
        'फसल कटाई के तुरंत बाद औने-पौने दाम पर बिक्री पर रोक और परिवहन लागत में बचत।'
      ],
      mr: [
        'पॅक्स स्तरावर ५०० ते २००० टन क्षमतेची अत्याधुनिक गोदामे.',
        'एआयएफ (AIF) कर्जावर ३% व्याज सवलत उपलब्ध.',
        'कापणीनंतरच्या नासाडीला आळा आणि योग्य बाजारभाव मिळेपर्यंत साठवणुकीची सोय.'
      ],
      bn: [
        'প্যাকস চত্বরে ৫০০ থেকে ২০০০ মেট্রিক টন ক্ষমতার আধুনিক গুদাম নির্মাণ।',
        'এআইএফ (AIF) ঋণের ওপর ৩% সুদে ভর্তুকির সুবিধা।',
        'ফসলের অপচয় রোধ এবং কৃষকদের উপযুক্ত দাম পাওয়ার সুযোগ।'
      ]
    },
    tags: ['Grain Storage', 'PACS Godown', 'AIF', 'Warehouse', 'Post-Harvest'],
    aiPrompt: {
      en: 'How can a PACS apply for financial assistance under the Grain Storage Plan and Agriculture Infrastructure Fund?',
      hi: 'कोई पैक्स अनाज भंडारण योजना और कृषि अवसंरचना कोष (AIF) के तहत वित्तीय सहायता के लिए कैसे आवेदन कर सकती है?',
      mr: 'धान्य साठवणूक योजना आणि एआयएफ (AIF) अंतर्गत पॅक्सने अनुदानासाठी कसा अर्ज करावा?',
      bn: 'খাদ্যশস্য মজুত প্রকল্প এবং এআইএফের আওতায় প্যাকস কীভাবে আর্থিক সহায়তার জন্য আবেদন করতে পারে?'
    }
  },
  {
    id: 'faq-elections-cea',
    category: 'elections',
    question: {
      en: 'What is the Cooperative Election Authority and how are MSCS elections conducted?',
      hi: 'सहकारी चुनाव प्राधिकरण (Cooperative Election Authority) क्या है और एमएससीएस में चुनाव कैसे होते हैं?',
      mr: 'सहकारी निवडणूक प्राधिकरण (CEA) काय आहे आणि बहु-राज्य सहकारी संस्थांमध्ये निवडणुका कशा होतात?',
      bn: 'সমবায় নির্বাচন কর্তৃপক্ষ (CEA) কী এবং এমএসসিএসে নির্বাচন কীভাবে হয়?'
    },
    answer: {
      en: 'Introduced under Section 45 of the Multi-State Co-operative Societies (Amendment) Act, 2023, the Central Government has established the Cooperative Election Authority (CEA) to conduct and supervise elections to the Board of all Multi-State Cooperative Societies. The CEA ensures impartial, transparent, and timely elections, enforces voter list preparation, oversees ballot procedures, and guarantees the statutory reservation of seats on the Board (at least one seat for Scheduled Castes or Scheduled Tribes, and two seats for Women).',
      hi: 'बहु-राज्य सहकारी समिति (संशोधन) अधिनियम, 2023 की धारा 45 के तहत केंद्र सरकार द्वारा सहकारी चुनाव प्राधिकरण (Cooperative Election Authority - CEA) की स्थापना की गई है। यह प्राधिकरण सभी बहु-राज्य सहकारी समितियों के निदेशक मंडल (Board) के निष्पक्ष, पारदर्शी और समयबद्ध चुनाव आयोजित और पर्यवेक्षित करता है। बोर्ड में अनुसूचित जाति/अनुसूचित जनजाति (SC/ST) के लिए कम से कम 1 सीट और महिलाओं के लिए 2 सीटों का अनिवार्य आरक्षण सुनिश्चित किया गया है।',
      mr: 'एमएससीएस (दुरुस्ती) कायदा २०२३ च्या कलम ४५ अंतर्गत केंद्र सरकारने स्वतंत्र सहकारी निवडणूक प्राधिकरण (CEA) स्थापन केले आहे. हे प्राधिकरण सर्व बहुराज्य सहकारी संस्थांच्या संचालक मंडळाच्या निवडणुका पारदर्शकपणे घेते. संचालक मंडळात महिलांसाठी २ जागा आणि अनुसूचित जाती/जमातीसाठी १ जागा राखीव असणे बंधनकारक आहे.',
      bn: 'এমএসসিএস (সংশোধনী) আইন ২০২৩-এর ধারা ৪৫ অনুযায়ী সমবায় নির্বাচন কর্তৃপক্ষ (CEA) গঠিত হয়েছে। এই কর্তৃপক্ষ সকল মাল্টি-স্টেট সমবায় সমিতির বোর্ড নির্বাচন পরিচালনা করে। বোর্ডে মহিলাদের জন্য ২টি আসন এবং এসসি/এসটির জন্য ১টি আসন সংরক্ষণ বাধ্যতামূলক।'
    },
    statutoryReference: {
      actOrPolicy: 'MSCS (Amendment) Act, 2023',
      sectionOrClause: 'Section 45 (Cooperative Election Authority) & Section 41 (Board Composition)',
      officialUrl: 'https://mscs.dac.gov.in'
    },
    keyPoints: {
      en: [
        'Elections are conducted strictly by an independent statutory Authority.',
        'Mandatory reservation: 2 seats for Women and 1 seat for SC/ST on every Board.',
        'Term of the Board of Directors is 5 years from the date of election.'
      ],
      hi: [
        'चुनाव पूरी तरह से स्वतंत्र वैधानिक चुनाव प्राधिकरण द्वारा संचालित।',
        'अनिवार्य आरक्षण: प्रत्येक बोर्ड में महिलाओं के लिए 2 सीटें और अजा/अजजा के लिए 1 सीट।',
        'निदेशक मंडल का कार्यकाल चुनाव की तिथि से 5 वर्ष होता है।'
      ],
      mr: [
        'निवडणुका पूर्णपणे स्वतंत्र वैधानिक निवडणूक प्राधिकरणाद्वारे घेतल्या जातात.',
        'बंधनकारक आरक्षण: संचालक मंडळात महिलांसाठी २ जागा व एससी/एसटीसाठी १ जागा.',
        'संचालक मंडळाचा कार्यकाळ निवडीच्या दिनांकापासून ५ वर्षे असतो.'
      ],
      bn: [
        'নির্বাচন সম্পূর্ণ স্বাধীন সংবিধিবদ্ধ কর্তৃপক্ষ দ্বারা পরিচালিত হয়।',
        'বাধ্যতামূলক সংরক্ষণ: বোর্ডে মহিলাদের জন্য ২টি আসন এবং এসসি/এসটির জন্য ১টি আসন।',
        'পরিচালক বোর্ডের মেয়াদ নির্বাচনের তারিখ থেকে ৫ বছর।'
      ]
    },
    tags: ['Elections', 'CEA', 'Board Reservation', 'Women Reservation', 'MSCS Act 2023'],
    aiPrompt: {
      en: 'What are the rules and disqualification criteria for members contesting Board elections in MSCS?',
      hi: 'बहु-राज्य सहकारी समितियों में बोर्ड चुनाव लड़ने वाले सदस्यों के लिए क्या नियम और अयोग्यता (Disqualification) की शर्तें हैं?',
      mr: 'बहुराज्य सहकारी संस्थेच्या निवडणुकीसाठी उमेदवाराची पात्रता आणि अपात्रतेच्या अटी कोणत्या आहेत?',
      bn: 'মাল্টি-স্টেট সমবায় সমিতির বোর্ড নির্বাচনে প্রতিদ্বন্দ্বিতা করার নিয়ম ও অযোগ্যতার শর্ত কী কী?'
    }
  },
  {
    id: 'faq-disputes-section84',
    category: 'disputes',
    question: {
      en: 'How are disputes in Multi-State Cooperative Societies resolved under Section 84?',
      hi: 'धारा 84 के तहत बहु-राज्य सहकारी समितियों में विवादों का समाधान कैसे होता है?',
      mr: 'कलम ८४ अन्वये बहु-राज्य सहकारी संस्थांमधील वादांचे निराकरण कसे केले जाते?',
      bn: 'ধারা ৮৪-এর অধীনে মাল্টি-স্টেট সমবায় সমিতিতে বিরোধ নিষ্পত্তি কীভাবে হয়?'
    },
    answer: {
      en: 'Under Section 84 of the MSCS Act, 2002, any dispute touching the constitution, management, elections, or business of a multi-state cooperative society among members, past members, officers, or between societies must be referred to the Central Registrar for arbitration. The Central Registrar may decide the dispute personally or appoint an Arbitrator under the Arbitration and Conciliation Act, 1996. Civil Courts do not have jurisdiction to entertain matters referable under Section 84.',
      hi: 'एमएससीएस अधिनियम, 2002 की धारा 84 के तहत, किसी बहु-राज्य सहकारी समिति के गठन, प्रबंधन, चुनाव, या व्यवसाय से संबंधित किसी भी विवाद को केवल केंद्रीय पंजीयक (Central Registrar) के पास मध्यस्थता (Arbitration) हेतु प्रस्तुत किया जा सकता है। केंद्रीय पंजीयक स्वयं इसका निपटारा कर सकते हैं या मध्यस्थ एवं सुलह अधिनियम, 1996 के तहत मध्यस्थ (Arbitrator) नियुक्त कर सकते हैं। धारा 84 के तहत आने वाले मामलों में दीवानी अदालतों (Civil Courts) का अधिकार क्षेत्र वर्जित है।',
      mr: 'एमएससीएस कायदा २००२ च्या कलम ८४ नुसार, बहुराज्य सहकारी संस्थेचे व्यवस्थापन, निवडणुका किंवा व्यवसायासंबंधी सभासद आणि संस्थेमधील कोणताही वाद लवादासाठी (Arbitration) केंद्रीय निबंधकांकडे पाठवला जातो. यासाठी दिवाणी न्यायालयात जाण्याची गरज नसते, तर लवाद कायद्यानुसार वाद सोडवला जातो.',
      bn: 'এমএসসিএস আইন ২০০২-এর ধারা ৮৪ অনুযায়ী, সমবায় সমিতির পরিচালনা, নির্বাচন বা ব্যবসা সম্পর্কিত যে কোনো বিরোধ নিষ্পত্তির জন্য কেন্দ্রীয় নিবন্ধকের কাছে সালিশির (Arbitration) জন্য আবেদন করতে হয়। দেওয়ানি আদালত এই বিষয়ে হস্তক্ষেপ করতে পারে না।'
    },
    statutoryReference: {
      actOrPolicy: 'Multi-State Co-operative Societies Act, 2002',
      sectionOrClause: 'Section 84 (Reference of Disputes) & Section 85 (Limitation)',
      officialUrl: 'https://mscs.dac.gov.in'
    },
    keyPoints: {
      en: [
        'Disputes must be filed with the Central Registrar or appointed Arbitrator.',
        'Arbitral awards have the force of a decree of a Civil Court.',
        'Bar of jurisdiction on Civil Courts ensures speedy and specialized disposal.'
      ],
      hi: [
        'विवाद केवल केंद्रीय पंजीयक या नियुक्त मध्यस्थ के समक्ष ही दर्ज किए जाने चाहिए।',
        'मध्यस्थता का फैसला (Arbitral Award) दीवानी न्यायालय की डिक्री के समान बाध्यकारी होता है।',
        'दीवानी अदालतों के अधिकार क्षेत्र पर रोक से मामलों का त्वरित निपटारा सुनिश्चित होता है।'
      ],
      mr: [
        'वाद केवळ केंद्रीय निबंधक किंवा नियुक्त लवादाकडे दाखल केले पाहिजेत.',
        'लवादाचा निर्णय दिवाणी न्यायालयाच्या हुकूमनाम्याप्रमाणे कायदेशीररीत्या बंधनकारक असतो.',
        'तक्रारींचा जलद गतीने निपटारा होतो.'
      ],
      bn: [
        'বিরোধ কেবল কেন্দ্রীয় নিবন্ধক বা নিযুক্ত সালিশির কাছে দায়ের করতে হবে।',
        'সালিশি আদালতের সিদ্ধান্ত দেওয়ানি আদালতের রায়ের মতো বাধ্যতামূলক।',
        'মামলার দ্রুত ও বিশেষায়িত নিষ্পত্তি নিশ্চিত করা হয়।'
      ]
    },
    tags: ['Section 84', 'Dispute Resolution', 'Arbitration', 'Civil Court Bar', 'MSCS Legal'],
    aiPrompt: {
      en: 'What is the exact process and limitation period for filing a dispute under Section 84 of MSCS Act?',
      hi: 'एमएससीएस अधिनियम की धारा 84 के तहत विवाद दर्ज करने की सटीक प्रक्रिया और परिसीमा अवधि (Limitation Period) क्या है?',
      mr: 'कलम ८४ अन्वये लवादाकडे दावा दाखल करण्याची नेमकी प्रक्रिया आणि मुदत काय आहे?',
      bn: 'এমএসসিএস আইনের ধারা ৮৪ অধীন বিরোধ দায়ের করার সঠিক পদ্ধতি ও সময়সীমা কী?'
    }
  },
  {
    id: 'faq-jan-aushadhi-pacs',
    category: 'pacs',
    question: {
      en: 'How can a PACS open a Pradhan Mantri Bhartiya Jan Aushadhi Kendra (PMBJK)?',
      hi: 'पैक्स (PACS) प्रधानमंत्री भारतीय जन औषधि केंद्र (PMBJK) कैसे खोल सकती है?',
      mr: 'पॅक्स (PACS) प्रधानमंत्री भारतीय जन औषधी केंद्र कसे सुरू करू शकते?',
      bn: 'প্যাকস কীভাবে প্রধানমন্ত্রী ভারতীয় জন ঔষধি কেন্দ্র খুলতে পারে?'
    },
    answer: {
      en: 'In collaboration with the Pharmaceuticals & Medical Devices Bureau of India (PMBI), PACS are eligible to open Jan Aushadhi Kendras in rural areas to provide quality generic medicines at 50% to 90% cheaper prices than branded market medicines. The PACS must possess at least 120 sq. ft. of owned or rented space, employ a registered B.Pharm/D.Pharm pharmacist, and apply online through the Jan Aushadhi portal with an endorsement from the State Registrar / Ministry of Cooperation. Financial incentive up to ₹5.00 Lakh is provided by PMBI.',
      hi: 'फार्मास्यूटिकल्स एंड मेडिकल डिवाइसेस ब्यूरो ऑफ इंडिया (PMBI) और सहकारिता मंत्रालय के सहयोग से पैक्स ग्रामीण क्षेत्रों में जन औषधि केंद्र खोल सकती हैं। इससे ग्रामीणों को 50% से 90% तक सस्ती जेनेरिक दवाएं मिलती हैं। पैक्स के पास कम से कम 120 वर्ग फुट स्थान और एक पंजीकृत फार्मासिस्ट (D.Pharm/B.Pharm) होना चाहिए। पीएमबीआई द्वारा ₹5.00 लाख तक का वित्तीय प्रोत्साहन और विशेष सहायता प्रदान की जाती है।',
      mr: 'सहकार मंत्रालय आणि पीएमबीआय (PMBI) यांच्या सहकार्याने पॅक्स गावात जन औषधी केंद्र सुरू करू शकतात. यामुळे ५०% ते ९०% पर्यंत स्वस्त दरात दर्जेदार जेनेरिक औषधे उपलब्ध होतात. यासाठी किमान १२० चौरस फूट जागा आणि नोंदणीकृत फार्मासिस्ट आवश्यक असून ५ लाख रुपयांपर्यंत प्रोत्साहन अनुदान मिळते.',
      bn: 'সমবায় মন্ত্রকের সহায়তায় প্যাকস গ্রামীণ এলাকায় জন ঔষধি কেন্দ্র খুলতে পারে। এতে সাধারণ মানুষ ৫০% থেকে ৯০% কম দামে জেনেরিক ওষুধ পান। এর জন্য ন্যূনতম ১২০ বর্গফুট জায়গা ও একজন নিবন্ধিত ফার্মাসিস্ট প্রয়োজন এবং ৫ লাখ টাকা পর্যন্ত সরকারি অনুদান পাওয়া যায়।'
    },
    statutoryReference: {
      actOrPolicy: 'Pradhan Mantri Bhartiya Jan Aushadhi Pariyojana (PMBJP) Guidelines',
      sectionOrClause: 'Special PACS Category Eligibility Protocol',
      officialUrl: 'https://janaushadhi.gov.in'
    },
    keyPoints: {
      en: [
        'Quality generic medicines made available at 50-90% discount in rural villages.',
        'PACS receives financial incentive up to ₹5.00 Lakh (linked to monthly purchase).',
        'One-time reimbursement for IT hardware and furniture setup.'
      ],
      hi: [
        'ग्रामीण क्षेत्रों में 50 से 90 प्रतिशत कम कीमत पर गुणवत्तापूर्ण जेनेरिक दवाइयां उपलब्ध।',
        'पैक्स को मासिक बिक्री के आधार पर ₹5 लाख तक का वित्तीय प्रोत्साहन।',
        'फर्नीचर और कंप्यूटर हार्डवेयर सेटअप के लिए एकमुश्त सहायता।'
      ],
      mr: [
        'ग्रामीण भागातील नागरिकांना ५० ते ९० टक्के कमी दरात उच्च दर्जाची औषधे.',
        'पॅक्सला मासिक खरेदीनुसार ५ लाख रुपयांपर्यंतचे आर्थिक प्रोत्साहन.',
        'संगणक आणि फर्निचरसाठी विशेष अनुदान.'
      ],
      bn: [
        'গ্রামাঞ্চলে ৫০-৯০% কম মূল্যে উন্নত মানের জেনেরিক ওষুধ প্রাপ্তি।',
        'প্যাকসকে ৫ লাখ টাকা পর্যন্ত আর্থিক প্রণোদনা প্রদান।',
        'ফার্নিচার ও কম্পিউটার সরঞ্জামের জন্য বিশেষ সহায়তা।'
      ]
    },
    tags: ['Jan Aushadhi', 'Generic Medicines', 'PACS Diversification', 'Healthcare', 'PMBJP'],
    aiPrompt: {
      en: 'What is the step-by-step application process and pharmacist license requirement for a PACS opening a Jan Aushadhi Kendra?',
      hi: 'पैक्स द्वारा जन औषधि केंद्र खोलने के लिए चरणबद्ध आवेदन प्रक्रिया और फार्मासिस्ट लाइसेंस संबंधी क्या नियम हैं?',
      mr: 'पॅक्सने जन औषधी केंद्र उघडण्यासाठी अर्ज प्रक्रिया आणि परवाना नियम काय आहेत?',
      bn: 'প্যাকসের জন ঔষধি কেন্দ্র খোলার জন্য ধাপে ধাপে আবেদনের নিয়ম ও ফার্মাসিস্ট লাইসেন্সের শর্ত কী?'
    }
  },
  {
    id: 'faq-portal-ai-sahayak',
    category: 'general',
    question: {
      en: 'How does Sahakar Setu AI Sahayak provide verified statutory answers?',
      hi: 'सहकार सेतु एआई सहायक (AI Sahayak) सत्यापित विधिक उत्तर कैसे प्रदान करता है?',
      mr: 'सहकार सेतू एआय सहाय्यक खात्रीशीर कायदेशीर उत्तरे कशी देतो?',
      bn: 'সহকার সেতু এআই সহায়ক কীভাবে যাচাইকৃত আইনি উত্তর প্রদান করে?'
    },
    answer: {
      en: 'Sahakar Setu uses a high-precision Retrieval-Augmented Generation (RAG) architecture grounded strictly in official government acts, model bye-laws, ministry circulars, and verified schemes. When you ask a query in English, Hindi, Marathi, or Bengali, the system semantic-searches statutory repositories, cross-verifies relevant clauses, and outputs clear step-by-step guidance along with official citations and links. If a topic is not in the statutory knowledge base, the system transparently indicates public web verification.',
      hi: 'सहकार सेतु आधिकारिक सरकारी अधिनियमों, मॉडल उप-नियमों, मंत्रालय के परिपत्रों और सत्यापित योजनाओं पर आधारित अत्याधुनिक आरएजी (RAG) प्रणाली का उपयोग करता है। जब आप हिंदी, अंग्रेजी, मराठी या बंगाली में कोई प्रश्न पूछते हैं, तो प्रणाली केवल आधिकारिक वैधानिक स्रोतों से संबंधित धाराओं को खोजती है और आधिकारिक संदर्भ के साथ उत्तर देती है। यदि कोई विषय स्थानीय ज्ञानकोष में नहीं है, तो वह पारदर्शिता के साथ वेब सत्यापन की सूचना देती है।',
      mr: 'सहकार सेतू अधिकृत कायदे, परिपत्रके आणि शासकीय योजनांवर आधारित आरएजी (RAG) तंत्रज्ञानाचा वापर करतो. तुम्ही मराठी, हिंदी, इंग्रजी किंवा बंगालीमध्ये प्रश्न विचारल्यास, सिस्टीम केवळ अधिकृत कलमांचा संदर्भ देऊन अचूक उत्तर देते.',
      bn: 'সহকার সেতু সরকারি আইন, মডেল উপ-আইন ও সার্কুলারের ওপর ভিত্তি করে আধুনিক আরএজি (RAG) সিস্টেম ব্যবহার করে। বাংলা, হিন্দি বা ইংরেজিতে প্রশ্ন করলে এটি যাচাইকৃত আইনের ধারা উল্লেখ করে নির্ভুল তথ্য প্রদান করে।'
    },
    statutoryReference: {
      actOrPolicy: 'Ministry of Cooperation Statutory Repository',
      sectionOrClause: 'RAG Verification Protocol v2.6',
      officialUrl: 'https://cooperation.gov.in'
    },
    keyPoints: {
      en: [
        'Zero hallucination: answers cite real acts, sections, and official circulars.',
        'Multilingual support across English, Hindi, Marathi, and Bengali.',
        'Includes real-time voice input, text-to-speech reading, and PDF export.'
      ],
      hi: [
        'विश्वसनीयता: उत्तर वास्तविक अधिनियमों, धाराओं और परिपत्रों के प्रमाण के साथ।',
        'हिंदी, अंग्रेजी, मराठी और बंगाली में संपूर्ण बहुभाषी समर्थन।',
        'वॉइस इनपुट, ऑटो-स्पीच वाचन और पीडीएफ प्रतिलेख डाउनलोड की सुविधा।'
      ],
      mr: [
        'अचूकता: उत्तरांसोबत अधिकृत कायदे, कलमे व शासकीय लिंक्स दिल्या जातात.',
        'मराठी, हिंदी, इंग्रजी आणि बंगाली भाषांमध्ये संवाद साधण्याची सोय.',
        'व्हॉइस इनपुट, बोलून दाखवणे आणि पीडीएफ डाऊनलोडची सुविधा.'
      ],
      bn: [
        'নির্ভুলতা: উত্তরের সাথে আইনের ধারা ও সরকারি সার্কুলার উল্লেখ করা হয়।',
        'বাংলা, হিন্দি, মারাঠি ও ইংরেজিতে নির্বিঘ্ন সেবা।',
        'ভয়েস ইনপুট ও পিডিএফ ডাউনলোডের সুবিধা।'
      ]
    },
    tags: ['AI Sahayak', 'RAG Engine', 'Multilingual', 'Voice Assistant', 'Statutory Search'],
    aiPrompt: {
      en: 'How can I use the voice assistant or verify the official gazette reference behind an answer?',
      hi: 'मैं वॉइस सहायक का उपयोग कैसे कर सकता हूँ और किसी उत्तर के पीछे आधिकारिक राजपत्र संदर्भ की जांच कैसे करूँ?',
      mr: 'मी व्हॉइस सहाय्यकाचा वापर कसा करावा आणि अधिकृत संदर्भांची खात्री कशी करावी?',
      bn: 'আমি কীভাবে ভয়েস সহকারী ব্যবহার করতে পারি এবং উত্তরের সরকারি সূত্র যাচাই করতে পারি?'
    }
  },
  {
    id: 'faq-pmfby-crop-insurance',
    category: 'schemes',
    question: {
      en: 'How can farmers claim crop insurance under PMFBY through PACS?',
      hi: 'किसान पैक्स के माध्यम से पीएमएफबीवाई (PMFBY) के तहत फसल बीमा का दावा कैसे कर सकते हैं?',
      mr: 'शेतकरी पॅक्सच्या माध्यमातून पीएमएफबीवाय (PMFBY) पीक विम्याचा दावा कसा करू शकतात?',
      bn: 'কৃষকরা প্যাকসের মাধ্যমে পিএমএফবিওয়াই (PMFBY) ফসল বিমার দাবি কীভাবে করবেন?'
    },
    answer: {
      en: 'Under the Pradhan Mantri Fasal Bima Yojana (PMFBY), loanee farmers taking KCC crop loans from PACS are automatically eligible for crop insurance, while non-loanee farmers can enroll voluntarily through their village PACS or CSC. In the event of localized calamities (hailstorm, landslide, inundation) or post-harvest losses, farmers must report the crop loss within 72 hours via the Crop Insurance App, Kisan Helpline (14447), or through their PACS secretary with photo evidence.',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY) के तहत, पैक्स से केसीसी फसल ऋण लेने वाले ऋणी किसान स्वतः पात्र होते हैं, जबकि गैर-ऋणी किसान अपने गांव की पैक्स या सीएससी के माध्यम से स्वेच्छा से नामांकन करा सकते हैं। स्थानीय आपदा (ओलावृष्टि, जलभराव, भूस्खलन) या फसल कटाई के बाद नुकसान होने पर, किसान को 72 घंटे के भीतर क्रॉप इंश्योरेंस ऐप, किसान हेल्पलाइन (14447) या पैक्स सचिव के माध्यम से फोटो सहित सूचना देनी अनिवार्य है।',
      mr: 'प्रधानमंत्री पीक विमा योजनेअंतर्गत (PMFBY), पॅक्सकडून पीककर्ज घेणाऱ्या शेतकऱ्यांचा विमा आपोआप उतरवला जातो. इतर शेतकरीही पॅक्स किंवा सीएससी केंद्रावर जाऊन विमा भरू शकतात. अतिवृष्टी किंवा गारपिटीमुळे पिकाचे नुकसान झाल्यास ७२ तासांच्या आत १४४४७ या टोल-फ्री क्रमांकावर किंवा क्रॉप इन्शुरन्स ॲपवर तक्रार करणे आवश्यक आहे.',
      bn: 'প্রধানমন্ত্রী ফসল বিমা যোজনায় (PMFBY) প্যাকস থেকে ঋণ নেওয়া কৃষকদের স্বয়ংক্রিয়ভাবে বিমাভুক্ত করা হয়। অন্যান্য কৃষকরাও প্যাকসের মাধ্যমে আবেদন করতে পারেন। দুর্যোগের কারণে ফসল নষ্ট হলে ৭২ ঘণ্টার মধ্যে কিষাণ হেল্পলাইন (১৪৪৪৭) বা অ্যাপের মাধ্যমে জানাতে হবে।'
    },
    statutoryReference: {
      actOrPolicy: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Operational Guidelines',
      sectionOrClause: 'Section 15 (Loss Assessment & 72-Hour Intimation)',
      officialUrl: 'https://pmfby.gov.in'
    },
    keyPoints: {
      en: [
        'Nominal premium: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops.',
        'Mandatory 72-hour reporting window for localized calamities with photographic evidence.',
        'Claims settled directly into farmer Aadhaar-linked bank accounts via DBT.'
      ],
      hi: [
        'नाममात्र प्रीमियम: खरीफ फसलों के लिए 2%, रबी फसलों के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5%।',
        'स्थानीयकृत आपदा की स्थिति में 72 घंटे के भीतर सूचना देना अनिवार्य।',
        'दावा राशि सीधे किसान के आधार से जुड़े बैंक खाते में डीबीटी (DBT) द्वारा हस्तांतरित।'
      ],
      mr: [
        'अत्यल्प विमा हप्ता: खरीप पिकांसाठी २%, रब्बीसाठी १.५% आणि बागायती पिकांसाठी ५%.',
        'नुकसान झाल्यावर ७२ तासांच्या आत तक्रार नोंदवणे बंधनकारक.',
        'विम्याची रक्कम थेट शेतकऱ्याच्या बँक खात्यात डीबीटीद्वारे जमा होते.'
      ],
      bn: [
        'স্বল্প প্রিমিয়াম: খরিফ ফসলের জন্য ২%, রবি ফসলের জন্য ১.৫% এবং বাণিজ্যিক ফসলের জন্য ৫%।',
        'স্থানীয় দুর্যোগের ক্ষেত্রে ৭২ ঘণ্টার মধ্যে রিপোর্ট করা বাধ্যতামূলক।',
        'বিমার টাকা সরাসরি কৃষকের ব্যাংক অ্যাকাউন্টে ডিবিটি মাধ্যমে জমা হয়।'
      ]
    },
    tags: ['PMFBY', 'Crop Insurance', 'Kharif', 'Rabi', '72 Hours', 'KCC'],
    aiPrompt: {
      en: 'What are the documents needed to file a crop loss claim under PMFBY through PACS within 72 hours?',
      hi: '72 घंटे के भीतर पैक्स के माध्यम से पीएमएफबीवाई फसल नुकसान का दावा दायर करने के लिए किन दस्तावेजों की आवश्यकता होती है?',
      mr: '७२ तासांच्या आत पीक नुकसान भरपाईचा दावा करण्यासाठी कोणती कागदपत्रे लागतात?',
      bn: '৭২ ঘণ্টার মধ্যে প্যাকসের মাধ্যমে ফসল ক্ষতির দাবি জানাতে কী কী নথি প্রয়োজন?'
    }
  }
];
