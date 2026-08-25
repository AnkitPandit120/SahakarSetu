import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, MessageSquare, Compass, ArrowRight, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  onAskQuestion: (question: string) => void;
  onOpenGuided: () => void;
  onOpenDirectChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onAskQuestion,
  onOpenGuided,
  onOpenDirectChat
}) => {
  const t = TRANSLATIONS[language];
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micMessage, setMicMessage] = useState<string | null>(null);

  // Popular suggested queries
  const popularQuestions: Record<Language, { label: string; query: string }[]> = {
    en: [
      { label: 'What is PMFBY?', query: 'What is PMFBY crop insurance and what are the premium rates and 72-hour loss reporting rules?' },
      { label: 'How can I become a PACS member?', query: 'How can a farmer apply to become a voting member in a Primary Agricultural Credit Society (PACS)?' },
      { label: 'What are cooperative member rights?', query: 'What are the democratic rights and voting powers of a cooperative society member?' },
      { label: 'Which government schemes am I eligible for?', query: 'What are the main government schemes available for small and marginal farmers in India?' },
      { label: 'How can I file a grievance?', query: 'How can I file a grievance or complaint against a cooperative society or PACS on the CRCS portal?' }
    ],
    hi: [
      { label: 'पीएमएफबीवाई क्या है?', query: 'प्रधानमंत्री फसल बीमा योजना (PMFBY) क्या है और इसमें प्रीमियम व 72 घंटे में नुकसान की सूचना के क्या नियम हैं?' },
      { label: 'पैक्स (PACS) का सदस्य कैसे बनें?', query: 'एक किसान प्राथमिक कृषि साख समिति (PACS) का नियमित मतदान सदस्य कैसे बन सकता है?' },
      { label: 'सहकारी सदस्य के अधिकार क्या हैं?', query: 'सहकारी समिति के सदस्यों के क्या वैधानिक अधिकार और मतदान शक्तियां हैं?' },
      { label: 'मैं किन सरकारी योजनाओं का पात्र हूँ?', query: 'छोटे और सीमांत किसानों के लिए कौन सी प्रमुख सरकारी योजनाएं उपलब्ध हैं?' },
      { label: 'शिकायत कैसे दर्ज करें?', query: 'सहकारी समिति या पैक्स के खिलाफ सीआरसीएस पोर्टल पर शिकायत कैसे दर्ज करें?' }
    ],
    mr: [
      { label: 'पीएमएफबीवाय (PMFBY) काय आहे?', query: 'प्रधानमंत्री पीक विमा योजना (PMFBY) काय आहे आणि ७२ तासांत नुकसान तक्रारीचे नियम काय आहेत?' },
      { label: 'पॅक्स (PACS) चे सभासद कसे व्हावे?', query: 'शेतकरी गावातील प्राथमिक कृषी पतसंस्थेचे (PACS) मतदानाचे सभासद कसे होऊ शकतात?' },
      { label: 'सभासदांचे कायदेशीर अधिकार काय आहेत?', query: 'सहकारी संस्थेच्या सभासदांचे कायदेशीर हक्क आणि मतदानाचे अधिकार काय आहेत?' },
      { label: 'शेतकऱ्यांसाठी प्रमुख योजना कोणत्या?', query: 'अल्प व अत्यल्प भूधारक शेतकऱ्यांसाठी महत्त्वाच्या शासकीय योजना कोणत्या आहेत?' },
      { label: 'तक्रार कशी दाखल करावी?', query: 'सहकारी संस्थेविरुद्ध सीआरसीएस पोर्टलवर ऑनलाइन तक्रार कशी करावी?' }
    ],
    bn: [
      { label: 'পিএমএফবিওয়াই কী?', query: 'প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY) কী এবং এর প্রিমিয়াম ও ৭২ ঘণ্টার নিয়ম কী?' },
      { label: 'কীভাবে প্যাকস সদস্য হবেন?', query: 'প্রাথমিক কৃষি সমবায় সমিতিতে (PACS) পূর্ণাঙ্গ সদস্য হওয়ার নিয়ম কী?' },
      { label: 'সমবায় সদস্যদের অধিকার কী?', query: 'সমবায় সমিতির সদস্যদের ভোটাধিকার এবং অন্যান্য আইনি অধিকার কী কী?' },
      { label: 'কৃষকদের জন্য কী কী প্রকল্প আছে?', query: 'ক্ষুদ্র ও প্রান্তিক কৃষকদের জন্য প্রধান সরকারি প্রকল্পসমূহ কী কী?' },
      { label: 'অভিযোগ কীভাবে দায়ের করবেন?', query: 'সমবায় সমিতি বা প্যাকসের বিরুদ্ধে কীভাবে অনলাইনে অভিযোগ জানাবেন?' }
    ]
  };

  const currentPopularQuestions = popularQuestions[language] || popularQuestions.en;

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicMessage(t.micUnsupported);
      setTimeout(() => setMicMessage(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setMicMessage(t.micListening);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchInput(transcript);
        setIsListening(false);
        setMicMessage(null);
        if (transcript.trim()) {
          onAskQuestion(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setMicMessage(`Voice error: ${event.error}. Please type your question.`);
        setTimeout(() => setMicMessage(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Failed to start voice recognition:', e);
      setIsListening(false);
      setMicMessage(t.micUnsupported);
      setTimeout(() => setMicMessage(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onAskQuestion(searchInput.trim());
    }
  };

  return (
    <section id="hero-section" className="bg-slate-50 pt-12 pb-16 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Verification badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-5 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Statutory Cooperative & Rural Public Service System</span>
        </div>

        {/* Main heading */}
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">
            {t.heroHeading}
          </h1>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubheading}
          </p>

          {/* Main Search / Question Box */}
          <form onSubmit={handleSubmit} className="relative group w-full max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              id="hero-question-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.askPlaceholder}
              className="w-full pl-14 pr-36 py-4.5 sm:py-5 text-base sm:text-lg bg-white border border-slate-300 rounded-2xl shadow-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 focus:outline-none placeholder:text-slate-400 transition-all text-slate-900"
            />

            {/* Microphone & Send actions inside input */}
            <div className="absolute inset-y-2 right-2 flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                id="hero-voice-btn"
                onClick={handleVoiceInput}
                title={speechSupported ? 'Voice Question' : t.micUnsupported}
                className={`p-2 rounded-xl text-slate-400 hover:text-slate-700 transition-colors ${
                  isListening ? 'bg-red-50 text-red-600 animate-pulse' : ''
                }`}
              >
                {isListening ? <Mic className="w-5 h-5 text-red-600" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                id="hero-submit-btn"
                disabled={!searchInput.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                {t.searchBtn}
              </button>
            </div>
          </form>

          {/* Voice status message */}
          {micMessage && (
            <div className="mt-3 text-xs text-slate-800 bg-white py-1.5 px-3.5 rounded-lg border border-slate-200 inline-block font-medium shadow-xs">
              {micMessage}
            </div>
          )}

          {/* Popular Questions Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-1 py-1">
              {t.popularQuestionsTitle}:
            </span>
            {currentPopularQuestions.map((qItem, idx) => (
              <button
                key={idx}
                id={`popular-q-${idx}`}
                onClick={() => onAskQuestion(qItem.query)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 shadow-2xs transition-all"
              >
                {qItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* TWO PRIMARY ACTIONS: Direct Chat & Guided Assistance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-12 text-left">
          {/* Action 1: Direct Chat */}
          <div
            id="action-direct-chat"
            onClick={onOpenDirectChat}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex gap-5"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {t.directChatTitle}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {t.directChatDesc}
                </p>
              </div>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>{t.directChatBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Action 2: Guided Assistance */}
          <div
            id="action-guided-assistance"
            onClick={onOpenGuided}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex gap-5"
          >
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-7 h-7" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {t.guidedAssistanceTitle}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {t.guidedAssistanceDesc}
                </p>
              </div>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>{t.guidedAssistanceBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Trust Guarantees */}
        <div className="mt-12 pt-6 border-t border-slate-200 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Exact Statutory Sections & Acts</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Grounded in Official Guidelines</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Direct Links to Government Portals</span>
          </div>
        </div>
      </div>
    </section>
  );
};
