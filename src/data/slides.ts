export const LEADER_IMAGES = {
  modi: '/images/modi_portrait.jpg',
  yogi: '/images/yogi_portrait.jpg',
  amitShah: '/images/amit_shah_portrait.jpg',
  farmerSugarcane: '/images/farmer_sugarcane.jpg',
  citizenBeneficiary: '/images/citizen_beneficiary.jpg',
  agriculturalLand: '/images/agricultural_land.jpg',
  crcsBanner: '/images/crcs_sahara_banner.jpg',
  cooperationBanner: '/images/cooperation_banner.jpg'
};

export interface SlideItem {
  id: string;
  type?: 'leader' | 'mann-ki-baat' | 'vibrant-villages' | 'pacs' | 'sahakar-samriddhi' | 'crcs-sahara' | 'digital-india' | 'e-upahaar' | 'svep-programme';
  image?: string;
  bannerBg?: string;
  dignitaryHi: string;
  dignitaryEn: string;
  roleHi: string;
  roleEn: string;
  quoteHi: string;
  quoteEn: string;
  occasionHi: string;
  occasionEn: string;
  tagHi: string;
  tagEn: string;
  query: string;
  primaryActionLabelHi?: string;
  primaryActionLabelEn?: string;
  primaryActionUrl?: string;
  secondaryActionLabelHi?: string;
  secondaryActionLabelEn?: string;
  callNumber?: string;
  datesText?: string;
}

export const GOV_SLIDES: SlideItem[] = [
  {
    id: 'sahakar-samriddhi-banner',
    type: 'sahakar-samriddhi',
    bannerBg: 'bg-white',
    dignitaryHi: 'सहकार से समृद्धि',
    dignitaryEn: 'Sahakar Se Samriddhi',
    roleHi: 'सहकारिता मंत्रालय, भारत सरकार • Ministry of Cooperation',
    roleEn: "Ministry of Cooperation, Government of India",
    quoteHi: 'सहकारिता के माध्यम से ग्रामीण अर्थव्यवस्था का सशक्तिकरण — पैक्स आधुनिकीकरण, राष्ट्रीय डेटाबेस और शून्य-प्रतिशत ब्याज साख।',
    quoteEn: 'Empowering the rural economy through cooperatives — PACS modernization, National Database, and accessible credit.',
    occasionHi: 'सहकारिता मंत्रालय, भारत सरकार • Ministry of Cooperation',
    occasionEn: 'Ministry of Cooperation, Government of India',
    tagHi: 'राष्ट्रीय सहकारिता विज़न',
    tagEn: 'National Cooperative Vision',
    primaryActionLabelHi: 'सहकार से समृद्धि योजनाएं पूछें',
    primaryActionLabelEn: 'Explore Sahakar Se Samriddhi',
    secondaryActionLabelHi: 'मॉडल पैक्स उप-नियम 2024',
    secondaryActionLabelEn: 'Model PACS Bye-Laws 2024',
    query: 'सहकार से समृद्धि (Sahakar Se Samriddhi) विज़न और सहकारिता मंत्रालय की प्रमुख योजनाओं के क्या लाभ हैं?'
  },
  {
    id: 'crcs-sahara-portal-banner',
    type: 'crcs-sahara',
    bannerBg: 'bg-[#18181b]',
    dignitaryHi: 'केंद्रीय पंजीयक — सहारा रिफंड पोर्टल',
    dignitaryEn: 'CRCS Sahara Refund & Citizen Assistance Portal',
    roleHi: 'केंद्रीय पंजीयक, सहकारिता मंत्रालय, भारत सरकार',
    roleEn: "Central Registrar of Cooperative Societies • Ministry of Cooperation",
    quoteHi: 'सहकारी समितियों के जमाकर्ताओं के पारदर्शी व त्वरित दावों के सत्यापन और सीधे बैंक खाते में भुगतान की पारदर्शी व्यवस्था।',
    quoteEn: 'A transparent digital mechanism for legitimate cooperative depositors for claim verification and direct bank account disbursement.',
    occasionHi: 'सहकारिता मंत्रालय, भारत सरकार • Central Registrar of Cooperative Societies (CRCS)',
    occasionEn: 'Ministry of Cooperation, Govt. of India • CRCS Portal',
    tagHi: 'पारदर्शी नागरिक रिफंड पोर्टल',
    tagEn: 'Transparent Depositor Refund',
    primaryActionLabelHi: 'सहारा रिफंड पोर्टल प्रक्रिया जानें',
    primaryActionLabelEn: 'Check CRCS Refund Process',
    secondaryActionLabelHi: 'सहकारी शिकायत व समाधान',
    secondaryActionLabelEn: 'Grievance Redressal Guide',
    query: 'केंद्रीय पंजीयक सहारा रिफंड पोर्टल (CRCS Sahara Refund Portal) पर दावा कैसे प्रस्तुत करें और क्या दस्तावेज चाहिए?'
  },
  {
    id: 'mann-ki-baat',
    type: 'mann-ki-baat',
    image: LEADER_IMAGES.modi,
    bannerBg: 'bg-gradient-to-r from-[#0a1b38] via-[#0d2757] to-[#12397e]',
    dignitaryHi: 'मन की बात — 30 अगस्त 2026',
    dignitaryEn: 'Mann Ki Baat on 30th August 2026',
    roleHi: 'आकाशवाणी राष्ट्रीय प्रसारण एवं नागरिक विचार संवाद',
    roleEn: 'National Citizen Suggestions & Dialogue Broadcast',
    quoteHi: 'सहकारिता, ग्रामीण नवाचार और किसान कल्याण पर अपने विचार व सुझाव राष्ट्रीय प्रसारण के साथ साझा करें।',
    quoteEn: 'Share your ideas and suggestions on cooperatives, rural innovation, and farmer welfare.',
    occasionHi: 'आकाशवाणी एवं दूरदर्शन राष्ट्रीय प्रसारण • National Broadcast',
    occasionEn: 'All India Radio & Doordarshan National Broadcast',
    tagHi: 'राष्ट्रीय संवाद • Citizen Suggestions',
    tagEn: 'National Citizen Dialogue',
    callNumber: '1800 11 7800 (Toll-Free)',
    datesText: 'The phone lines shall remain open from 3rd - 28th August 2026',
    primaryActionLabelHi: 'विचार साझा करें (Click Here to Share Ideas)',
    primaryActionLabelEn: 'Click Here or Dial 1800 11 7800 (Toll-Free)',
    secondaryActionLabelHi: 'एआई सहकार मित्र से पूछें',
    secondaryActionLabelEn: 'Ask AI Advisor about Mann Ki Baat',
    query: 'प्रधानमंत्री जी के मन की बात कार्यक्रम में ग्रामीण सहकारिता व किसान विषयों पर कैसे सुझाव दें?'
  },
  {
    id: 'vibrant-villages',
    type: 'vibrant-villages',
    bannerBg: 'bg-white',
    dignitaryHi: 'वाइब्रेंट विलेजेज प्रोग्राम (VVP)',
    dignitaryEn: 'Vibrant Villages Programme',
    roleHi: 'गृह मंत्रालय एवं सीमा प्रबंधन विभाग, भारत सरकार',
    roleEn: 'Ministry of Home Affairs & Department of Border Management, Govt. of India',
    quoteHi: 'सीमावर्ती गांवों में बहुउद्देशीय पैक्स, सहकारी विपणन, पर्यटन व टिकाऊ आजीविका का समग्र विकास।',
    quoteEn: 'Comprehensive development of border villages with multipurpose PACS, cooperative marketing, and sustainable livelihoods.',
    occasionHi: 'गृह मंत्रालय, भारत सरकार • india.gov.in',
    occasionEn: 'Ministry of Home Affairs, Government of India • india.gov.in',
    tagHi: 'सीमावर्ती ग्राम विकास',
    tagEn: 'Border Village Empowerment',
    primaryActionLabelHi: 'योजना विवरण देखें',
    primaryActionLabelEn: 'Explore Vibrant Villages Guidelines',
    secondaryActionLabelHi: 'सहकारी सुविधाएं जानें',
    secondaryActionLabelEn: 'Border Cooperative Schemes',
    query: 'वाइब्रेंट विलेजेज प्रोग्राम (Vibrant Villages Programme) के तहत सहकारी समितियों और आजीविका के क्या प्रावधान हैं?'
  },
  {
    id: 'digital-india-banner',
    type: 'digital-india',
    image: LEADER_IMAGES.modi,
    bannerBg: 'bg-[#f0f9ff]',
    dignitaryHi: 'डिजिटल इंडिया (Digital India)',
    dignitaryEn: 'Digital India • 11 Years of Empowerment',
    roleHi: 'इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार',
    roleEn: 'Ministry of Electronics and Information Technology, Government of India',
    quoteHi: 'Digital India means opportunity for all, facility for all and participation of all.',
    quoteEn: 'Digital India means opportunity for all, facility for all and participation of all.',
    occasionHi: 'इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी मंत्रालय • Ministry of Electronics & IT',
    occasionEn: 'Ministry of Electronics and Information Technology, Govt. of India',
    tagHi: '11 Years of Digital India',
    tagEn: 'Digital Empowerment for All',
    primaryActionLabelHi: 'डिजिटल इंडिया पहल जानें',
    primaryActionLabelEn: 'Explore Digital India Initiatives',
    secondaryActionLabelHi: 'पैक्स डिजिटल ई-सेवाएं',
    secondaryActionLabelEn: 'PACS Digital Services',
    query: 'डिजिटल इंडिया मिशन और सहकारिता में डिजिटल ई-सेवाओं (CSC, डिजिटल भुगतान, पैक्स सॉफ्टवेयर) के क्या लाभ हैं?'
  },
  {
    id: 'e-upahaar-auction-banner',
    type: 'e-upahaar',
    bannerBg: 'bg-[#faf5ef]',
    dignitaryHi: 'ई-उपहार राष्ट्रपति उपहार नीलामी 2026',
    dignitaryEn: 'e-Upahaar Presidential Gifts Auction 2026',
    roleHi: 'राष्ट्रपति भवन एवं मायगॉव (मेरी सरकार)',
    roleEn: 'Rashtrapati Bhavan & MyGov (Meri Sarkar)',
    quoteHi: 'माननीय राष्ट्रपति जी को भेंट किए गए विशिष्ट स्मृति-चिह्नों और कलाकृतियों की पारदर्शी ऑनलाइन नीलामी। प्राप्त राशि का उपयोग लोक-कल्याण कार्यों में।',
    quoteEn: 'Transparent online auction of exclusive mementos and traditional artifacts presented to the Hon\'ble President of India for public welfare.',
    occasionHi: 'राष्ट्रपति भवन • Rashtrapati Bhavan & MyGov',
    occasionEn: 'Rashtrapati Bhavan & MyGov, Government of India',
    tagHi: 'ऑनलाइन उपहार नीलामी 2026',
    tagEn: 'Presidential Gifts Auction',
    primaryActionLabelHi: 'ई-उपहार पोर्टल जानकारी लें',
    primaryActionLabelEn: 'Explore e-Upahaar Auction',
    secondaryActionLabelHi: 'मायगॉव नागरिक सहभागिता',
    secondaryActionLabelEn: 'MyGov Citizen Initiatives',
    query: 'राष्ट्रपति भवन ई-उपहार (e-Upahaar Presidential Gifts Auction 2026) नीलामी में नागरिक कैसे भाग ले सकते हैं?'
  },
  {
    id: 'svep-programme-banner',
    type: 'svep-programme',
    bannerBg: 'bg-[#fffbf7]',
    dignitaryHi: 'स्टार्ट-अप विलेज एंटरप्रेन्योरशिप प्रोग्राम (SVEP)',
    dignitaryEn: 'Start-up Village Entrepreneurship Programme',
    roleHi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय व ग्रामीण विकास, भारत सरकार',
    roleEn: 'Ministry of Social Justice & Empowerment & Rural Development, Govt. of India',
    quoteHi: 'ग्रामीण महिलाओं व युवाओं को स्वावलंबी बनाने हेतु सूक्ष्म उद्यमों, स्वयं सहायता समूहों (SHGs) और सहकारी स्टार्टअप्स का वित्तीय व तकनीकी संवर्धन।',
    quoteEn: 'Promoting rural livelihoods by supporting women and youth to set up sustainable village enterprises and cooperative ventures.',
    occasionHi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय • india.gov.in',
    occasionEn: 'Ministry of Social Justice & Empowerment • india.gov.in',
    tagHi: 'ग्रामीण उद्यमिता मिशन',
    tagEn: 'Rural Entrepreneurship',
    primaryActionLabelHi: 'एसवीईपी ग्रामीण योजनाएं पूछें',
    primaryActionLabelEn: 'Explore SVEP Rural Schemes',
    secondaryActionLabelHi: 'महिला स्वयं सहायता समूह',
    secondaryActionLabelEn: 'Women SHG & Cooperative Loans',
    query: 'स्टार्ट-अप विलेज एंटरप्रेन्योरशिप प्रोग्राम (SVEP) के तहत ग्रामीण युवाओं व महिलाओं को उद्यम शुरू करने हेतु क्या सहायता मिलती है?'
  },
  {
    id: 'pacs-empowerment',
    type: 'pacs',
    image: LEADER_IMAGES.farmerSugarcane,
    bannerBg: 'bg-gradient-to-r from-[#0a2318] via-[#103b29] to-[#19593e]',
    dignitaryHi: 'पैक्स एवं डिजिटल किसान केंद्र',
    dignitaryEn: 'PACS & Digital Farmer Network',
    roleHi: '63,000+ प्राथमिक कृषि साख समितियां (PACS) • Common Service Centres',
    roleEn: '63,000+ Primary Agricultural Credit Societies • Common Service Centres',
    quoteHi: 'पैक्स अब केवल ऋण समिति नहीं, बल्कि कॉमन सर्विस सेंटर (CSC), उर्वरक, प्रमाणित बीज, कोल्ड स्टोरेज और पीएम फसल बीमा सहायता का समग्र केंद्र हैं।',
    quoteEn: 'PACS now serve as Common Service Centres (CSC), delivering seeds, fertilizers, modern storage, and PMFBY crop insurance support.',
    occasionHi: 'केंद्रीय प्रायोजित पैक्स डिजिटलीकरण योजना',
    occasionEn: 'Centrally Sponsored PACS Modernization Scheme',
    tagHi: 'डिजिटल सहकारिता तंत्र',
    tagEn: 'Digital Rural Infrastructure',
    primaryActionLabelHi: 'पैक्स सीएससी सेवाएं जानें',
    primaryActionLabelEn: 'PACS CSC Services List',
    secondaryActionLabelHi: 'फसल बीमा नियम',
    secondaryActionLabelEn: 'PMFBY 72-Hour Rule',
    query: 'पैक्स (PACS) कॉमन सर्विस सेंटर (CSC) सेवाओं और उर्वरक वितरण के नियम क्या हैं?'
  }
];

