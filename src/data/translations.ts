import { Language } from '../types';

export const TRANSLATIONS: Record<Language, {
  appName: string;
  appSubtitle: string;
  navHome: string;
  navServices: string;
  navSchemes: string;
  navAbout: string;
  navLogin: string;
  navAccount: string;
  heroHeading: string;
  heroSubheading: string;
  askPlaceholder: string;
  searchBtn: string;
  micListening: string;
  micUnsupported: string;
  popularQuestionsTitle: string;
  directChatTitle: string;
  directChatDesc: string;
  directChatBtn: string;
  guidedAssistanceTitle: string;
  guidedAssistanceDesc: string;
  guidedAssistanceBtn: string;
  guidedHeading: string;
  guidedSubheading: string;
  chatHeading: string;
  backBtn: string;
  newChat: string;
  clearChat: string;
  copyAnswer: string;
  copied: string;
  helpful: string;
  unhelpful: string;
  sourceBadgeKnowledge: string;
  sourceBadgeGov: string;
  sourceBadgeWeb: string;
  answerLabel: string;
  importantLabel: string;
  sourceLabel: string;
  documentLabel: string;
  sectionLabel: string;
  pageLabel: string;
  viewDocument: string;
  openOfficialSource: string;
  suggestedFollowUp: string;
  legalDisclaimer: string;
  legalDisclaimerHeader: string;
  voiceModalTitle: string;
  voiceSpeakPrompt: string;
  voiceStop: string;
  readAloud: string;
  stopReading: string;
  autoSpeak: string;
  voiceModeBtn: string;
  voiceModeDesc: string;
  voiceStatusListening: string;
  voiceStatusThinking: string;
  voiceStatusSpeaking: string;
  voiceStatusIdle: string;
  voiceSpeed: string;
  handsFreeMode: string;
  schemesHeading: string;
  schemesSubheading: string;
  filterAll: string;
  servicesHeading: string;
  servicesSubheading: string;
  targetUsersLabel: string;
  requiredDocsLabel: string;
  timelineLabel: string;
  applyPortalBtn: string;
  learnMoreBtn: string;
  aboutHeading: string;
  aboutWhatIsThis: string;
  aboutWhatIsThisText: string;
  aboutHowItWorks: string;
  aboutHowItWorksSteps: string[];
  aboutSafetyHeading: string;
  aboutSafetyText: string;
  loginTitle: string;
  registerTitle: string;
  emailLabel: string;
  passwordLabel: string;
  fullNameLabel: string;
  roleLabel: string;
  farmerRole: string;
  pacsRole: string;
  citizenRole: string;
  loginBtn: string;
  registerBtn: string;
  noAccount: string;
  haveAccount: string;
  continueAsGuest: string;
  guestNote: string;
  savedQueriesTitle: string;
  bookmarksTitle: string;
  noBookmarks: string;
  logoutBtn: string;
  helplineTitle: string;
  helplineKisan: string;
  helplinePmfby: string;
  helplineConsumer: string;
  footerRights: string;
  footerDisclaimer: string;
  searchingDatabase: string;
  errorNotFound: string;
  errorRephrase: string;
}> = {
  en: {
    appName: 'SahakarSetu',
    appSubtitle: 'Cooperative Governance & Rural Legal Assistance Portal',
    navHome: 'Home',
    navServices: 'Services',
    navSchemes: 'Schemes',
    navAbout: 'About',
    navLogin: 'Login',
    navAccount: 'My Portal',
    heroHeading: 'Your Guide to Cooperative & Rural Services',
    heroSubheading: 'Get simple, multilingual guidance on cooperative laws, government schemes, PACS services, agriculture, finance and grievance support.',
    askPlaceholder: 'Ask your question (e.g., How can I become a PACS member?)...',
    searchBtn: 'Ask',
    micListening: 'Listening... Please speak your question now',
    micUnsupported: 'Voice input is not supported in this browser.',
    popularQuestionsTitle: 'Popular Questions',
    directChatTitle: 'Direct Chat',
    directChatDesc: 'Ask your question directly and get a verified answer.',
    directChatBtn: 'Start Chat',
    guidedAssistanceTitle: 'Guided Assistance',
    guidedAssistanceDesc: 'Select a topic and get step-by-step help.',
    guidedAssistanceBtn: 'Explore Topics',
    guidedHeading: 'What do you need help with?',
    guidedSubheading: 'Choose a topic to get more focused assistance.',
    chatHeading: 'Cooperative & Legal Assistant',
    backBtn: 'Back',
    newChat: 'New Chat',
    clearChat: 'Clear History',
    copyAnswer: 'Copy',
    copied: 'Copied!',
    helpful: 'Helpful',
    unhelpful: 'Not Helpful',
    sourceBadgeKnowledge: 'Verified Knowledge Base',
    sourceBadgeGov: 'Verified Government Portal',
    sourceBadgeWeb: 'Verified Web Source',
    answerLabel: 'Answer',
    importantLabel: 'Important Conditions & Exceptions',
    sourceLabel: 'Verified Source',
    documentLabel: 'Document',
    sectionLabel: 'Section / Clause',
    pageLabel: 'Page / Chapter',
    viewDocument: 'View Official Document',
    openOfficialSource: 'Open Official Portal',
    suggestedFollowUp: 'Suggested Follow-up Questions',
    legalDisclaimer: 'This platform provides information and guidance based on official public records. It does not replace professional legal, financial or government-authority advice.',
    legalDisclaimerHeader: 'Legal & Public Information Notice',
    voiceModalTitle: 'Voice Assistant',
    voiceSpeakPrompt: 'Speak clearly in English, Hindi, Marathi, or Bengali...',
    voiceStop: 'Stop & Submit',
    readAloud: 'Read Aloud',
    stopReading: 'Stop Audio',
    autoSpeak: 'Auto-Speak Responses',
    voiceModeBtn: 'Live Voice Assistant',
    voiceModeDesc: 'Talk naturally in your regional language with real-time statutory audio answers',
    voiceStatusListening: 'Listening to you... Speak now',
    voiceStatusThinking: 'Analyzing acts, schemes & model bye-laws...',
    voiceStatusSpeaking: 'Speaking answer...',
    voiceStatusIdle: 'Tap microphone to speak',
    voiceSpeed: 'Voice Speed',
    handsFreeMode: 'Hands-Free Dialogue',
    schemesHeading: 'Verified Government Schemes Directory',
    schemesSubheading: 'Explore authentic government support programs, eligibility requirements, benefits, and direct official portals.',
    filterAll: 'All Schemes',
    servicesHeading: 'Public Cooperative & Agricultural Services',
    servicesSubheading: 'Direct access to essential public services, statutory applications, and grievance filing portals.',
    targetUsersLabel: 'Target Beneficiaries',
    requiredDocsLabel: 'Required Documents',
    timelineLabel: 'Timeline / Redressal Period',
    applyPortalBtn: 'Continue to Official Portal →',
    learnMoreBtn: 'View Details & Apply',
    aboutHeading: 'About Cooperative & Rural Legal Assistance Portal',
    aboutWhatIsThis: 'What is this platform?',
    aboutWhatIsThisText: 'A trustworthy, multilingual public-service portal designed to empower cooperative members, farmers, rural citizens, PACS secretaries, and rural stakeholders with simple, cited answers regarding cooperative acts, government schemes, agricultural finance, crop insurance, and grievance redressal.',
    aboutHowItWorks: 'How does it work?',
    aboutHowItWorksSteps: [
      '1. Ask your question in plain language or select a guided topic.',
      '2. The system searches our verified statutory knowledge base and official government repositories.',
      '3. Relevant statutory sections, guidelines, and circulars are cross-verified.',
      '4. An easy-to-understand answer is generated with exact citations, sections, and page references.',
      '5. You can inspect the source and open the official government portal directly.'
    ],
    aboutSafetyHeading: 'Legal Disclaimer & Information Integrity',
    aboutSafetyText: 'This platform serves purely as an educational information and statutory guidance portal. It is designed around the ASK → VERIFY → EXPLAIN → CITE principle. It does not fabricate laws or section numbers, and does not replace official advice from licensed legal practitioners or government registrars.',
    loginTitle: 'Citizen & Member Login',
    registerTitle: 'Create Free Account',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    fullNameLabel: 'Full Name',
    roleLabel: 'Your Role / Occupation',
    farmerRole: 'Farmer / Cultivator',
    pacsRole: 'PACS Secretary / Board Member',
    citizenRole: 'Rural Citizen / Member',
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    noAccount: "Don't have an account? Register free",
    haveAccount: 'Already have an account? Sign in',
    continueAsGuest: 'Continue without login (Full access)',
    guestNote: 'Login is completely optional. You can ask unlimited questions without an account.',
    savedQueriesTitle: 'Saved Questions & History',
    bookmarksTitle: 'Bookmarked Schemes & Answers',
    noBookmarks: 'No bookmarks saved yet. Click the bookmark icon on any answer or scheme.',
    logoutBtn: 'Sign Out',
    helplineTitle: 'Official Public Helplines',
    helplineKisan: 'Kisan Call Centre: 1800-180-1551 (Toll-free)',
    helplinePmfby: 'PMFBY Crop Loss Helpline: 14447 (Toll-free)',
    helplineConsumer: 'National Consumer Helpline: 1915',
    footerRights: 'Cooperative Governance & Rural Legal Assistance Portal. Public Service Information System.',
    footerDisclaimer: 'Grounded in official Ministry of Cooperation, PMFBY, and RBI/NABARD guidelines. Not a substitute for formal legal counsel.',
    searchingDatabase: 'Searching verified knowledge base and official guidelines...',
    errorNotFound: "I couldn't find a verified statutory source for this specific question.",
    errorRephrase: 'Please try rephrasing your question, or select a topic from Guided Assistance above.'
  },
  hi: {
    appName: 'सहकार सेतु',
    appSubtitle: 'सहकारी शासन एवं ग्रामीण विधिक सहायता पोर्टल',
    navHome: 'होम',
    navServices: 'सेवाएं',
    navSchemes: 'योजनाएं',
    navAbout: 'परिचय',
    navLogin: 'लॉग इन',
    navAccount: 'मेरा पोर्टल',
    heroHeading: 'सहकारी एवं ग्रामीण सेवाओं के लिए आपका मार्गदर्शक',
    heroSubheading: 'सहकारी कानूनों, सरकारी योजनाओं, पैक्स (PACS) सेवाओं, कृषि, वित्त और शिकायत निवारण पर सरल, बहुभाषी और सत्यापित मार्गदर्शन प्राप्त करें।',
    askPlaceholder: 'अपना प्रश्न पूछें (जैसे: मैं पैक्स का सदस्य कैसे बन सकता हूँ?)...',
    searchBtn: 'पूछें',
    micListening: 'सुन रहे हैं... कृपया अपना प्रश्न बोलें',
    micUnsupported: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।',
    popularQuestionsTitle: 'लोकप्रिय प्रश्न',
    directChatTitle: 'सीधी बातचीत (Direct Chat)',
    directChatDesc: 'सीधा प्रश्न पूछें और प्रमाण सहित सत्यापित उत्तर पाएं।',
    directChatBtn: 'बातचीत शुरू करें',
    guidedAssistanceTitle: 'मार्गदर्शित सहायता (Guided Assistance)',
    guidedAssistanceDesc: 'विषय चुनें और चरण-दर-चरण सटीक मदद पाएं।',
    guidedAssistanceBtn: 'विषय देखें',
    guidedHeading: 'आपको किस विषय में सहायता चाहिए?',
    guidedSubheading: 'अधिक सटीक और केंद्रित जानकारी के लिए एक विषय चुनें।',
    chatHeading: 'सहकारी एवं विधिक सहायक',
    backBtn: 'वापस',
    newChat: 'नई बातचीत',
    clearChat: 'इतिहास साफ करें',
    copyAnswer: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    helpful: 'उपयोगी',
    unhelpful: 'अनुपयोगी',
    sourceBadgeKnowledge: 'सत्यापित ज्ञानकोष',
    sourceBadgeGov: 'सत्यापित सरकारी पोर्टल',
    sourceBadgeWeb: 'सत्यापित वेब स्रोत',
    answerLabel: 'उत्तर',
    importantLabel: 'महत्वपूर्ण शर्तें व नियम',
    sourceLabel: 'सत्यापित स्रोत व संदर्भ',
    documentLabel: 'दस्तावेज / कानून',
    sectionLabel: 'धारा / खंड',
    pageLabel: 'पृष्ठ / अध्याय',
    viewDocument: 'आधिकारिक दस्तावेज देखें',
    openOfficialSource: 'आधिकारिक पोर्टल खोलें',
    suggestedFollowUp: 'सुझाए गए संबंधित प्रश्न',
    legalDisclaimer: 'यह मंच आधिकारिक सार्वजनिक रिकॉर्ड पर आधारित सूचना और मार्गदर्शन प्रदान करता है। यह पेशेवर कानूनी या सरकारी अधिकारी की सलाह का स्थान नहीं लेता है।',
    legalDisclaimerHeader: 'कानूनी व सार्वजनिक सूचना अस्वीकरण',
    voiceModalTitle: 'वॉइस सहायक',
    voiceSpeakPrompt: 'कृपया माइक्रोफोन में स्पष्ट रूप से बोलें...',
    voiceStop: 'रोकें और भेजें',
    readAloud: 'बोलकर सुनाएं',
    stopReading: 'आवाज बंद करें',
    autoSpeak: 'उत्तर स्वतः बोलकर सुनाएं',
    voiceModeBtn: 'लाइव वॉइस सहायक',
    voiceModeDesc: 'अपनी क्षेत्रीय भाषा में सीधे बोलकर प्रमाणित सरकारी उत्तर सुनें',
    voiceStatusListening: 'सुन रहा हूँ... कृपया बोलिए',
    voiceStatusThinking: 'सरकारी नियमों व योजनाओं की जांच हो रही है...',
    voiceStatusSpeaking: 'उत्तर बोल रहा हूँ...',
    voiceStatusIdle: 'बोलने के लिए माइक दबाएं',
    voiceSpeed: 'आवाज की गति',
    handsFreeMode: 'हैंड्स-फ्री निरंतर बातचीत',
    schemesHeading: 'सत्यापित सरकारी योजना निर्देशिका',
    schemesSubheading: 'प्रामाणिक सरकारी सहायता कार्यक्रम, पात्रता मानदंड, लाभ और आधिकारिक पोर्टल लिंक देखें।',
    filterAll: 'सभी योजनाएं',
    servicesHeading: 'सार्वजनिक सहकारी एवं कृषि सेवाएं',
    servicesSubheading: 'आवश्यक सार्वजनिक सेवाओं, आवेदन प्रक्रियाओं और शिकायत निवारण तक सीधी पहुंच।',
    targetUsersLabel: 'लक्षित लाभार्थी',
    requiredDocsLabel: 'आवश्यक दस्तावेज',
    timelineLabel: 'निस्तारण समय-सीमा',
    applyPortalBtn: 'आधिकारिक पोर्टल पर जाएं →',
    learnMoreBtn: 'विवरण देखें और आवेदन करें',
    aboutHeading: 'सहकारी एवं ग्रामीण विधिक सहायता पोर्टल के बारे में',
    aboutWhatIsThis: 'यह मंच क्या है?',
    aboutWhatIsThisText: 'यह एक विश्वसनीय, बहुभाषी लोक-सेवा पोर्टल है जिसे सहकारी सदस्यों, किसानों, ग्रामीण नागरिकों, पैक्स सचिवों और ग्रामीण हितधारकों को सहकारी अधिनियमों, सरकारी योजनाओं, कृषि वित्त, फसल बीमा और शिकायत निवारण पर सरल व प्रमाणित उत्तर देने के लिए बनाया गया है।',
    aboutHowItWorks: 'यह कैसे कार्य करता है?',
    aboutHowItWorksSteps: [
      '1. अपनी भाषा में प्रश्न पूछें या मार्गदर्शित विषय चुनें।',
      '2. सिस्टम सत्यापित वैधानिक ज्ञानकोष और आधिकारिक सरकारी दस्तावेजों को खोजता है।',
      '3. संबंधित कानूनी धाराओं, नियमों और परिपत्रों का मिलान किया जाता है।',
      '4. सटीक संदर्भ, धारा और पृष्ठ संख्या के साथ सरल भाषा में उत्तर तैयार किया जाता है।',
      '5. आप सीधे मूल सरकारी दस्तावेज या पोर्टल को खोलकर पुष्टि कर सकते हैं।'
    ],
    aboutSafetyHeading: 'कानूनी अस्वीकरण एवं सत्यनिष्ठा',
    aboutSafetyText: 'यह पोर्टल विशुद्ध रूप से शैक्षणिक एवं मार्गदर्शन के उद्देश्य से है। यह "पूछें → सत्यापित करें → समझाएं → संदर्भ दें" के सिद्धांत पर काम करता है। यह कभी भी मनगढ़ंत धाराएं या झूठी जानकारी नहीं देता है।',
    loginTitle: 'नागरिक व सदस्य लॉगिन',
    registerTitle: 'निशुल्क खाता बनाएं',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूरा नाम',
    roleLabel: 'आपकी भूमिका / व्यवसाय',
    farmerRole: 'किसान / काश्तकार',
    pacsRole: 'पैक्स सचिव / बोर्ड सदस्य',
    citizenRole: 'ग्रामीण नागरिक / सदस्य',
    loginBtn: 'साइन इन करें',
    registerBtn: 'खाता बनाएं',
    noAccount: 'खाता नहीं है? निशुल्क पंजीकरण करें',
    haveAccount: 'पहले से खाता है? साइन इन करें',
    continueAsGuest: 'बिना लॉगिन के जारी रखें (पूर्ण पहुंच)',
    guestNote: 'लॉगिन पूरी तरह से वैकल्पिक है। आप बिना खाते के भी सभी प्रश्न पूछ सकते हैं।',
    savedQueriesTitle: 'सहेजे गए प्रश्न एवं इतिहास',
    bookmarksTitle: 'बुकमार्क की गई योजनाएं व उत्तर',
    noBookmarks: 'कोई बुकमार्क नहीं है। किसी भी उत्तर या योजना पर बुकमार्क आइकन क्लिक करें।',
    logoutBtn: 'साइन आउट',
    helplineTitle: 'आधिकारिक सार्वजनिक हेल्पलाइन',
    helplineKisan: 'किसान कॉल सेंटर: 1800-180-1551 (टोल-फ्री)',
    helplinePmfby: 'PMFBY फसल नुकसान हेल्पलाइन: 14447 (टोल-फ्री)',
    helplineConsumer: 'राष्ट्रीय उपभोक्ता हेल्पलाइन: 1915',
    footerRights: 'सहकारी शासन एवं ग्रामीण विधिक सहायता पोर्टल। लोक सेवा सूचना प्रणाली।',
    footerDisclaimer: 'सहकारिता मंत्रालय, पीएमएफबीवाई और आरबीआई/नाबार्ड के आधिकारिक दिशानिर्देशों पर आधारित।',
    searchingDatabase: 'सत्यापित ज्ञानकोष और आधिकारिक दिशानिर्देशों में खोज रहे हैं...',
    errorNotFound: 'इस प्रश्न के लिए कोई आधिकारिक या वैधानिक संदर्भ नहीं मिला।',
    errorRephrase: 'कृपया अपने प्रश्न को सरल शब्दों में दोबारा पूछें या ऊपर दिए गए विषयों में से चुनें।'
  },
  mr: {
    appName: 'सहकार सेतू',
    appSubtitle: 'सहकारी प्रशासन आणि ग्रामीण कायदेशीर सहाय्य पोर्टल',
    navHome: 'मुख्यपृष्ठ',
    navServices: 'सेवा',
    navSchemes: 'योजना',
    navAbout: 'माहिती',
    navLogin: 'लॉगिन',
    navAccount: 'माझे खाते',
    heroHeading: 'सहकारी आणि ग्रामीण सेवांसाठी तुमचा मार्गदर्शक',
    heroSubheading: 'सहकारी कायदे, शासकीय योजना, पॅक्स (PACS) सेवा, शेती, वित्त आणि तक्रार निवारणाबाबत साधे, बहुभाषिक आणि खात्रीशीर मार्गदर्शन मिळवा.',
    askPlaceholder: 'तुमचा प्रश्न विचारा (उदा: पॅक्सचे सभासद कसे व्हावे?)...',
    searchBtn: 'विचारा',
    micListening: 'ऐकत आहे... कृपया तुमचा प्रश्न बोला',
    micUnsupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही.',
    popularQuestionsTitle: 'लोकप्रिय प्रश्न',
    directChatTitle: 'थेट संवाद (Direct Chat)',
    directChatDesc: 'थेट प्रश्न विचारा आणि पुराव्यासह अचूक उत्तर मिळवा.',
    directChatBtn: 'संवाद सुरू करा',
    guidedAssistanceTitle: 'मार्गदर्शित मदत (Guided Assistance)',
    guidedAssistanceDesc: 'विषय निवडा आणि टप्प्याटप्प्याने मदत मिळवा.',
    guidedAssistanceBtn: 'विषय पहा',
    guidedHeading: 'तुम्हाला कोणत्या विषयात मदत हवी आहे?',
    guidedSubheading: 'अधिक अचूक माहिती मिळवण्यासाठी योग्य विषय निवडा.',
    chatHeading: 'सहकारी व कायदेशीर सहाय्यक',
    backBtn: 'मागे',
    newChat: 'नवीन संवाद',
    clearChat: 'इतिहास पुसा',
    copyAnswer: 'कॉपी करा',
    copied: 'कॉपी झाले!',
    helpful: 'उपयुक्त',
    unhelpful: 'अनुपयुक्त',
    sourceBadgeKnowledge: 'सत्यापित ज्ञानकोश',
    sourceBadgeGov: 'सत्यापित शासकीय पोर्टल',
    sourceBadgeWeb: 'सत्यापित वेब स्रोत',
    answerLabel: 'उत्तर',
    importantLabel: 'महत्वाच्या अटी आणि नियम',
    sourceLabel: 'सत्यापित संदर्भ व स्रोत',
    documentLabel: 'दस्तऐवज / कायदा',
    sectionLabel: 'कलम / नियम',
    pageLabel: 'पृष्ठ / प्रकरण',
    viewDocument: 'अधिकृत दस्तऐवज पहा',
    openOfficialSource: 'अधिकृत पोर्टल उघडा',
    suggestedFollowUp: 'सुचवलेले संबंधित प्रश्न',
    legalDisclaimer: 'हे पोर्टल अधिकृत सार्वजनिक नियमांवर आधारित माहिती व मार्गदर्शन पुरवते. हे व्यावसायिक वकील किंवा सक्षम अधिकाऱ्याच्या सल्ल्याचा पर्याय नाही.',
    legalDisclaimerHeader: 'कायदेशीर व सार्वजनिक माहिती सूचना',
    voiceModalTitle: 'व्हॉइस सहाय्यक',
    voiceSpeakPrompt: 'कृपया मायक्रोफोनमध्ये स्पष्ट बोला...',
    voiceStop: 'थांबवा आणि पाठवा',
    readAloud: 'मोठ्याने वाचा',
    stopReading: 'आवाज थांबवा',
    autoSpeak: 'उत्तरे आपोआप ऐका',
    voiceModeBtn: 'लाइव्ह व्हॉइस सहाय्यक',
    voiceModeDesc: 'आपल्या प्रादेशिक भाषेत थेट बोला आणि खात्रीशीर सरकारी उत्तरे ऐका',
    voiceStatusListening: 'ऐकत आहे... कृपया बोला',
    voiceStatusThinking: 'शासकीय नियम व योजना तपासत आहे...',
    voiceStatusSpeaking: 'उत्तर सांगत आहे...',
    voiceStatusIdle: 'बोलण्यासाठी माइक दाबा',
    voiceSpeed: 'आवाजाचा वेग',
    handsFreeMode: 'हँड्स-फ्री सतत संवाद',
    schemesHeading: 'सत्यापित शासकीय योजनांची माहिती',
    schemesSubheading: 'अधिकृत शासकीय योजना, पात्रता निकष, फायदे आणि थेट अर्ज लिंक्स पहा.',
    filterAll: 'सर्व योजना',
    servicesHeading: 'सहकारी व कृषी सार्वजनिक सेवा',
    servicesSubheading: 'महत्वाच्या शासकीय सेवा, अर्ज पद्धती आणि तक्रार निवारण पोर्टल.',
    targetUsersLabel: 'पात्र लाभार्थी',
    requiredDocsLabel: 'आवश्यक कागदपत्रे',
    timelineLabel: 'निवारण कालावधी',
    applyPortalBtn: 'अधिकृत पोर्टलवर जा →',
    learnMoreBtn: 'तपशील पहा व अर्ज करा',
    aboutHeading: 'सहकारी आणि ग्रामीण कायदेशीर सहाय्य पोर्टलविषयी',
    aboutWhatIsThis: 'हे पोर्टल काय आहे?',
    aboutWhatIsThisText: 'सहकारी संस्थांचे सभासद, शेतकरी, ग्रामीण नागरिक आणि पॅक्स सचिवांना सहकारी कायदे, सरकारी योजना, पीक विमा आणि तक्रार निवारणाविषयी सोप्या भाषेत व पुराव्यासह माहिती देण्यासाठी हे व्यासपीठ तयार केले आहे.',
    aboutHowItWorks: 'हे कसे कार्य करते?',
    aboutHowItWorksSteps: [
      '१. सोप्या भाषेत प्रश्न विचारा किंवा मार्गदर्शित विषय निवडा.',
      '२. प्रणाली अधिकृत कायद्यांच्या ज्ञानकोशात शोध घेते.',
      '३. संबंधित कलमे, परिपत्रके आणि मार्गदर्शक तत्त्वांची पडताळणी केली जाते.',
      '४. योग्य कलमांचा व संदर्भांचा उल्लेख करून सोपे उत्तर दिले जाते.',
      '५. तुम्ही थेट अधिकृत सरकारी पोर्टल किंवा दस्तऐवज उघडून खात्री करू शकता.'
    ],
    aboutSafetyHeading: 'कायदेशीर अस्वीकरण आणि विश्वासार्हता',
    aboutSafetyText: 'हे पोर्टल "विचारा → तपासा → स्पष्ट करा → संदर्भ द्या" या नियमावर चालते. येथे कोणत्याही चुकीच्या किंवा काल्पनिक कलमांची माहिती दिली जात नाही.',
    loginTitle: 'नागरिक व सभासद लॉगिन',
    registerTitle: 'मोफत खाते तयार करा',
    emailLabel: 'ईमेल पत्ता',
    passwordLabel: 'पासवर्ड',
    fullNameLabel: 'पूर्ण नाव',
    roleLabel: 'तुमची भूमिका / व्यवसाय',
    farmerRole: 'शेतकरी / खातेदार',
    pacsRole: 'पॅक्स सचिव / संचालक',
    citizenRole: 'ग्रामीण नागरिक / सभासद',
    loginBtn: 'साइन इन',
    registerBtn: 'खाते तयार करा',
    noAccount: 'खाते नाही? मोफत नोंदणी करा',
    haveAccount: 'आधीच खाते आहे? साइन इन करा',
    continueAsGuest: 'लॉगिन न करता पुढे जा (पूर्ण सुविधा)',
    guestNote: 'लॉगिन करणे ऐच्छिक आहे. तुम्ही खाते नसतानाही सर्व प्रश्न विचारू शकता.',
    savedQueriesTitle: 'जतन केलेले प्रश्न आणि इतिहास',
    bookmarksTitle: 'बुकमार्क केलेल्या योजना व उत्तरे',
    noBookmarks: 'अद्याप कोणतेही बुकमार्क केलेले नाही.',
    logoutBtn: 'साइन आउट',
    helplineTitle: 'अधिकृत सार्वजनिक हेल्पलाइन',
    helplineKisan: 'किसान कॉल सेंटर: १८००-१८०-१५५१ (टोल-फ्री)',
    helplinePmfby: 'PMFBY पीक नुकसान हेल्पलाइन: १४४४७ (टोल-फ्री)',
    helplineConsumer: 'राष्ट्रीय ग्राहक हेल्पलाइन: १९१५',
    footerRights: 'सहकारी प्रशासन आणि ग्रामीण कायदेशीर सहाय्य पोर्टल. लोकसेवा माहिती प्रणाली.',
    footerDisclaimer: 'सहकार मंत्रालय, पीएमएफबीवाय आणि नाबार्डच्या अधिकृत नियमांवर आधारित.',
    searchingDatabase: 'सत्यापित ज्ञानकोशात शोधत आहे...',
    errorNotFound: 'या प्रश्नासाठी कोणताही अधिकृत संदर्भ सापडला नाही.',
    errorRephrase: 'कृपया प्रश्न सोप्या भाषेत पुन्हा विचारा किंवा वरील विषय निवडा.'
  },
  bn: {
    appName: 'সহকার সেতু',
    appSubtitle: 'সমবায় পরিচালনা ও গ্রামীণ আইনি সহায়তা পোর্টাল',
    navHome: 'হোম',
    navServices: 'পরিষেবা',
    navSchemes: 'প্রকল্পসমূহ',
    navAbout: 'সম্পর্কে',
    navLogin: 'লগইন',
    navAccount: 'আমার প্রোফাইল',
    heroHeading: 'সমবায় ও গ্রামীণ সেবায় আপনার নির্ভরযোগ্য নির্দেশিকা',
    heroSubheading: 'সমবায় আইন, সরকারি প্রকল্প, প্যাকস (PACS) পরিষেবা, কৃষি, অর্থ ও অভিযোগ প্রতিকারে সহজ, বহুভাষিক ও যাচাইকৃত তথ্য পান।',
    askPlaceholder: 'আপনার প্রশ্ন লিখুন (যেমন: কীভাবে প্যাকসের সদস্য হওয়া যায়?)...',
    searchBtn: 'জানুন',
    micListening: 'শুনছি... অনুগ্রহ করে আপনার প্রশ্ন বলুন',
    micUnsupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।',
    popularQuestionsTitle: 'জনপ্রিয় প্রশ্নসমূহ',
    directChatTitle: 'সরাসরি প্রশ্ন (Direct Chat)',
    directChatDesc: 'সরাসরি প্রশ্ন করুন এবং প্রমাণসহ যাচাইকৃত উত্তর পান।',
    directChatBtn: 'প্রশ্ন করুন',
    guidedAssistanceTitle: 'নির্দেশিত সহায়তা (Guided Assistance)',
    guidedAssistanceDesc: 'বিষয় নির্বাচন করুন এবং ধাপে ধাপে সঠিক সাহায্য নিন।',
    guidedAssistanceBtn: 'বিষয়সমূহ দেখুন',
    guidedHeading: 'আপনি কোন বিষয়ে সাহায্য চান?',
    guidedSubheading: 'সুনির্দিষ্ট তথ্যের জন্য একটি বিষয় বেছে নিন।',
    chatHeading: 'সমবায় ও আইনি সহায়ক',
    backBtn: 'পেছনে',
    newChat: 'নতুন আলোচনা',
    clearChat: 'ইতিহাস মুছুন',
    copyAnswer: 'কপি করুন',
    copied: 'কপি হয়েছে!',
    helpful: 'উপকারী',
    unhelpful: 'অনুপকারী',
    sourceBadgeKnowledge: 'যাচাইকৃত জ্ঞানভাণ্ডার',
    sourceBadgeGov: 'যাচাইকৃত সরকারি পোর্টাল',
    sourceBadgeWeb: 'যাচাইকৃত ওয়েব উৎস',
    answerLabel: 'উত্তর',
    importantLabel: 'গুরুত্বপূর্ণ শর্ত ও নিয়মাবলী',
    sourceLabel: 'যাচাইকৃত উৎস ও তথ্যসূত্র',
    documentLabel: 'নথি / আইন',
    sectionLabel: 'ধারা / অনুচ্ছেদ',
    pageLabel: 'পৃষ্ঠা / অধ্যায়',
    viewDocument: 'অফিসিয়াল নথি দেখুন',
    openOfficialSource: 'সরকারি পোর্টাল খুলুন',
    suggestedFollowUp: 'প্রস্তাবিত অন্যান্য প্রশ্ন',
    legalDisclaimer: 'এই প্ল্যাটফর্মটি সরকারি ও আইনি নথির ভিত্তিতে সাধারণ তথ্য ও সহায়তা প্রদান করে। এটি কোনো আইনজীবী বা সরকারি কর্মকর্তার বিকল্প নয়।',
    legalDisclaimerHeader: 'আইনি ও জনতথ্য সংক্রান্ত সতর্কতা',
    voiceModalTitle: 'ভয়েস সহকারী',
    voiceSpeakPrompt: 'অনুগ্রহ করে মাইক্রোফোনে স্পষ্ট করে বলুন...',
    voiceStop: 'থামুন ও পাঠান',
    readAloud: 'পড়ে শোনান',
    stopReading: 'আওয়াজ বন্ধ করুন',
    autoSpeak: 'উত্তর স্বয়ংক্রিয়ভাবে শুনুন',
    voiceModeBtn: 'লাইভ ভয়েস সহকারী',
    voiceModeDesc: 'আপনার মাতৃভাষায় কথা বলুন এবং তাৎক্ষণিক নির্ভরযোগ্য উত্তর শুনুন',
    voiceStatusListening: 'শুনছি... অনুগ্রহ করে বলুন',
    voiceStatusThinking: 'সরকারি আইন ও প্রকল্প যাচাই করা হচ্ছে...',
    voiceStatusSpeaking: 'উত্তর বলা হচ্ছে...',
    voiceStatusIdle: 'কথা বলতে মাইক চাপুন',
    voiceSpeed: 'আওয়াজের গতি',
    handsFreeMode: 'হ্যান্ডস-ফ্রি কথোপকথন',
    schemesHeading: 'যাচাইকৃত সরকারি প্রকল্প তালিকা',
    schemesSubheading: 'সরকারি সুযোগ-সুবিধা, আবেদনের যোগ্যতা, প্রয়োজনীয় নথি ও পোর্টাল লিংক দেখুন।',
    filterAll: 'সকল প্রকল্প',
    servicesHeading: 'জনসাধারণের জন্য সমবায় ও কৃষি সেবা',
    servicesSubheading: 'গুরুত্বপূর্ণ সরকারি সেবা, আবেদন পদ্ধতি এবং অভিযোগ দায়েরের পোর্টাল।',
    targetUsersLabel: 'যোগ্য সুবিধাভোগী',
    requiredDocsLabel: 'প্রয়োজনীয় নথিপত্র',
    timelineLabel: 'নিষ্পত্তির সময়সীমা',
    applyPortalBtn: 'সরকারি পোর্টালে যান →',
    learnMoreBtn: 'বিস্তারিত দেখুন ও আবেদন করুন',
    aboutHeading: 'সমবায় ও গ্রামীণ আইনি সহায়তা পোর্টাল সম্পর্কে',
    aboutWhatIsThis: 'এই প্ল্যাটফর্মটি কী?',
    aboutWhatIsThisText: 'সমবায় সদস্য, কৃষক, গ্রামীণ নাগরিক ও প্যাকস কর্মকর্তাদের সমবায় আইন, সরকারি অনুদান, শস্য বীমা ও অভিযোগ প্রতিকারে সঠিক ও তথ্যবহুল সহায়তা প্রদানের জন্য এই পোর্টালটি তৈরি।',
    aboutHowItWorks: 'এটি কীভাবে কাজ করে?',
    aboutHowItWorksSteps: [
      '১. আপনার প্রশ্ন লিখুন বা নির্দেশিত বিষয় নির্বাচন করুন।',
      '২. সিস্টেম যাচাইকৃত সরকারি আইন ও নথিতে অনুসন্ধান করে।',
      '৩. প্রাসঙ্গিক ধারা, নিয়ম ও নির্দেশিকা মিলিয়ে দেখা হয়।',
      '৪. সঠিক আইনি ধারা ও পৃষ্ঠার রেফারেন্সসহ সহজ ভাষায় উত্তর দেওয়া হয়।',
      '৫. আপনি সরাসরি মূল সরকারি পোর্টাল বা নথি খুলে যাচাই করতে পারেন।'
    ],
    aboutSafetyHeading: 'আইনি অস্বীকৃতি ও নির্ভরযোগ্যতা',
    aboutSafetyText: 'এই প্ল্যাটফর্মটি "জিজ্ঞাসা → যাচাই → ব্যাখ্যা → তথ্যসূত্র" নীতির ওপর প্রতিষ্ঠিত। এটি কোনো কাল্পনিক ধারা বা অসত্য তথ্য প্রকাশ করে না।',
    loginTitle: 'নাগরিক ও সদস্য লগইন',
    registerTitle: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
    emailLabel: 'ইমেইল ঠিকানা',
    passwordLabel: 'পাসওয়ার্ড',
    fullNameLabel: 'পুরো নাম',
    roleLabel: 'আপনার পেশা / ভূমিকা',
    farmerRole: 'কৃষক / চাষী',
    pacsRole: 'প্যাকস সম্পাদক / পরিচালক',
    citizenRole: 'গ্রামীণ নাগরিক / সদস্য',
    loginBtn: 'সাইন ইন',
    registerBtn: 'অ্যাকাউন্ট তৈরি করুন',
    noAccount: 'অ্যাকাউন্ট নেই? বিনামূল্যে নিবন্ধন করুন',
    haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন',
    continueAsGuest: 'লগইন ছাড়াই ব্যবহার করুন (সম্পূর্ণ উন্মুক্ত)',
    guestNote: 'লগইন সম্পূর্ণ ঐচ্ছিক। অ্যাকাউন্ট ছাড়াই আপনি সমস্ত প্রশ্ন করতে পারেন।',
    savedQueriesTitle: 'সংরক্ষিত প্রশ্ন ও ইতিহাস',
    bookmarksTitle: 'বুকমার্ক করা উত্তর ও প্রকল্প',
    noBookmarks: 'কোনো বুকমার্ক সংরক্ষিত নেই।',
    logoutBtn: 'সাইন আউট',
    helplineTitle: 'সরকারি জরুরি হেল্পলাইন',
    helplineKisan: 'কিষাণ কল সেন্টার: ১৮০০-১৮০-১৫৫১ (টোল-ফ্রি)',
    helplinePmfby: 'PMFBY শস্য ক্ষতি হেল্পলাইন: ১৪৪৪৭ (টোল-ফ্রি)',
    helplineConsumer: 'জাতীয় উপভোক্তা হেল্পলাইন: ১৯১৫',
    footerRights: 'সমবায় পরিচালনা ও গ্রামীণ আইনি সহায়তা পোর্টাল। জনসেবামূলক তথ্য ব্যবস্থা।',
    footerDisclaimer: 'সমবায় মন্ত্রক, পিএমএফবিওয়াই এবং আরবিআই/নাবার্ডের নির্দেশিকার ওপর ভিত্তি করে প্রস্তুত।',
    searchingDatabase: 'যাচাইকৃত তথ্যভাণ্ডারে অনুসন্ধান করা হচ্ছে...',
    errorNotFound: 'এই প্রশ্নের জন্য কোনো নির্ভরযোগ্য সরকারি তথ্যসূত্র পাওয়া যায়নি।',
    errorRephrase: 'অনুগ্রহ করে প্রশ্নটি সহজ ভাষায় পুনরায় লিখুন বা উপরের বিষয়সমূহ থেকে নির্বাচন করুন।'
  }
};
