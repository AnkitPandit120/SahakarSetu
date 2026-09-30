export interface SlideItem {
  id: string;
  image: string;
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
}

export const GOV_SLIDES: SlideItem[] = [
  {
    id: 'pm-modi',
    image: '/images/modi_portrait.jpg',
    dignitaryHi: 'श्री नरेन्द्र मोदी',
    dignitaryEn: 'Shri Narendra Modi',
    roleHi: 'माननीय प्रधानमंत्री, भारत सरकार',
    roleEn: "Hon'ble Prime Minister of India",
    quoteHi: 'भारत में COOPERATIVES, हमारे DAIRY SECTOR को.... हमारी RURAL ECONOMY को एक नई शक्ति दे रहे हैं।',
    quoteEn: 'In India, cooperatives are giving new strength to our dairy sector and our rural economy.',
    occasionHi: 'वर्ल्ड फूड इंडिया कार्यक्रम / सहकार से समृद्धि विज़न',
    occasionEn: 'World Food India / Sahakar Se Samriddhi Vision',
    tagHi: 'राष्ट्रीय सहकारिता संकल्प',
    tagEn: 'National Cooperative Vision',
    query: 'प्रधानमंत्री पैक्स कंप्यूटरीकरण और डेयरी सहकारिता योजना के क्या मुख्य बिंदु हैं?'
  },
  {
    id: 'cm-yogi',
    image: '/images/yogi_portrait.jpg',
    dignitaryHi: 'श्री योगी आदित्यनाथ',
    dignitaryEn: 'Shri Yogi Adityanath',
    roleHi: 'माननीय मुख्यमंत्री, उत्तर प्रदेश',
    roleEn: "Hon'ble Chief Minister, Uttar Pradesh",
    quoteHi: 'सहकारिता किसानों की आत्मनिर्भरता का मजबूत आधार है। प्रदेश की 7,000+ बी-पैक्स को आधुनिक बनाकर पारदर्शी साख दी जा रही है।',
    quoteEn: 'Cooperatives are the cornerstone of farmer self-reliance. Over 7,000 B-PACS are computerized for transparent rural credit.',
    occasionHi: 'उत्तर प्रदेश बी-पैक्स सुदृढ़ीकरण व ग्रामीण साख मिशन',
    occasionEn: 'UP B-PACS Modernization & Rural Credit Mission',
    tagHi: 'राज्य सहकारिता पहल',
    tagEn: 'State Cooperative Reform',
    query: 'उत्तर प्रदेश बी-पैक्स कंप्यूटरीकरण और किसान ऋण योजना की मुख्य विशेषताएं क्या हैं?'
  },
  {
    id: 'minister-amit-shah',
    image: '/images/amit_shah_portrait.jpg',
    dignitaryHi: 'श्री अमित शाह',
    dignitaryEn: 'Shri Amit Shah',
    roleHi: 'माननीय केंद्रीय गृह एवं सहकारिता मंत्री',
    roleEn: "Hon'ble Union Minister of Cooperation",
    quoteHi: 'मॉडल पैक्स उप-नियम 2024 और राष्ट्रीय सहकारिता डेटाबेस से देश की हर पंचायत में बहुउद्देशीय सहकारी समिति सक्रिय होगी।',
    quoteEn: 'Model PACS Bye-Laws 2024 and the National Database will empower every Panchayat with a vibrant multipurpose cooperative.',
    occasionHi: 'सहकारिता मंत्रालय, भारत सरकार',
    occasionEn: 'Ministry of Cooperation, Government of India',
    tagHi: 'विधिक व विनियामक सुधार',
    tagEn: 'Statutory Policy Reforms',
    query: 'मॉडल पैक्स उप-नियम 2024 और मल्टी-स्टेट सहकारी समिति संशोधन अधिनियम 2023 के प्रमुख नियम क्या हैं?'
  },
  {
    id: 'pacs-empowerment',
    image: '/images/pacs_farmer_cooperative.jpg',
    dignitaryHi: 'पैक्स एवं डिजिटल किसान केंद्र',
    dignitaryEn: 'PACS & Digital Farmer Network',
    roleHi: '63,000+ प्राथमिक कृषि साख समितियां (PACS)',
    roleEn: '63,000+ Primary Agricultural Credit Societies',
    quoteHi: 'पैक्स अब केवल ऋण समिति नहीं, बल्कि कॉमन सर्विस सेंटर (CSC), उर्वरक, बीज, अनाज भंडारण और 300+ नागरिक सेवाओं का केंद्र हैं।',
    quoteEn: 'PACS now serve as Common Service Centres (CSC), delivering seeds, fertilizers, storage, and 300+ public e-services.',
    occasionHi: 'केंद्रीय प्रायोजित पैक्स डिजिटलीकरण योजना',
    occasionEn: 'Centrally Sponsored PACS Modernization Scheme',
    tagHi: 'डिजिटल सहकारिता तंत्र',
    tagEn: 'Digital Rural Infrastructure',
    query: 'पैक्स (PACS) कॉमन सर्विस सेंटर (CSC) सेवाओं और उर्वरक वितरण के नियम क्या हैं?'
  }
];
