import { CategoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cooperative-law',
    iconName: 'Scale',
    name: {
      en: 'Cooperative Law & Governance',
      hi: 'सहकारी कानून और शासन',
      mr: 'सहकारी कायदा आणि प्रशासन',
      bn: 'সমবায় আইন ও পরিচালনা'
    },
    description: {
      en: 'Cooperative Acts, By-laws, member voting rights, election rules, and managing committee duties.',
      hi: 'सहकारी अधिनियम, उप-नियम, सदस्य मतदान अधिकार, चुनाव नियम और प्रबंध समिति के कर्तव्य।',
      mr: 'सहकारी कायदे, पोटनियम, सदस्य मतदानाचे अधिकार, निवडणूक नियम आणि व्यवस्थापन समितीची कर्तव्ये.',
      bn: 'সমবায় আইন, উপ-আইন, সদস্যদের ভোটাধিকার, নির্বাচন বিধি এবং পরিচালনা কমিটির দায়িত্ব।'
    },
    examples: {
      en: ['Cooperative Acts', 'By-laws', 'Member rights', 'Elections', 'Governance'],
      hi: ['सहकारी अधिनियम', 'उप-नियम', 'सदस्य अधिकार', 'चुनाव', 'शासन'],
      mr: ['सहकारी कायदे', 'पोटनियम', 'सदस्य अधिकार', 'निवडणुका', 'प्रशासन'],
      bn: ['সমবায় আইন', 'উপ-আইন', 'সদস্যদের অধিকার', 'নির্বাচন', 'সুশাসন']
    },
    topics: [
      {
        id: 'member-rights',
        title: {
          en: 'Rights & Duties of Cooperative Members',
          hi: 'सहकारी सदस्यों के अधिकार और कर्तव्य',
          mr: 'सहकारी सदस्यांचे हक्क आणि कर्तव्ये',
          bn: 'সমবায় সদস্যদের অধিকার ও দায়িত্ব'
        },
        description: {
          en: 'Voting equality (one member one vote), inspecting audit books, quorum requirements, and dividend claims.',
          hi: 'मतदान समानता (एक सदस्य एक मत), ऑडिट बही का निरीक्षण, कोरम और लाभांश दावे।',
          mr: 'मतदान समानता (एक सदस्य एक मत), लेखापरीक्षण वह्या तपासणे, गणसंख्या आणि लाभांश.',
          bn: 'ভোটের সমতা (এক সদস্য এক ভোট), নিরীক্ষা বই পরিদর্শন, কোরাম এবং লভ্যাংশ।'
        },
        prompt: {
          en: 'What are the legal rights and duties of a member in a cooperative society under the Cooperative Societies Act?',
          hi: 'सहकारी समिति अधिनियम के तहत एक सहकारी सदस्य के कानूनी अधिकार और कर्तव्य क्या हैं?',
          mr: 'सहकारी संस्था कायद्यांतर्गत सहकारी सदस्याचे कायदेशीर हक्क आणि कर्तव्ये काय आहेत?',
          bn: 'সমবায় সমিতি আইনের অধীনে একজন সমবায় সদস্যের আইনি অধিকার ও দায়িত্ব কী কী?'
        }
      },
      {
        id: 'election-rules',
        title: {
          en: 'Cooperative Election Authority & Process',
          hi: 'सहकारी चुनाव प्राधिकरण और प्रक्रिया',
          mr: 'सहकारी निवडणूक प्राधिकरण आणि प्रक्रिया',
          bn: 'সমবায় নির্বাচন কর্তৃপক্ষ ও পদ্ধতি'
        },
        description: {
          en: 'Term of board, voter list publication, reservation of seats for women and SC/ST, and returning officer roles.',
          hi: 'बोर्ड का कार्यकाल, मतदाता सूची प्रकाशन, महिलाओं और एससी/एसटी के लिए सीटों का आरक्षण।',
          mr: 'मंडळाचा कार्यकाळ, मतदार यादी प्रसिद्ध करणे, महिला व अनुसूचित जाती/जमाती आरक्षण.',
          bn: 'বোর্ডের মেয়াদ, ভোটার তালিকা প্রকাশ, নারী ও এসসি/এসটি আসন সংরক্ষণ।'
        },
        prompt: {
          en: 'How are democratic elections conducted in a cooperative society and what are the rules under the Cooperative Election Authority?',
          hi: 'सहकारी समिति में लोकतांत्रिक चुनाव कैसे आयोजित किए जाते हैं और चुनाव प्राधिकरण के तहत क्या नियम हैं?',
          mr: 'सहकारी संस्थेत लोकशाही निवडणुका कशा घेतल्या जातात आणि निवडणूक प्राधिकरणाचे नियम काय आहेत?',
          bn: 'সমবায় সমিতিতে গণতান্ত্রিক নির্বাচন কীভাবে পরিচালিত হয় এবং নির্বাচনী কর্তৃপক্ষের নিয়ম কী?'
        }
      },
      {
        id: 'bylaw-amendment',
        title: {
          en: 'Amending Society By-Laws',
          hi: 'समिति के उप-नियमों में संशोधन',
          mr: 'संस्थेच्या पोटनियमात सुधारणा करणे',
          bn: 'সমিতির উপ-আইন সংশোধন'
        },
        description: {
          en: 'Special General Body Meeting procedure, 2/3rd majority voting, and Registrar approval timeline.',
          hi: 'विशेष साधारण सभा की प्रक्रिया, 2/3 बहुमत और रजिस्ट्रार अनुमोदन समय-सीमा।',
          mr: 'विशेष सर्वसाधारण सभा प्रक्रिया, २/३ बहुमताने ठराव आणि निबंधक मंजुरी.',
          bn: 'বিশেষ সাধারণ সভা পদ্ধতি, ২/৩ সংখ্যাগরিষ্ঠতা এবং রেজিস্ট্রারের অনুমোদনের সময়সীমা।'
        },
        prompt: {
          en: 'What is the exact legal procedure to amend the by-laws of a cooperative society?',
          hi: 'सहकारी समिति के उप-नियमों (by-laws) में संशोधन करने की सटीक कानूनी प्रक्रिया क्या है?',
          mr: 'सहकारी संस्थेच्या उपविधी (पोटनियम) मध्ये सुधारणा करण्याची कायदेशीर प्रक्रिया काय आहे?',
          bn: 'সমবায় সমিতির উপ-আইন সংশোধনের সঠিক আইনি পদ্ধতি কী?'
        }
      }
    ]
  },
  {
    id: 'finance-literacy',
    iconName: 'IndianRupee',
    name: {
      en: 'Finance & Financial Literacy',
      hi: 'वित्त और वित्तीय साक्षरता',
      mr: 'वित्त आणि वित्तीय साक्षरता',
      bn: 'অর্থ ও আর্থিক সাক্ষরতা'
    },
    description: {
      en: 'Agricultural loans, Kisan Credit Card, interest subvention, savings accounts, and cooperative credit rules.',
      hi: 'कृषि ऋण, किसान क्रेडिट कार्ड, ब्याज अनुदान, बचत खाते और सहकारी ऋण नियम।',
      mr: 'कृषी कर्जे, किसान क्रेडिट कार्ड, व्याज सवलत, बचत खाती आणि सहकारी पत नियम.',
      bn: 'কৃষি ঋণ, কিষাণ ক্রেডিট কার্ড, সুদ ভর্তুকি, সঞ্চয় অ্যাকাউন্ট এবং সমবায় ঋণ নিয়ম।'
    },
    examples: {
      en: ['Loans', 'Interest', 'Savings', 'Financial planning', 'Cooperative finance'],
      hi: ['ऋण', 'ब्याज', 'बचत', 'वित्तीय योजना', 'सहकारी वित्त'],
      mr: ['कर्ज', 'व्याज', 'बचत', 'आर्थिक नियोजन', 'सहकारी वित्त'],
      bn: ['ঋণ', 'সুদ', 'সঞ্চয়', 'আর্থিক পরিকল্পনা', 'সমবায় অর্থায়ন']
    },
    topics: [
      {
        id: 'kcc-interest-subvention',
        title: {
          en: 'KCC 4% Interest Subvention & Limits',
          hi: 'केसीसी 4% ब्याज अनुदान और सीमाएं',
          mr: 'केसीसी ४% व्याज सवलत आणि मर्यादा',
          bn: 'কেসিসি ৪% সুদ ভর্তুকি ও সীমা'
        },
        description: {
          en: 'How to get crop loan up to Rs 3 Lakh at effective 4% interest rate with prompt repayment.',
          hi: 'समय पर पुनर्भुगतान के साथ 4% प्रभावी ब्याज दर पर 3 लाख रुपये तक का फसली ऋण कैसे प्राप्त करें।',
          mr: 'वेळेवर परतफेड करून प्रभावी ४% व्याजदराने ३ लाख रुपयांपर्यंत पीक कर्ज कसे मिळवावे.',
          bn: 'সময়মতো পরিশোধ সাপেক্ষে ৪% কার্যকর সুদে ৩ লক্ষ টাকা পর্যন্ত ফসল ঋণ পাওয়ার উপায়।'
        },
        prompt: {
          en: 'What are the interest rates, credit limits, and subvention rules for Kisan Credit Card (KCC) loans?',
          hi: 'किसान क्रेडिट कार्ड (KCC) ऋण के लिए ब्याज दरें, क्रेडिट सीमाएं और ब्याज छूट (सबवेंशन) नियम क्या हैं?',
          mr: 'किसान क्रेडिट कार्ड (KCC) कर्जासाठी व्याजदर, कर्ज मर्यादा आणि व्याज सवलतीचे नियम काय आहेत?',
          bn: 'কিষাণ ক্রেডিট কার্ড (KCC) ঋণের সুদের হার, ঋণের সীমা এবং ভর্তুকির নিয়ম কী?'
        }
      },
      {
        id: 'collateral-free-loans',
        title: {
          en: 'Collateral-Free Agriculture Loans',
          hi: 'बिना गारंटी (कोलैटरल-फ्री) कृषि ऋण',
          mr: 'तारणमुक्त शेती कर्जे',
          bn: 'জামানতমুক্ত কৃষি ঋণ'
        },
        description: {
          en: 'RBI guidelines for collateral-free crop loans up to Rs 1.60 Lakh for small & marginal farmers.',
          hi: 'छोटे और सीमांत किसानों के लिए 1.60 लाख रुपये तक के बिना गारंटी फसली ऋण के लिए आरबीआई दिशानिर्देश।',
          mr: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांसाठी १.६० लाखांपर्यंत तारणमुक्त पीक कर्जाचे आरबीआय नियम.',
          bn: 'ক্ষুদ্র ও প্রান্তিক কৃষকদের জন্য ১.৬০ লক্ষ টাকা পর্যন্ত জামানতমুক্ত ফসল ঋণের আরবিআই নির্দেশিকা।'
        },
        prompt: {
          en: 'What is the limit for collateral-free agricultural loans and what documents are required?',
          hi: 'बिना गारंटी (collateral-free) कृषि ऋण की सीमा क्या है और कौन से दस्तावेज आवश्यक हैं?',
          mr: 'तारणमुक्त कृषी कर्जाची मर्यादा किती आहे आणि कोणती कागदपत्रे लागतात?',
          bn: 'জামানতমুক্ত কৃষি ঋণের সীমা কত এবং কী কী নথি প্রয়োজন?'
        }
      }
    ]
  },
  {
    id: 'government-schemes',
    iconName: 'Building2',
    name: {
      en: 'Government Schemes',
      hi: 'सरकारी योजनाएं',
      mr: 'शासकीय योजना',
      bn: 'সরকারি প্রকল্পসমূহ'
    },
    description: {
      en: 'PM-KISAN, Agriculture Infrastructure Fund, NCDC Yuva Sahakar, and Central/State welfare programs.',
      hi: 'पीएम-किसान, कृषि अवसंरचना कोष, एनसीडीसी युवा सहकार और केंद्रीय/राज्य कल्याणकारी योजनाएं।',
      mr: 'पीएम-किसान, कृषी पायाभूत सुविधा निधी, एनसीडीसी युवा सहकार आणि कल्याणकारी योजना.',
      bn: 'পিএম-কিষাণ, কৃষি অবকাঠামো তহবিল, এনসিডিসি যুব সহকার এবং সরকারি কল্যাণ প্রকল্প।'
    },
    examples: {
      en: ['Eligibility', 'Benefits', 'Application process', 'Required documents'],
      hi: ['पात्रता', 'लाभ', 'आवेदन प्रक्रिया', 'आवश्यक दस्तावेज'],
      mr: ['पात्रता', 'फायदे', 'अर्ज प्रक्रिया', 'आवश्यक कागदपत्रे'],
      bn: ['যোগ্যতা', 'সুবিধা', 'আবেদন প্রক্রিয়া', 'প্রয়োজনীয় নথি']
    },
    topics: [
      {
        id: 'pm-kisan-eligibility',
        title: {
          en: 'PM-KISAN Rs 6,000 Benefit & e-KYC',
          hi: 'पीएम-किसान 6,000 रुपये लाभ और ई-केवाईसी',
          mr: 'पीएम-किसान ६,००० रुपये लाभ आणि ई-केवायसी',
          bn: 'পিএম-কিষাণ ৬,০০০ টাকা সহায়তা ও ই-কেওয়াইসি'
        },
        description: {
          en: 'Eligibility rules, mandatory land registry seeding, Aadhaar-linked bank accounts, and exclusion criteria.',
          hi: 'पात्रता नियम, अनिवार्य भूमि रजिस्ट्री सीडिंग, आधार लिंक बैंक खाते और अपवर्जन मानदंड।',
          mr: 'पात्रता नियम, जमीन नोंदणी जोडणी, आधार लिंक बँक खाते आणि वगळण्याचे निकष.',
          bn: 'যোগ্যতার নিয়ম, জমির রেকর্ড সংযুক্তি, আধার লিঙ্কযুক্ত ব্যাঙ্ক অ্যাকাউন্ট ও বর্জনের শর্ত।'
        },
        prompt: {
          en: 'Who is eligible for PM-KISAN, how to complete e-KYC, and what causes installment rejections?',
          hi: 'पीएम-किसान के लिए कौन पात्र है, ई-केवाईसी कैसे पूरी करें और किस्तें रुकने के क्या कारण हैं?',
          mr: 'पीएम-किसानसाठी कोण पात्र आहे, ई-केवायसी कसे करावे आणि हप्ते का थांबतात?',
          bn: 'পিএম-কিষাণের যোগ্য কারা, কীভাবে ই-কেওয়াইসি করবেন এবং কিস্তি আটকে যাওয়ার কারণ কী?'
        }
      },
      {
        id: 'aif-scheme',
        title: {
          en: 'Agriculture Infrastructure Fund (AIF)',
          hi: 'कृषि अवसंरचना कोष (AIF)',
          mr: 'कृषी पायाभूत सुविधा निधी (AIF)',
          bn: 'কৃষি অবকাঠামো তহবিল (AIF)'
        },
        description: {
          en: 'Medium-long term debt financing for post-harvest management projects and community farming assets.',
          hi: 'कटाई उपरांत प्रबंधन परियोजनाओं और सामुदायिक कृषि संपत्तियों के लिए ऋण वित्तपोषण और 3% ब्याज छूट।',
          mr: 'कापणी पश्चात व्यवस्थापन आणि शेती प्रकल्पांसाठी ३% व्याज सवलतीसह कर्ज निधी.',
          bn: 'ফসল তোলার পরবর্তী ব্যবস্থাপনা ও প্রকল্পের জন্য ৩% সুদ ছাড়সহ দীর্ঘমেয়াদী ঋণ।'
        },
        prompt: {
          en: 'What benefits and subsidies do PACS and farmers get under Agriculture Infrastructure Fund (AIF)?',
          hi: 'कृषि अवसंरचना कोष (AIF) के तहत पैक्स (PACS) और किसानों को क्या लाभ और सब्सिडी मिलती है?',
          mr: 'कृषी पायाभूत सुविधा निधी (AIF) अंतर्गत पॅक्स (PACS) आणि शेतकऱ्यांना कोणते फायदे व अनुदान मिळते?',
          bn: 'কৃষি অবকাঠামো তহবিলের (AIF) অধীনে প্যাকস (PACS) ও কৃষকরা কী সুবিধা এবং ভর্তুকি পান?'
        }
      }
    ]
  },
  {
    id: 'agriculture-insurance',
    iconName: 'ShieldCheck',
    name: {
      en: 'Agriculture & Crop Insurance',
      hi: 'कृषि और फसल बीमा',
      mr: 'कृषी आणि पीक विमा',
      bn: 'কৃষি ও ফসল বীমা'
    },
    description: {
      en: 'PMFBY guidelines, 72-hour loss intimation rule, premium rates, localized damage claims, and survey process.',
      hi: 'पीएमएफबीवाई दिशानिर्देश, 72 घंटे का नुकसान सूचना नियम, प्रीमियम दरें, स्थानीयकृत क्षति दावे।',
      mr: 'पीएमएफबीवाय मार्गदर्शक तत्त्वे, ७२ तासांत नुकसानीची माहिती देण्याचा नियम, प्रीमियम दर, दावे.',
      bn: 'পিএমএফবিওয়াই নির্দেশিকা, ৭২ ঘণ্টার ক্ষয়ক্ষতি জানানোর নিয়ম, প্রিমিয়াম হার ও দাবি নিষ্পত্তির প্রক্রিয়া।'
    },
    examples: {
      en: ['PMFBY', 'Crop insurance', 'Farmer support', 'Agricultural schemes'],
      hi: ['पीएमएफबीवाई', 'फसल बीमा', 'किसान सहायता', 'कृषि योजनाएं'],
      mr: ['पीएमएफबीवाय', 'पीक विमा', 'शेतकरी सहाय्य', 'कृषी योजना'],
      bn: ['পিএমএফবিওয়াই', 'ফসল বীমা', 'কৃষক সহায়তা', 'কৃষি প্রকল্প']
    },
    topics: [
      {
        id: 'pmfby-claim-loss-intimation',
        title: {
          en: 'PMFBY 72-Hour Loss Reporting & Claim Process',
          hi: 'पीएमएफबीवाई 72 घंटे में नुकसान रिपोर्टिंग और दावा प्रक्रिया',
          mr: 'पीएमएफबीवाय ७२ तासांत नुकसान तक्रार आणि दावा प्रक्रिया',
          bn: 'পিএমএফবিওয়াই ৭২ ঘণ্টার মধ্যে ক্ষতিপূরণ দাবি ও ক্ষতি জানানোর পদ্ধতি'
        },
        description: {
          en: 'Mandatory 72-hour reporting via Crop Insurance App, Toll-free 14447, or Bank for hailstorm/rain damage.',
          hi: 'ओलावृष्टि/अतिवृष्टि नुकसान के लिए क्रॉप इंश्योरेंस ऐप, टोल-फ्री 14447 या बैंक के जरिए 72 घंटे में सूचना।',
          mr: 'गारपीट किंवा अतिवृष्टीच्या नुकसानीसाठी पीक विमा ॲप, टोल-फ्री १४४४७ द्वारे ७२ तासांत नोंद.',
          bn: 'শিলাবৃষ্টি বা অতিবৃষ্টিজনিত ক্ষয়ক্ষতিতে ক্রপ ইন্স্যুরেন্স অ্যাপ বা টোল-ফ্রি ১৪৪৪৭ এর মাধ্যমে ৭২ ঘণ্টার মধ্যে জানানোর নিয়ম।'
        },
        prompt: {
          en: 'What is the step-by-step process to claim crop insurance under PMFBY if my crop is damaged by unseasonal rains or hailstorm?',
          hi: 'यदि मेरी फसल बेमौसम बारिश या ओलावृष्टि से खराब हो जाती है तो PMFBY के तहत फसल बीमा का दावा करने की चरणबद्ध प्रक्रिया क्या है?',
          mr: 'अवेळी पाऊस किंवा गारपिटीमुळे पिकाचे नुकसान झाल्यास PMFBY अंतर्गत पीक विमा क्लेम करण्याची टप्प्याटप्प्याने प्रक्रिया काय आहे?',
          bn: 'অসময়ের বৃষ্টি বা শিলাবৃষ্টিতে ফসল নষ্ট হলে PMFBY-এর অধীনে কীভাবে ধাপে ধাপে ফসল বীমার দাবি জানাব?'
        }
      },
      {
        id: 'pmfby-premium-rates',
        title: {
          en: 'Crop Insurance Premium Capping (1.5% - 5%)',
          hi: 'फसल बीमा प्रीमियम सीमा (1.5% - 5%)',
          mr: 'पीक विमा प्रीमियम मर्यादा (१.५% - ५%)',
          bn: 'ফসল বীমা প্রিমিয়ামের সর্বোচ্চ হার (১.৫% - ৫%)'
        },
        description: {
          en: 'Maximum farmer contribution: 2% Kharif foodgrains/oilseeds, 1.5% Rabi, 5% annual horticultural crops.',
          hi: 'किसान का अधिकतम अंशदान: खरीफ 2%, रबी 1.5%, वाणिज्यिक/बागवानी फसलें 5%।',
          mr: 'शेतकऱ्यांचा कमाल वाटा: खरीप २%, रब्बी १.५%, बागायती/व्यापारी पिके ५%.',
          bn: 'কৃষকের সর্বাধিক অবদান: খারিফ ২%, রবি ১.৫%, বাণিজ্যিক/উদ্যানপালন ৫%।'
        },
        prompt: {
          en: 'What are the premium rates payable by farmers for Kharif, Rabi, and Horticultural crops under PMFBY?',
          hi: 'PMFBY के तहत खरीफ, रबी और बागवानी फसलों के लिए किसानों द्वारा देय प्रीमियम दरें क्या हैं?',
          mr: 'PMFBY अंतर्गत खरीप, रब्बी आणि बागायती पिकांसाठी शेतकऱ्यांनी भरावयाचे प्रीमियम दर काय आहेत?',
          bn: 'PMFBY-এর অধীনে খারিফ, রবি এবং উদ্যানপালন ফসলের জন্য কৃষকদের প্রদেয় প্রিমিয়াম হার কত?'
        }
      }
    ]
  },
  {
    id: 'pacs-services',
    iconName: 'Warehouse',
    name: {
      en: 'PACS Services & Digitalization',
      hi: 'पैक्स सेवाएं और डिजिटलीकरण',
      mr: 'पॅक्स सेवा आणि संगणकीकरण',
      bn: 'প্যাকস সেবা ও ডিজিটাল রূপান্তর'
    },
    description: {
      en: 'Primary Agricultural Credit Societies membership, CSC services, fertilizer distribution, and grain storage.',
      hi: 'प्राथमिक कृषि ऋण समिति (PACS) सदस्यता, सीएससी सेवाएं, उर्वरक वितरण और अनाज भंडारण।',
      mr: 'प्राथमिक कृषी पतसंस्था (PACS) सभासदत्व, सीएससी सेवा, खत वाटप आणि धान्य साठवणूक.',
      bn: 'প্রাথমিক কৃষি সমবায় সমিতি (PACS) সদস্যপদ, সিএসসি সেবা, সার বিতরণ এবং খাদ্যশস্য সঞ্চয়।'
    },
    examples: {
      en: ['Membership', 'PACS services', 'Loans', 'Storage', 'Digital PACS'],
      hi: ['सदस्यता', 'पैक्स सेवाएं', 'ऋण', 'भंडारण', 'डिजिटल पैक्स'],
      mr: ['सभासदत्व', 'पॅक्स सेवा', 'कर्ज', 'साठवणूक', 'डिजिटल पॅक्स'],
      bn: ['সদস্যপদ', 'প্যাকস সেবা', 'ঋণ', 'গুদামজাতকরণ', 'ডিজিটাল প্যাকস']
    },
    topics: [
      {
        id: 'pacs-membership-rules',
        title: {
          en: 'How to Become a PACS Member',
          hi: 'पैक्स (PACS) का सदस्य कैसे बनें',
          mr: 'पॅक्स (PACS) चे सभासद कसे व्हावे',
          bn: 'কীভাবে প্যাকস (PACS) সদস্য হবেন'
        },
        description: {
          en: 'Eligibility conditions, share purchase requirement, admission fee, and resolution by Managing Committee.',
          hi: 'पात्रता शर्तें, शेयर खरीद आवश्यकता, प्रवेश शुल्क और प्रबंध समिति का प्रस्ताव।',
          mr: 'पात्रता अटी, शेअर खरेदी, प्रवेश फी आणि संचालक मंडळाचा ठराव.',
          bn: 'যোগ্যতার শর্ত, শেয়ার ক্রয়, প্রবেশ ফি এবং পরিচালনা কমিটির অনুমোদন।'
        },
        prompt: {
          en: 'How can a farmer or rural citizen apply to become a voting member in a Primary Agricultural Credit Society (PACS)?',
          hi: 'एक किसान या ग्रामीण नागरिक प्राथमिक कृषि साख समिति (PACS) में मतदान सदस्य बनने के लिए कैसे आवेदन कर सकता है?',
          mr: 'शेतकरी किंवा ग्रामीण नागरिक प्राथमिक कृषी पतसंस्थेचे (PACS) मतदानाचे सभासद होण्यासाठी कसा अर्ज करू शकतो?',
          bn: 'একজন কৃষক বা গ্রামীণ নাগরিক কীভাবে প্রাথমিক কৃষি সমবায় সমিতিতে (PACS) পূর্ণাঙ্গ সদস্যপদের জন্য আবেদন করতে পারেন?'
        }
      },
      {
        id: 'pacs-csc-multipurpose',
        title: {
          en: 'Model Bye-Laws & Multipurpose Activities',
          hi: 'मॉडल उप-नियम और बहुउद्देशीय गतिविधियां',
          mr: 'आदर्श उपविधी आणि बहुउद्देशीय उपक्रम',
          bn: 'মডেল উপ-আইন ও বহুমুখী কার্যক্রম'
        },
        description: {
          en: 'Transformation into Common Service Centre (CSC), solar power, custom hiring, dairy, and retail outlets.',
          hi: 'कॉमन सर्विस सेंटर (CSC), कस्टम हायरिंग सेंटर, डेयरी और रिटेल आउटलेट में रूपांतरण।',
          mr: 'कॉमन सर्व्हिस सेंटर (CSC), शेती अवजारे भाडे केंद्र, दुग्ध व्यवसाय आणि खत विक्री केंद्र.',
          bn: 'কমন সার্ভিস সেন্টার (CSC), কৃষি যন্ত্রপাতি ভাড়া, দুগ্ধ ও খুচরা সার বিক্রয় কেন্দ্র।'
        },
        prompt: {
          en: 'What new services can PACS deliver under the Ministry of Cooperation Model Bye-laws?',
          hi: 'सहकारिता मंत्रालय के मॉडल उप-नियमों के तहत पैक्स (PACS) कौन-कौन सी नई सेवाएं प्रदान कर सकते हैं?',
          mr: 'सहकार मंत्रालयाच्या आदर्श उपविधीनुसार पॅक्स (PACS) कोणत्या नवीन सेवा देऊ शकतात?',
          bn: 'সমবায় মন্ত্রণালয়ের মডেল উপ-আইনের অধীনে প্যাকস (PACS) কী কী নতুন পরিষেবা প্রদান করতে পারে?'
        }
      }
    ]
  },
  {
    id: 'property-documents',
    iconName: 'FileText',
    name: {
      en: 'Property & Documents',
      hi: 'संपत्ति और दस्तावेज',
      mr: 'मालमत्ता आणि कागदपत्रे',
      bn: 'সম্পত্তি ও নথিপত্র'
    },
    description: {
      en: 'Land records (7/12, RoR, Khasra), cooperative mortgage charge creation, NOC release, and mutation rules.',
      hi: 'भू-अभिलेख (7/12, RoR, खसरा), सहकारी बंधक प्रभार सृजन, अनापत्ति प्रमाण पत्र (NOC) और नामांतरण।',
      mr: 'जमीन महसूल नोंदी (७/१२, फेरफार, खतावणी), सहकारी बोजा नोंदणी, एनओसी आणि वारस नोंद.',
      bn: 'জমির রেকর্ড (৭/১২, আরওয়াইআর, খতিয়ান), সমবায় বন্ধক চার্জ সৃষ্টি, এনওসি ও নামজারি।'
    },
    examples: {
      en: ['Property-related procedures', 'Documents', 'Certificates', 'Land-related guidance'],
      hi: ['संपत्ति प्रक्रियाएं', 'दस्तावेज', 'प्रमाण पत्र', 'भूमि मार्गदर्शन'],
      mr: ['मालमत्ता प्रक्रिया', 'कागदपत्रे', 'दाखले', 'जमीन मार्गदर्शन'],
      bn: ['সম্পত্তি সংক্রান্ত পদ্ধতি', 'নথিপত্র', 'সার্টিফিকেট', 'জমি সংক্রান্ত নির্দেশিকা']
    },
    topics: [
      {
        id: 'cooperative-land-charge',
        title: {
          en: 'Cooperative Land Charge (Gehan / Bojh) & NOC',
          hi: 'सहकारी भूमि बंधक (गेहन / बोझ) और एनओसी',
          mr: 'सहकारी संस्थेचा जमिनीवरील बोजा नोंद व एनओसी',
          bn: 'জমিতে সমবায় বন্ধক চার্জ ও এনওসি প্রদান'
        },
        description: {
          en: 'How cooperative loan charge is registered on 7/12 / RoR and procedure to discharge after full repayment.',
          hi: '7/12 / RoR पर सहकारी ऋण प्रभार कैसे दर्ज होता है और ऋण चुकाने के बाद इसे हटाने की प्रक्रिया।',
          mr: '७/१२ वर सहकारी कर्जाचा बोजा कसा चढवला जातो आणि कर्ज फेडल्यावर बोजा कसा कमी केला जातो.',
          bn: 'জমির রেকর্ডে সমবায় ঋণের চার্জ কীভাবে যুক্ত হয় এবং ঋণ পরিশোধের পর কীভাবে তা বাতিল করা হয়।'
        },
        prompt: {
          en: 'What is the procedure for registering a cooperative loan charge on land records and obtaining an NOC upon loan repayment?',
          hi: 'भू-अभिलेखों पर सहकारी ऋण प्रभार (बंधक) दर्ज करने और ऋण चुकता होने पर एनओसी (NOC) प्राप्त करने की क्या प्रक्रिया है?',
          mr: 'जमीन महसूल नोंदींवर सहकारी कर्जाचा बोजा नोंदवण्याची आणि कर्ज फेडल्यानंतर एनओसी मिळवून बोजा कमी करण्याची प्रक्रिया काय आहे?',
          bn: 'জমির নথিতে সমবায় ঋণের চার্জ নিবন্ধন এবং ঋণ পরিশোধের পর এনওসি (NOC) পাওয়ার পদ্ধতি কী?'
        }
      },
      {
        id: 'mutation-inheritance-coop',
        title: {
          en: 'Land Mutation & Cooperative Membership Transfer',
          hi: 'नामांतरण (दाखिल-खारिज) और सदस्यता हस्तांतरण',
          mr: 'जमीन फेरफार आणि सहकारी सभासदत्व वारसा हक्क',
          bn: 'জমির নামজারি ও সমবায় সদস্যপদ হস্তান্তর'
        },
        description: {
          en: 'Transfer of PACS shares and agricultural land rights to legal heirs upon deceased member.',
          hi: 'दिवंगत सदस्य के कानूनी वारिसों को पैक्स शेयर और कृषि भूमि अधिकारों का हस्तांतरण।',
          mr: 'मयत सभासदाच्या कायदेशीर वारसांना पॅक्सचे शेअर्स आणि शेतजमीन हक्क हस्तांतरित करणे.',
          bn: 'মৃত সদস্যের আইনি উত্তরাধিকারীদের কাছে প্যাকস শেয়ার এবং কৃষি জমির অধিকার হস্তান্তর।'
        },
        prompt: {
          en: 'What documents are required to transfer cooperative society shares and land records to legal heirs after a member passes away?',
          hi: 'किसी सदस्य के निधन के बाद कानूनी वारिसों को सहकारी समिति के शेयर और जमीन रिकॉर्ड हस्तांतरित करने के लिए कौन से दस्तावेज आवश्यक हैं?',
          mr: 'सभासदाच्या मृत्यूनंतर कायदेशीर वारसांच्या नावे सहकारी संस्थेचे शेअर्स व जमीन नोंद करण्यासाठी कोणती कागदपत्रे लागतात?',
          bn: 'সদস্যের মৃত্যুর পর আইনি উত্তরাধিকারীদের কাছে সমবায় শেয়ার ও জমির রেকর্ড হস্তান্তরের জন্য কী কী নথি প্রয়োজন?'
        }
      }
    ]
  },
  {
    id: 'grievance-redressal',
    iconName: 'AlertCircle',
    name: {
      en: 'Grievance Redressal',
      hi: 'शिकायत निवारण',
      mr: 'तक्रार निवारण',
      bn: 'অভিযোগ প্রতিকার'
    },
    description: {
      en: 'Filing complaints against cooperative society, CRCS portal, Cooperative Ombudsman, and CPGRAMS escalation.',
      hi: 'सहकारी समिति के खिलाफ शिकायत दर्ज करना, सीआरसीएस पोर्टल, सहकारी लोकपाल और सीपीग्राम्स।',
      mr: 'सहकारी संस्थेविरुद्ध तक्रार दाखल करणे, सीआरसीएस पोर्टल, सहकारी लोकपाल आणि निवारण प्रक्रिया.',
      bn: 'সমবায় সমিতির বিরুদ্ধে অভিযোগ দায়ের, সিআরসিএস পোর্টাল, সমবায় ন্যায়পাল ও সিপিগ্রামস।'
    },
    examples: {
      en: ['Filing complaints', 'Complaint status', 'Escalation', 'Relevant authority'],
      hi: ['शिकायत दर्ज करना', 'शिकायत स्थिति', 'उच्च स्तर पर अपील', 'संबंधित प्राधिकरण'],
      mr: ['तक्रार दाखल करणे', 'तक्रारीची स्थिती', 'वरिष्ठ अधिकारी अपील', 'संबंधित अधिकारी'],
      bn: ['অভিযোগ দায়ের', 'অভিযোগের স্থিতি', 'উচ্চতর কর্তৃপক্ষ', 'সংশ্লিষ্ট দপ্তর']
    },
    topics: [
      {
        id: 'file-coop-complaint',
        title: {
          en: 'Step-by-Step Grievance Filing Process',
          hi: 'चरणबद्ध शिकायत दर्ज करने की प्रक्रिया',
          mr: 'टप्प्याटप्प्याने तक्रार नोंदवण्याची प्रक्रिया',
          bn: 'ধাপে ধাপে অভিযোগ দায়েরের পদ্ধতি'
        },
        description: {
          en: '1st stage: Society Secretary, 2nd stage: District Deputy Registrar (DDR), 3rd stage: CRCS / Cooperative Ombudsman.',
          hi: 'पहला चरण: समिति सचिव, दूसरा चरण: जिला उप निबंधक (DDR), तीसरा चरण: सीआरसीएस / लोकपाल।',
          mr: 'पहिली पायरी: संस्था सचिव, दुसरी पायरी: जिल्हा उपनिबंधक (DDR), तिसरी पायरी: सहकार लोकपाल.',
          bn: 'প্রথম ধাপ: সমিতি সচিব, দ্বিতীয় ধাপ: জেলা উপ-রেজিস্ট্রার (DDR), তৃতীয় ধাপ: সমবায় ন্যায়পাল।'
        },
        prompt: {
          en: 'How can a citizen or member file a complaint against a cooperative society or PACS if loans or deposits are mishandled?',
          hi: 'यदि ऋण या जमा राशि में गड़बड़ी होती है तो एक नागरिक या सदस्य सहकारी समिति या पैक्स के खिलाफ कैसे शिकायत दर्ज कर सकता है?',
          mr: 'कर्ज किंवा ठेवींमध्ये गैरव्यवहार झाल्यास नागरिक किंवा सभासद सहकारी संस्था किंवा पॅक्सविरुद्ध कशी तक्रार करू शकतात?',
          bn: 'ঋণ বা আমানতে অনিয়ম হলে একজন নাগরিক বা সদস্য কীভাবে সমবায় সমিতি বা প্যাকসের বিরুদ্ধে অভিযোগ দায়ের করতে পারেন?'
        }
      },
      {
        id: 'cooperative-ombudsman-powers',
        title: {
          en: 'Cooperative Ombudsman & Arbitration (Sec 84)',
          hi: 'सहकारी लोकपाल और मध्यस्थता (धारा 84)',
          mr: 'सहकारी लोकपाल आणि लवाद प्रक्रिया (कलम ८४)',
          bn: 'সমবায় ন্যায়পাল ও সালিশি প্রক্রিয়া (ধারা ৮৪)'
        },
        description: {
          en: 'Statutory powers of Cooperative Ombudsman under MSCS Amendment Act 2023 for speedy resolution.',
          hi: 'त्वरित समाधान के लिए एमएससीएस संशोधन अधिनियम 2023 के तहत सहकारी लोकपाल की वैधानिक शक्तियां।',
          mr: 'जलद निवारणासाठी एमएससीएस सुधारणा कायदा २०२३ अंतर्गत सहकार लोकपालाचे अधिकार.',
          bn: 'দ্রুত সমাধানের জন্য এমএসসিএস সংশোধনী আইন ২০২৩ এর অধীনে সমবায় ন্যায়পালের বিধিবদ্ধ ক্ষমতা।'
        },
        prompt: {
          en: 'What are the powers of the Cooperative Ombudsman and how to approach arbitration under Section 84 of MSCS Act?',
          hi: 'सहकारी लोकपाल की क्या शक्तियां हैं और एमएससीएस अधिनियम की धारा 84 के तहत मध्यस्थता (Arbitration) के लिए कैसे संपर्क करें?',
          mr: 'सहकार लोकपालाचे अधिकार काय आहेत आणि एमएससीएस कायद्याच्या कलम ८४ अंतर्गत लवादाकडे कशी दाद मागावी?',
          bn: 'সমবায় ন্যায়পালের ক্ষমতা কী এবং এমএসসিএস আইনের ৮৪ ধারার অধীনে সালিশির জন্য কীভাবে আবেদন করবেন?'
        }
      }
    ]
  }
];
