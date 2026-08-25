import { SchemeItem, ServiceItem } from '../types';

export const VERIFIED_SCHEMES: SchemeItem[] = [
  {
    id: 'pmfby',
    name: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      mr: 'प्रधानमंत्री पीक विमा योजना (PMFBY)',
      bn: 'প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY)'
    },
    ministry: {
      en: 'Ministry of Agriculture & Farmers Welfare',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय',
      mr: 'कृषी आणि शेतकरी कल्याण मंत्रालय',
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক'
    },
    category: 'Insurance',
    shortDescription: {
      en: 'Comprehensive crop insurance against non-preventable natural risks, drought, floods, hailstorms, and post-harvest losses.',
      hi: 'गैर-निवारक प्राकृतिक जोखिमों, सूखे, बाढ़, ओलावृष्टि और कटाई उपरांत नुकसान के खिलाफ व्यापक फसल बीमा।',
      mr: 'नैसर्गिक आपत्ती, दुष्काळ, पूर, गारपीट आणि काढणीपश्चात नुकसानीविरुद्ध सर्वसमावेशक पीक विमा संरक्षण.',
      bn: 'প্রাকৃতিক দুর্যোগ, খরা, বন্যা, শিলাবৃষ্টি ও ফসল তোলার পরবর্তী ক্ষয়ক্ষতিতে বিস্তৃত ফসল বীমা।'
    },
    targetUsers: {
      en: 'All farmers (loanee and non-loanee, sharecroppers, tenant farmers) growing notified crops.',
      hi: 'अधिसूचित फसलें उगाने वाले सभी किसान (ऋणी और गैर-ऋणी, बटाईदार और काश्तकार किसान)।',
      mr: 'अधिसूचित पिके घेणारे सर्व शेतकरी (कर्जदार व बिगर-कर्जदार, कुळ शेतकरी).',
      bn: 'বিজ্ঞাপিত ফসল উৎপাদনকারী সকল কৃষক (ঋণগ্রহীতা ও অ-ঋণগ্রহীতা, ভাগচাষী)।'
    },
    eligibility: {
      en: [
        'Must cultivate notified crop in a notified insurance unit / area',
        'Valid land tenancy / ownership proof (RoR / 7/12 extract / Patta)',
        'Active bank account seeded with Aadhaar',
        'Sowing certificate / self-declaration of crop sown'
      ],
      hi: [
        'अधिसूचित बीमा इकाई/क्षेत्र में अधिसूचित फसल की खेती होनी चाहिए',
        'वैध भूमि स्वामित्व/काश्तकारी प्रमाण (RoR / 7/12 खतौनी / पट्टा)',
        'आधार से जुड़ा सक्रिय बैंक खाता',
        'बुवाई प्रमाण पत्र / बोई गई फसल का स्व-घोषणा पत्र'
      ],
      mr: [
        'अधिसूचित क्षेत्रात अधिसूचित पिकाची लागवड असणे आवश्यक',
        'जमीन मालकी किंवा कुळ वहिवाटीचा पुरावा (७/१२ उतारा / फेरफार)',
        'आधार संलग्न सक्रिय बँक खाते',
        'पीक पेरणी स्वयंघोषणा पत्र / दाखला'
      ],
      bn: [
        'বিজ্ঞাপিত অঞ্চলে বিজ্ঞাপিত ফসলের চাষ হতে হবে',
        'জমির মালিকানা বা লিজের প্রমাণ (খতিয়ান / পরচা)',
        'আধারের সাথে সংযুক্ত সক্রিয় ব্যাঙ্ক অ্যাকাউন্ট',
        'ফসল বপনের শংসাপত্র বা স্ব-ঘোষণা'
      ]
    },
    benefits: {
      en: [
        'Extremely low farmer premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops',
        'Government covers 100% of the remaining actuarial premium',
        'Full sum insured payout without cap for localized calamities, prevented sowing, and post-harvest damage',
        'Direct bank transfer to Aadhaar-enabled bank accounts'
      ],
      hi: [
        'अत्यंत कम किसान प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%, वाणिज्यिक/बागवानी फसलों के लिए 5%',
        'सरकार शेष वास्तविक प्रीमियम का 100% वहन करती है',
        'स्थानीयकृत आपदाओं, रोकी गई बुवाई और कटाई उपरांत नुकसान के लिए पूर्ण बीमा राशि का भुगतान',
        'आधार सक्षम बैंक खातों में सीधा बैंक ट्रांसफर'
      ],
      mr: [
        'अत्यंत कमी शेतकरी प्रीमियम: खरीप २%, रब्बी १.५%, बागायती ५%',
        'उर्वरित सर्व विमा हप्ता शासन भरते',
        'स्थानिक नैसर्गिक आपत्ती व काढणीपश्चात नुकसानीसाठी पूर्ण भरपाई',
        'थेट बँक खात्यात भरपाई जमा'
      ],
      bn: [
        'অতি সামান্য প্রিমিয়াম: খারিফ ২%, রবি ১.৫%, বাণিজ্যিক ৫%',
        'অবশিষ্ট প্রিমিয়াম সম্পূর্ণ সরকার বহন করে',
        'স্থানীয় দুর্যোগ ও ফসল কাটার পর ক্ষতির সম্পূর্ণ সুরক্ষা',
        'ডিবিটি মাধ্যমে সরাসরি ব্যাঙ্ক অ্যাকাউন্টে অর্থ স্থানান্তর'
      ]
    },
    applicationProcess: {
      en: [
        'Apply online at National Crop Insurance Portal (pmfby.gov.in) or offline via PACS / CSC / Bank branch',
        'Submit land record (7/12 or RoR), Aadhaar, bank passbook, and crop sowing certificate',
        'Pay the nominal farmer premium share before the cut-off date (July 31 for Kharif, Dec 31 for Rabi)',
        'Download the insurance acknowledgement policy certificate'
      ],
      hi: [
        'राष्ट्रीय फसल बीमा पोर्टल (pmfby.gov.in) पर ऑनलाइन या पैक्स / सीएससी / बैंक शाखा के माध्यम से ऑफलाइन आवेदन करें',
        'भू-अभिलेख (7/12 या RoR), आधार, बैंक पासबुक और बुवाई प्रमाण पत्र जमा करें',
        'कट-ऑफ तिथि से पहले किसान प्रीमियम का भुगतान करें (खरीफ के लिए 31 जुलाई, रबी के लिए 31 दिसंबर)',
        'बीमा पावती रसीद / पॉलिसी प्रमाण पत्र डाउनलोड करें'
      ],
      mr: [
        'pmfby.gov.in वर किंवा जवळच्या पॅक्स / सीएससी केंद्रावर अर्ज करा',
        '७/१२, आधार, बँक पासबुक आणि पेरणी दाखला सादर करा',
        'शेवटच्या तारखेपूर्वी शेतकरी हप्ता जमा करा',
        'विमा पावती डाउनलोड करा'
      ],
      bn: [
        'pmfby.gov.in পোর্টাল বা প্যাকস / সিএসসি সেন্টারে আবেদন করুন',
        'জমির রেকর্ড, আধার, ব্যাঙ্ক পাসবুক ও বপনের প্রমাণ জমা দিন',
        'নির্দিষ্ট সময়সীমার মধ্যে প্রিমিয়াম জমা দিন',
        'বীমা স্বীকৃতির রসিদ সংগ্রহ করুন'
      ]
    },
    requiredDocuments: {
      en: ['Aadhaar Card', 'Land Record (7/12 / RoR / Khasra)', 'Bank Passbook / Cancelled Cheque', 'Sowing Certificate / Crop Declaration', 'Tenancy Agreement (for tenant farmers)'],
      hi: ['आधार कार्ड', 'भू-अभिलेख (7/12 / RoR / खसरा)', 'बैंक पासबुक / रद्द चेक', 'बुवाई प्रमाण पत्र / फसल घोषणा', 'काश्तकारी अनुबंध (बटाईदार किसानों के लिए)'],
      mr: ['आधार कार्ड', 'जमीन नोंद (७/१२ उतारा)', 'बँक पासबुक', 'पीक पेरणी दाखला', 'कुळ करारपत्र (लागू असल्यास)'],
      bn: ['আধার কার্ড', 'জমির রেকর্ড (খতিয়ান)', 'ব্যাঙ্ক পাসবুক', 'ফসল বপনের ঘোষণাপত্র', 'লিজ চুক্তি (ভাগচাষীদের জন্য)']
    },
    officialSource: 'pmfby.gov.in',
    officialUrl: 'https://pmfby.gov.in'
  },
  {
    id: 'pm-kisan',
    name: {
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
      mr: 'प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)',
      bn: 'প্রধানমন্ত্রী কিষাণ সম্মান নিধি (PM-KISAN)'
    },
    ministry: {
      en: 'Ministry of Agriculture & Farmers Welfare',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय',
      mr: 'कृषी आणि शेतकरी कल्याण मंत्रालय',
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক'
    },
    category: 'Agriculture',
    shortDescription: {
      en: 'Direct income support of Rs 6,000 per year in 3 equal installments of Rs 2,000 to all eligible landholding farmer families.',
      hi: 'सभी पात्र भूमिधारक किसान परिवारों को 2,000 रुपये की 3 समान किस्तों में प्रति वर्ष 6,000 रुपये की प्रत्यक्ष आय सहायता।',
      mr: 'सर्व पात्र शेतकरी कुटुंबांना प्रतिवर्ष ६,००० रुपये (२,००० रुपयांचे ३ हप्ते) थेट बँक खात्यात आर्थिक मदत.',
      bn: 'সকল যোগ্য জমিধারী কৃষক পরিবারকে বছরে ৬,০০০ টাকা (২,০০০ টাকার ৩টি কিস্তি) সরাসরি আর্থিক সহায়তা।'
    },
    targetUsers: {
      en: 'Small, marginal, and all operational landholding farmer families with cultivable land.',
      hi: 'कृषि योग्य भूमि वाले छोटे, सीमांत और सभी परिचालन भूमिधारक किसान परिवार।',
      mr: 'लागवडीयोग्य जमीन असलेले सर्व शेतकरी कुटुंब.',
      bn: 'চাষযোগ্য জমির মালিক সকল কৃষক পরিবার।'
    },
    eligibility: {
      en: [
        'Farmer family must own cultivable agricultural land registered in state records',
        'Mandatory completed e-KYC (OTP, Biometric, or Face Authentication)',
        'Bank account must be Aadhaar seeded and NPCI DBT-enabled',
        'Not belonging to income tax payees, constitutional post holders, or institutional landholders'
      ],
      hi: [
        'किसान परिवार के पास राज्य रिकॉर्ड में पंजीकृत कृषि योग्य भूमि होनी चाहिए',
        'अनिवार्य ई-केवाईसी (OTP, बायोमेट्रिक या फेस ऑथेंटिकेशन द्वारा)',
        'बैंक खाता आधार से जुड़ा और NPCI DBT-सक्षम होना चाहिए',
        'आयकर दाता, संवैधानिक पद धारक या संस्थागत भूमिधारक पात्र नहीं हैं'
      ],
      mr: [
        'शेतकऱ्याच्या नावावर लागवडीयोग्य शेतजमीन अधिकृत नोंद असणे आवश्यक',
        'ई-केवायसी पूर्ण असणे बंधनकारक',
        'बँक खाते आधार लिंक व डीबीटी सक्षम असणे आवश्यक',
        'आयकर भरणारे किंवा उच्च पदस्थ अधिकारी पात्र नाहीत'
      ],
      bn: [
        'চাষযোগ্য জমির মালিকানা থাকতে হবে',
        'বাধ্যতামূলক ই-কেওয়াইসি সম্পন্ন হতে হবে',
        'ব্যাঙ্ক অ্যাকাউন্ট আধার ও ডিবিটি সক্রিয় হতে হবে',
        'আয়করদাতা ও সরকারি উচ্চপদস্থ ব্যক্তিরা অন্তর্ভুক্ত নন'
      ]
    },
    benefits: {
      en: [
        'Guaranteed financial assistance of Rs 6,000 annually',
        'Disbursed in 3 tranches: April-July, August-November, December-March',
        'Directly deposited into bank account via DBT without intermediaries'
      ],
      hi: [
        'सालाना 6,000 रुपये की सुनिश्चित वित्तीय सहायता',
        '3 किस्तों में वितरित: अप्रैल-जुलाई, अगस्त-नवंबर, दिसंबर-मार्च',
        'बिचौलियों के बिना डीबीटी के माध्यम से सीधे बैंक खाते में जमा'
      ],
      mr: [
        'दरवर्षी ६,००० रुपयांची खात्रीशीर मदत',
        'वर्षातून ३ हप्त्यांमध्ये वाटप',
        'कोणत्याही मध्यस्थाशिवाय थेट खात्यात जमा'
      ],
      bn: [
        'বার্ষিক ৬,০০০ টাকার নিশ্চিত আর্থিক সাহায্য',
        '৩টি সমান কিস্তিতে প্রদান',
        'কোনো মধ্যস্থতাকারী ছাড়াই সরাসরি ব্যাঙ্ক অ্যাকাউন্টে'
      ]
    },
    applicationProcess: {
      en: [
        'Register online at pmkisan.gov.in under "New Farmer Registration"',
        'Enter Aadhaar number, state, district, sub-district, block, and village',
        'Provide land ownership survey / khatauni / dag number details',
        'Complete e-KYC using Aadhaar OTP or nearby CSC centre'
      ],
      hi: [
        'pmkisan.gov.in पर "New Farmer Registration" के तहत ऑनलाइन पंजीकरण करें',
        'आधार नंबर, राज्य, जिला, उप-जिला, ब्लॉक और गांव दर्ज करें',
        'भूमि स्वामित्व सर्वेक्षण / खतौनी / दाग संख्या का विवरण प्रदान करें',
        'आधार ओटीपी या नजदीकी सीएससी केंद्र का उपयोग करके ई-केवाईसी पूरा करें'
      ],
      mr: [
        'pmkisan.gov.in वर जाऊन "New Farmer Registration" करा',
        'आधार क्रमांक, पत्ता आणि जमिनीचे तपशील भरा',
        '७/१२ व फेरफार नोंद जोडा',
        'ओटीपी द्वारे ई-केवायसी पूर्ण करा'
      ],
      bn: [
        'pmkisan.gov.in এ গিয়ে নতুন কৃষক নিবন্ধন করুন',
        'আধার নম্বর ও জমির খতিয়ান নম্বর দিন',
        'ওটিপি বা বায়োমেট্রিকের মাধ্যমে ই-কেওয়াইসি সম্পন্ন করুন'
      ]
    },
    requiredDocuments: {
      en: ['Aadhaar Card', 'Land Ownership Records (RoR / 7/12 / Khasra)', 'Active Bank Account Passbook (Aadhaar linked)', 'Mobile number linked with Aadhaar'],
      hi: ['आधार कार्ड', 'भूमि स्वामित्व रिकॉर्ड (RoR / 7/12 / खसरा)', 'सक्रिय बैंक खाता पासबुक (आधार से जुड़ा)', 'आधार से जुड़ा मोबाइल नंबर'],
      mr: ['आधार कार्ड', 'जमीन मालकी नोंद (७/१२)', 'बँक पासबुक', 'आधार लिंक मोबाईल नंबर'],
      bn: ['আধার কার্ড', 'জমির পরচা বা খতিয়ান', 'ব্যাঙ্ক পাসবুক', 'আধার সংযুক্ত মোবাইল নম্বর']
    },
    officialSource: 'pmkisan.gov.in',
    officialUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'kcc-scheme',
    name: {
      en: 'Kisan Credit Card (KCC) Scheme',
      hi: 'किसान क्रेडिट कार्ड (KCC) योजना',
      mr: 'किसान क्रेडिट कार्ड (KCC) योजना',
      bn: 'কিষাণ ক্রেডিট কার্ড (KCC) প্রকল্প'
    },
    ministry: {
      en: 'Ministry of Agriculture & NABARD / RBI',
      hi: 'कृषि मंत्रालय एवं नाबार्ड / आरबीआई',
      mr: 'कृषी मंत्रालय आणि नाबार्ड / आरबीआय',
      bn: 'কৃষি মন্ত্রক ও নাবার্ড / আরবিআই'
    },
    category: 'Finance',
    shortDescription: {
      en: 'Flexible revolving agricultural credit for crop cultivation, farm maintenance, dairy, fisheries, and post-harvest expenses at subsidized 4% interest.',
      hi: 'फसल की खेती, फार्म रखरखाव, डेयरी, मत्स्य पालन और कटाई उपरांत खर्चों के लिए 4% रियायती ब्याज पर लचीला कृषि ऋण।',
      mr: 'पीक लागवड, शेती व्यवस्थापन, दुग्धव्यवसाय आणि मत्स्यपालनासाठी ४% सवलतीच्या दरात फिरते कृषी कर्ज.',
      bn: 'ফসলের চাষাবাদ, খামার পরিচালনা, দুগ্ধ ও মৎস্যচাষের জন্য ৪% ভর্তুকিযুক্ত সুদে সহজলভ্য কৃষি ঋণ।'
    },
    targetUsers: {
      en: 'All individual farmers, joint borrowers, tenant farmers, oral lessees, and Self Help Groups (SHGs).',
      hi: 'सभी व्यक्तिगत किसान, संयुक्त उधारकर्ता, काश्तकार किसान, बटाईदार और स्वयं सहायता समूह (SHG)।',
      mr: 'सर्व वैयक्तिक शेतकरी, संयुक्त खातेदार, कुळ शेतकरी आणि महिला बचत गट (SHG).',
      bn: 'সকল কৃষক, যৌথ অংশীদার, ভাগচাষী এবং স্বনির্ভর দল (SHG)।'
    },
    eligibility: {
      en: [
        'Cultivators of agricultural crops or allied animal husbandry/fishery activities',
        'Age between 18 and 75 years (co-borrower mandatory if age is above 60)',
        'Good credit repayment history without past default on cooperative loans'
      ],
      hi: [
        'कृषि फसलों या संबद्ध पशुपालन/मत्स्य पालन गतिविधियों के उत्पादक',
        'आयु 18 से 75 वर्ष (60 वर्ष से अधिक होने पर सह-उधारकर्ता अनिवार्य)',
        'सहकारी या बैंक ऋणों पर पिछले डिफ़ॉल्ट के बिना अच्छा क्रेडिट इतिहास'
      ],
      mr: [
        'शेती किंवा पशुसंवर्धन/दुग्ध/मत्स्य व्यवसाय करणारे शेतकरी',
        'वय १८ ते ७५ वर्षे',
        'मागील कर्जाची समाधानकारक परतफेड नोंद'
      ],
      bn: [
        'ফসল বা পশুপালন/মৎস্যচাষের সাথে যুক্ত কৃষক',
        'বয়স ১৮ থেকে ৭৫ বছর',
        'পূর্ববর্তী ঋণে খেলাপী না থাকা'
      ]
    },
    benefits: {
      en: [
        'Short-term crop credit up to Rs 3,00,000 at effective 4% interest per annum with timely repayment',
        'Collateral-free loans up to Rs 1,60,000 without mortgaging land',
        'Card valid for 5 years with annual scale-of-finance review',
        'ATM-enabled RuPay Kisan Card for easy withdrawals anytime'
      ],
      hi: [
        'समय पर पुनर्भुगतान पर 4% प्रभावी वार्षिक ब्याज पर 3,00,000 रुपये तक का अल्पकालिक फसली ऋण',
        'भूमि बंधक रखे बिना 1,60,000 रुपये तक का बिना गारंटी ऋण',
        'वार्षिक समीक्षा के साथ 5 वर्ष के लिए वैध कार्ड',
        'कभी भी आसान निकासी के लिए एटीएम सक्षम रूपे किसान कार्ड'
      ],
      mr: [
        'वेळेवर परतफेड केल्यास ३ लाख रुपयांपर्यंत केवळ ४% व्याजाने कर्ज',
        '१.६० लाखांपर्यंत जमीन तारण न ठेवता कर्ज',
        '५ वर्षांसाठी वैध रूपे किसान कार्ड',
        'एटीएमद्वारे हवे तेव्हा पैसे काढण्याची सुविधा'
      ],
      bn: [
        'সময়মতো পরিশোধে কার্যকর ৪% সুদে ৩ লক্ষ টাকা পর্যন্ত ঋণ',
        '১.৬০ লক্ষ টাকা পর্যন্ত জামানতমুক্ত ঋণ',
        '৫ বছরের জন্য বৈধ রূপয় কিষাণ কার্ড',
        'এটিএম থেকে সহজে অর্থ উত্তোলনের সুবিধা'
      ]
    },
    applicationProcess: {
      en: [
        'Download single-page KCC application form from official bank/NABARD website or obtain at nearest PACS/bank branch',
        'Attach land record extract (7/12 or RoR) and Aadhaar/Voter ID',
        'Submit to PACS Secretary or local commercial/Gramin bank branch',
        'Bank evaluates scale of finance and issues RuPay KCC card within 14 days'
      ],
      hi: [
        'बैंक/नाबार्ड की वेबसाइट से एक पृष्ठ का केसीसी फॉर्म डाउनलोड करें या नजदीकी पैक्स/बैंक शाखा से प्राप्त करें',
        'भू-अभिलेख उद्धरण (7/12 या RoR) और आधार/वोटर कार्ड संलग्न करें',
        'पैक्स सचिव या स्थानीय बैंक शाखा में जमा करें',
        'बैंक 14 दिनों के भीतर सीमा तय कर रूपे केसीसी कार्ड जारी करता है'
      ],
      mr: [
        'पॅक्स किंवा बँकेतून केसीसी अर्ज घ्या',
        '७/१२ उतारा आणि आधार कार्ड जोडा',
        'पॅक्स सचिव किंवा बँकेत अर्ज जमा करा',
        '१४ दिवसांत रूपे किसान कार्ड मंजूर केले जाते'
      ],
      bn: [
        'ব্যাঙ্ক বা প্যাকস থেকে এক পাতার আবেদন ফর্ম সংগ্রহ করুন',
        'জমির রেকর্ড ও আধার যুক্ত করে জমা দিন',
        '১৪ দিনের মধ্যে রূপয় কেসিসি কার্ড পেয়ে যান'
      ]
    },
    requiredDocuments: {
      en: ['Completed KCC Application Form', 'Identity Proof (Aadhaar / Voter ID)', 'Address Proof', 'Land Ownership (RoR / 7/12 / Mutation Record)', 'Crop Sowing Details'],
      hi: ['भरा हुआ केसीसी आवेदन पत्र', 'पहचान प्रमाण (आधार / वोटर आईडी)', 'पते का प्रमाण', 'भूमि स्वामित्व (RoR / 7/12 / दाखिल-खारिज)', 'फसल बुवाई का विवरण'],
      mr: ['केसीसी अर्ज', 'आधार कार्ड', '७/१२ उतारा व ८-अ', 'पेरणी तपशील'],
      bn: ['কেসিসি আবেদন পত্র', 'আধার কার্ড', 'জমির খতিয়ান', 'ফসল চাষের বিবরণ']
    },
    officialSource: 'nabard.org',
    officialUrl: 'https://www.nabard.org'
  },
  {
    id: 'aif',
    name: {
      en: 'Agriculture Infrastructure Fund (AIF)',
      hi: 'कृषि अवसंरचना कोष (AIF)',
      mr: 'कृषी पायाभूत सुविधा निधी (AIF)',
      bn: 'কৃষি অবকাঠামো তহবিল (AIF)'
    },
    ministry: {
      en: 'Ministry of Agriculture & Farmers Welfare',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय',
      mr: 'कृषी आणि शेतकरी कल्याण मंत्रालय',
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক'
    },
    category: 'Cooperative',
    shortDescription: {
      en: 'Medium-long term debt financing facility for investment in viable post-harvest management infrastructure and community farm assets with 3% interest subvention.',
      hi: '3% ब्याज छूट के साथ कटाई उपरांत प्रबंधन अवसंरचना और सामुदायिक कृषि संपत्तियों में निवेश के लिए मध्यम-दीर्घकालिक ऋण सुविधा।',
      mr: 'कापणी पश्चात व्यवस्थापन आणि शेती पायाभूत सुविधांसाठी ३% व्याज सवलतीसह दीर्घ मुदतीचे कर्ज सहाय्य.',
      bn: 'ফসল তোলার পরবর্তী অবকাঠামো তৈরি ও গুদামজাতকরণের জন্য ৩% সুদ ছাড়সহ মাঝারি ও দীর্ঘমেয়াদী ঋণ।'
    },
    targetUsers: {
      en: 'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Farmer Producers Organizations (FPOs), SHGs, Agri-entrepreneurs.',
      hi: 'प्राथमिक कृषि साख समितियां (PACS), विपणन सहकारी समितियां, किसान उत्पादक संगठन (FPO), स्वयं सहायता समूह, कृषि उद्यमी।',
      mr: 'पॅक्स (PACS), शेतकरी उत्पादक कंपन्या (FPO), सहकारी खरेदी-विक्री संस्था, कृषी उद्योजक.',
      bn: 'প্যাকস (PACS), এফপিও (FPO), সমবায় বিপণন সমিতি ও কৃষি উদ্যোক্তা।'
    },
    eligibility: {
      en: [
        'Registered PACS, cooperative societies, FPOs, or individual agri-entrepreneurs',
        'Project must relate to post-harvest management (warehouses, cold chains, sorting/grading units) or community farm assets',
        'Viable detailed project report (DPR)'
      ],
      hi: [
        'पंजीकृत पैक्स, सहकारी समितियां, एफपीओ, या व्यक्तिगत कृषि उद्यमी',
        'परियोजना कटाई उपरांत प्रबंधन (गोदाम, कोल्ड चेन, ग्रेडिंग इकाइयां) या सामुदायिक कृषि संपत्ति से संबंधित होनी चाहिए',
        'व्यवहार्य विस्तृत परियोजना रिपोर्ट (DPR)'
      ],
      mr: [
        'नोंदणीकृत पॅक्स, सहकारी संस्था, शेतकरी उत्पादक कंपन्या (FPO)',
        'प्रकल्प धान्य साठवणूक, शीतगृह, प्रतवारी केंद्र किंवा शेती अवजारे केंद्राशी संबंधित असावा',
        'व्यवहार्य प्रकल्प अहवाल (DPR)'
      ],
      bn: [
        'নিবন্ধিত প্যাকস, এফপিও বা কৃষি উদ্যোক্তা',
        'প্রকল্পটি গুদামজাতকরণ, কোল্ড স্টোরেজ বা গ্রেডিং ইউনিটের হতে হবে',
        'প্রকল্পের বিস্তারিত ডিপিআর (DPR)'
      ]
    },
    benefits: {
      en: [
        '3% per annum interest subvention for loans up to Rs 2.00 Crore for maximum period of 7 years',
        'Credit guarantee coverage under CGTMSE for loans up to Rs 2.00 Crore',
        'PACS can combine AIF with NCDC and State cooperative convergence schemes'
      ],
      hi: [
        'अधिकतम 7 वर्षों के लिए 2.00 करोड़ रुपये तक के ऋण पर 3% प्रति वर्ष ब्याज छूट',
        '2.00 करोड़ रुपये तक के ऋण के लिए सीजीटीएमएसई के तहत क्रेडिट गारंटी कवरेज',
        'पैक्स एआईएफ को एनसीडीसी और राज्य सहकारी योजनाओं के साथ जोड़ सकते हैं'
      ],
      mr: [
        '२ कोटींपर्यंतच्या कर्जावर सलग ७ वर्षांसाठी दरवर्षी ३% व्याज सवलत',
        '२ कोटींपर्यंतच्या कर्जासाठी क्रेडिट गॅरंटी संरक्षण',
        'पॅक्ससाठी विविध योजनांचे अभिसरण'
      ],
      bn: [
        '২ কোটি টাকা পর্যন্ত ঋণের ওপর বার্ষিক ৩% সুদ ছাড় (সর্বোচ্চ ৭ বছর)',
        'সিজিটিএমএসই-এর অধীনে ক্রেডিট গ্যারান্টি সুবিধা',
        'প্যাকসের জন্য বহুমুখী সমন্বয়ের সুযোগ'
      ]
    },
    applicationProcess: {
      en: [
        'Register and submit project proposal at the AIF Portal (agriinfra.dac.gov.in)',
        'Upload project DPR, land document/lease, and cooperative balance sheets',
        'Proposal evaluated by Ministry PMU and forwarded to designated lending bank within 7 days',
        'Bank sanctions loan with automatic 3% interest subvention tagging'
      ],
      hi: [
        'एआईएफ पोर्टल (agriinfra.dac.gov.in) पर पंजीकरण करें और परियोजना प्रस्ताव प्रस्तुत करें',
        'परियोजना डीपीआर, भूमि दस्तावेज/पट्टा, और सहकारी बैलेंस शीट अपलोड करें',
        'मंत्रालय पीएमयू द्वारा प्रस्ताव का मूल्यांकन और 7 दिनों के भीतर बैंक को प्रेषण',
        'बैंक स्वचालित 3% ब्याज छूट टैगिंग के साथ ऋण स्वीकृत करता है'
      ],
      mr: [
        'agriinfra.dac.gov.in पोर्टलवर प्रकल्प नोंदणी करा',
        'प्रकल्प अहवाल (DPR) आणि संस्थेचे ताळेबंद अपलोड करा',
        'बँकेकडून कर्ज मंजुरी व व्याज सवलत लागू होते'
      ],
      bn: [
        'agriinfra.dac.gov.in পোর্টালে প্রকল্পের প্রস্তাব জমা দিন',
        'ডিপিআর এবং নথিপত্র আপলোড করুন',
        'ব্যাঙ্ক থেকে ৩% সুদ ছাড়সহ ঋণ অনুমোদন নিন'
      ]
    },
    requiredDocuments: {
      en: ['Detailed Project Report (DPR)', 'Society Registration Certificate & By-laws', 'Land Ownership / Long-term Lease Agreement', 'Audited Financial Statements of past 3 years', 'Managing Committee Resolution'],
      hi: ['विस्तृत परियोजना रिपोर्ट (DPR)', 'समिति पंजीकरण प्रमाण पत्र और उप-नियम', 'भूमि स्वामित्व / दीर्घकालिक पट्टा समझौता', 'पिछले 3 वर्षों के लेखापरीक्षित वित्तीय विवरण', 'प्रबंध समिति का संकल्प'],
      mr: ['सविस्तर प्रकल्प अहवाल (DPR)', 'संस्था नोंदणी दाखला व उपविधी', 'जागेचा ७/१२ किंवा भाडेकरार', 'मागील ३ वर्षांचे ऑडिट रिपोर्ट', 'संचालक मंडळाचा ठराव'],
      bn: ['বিস্তারিত প্রকল্প রিপোর্ট (DPR)', 'সমিতির নিবন্ধন শংসাপত্র ও উপ-আইন', 'জমির মালিকানা বা লিজ চুক্তি', 'বিগত ৩ বছরের নিরীক্ষিত অডিট রিপোর্ট', 'পরিচালনা কমিটির রেজোলিউশন']
    },
    officialSource: 'agriinfra.dac.gov.in',
    officialUrl: 'https://agriinfra.dac.gov.in'
  },
  {
    id: 'ncdc-yuva-sahakar',
    name: {
      en: 'NCDC Yuva Sahakar - Cooperative Enterprise Scheme',
      hi: 'एनसीडीसी युवा सहकार - सहकारी उद्यम योजना',
      mr: 'एनसीडीसी युवा सहकार - सहकारी उद्योग योजना',
      bn: 'এনসিডিসি যুব সহকার - সমবায় উদ্যোগ প্রকল্প'
    },
    ministry: {
      en: 'Ministry of Cooperation / NCDC',
      hi: 'सहकारिता मंत्रालय / एनसीडीसी',
      mr: 'सहकार मंत्रालय / एनसीडीसी',
      bn: 'সমবায় মন্ত্রক / এনসিডিসি'
    },
    category: 'Rural Development',
    shortDescription: {
      en: 'Concessional funding support to newly formed and youth-led cooperatives to venture into innovative agri-business, food processing, and rural tech.',
      hi: 'नवनिर्मित और युवा-नेतृत्व वाली सहकारी समितियों को अभिनव कृषि-व्यवसाय, खाद्य प्रसंस्करण और ग्रामीण तकनीक में उद्यम करने के लिए रियायती वित्तपोषण सहायता।',
      mr: 'कृषी प्रक्रिया, नावीन्यपूर्ण ग्रामीण उद्योग आणि तंत्रज्ञानासाठी तरुण सहकारी संस्थांना सवलतीच्या दरात भांडवली सहाय्य.',
      bn: 'উদ্ভাবনী কৃষি ব্যবসা, খাদ্য প্রক্রিয়াকরণ ও গ্রামীণ প্রযুক্তিতে তরুণদের সমবায় উদ্যোগের জন্য সহজ শর্তে ঋণ।'
    },
    targetUsers: {
      en: 'Cooperative societies with youth members (at least 3 months in operation), women cooperatives, and SC/ST cooperatives.',
      hi: 'युवा सदस्यों वाली सहकारी समितियां (कम से कम 3 महीने से परिचालन में), महिला सहकारी समितियां, और एससी/एसटी सहकारी समितियां।',
      mr: 'किमान ३ महिने कार्यरत असलेल्या तरुण सभासदांच्या सहकारी संस्था, महिला व मागासवर्गीय संस्था.',
      bn: 'তরুণদের দ্বারা পরিচালিত সমবায় সমিতি, মহিলা সমবায় ও অনগ্রসর শ্রেণীর সমবায়।'
    },
    eligibility: {
      en: [
        'Registered cooperative society operating for at least 3 months',
        'Cooperative must have viable business model in agriculture, dairy, fisheries, logistics, or services',
        'Youth/women representation in Managing Committee'
      ],
      hi: [
        'कम से कम 3 महीने से संचालित पंजीकृत सहकारी समिति',
        'कृषि, डेयरी, मत्स्य पालन, लॉजिस्टिक्स या सेवाओं में व्यवहार्य व्यावसायिक मॉडल होना चाहिए',
        'प्रबंध समिति में युवा/महिला प्रतिनिधित्व'
      ],
      mr: [
        'किमान ३ महिने कार्यरत नोंदणीकृत सहकारी संस्था',
        'कृषी, दुग्ध, लॉजिस्टिक्स किंवा सेवा क्षेत्रातील प्रकल्प',
        'व्यवस्थापन समितीत युवा/महिला प्रतिनिधी'
      ],
      bn: [
        'কমপক্ষে ৩ মাস সক্রিয় নিবন্ধিত সমবায় সমিতি',
        'কৃষি, প্রক্রিয়াকরণ বা পরিষেবা খাতের প্রকল্প',
        'পরিচালনা কমিটিতে তরুণ/নারী প্রতিনিধিত্ব'
      ]
    },
    benefits: {
      en: [
        'Project funding up to 80% of project cost (up to Rs 3.00 Crore for normal cooperatives, up to Rs 3.60 Crore for women/SC/ST/North-East)',
        '2% interest incentive on prompt repayment',
        'Moratorium period up to 2 years for principal repayment'
      ],
      hi: [
        'परियोजना लागत का 80% तक वित्तपोषण (सामान्य सहकारी समितियों के लिए 3.00 करोड़ तक, महिला/एससी/एसटी के लिए 3.60 करोड़ तक)',
        'समय पर पुनर्भुगतान पर 2% ब्याज प्रोत्साहन',
        'मूलधन पुनर्भुगतान के लिए 2 वर्ष तक का अधिस्थगन (मोरेटोरियम)'
      ],
      mr: [
        'प्रकल्प खर्चाच्या ८०% पर्यंत कर्ज (३ कोटी रुपयांपर्यंत)',
        'वेळेवर परतफेडीवर २% अतिरिक्त व्याज सवलत',
        '२ वर्षांचा हप्ता सवलत कालावधी (Moratorium)'
      ],
      bn: [
        'প্রকল্প খরচের ৮০% পর্যন্ত অর্থায়ন (৩ কোটি টাকা পর্যন্ত)',
        'সময়মতো পরিশোধে ২% অতিরিক্ত সুদ ছাড়',
        'আসল পরিশোধে ২ বছরের মোরাটোরিয়াম'
      ]
    },
    applicationProcess: {
      en: [
        'Submit application through State Directorate of Cooperation or directly to NCDC Regional Office',
        'Attach detailed business project proposal and society resolution',
        'NCDC conducts technical feasibility appraisal and sanctions loan',
        'Funds disbursed in milestone-based tranches directly to society escrow account'
      ],
      hi: [
        'राज्य सहकारिता निदेशालय के माध्यम से या सीधे एनसीडीसी क्षेत्रीय कार्यालय में आवेदन जमा करें',
        'विस्तृत व्यावसायिक परियोजना प्रस्ताव और समिति का संकल्प संलग्न करें',
        'एनसीडीसी तकनीकी व्यवहार्यता मूल्यांकन करता है और ऋण स्वीकृत करता है',
        'धन सीधे समिति के खाते में चरणों में वितरित किया जाता है'
      ],
      mr: [
        'राज्य सहकार विभाग किंवा एनसीडीसी प्रादेशिक कार्यालयामार्फत अर्ज करा',
        'प्रकल्प अहवाल आणि संचालक मंडळाचा ठराव जोडा',
        'एनसीडीसीकडून छाननी होऊन थेट निधी मंजूर केला जातो'
      ],
      bn: [
        'রাজ্য সমবায় দপ্তর বা এনসিডিসি আঞ্চলিক অফিসে আবেদন করুন',
        'প্রকল্প রিপোর্ট ও রেজোলিউশন জমা দিন',
        'এনসিডিসি যাচাই করে ঋণ প্রদান করে'
      ]
    },
    requiredDocuments: {
      en: ['NCDC Application Form', 'Detailed Project Proposal', 'Society Registration Certificate & Bye-laws', 'Audited Accounts / Provisional Financials', 'Board Resolution'],
      hi: ['एनसीडीसी आवेदन पत्र', 'विस्तृत परियोजना प्रस्ताव', 'समिति पंजीकरण प्रमाण पत्र और उप-नियम', 'लेखापरीक्षित खाते / अनंतिम वित्तीय विवरण', 'बोर्ड का संकल्प'],
      mr: ['एनसीडीसी अर्ज', 'प्रकल्प अहवाल', 'संस्था नोंदणी दाखला व पोटनियम', 'ऑडिट रिपोर्ट', 'संचालक मंडळाचा ठराव'],
      bn: ['এনসিডিসি আবেদনপত্র', 'প্রকল্প প্রস্তাবনা', 'সমিতি নিবন্ধন শংসাপত্র', 'অডিট রিপোর্ট', 'বোর্ডের রেজোলিউশন']
    },
    officialSource: 'ncdc.in',
    officialUrl: 'https://www.ncdc.in'
  }
];

export const VERIFIED_SERVICES: ServiceItem[] = [
  {
    id: 'crop-insurance-claim',
    title: {
      en: 'File PMFBY Crop Loss Intimation (within 72 hours)',
      hi: 'पीएमएफबीवाई फसल नुकसान सूचना दर्ज करें (72 घंटे के भीतर)',
      mr: 'पीएमएफबीवाय पीक नुकसान तक्रार नोंदवा (७२ तासांच्या आत)',
      bn: 'পিএমএফবিওয়াই ফসল ক্ষতিপূরণ জানান (৭২ ঘণ্টার মধ্যে)'
    },
    shortDescription: {
      en: 'Direct service to report localized crop damages caused by hailstorms, heavy rainfall, landslides, or inundation within statutory 72-hour window.',
      hi: 'ओलावृष्टि, भारी वर्षा, भूस्खलन या जलभराव से हुए स्थानीयकृत फसल नुकसान की 72 घंटे की वैधानिक समय-सीमा में सूचना देने की सीधी सेवा।',
      mr: 'गारपीट, अतिवृष्टी किंवा पुरामुळे झालेल्या पीक नुकसानीची ७२ तासांच्या आत अधिकृत तक्रार नोंदवण्याची सेवा.',
      bn: 'শিলাবৃষ্টি, অতিবৃষ্টি বা বন্যার ফলে ফসল নষ্ট হলে ৭২ ঘণ্টার মধ্যে জানানোর সরাসরি পোর্টাল পরিষেবা।'
    },
    targetUsers: {
      en: 'All insured farmers with active PMFBY policy for the current season.',
      hi: 'चालू मौसम के लिए सक्रिय PMFBY पॉलिसी वाले सभी बीमित किसान।',
      mr: 'चालू हंगामात पीक विमा भरलेले सर्व शेतकरी.',
      bn: 'বর্তমান মরশুমে ফসল বীমা থাকা সকল কৃষক।'
    },
    category: 'Insurance',
    requiredDocuments: {
      en: ['PMFBY Policy Number / Application ID', 'Aadhaar Number', 'Survey/Khasra Number of damaged field', 'Geo-tagged field photos (via Crop Insurance App)'],
      hi: ['PMFBY पॉलिसी नंबर / आवेदन आईडी', 'आधार नंबर', 'क्षतिग्रस्त खेत का सर्वे/खसरा नंबर', 'खेत की जियो-टैग की गई तस्वीरें (क्रॉप इंश्योरेंस ऐप के माध्यम से)'],
      mr: ['पीक विमा अर्ज क्रमांक / पावती', 'आधार कार्ड', 'नुकसान झालेल्या शेताचा गट/सर्व्हे नंबर', 'शेतातील नुकसानीचे फोटो'],
      bn: ['পিএমএফবিওয়াই পলিসি নম্বর', 'আধার নম্বর', 'ক্ষতিগ্রস্ত জমির দাগ নম্বর', 'জমির ছবি']
    },
    officialSource: 'pmfby.gov.in / Toll-Free 14447',
    officialUrl: 'https://pmfby.gov.in',
    timeline: {
      en: 'Intimation must be filed within 72 hours of occurrence. Joint survey conducted within 10 days.',
      hi: 'घटना के 72 घंटे के भीतर सूचना दर्ज की जानी चाहिए। 10 दिनों के भीतर संयुक्त सर्वेक्षण किया जाता है।',
      mr: 'आपत्तीनंतर ७२ तासांत तक्रार आवश्यक. पुढील १० दिवसांत संयुक्त पंचनामा.',
      bn: 'ঘটনার ৭২ ঘণ্টার মধ্যে জানাতে হবে। ১০ দিনের মধ্যে সমীক্ষা সম্পন্ন হবে।'
    }
  },
  {
    id: 'crcs-grievance-portal',
    title: {
      en: 'File Grievance Against Cooperative Society (CRCS Portal)',
      hi: 'सहकारी समिति के खिलाफ शिकायत दर्ज करें (CRCS पोर्टल)',
      mr: 'सहकारी संस्थेविरुद्ध ऑनलाइन तक्रार दाखल करा (CRCS पोर्टल)',
      bn: 'সমবায় সমিতির বিরুদ্ধে অভিযোগ দায়ের করুন (সিআরসিএস পোর্টাল)'
    },
    shortDescription: {
      en: 'Statutory grievance redressal portal of the Central Registrar of Cooperative Societies for deposit non-refund, loan anomalies, and electoral disputes.',
      hi: 'जमा राशि न लौटाने, ऋण विसंगतियों और चुनावी विवादों के लिए केंद्रीय सहकारी समिति रजिस्ट्रार का वैधानिक शिकायत निवारण पोर्टल।',
      mr: 'ठेवी परत न मिळणे, कर्ज गैरव्यवहार किंवा निवडणूक वादांबाबत केंद्रीय निबंधकांकडे अधिकृत तक्रार निवारण.',
      bn: 'আমানত ফেরত না পাওয়া, ঋণ সংক্রান্ত অনিয়ম বা নির্বাচন নিয়ে কেন্দ্রীয় রেজিস্ট্রারের কাছে সরাসরি অভিযোগ জানানোর পোর্টাল।'
    },
    targetUsers: {
      en: 'Members, depositors, and shareholders of Multi-State Cooperative Societies.',
      hi: 'मल्टी-स्टेट सहकारी समितियों के सदस्य, जमाकर्ता और शेयरधारक।',
      mr: 'मल्टी-स्टेट सहकारी संस्थांचे सभासद, ठेवीदार आणि भागधारक.',
      bn: 'মাল্টি-স্টেট সমবায় সমিতির সদস্য, আমানতকারী ও অংশীদারগণ।'
    },
    category: 'Grievance',
    requiredDocuments: {
      en: ['Copy of Membership / Share Certificate', 'Deposit Receipts / Bond Certificate', 'Prior Written Representation to Society with Postal/Receiving Proof', 'Identity Proof (Aadhaar/PAN)'],
      hi: ['सदस्यता / शेयर प्रमाण पत्र की प्रति', 'जमा रसीद / बॉन्ड प्रमाण पत्र', 'समिति को दिए गए पूर्व लिखित आवेदन की पावती प्रति', 'पहचान प्रमाण (आधार/पैन)'],
      mr: ['सभासदत्व / शेअर दाखला', 'ठेव पावती किंवा बाँड', 'संस्थेला आधी दिलेल्या तक्रारीची पोहोच पावती', 'आधार किंवा पॅन कार्ड'],
      bn: ['সদস্যপদ বা শেয়ার সার্টিফিকেট', 'আমানত রসিদ বা বন্ড', 'সমিতিকে পূর্বে পাঠানো চিঠির প্রমাণপত্র', 'আধার বা প্যান কার্ড']
    },
    officialSource: 'crcs.gov.in / Ministry of Cooperation',
    officialUrl: 'https://crcs.gov.in',
    timeline: {
      en: 'Mandated disposal and action-taken report within 60 days of registration.',
      hi: 'पंजीकरण के 60 दिनों के भीतर अनिवार्य निपटान और कार्रवाई रिपोर्ट।',
      mr: 'नोंदणीनंतर ६० दिवसांच्या आत चौकशी व कारवाई अहवाल.',
      bn: 'নিবন্ধনের ৬০ দিনের মধ্যে নিষ্পত্তি ও রিপোর্ট প্রদান।'
    }
  },
  {
    id: 'pacs-membership-apply',
    title: {
      en: 'PACS Voting Membership & Share Purchase Guide',
      hi: 'पैक्स मतदान सदस्यता और शेयर खरीद मार्गदर्शन',
      mr: 'पॅक्स (PACS) मतदान सभासदत्व व शेअर खरेदी माहिती',
      bn: 'প্যাকস ভোটাধিকার সদস্যপদ ও শেয়ার ক্রয় নির্দেশিকা'
    },
    shortDescription: {
      en: 'Guidance and application checklist for becoming a regular member of your village Primary Agricultural Credit Society (PACS) to access subsidized loans and fertilizers.',
      hi: 'रियायती ऋण और उर्वरक प्राप्त करने के लिए अपने गांव की प्राथमिक कृषि ऋण समिति (PACS) का नियमित सदस्य बनने का मार्गदर्शन और चेकलिस्ट।',
      mr: 'सवलतीचे पीक कर्ज, बी-बियाणे आणि खते मिळवण्यासाठी गावातील प्राथमिक कृषी पतसंस्थेचे सभासद होण्यासाठी मार्गदर्शन.',
      bn: 'সুলভ মূল্যে ঋণ ও সার পাওয়ার জন্য আপনার গ্রামের প্রাথমিক কৃষি সমবায় সমিতিতে (PACS) সদস্য হওয়ার নির্দেশিকা।'
    },
    targetUsers: {
      en: 'Farmers, agricultural labourers, rural artisans, and small entrepreneurs residing in the PACS operational area.',
      hi: 'पैक्स के परिचालन क्षेत्र में रहने वाले किसान, कृषि मजदूर, ग्रामीण कारीगर और छोटे उद्यमी।',
      mr: 'संस्थेच्या कार्यक्षेत्रात राहणारे शेतकरी, शेतमजूर आणि ग्रामीण कारागीर.',
      bn: 'প্যাকসের ভৌগোলিক এলাকার কৃষক, কৃষি শ্রমিক এবং গ্রামীণ কারিগর।'
    },
    category: 'Cooperative',
    requiredDocuments: {
      en: ['Prescribed Membership Form (Form A)', 'Land Record (7/12 / RoR) or Residence Certificate', 'Aadhaar Card', 'Passport size photograph', 'Admission Fee (Rs 10 to Rs 50) + Minimum One Share Capital payment'],
      hi: ['निर्धारित सदस्यता प्रपत्र (प्रपत्र A)', 'भू-अभिलेख (7/12 / RoR) या निवास प्रमाण पत्र', 'आधार कार्ड', 'पासपोर्ट आकार का फोटो', 'प्रवेश शुल्क (10 से 50 रुपये) + न्यूनतम एक शेयर पूंजी'],
      mr: ['नमुना अर्ज', '७/१२ उतारा किंवा रहिवासी दाखला', 'आधार कार्ड', 'पासपोर्ट फोटो', 'प्रवेश फी व किमान १ शेअर रक्कम'],
      bn: ['নির্দিষ্ট আবেদন ফর্ম', 'জমির খতিয়ান বা আবাসিক প্রমাণপত্র', 'আধার কার্ড', 'পাসপোর্ট ছবি', 'প্রবেশ ফি ও একটি শেয়ারের মূল্য']
    },
    officialSource: 'State Department of Cooperation & Model PACS Bye-laws',
    officialUrl: 'https://cooperation.gov.in/pacs-model-byelaws'
  },
  {
    id: 'land-records-check',
    title: {
      en: 'Check Land Records & Agricultural Charge Status',
      hi: 'भू-अभिलेख और कृषि ऋण बंधक (चार्ज) स्थिति जांचें',
      mr: 'जमीन महसूल नोंदी (७/१२) व बँक बोजा स्थिती तपासा',
      bn: 'জমির রেকর্ড ও সমবায় ঋণের চার্জ স্থিতি যাচাই'
    },
    shortDescription: {
      en: 'Verify official digitised Record of Rights (RoR), 7/12 extract, survey numbers, and bank encumbrances before applying for cooperative agricultural loans.',
      hi: 'सहकारी कृषि ऋण के लिए आवेदन करने से पहले आधिकारिक डिजिटल भू-अभिलेख (RoR), 7/12 खतौनी, सर्वे नंबर और बैंक बंधक की जांच करें।',
      mr: 'सहकारी पीक कर्जासाठी अर्ज करण्यापूर्वी अधिकृत डिजिटल ७/१२ उतारा आणि बँकेचा बोजा नोंद तपासा.',
      bn: 'সমবায় কৃষি ঋণের আবেদনের আগে আপনার জমির ডিজিটাল রেকর্ড (খতিয়ান) ও বন্ধক অবস্থা যাচাই করুন।'
    },
    targetUsers: {
      en: 'Landowning farmers, heirs, and cooperative loan applicants.',
      hi: 'भूमिधारक किसान, वारिस और सहकारी ऋण आवेदक।',
      mr: 'जमीनधारक शेतकरी आणि कर्जदार सभासद.',
      bn: 'জমির মালিক কৃষক ও ঋণ আবেদনকারী।'
    },
    category: 'Property',
    requiredDocuments: {
      en: ['Survey Number / Gut Number / Khasra-Khatauni Number', 'District, Taluka/Tehsil, and Village Name'],
      hi: ['सर्वे नंबर / गट नंबर / खसरा-खतौनी नंबर', 'जिला, तालुका/तहसील, और गांव का नाम'],
      mr: ['गट क्रमांक / सर्व्हे नंबर', 'जिल्हा, तालुका आणि गाव'],
      bn: ['দাগ নম্বর / খতিয়ান নম্বর', 'জেলা, ব্লক এবং মৌজা']
    },
    officialSource: 'Digital India Land Records (DILRMP) / State Portals',
    officialUrl: 'https://dilrmp.gov.in'
  }
];
