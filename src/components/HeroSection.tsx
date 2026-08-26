import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  Bell,
  Landmark,
  Scale,
  Users,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  onAskQuestion: (question: string) => void;
  onOpenGuided: () => void;
  onOpenDirectChat: () => void;
  onOpenVoiceMode?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onAskQuestion,
  onOpenGuided,
  onOpenDirectChat
}) => {
  const t = TRANSLATIONS[language];
  const [searchInput, setSearchInput] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'mscs' | 'pacs' | 'credit' | 'dispute'>('all');

  // Official Government Gazette & Policy Flash Ticker items
  const tickerNotices = [
    '🔔 भारत का राजपत्र: Model Bye-laws 2024 adopted across 63,000+ Primary Agricultural Credit Societies (PACS).',
    '📢 Ministry of Cooperation: National Cooperative Database covers over 8.5 Lakh societies across 28 States & 8 UTs.',
    '🌾 Central Scheme: Computerization of PACS with modern ERP & Common Service Centre (CSC) integration active.',
    '⚖️ Statutory Notice: Multi-State Co-operative Societies (Amendment) Act 2023 Rules notified for transparent governance.',
    '💳 KCC Saturation: Interest subvention of 3% for prompt repayment on crop loans through rural cooperative credit.'
  ];

  // Popular suggested queries
  const popularQuestions: Record<Language, { label: string; query: string }[]> = {
    en: [
      { label: 'PACS Membership Procedure', query: 'What is the step-by-step procedure to apply for voting membership in a Primary Agricultural Credit Society (PACS)?' },
      { label: 'PMFBY 72-Hour Claim Rule', query: 'What is the 72-hour localized calamity intimation rule and crop loss survey process under PMFBY?' },
      { label: 'Cooperative Member Rights', query: 'What are the statutory democratic rights, inspection rights, and voting powers of a cooperative society member?' },
      { label: 'KCC Loan Subvention', query: 'What are the interest subvention rules and collateral-free loan limits for Kisan Credit Card through cooperatives?' },
      { label: 'CRCS Grievance Redressal', query: 'How can a citizen lodge a formal complaint against a Multi-State Cooperative Society on the CRCS grievance portal?' }
    ],
    hi: [
      { label: 'पैक्स (PACS) सदस्यता नियम', query: 'प्राथमिक कृषि साख समिति (PACS) में नियमित मतदान सदस्य बनने की क्या प्रक्रिया और पात्रता है?' },
      { label: 'पीएम फसल बीमा 72 घंटे का नियम', query: 'प्रधानमंत्री फसल बीमा योजना (PMFBY) के तहत 72 घंटे में स्थानीय आपदा सूचना और क्लेम की क्या प्रक्रिया है?' },
      { label: 'सहकारी सदस्य के अधिकार', query: 'सहकारी समिति अधिनियम के तहत सदस्यों के क्या वैधानिक अधिकार और मतदान शक्तियां हैं?' },
      { label: 'केसीसी (KCC) ब्याज छूट योजना', query: 'सहकारी बैंकों के माध्यम से किसान क्रेडिट कार्ड (KCC) पर 3% त्वरित पुनर्भुगतान ब्याज छूट के क्या नियम हैं?' },
      { label: 'सीआरसीएस पर शिकायत निवारण', query: 'मल्टी-स्टेट कोऑपरेटिव सोसाइटी के विरुद्ध सीआरसीएस पोर्टल पर ऑनलाइन शिकायत कैसे दर्ज करें?' }
    ],
    mr: [
      { label: 'पॅक्स (PACS) सभासदत्व प्रक्रिया', query: 'गावातील प्राथमिक कृषी पतसंस्थेचे (PACS) मतदानाचे सभासद कसे व्हावे?' },
      { label: 'पीक विमा ७२ तास नियम', query: 'प्रधानमंत्री पीक विमा योजना (PMFBY) मध्ये ७२ तासांच्या आत नुकसान तक्रारीचे नियम काय आहेत?' },
      { label: 'सभासदांचे कायदेशीर हक्क', query: 'सहकारी संस्थेच्या सभासदांचे कायदेशीर हक्क आणि मतदानाचे अधिकार काय आहेत?' },
      { label: 'केसीसी व्याज सवलत योजना', query: 'सहकारी बँकेतून किसान क्रेडिट कार्ड (KCC) वरील व्याज सवलत नियम काय आहेत?' },
      { label: 'सीआरसीएस तक्रार निवारण', query: 'सहकारी संस्थेविरुद्ध सीआरसीएस पोर्टलवर ऑनलाइन तक्रार कशी करावी?' }
    ],
    bn: [
      { label: 'প্যাকস সদস্যপদ প্রক্রিয়া', query: 'প্রাথমিক কৃষি সমবায় সমিতিতে (PACS) পূর্ণাঙ্গ ভোটাধিকার সদস্য হওয়ার নিয়ম কী?' },
      { label: 'ফসল বীমা ৭২ ঘণ্টার নিয়ম', query: 'প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY) তে ৭২ ঘণ্টার মধ্যে ক্ষয়ক্ষতির অভিযোগ জানানোর নিয়ম কী?' },
      { label: 'সমবায় সদস্যদের আইনি অধিকার', query: 'সমবায় সমিতির সদস্যদের ভোটাধিকার এবং অন্যান্য সংবিধিবদ্ধ অধিকার কী কী?' },
      { label: 'কেসিসি ঋণ অনুদান প্রকল্প', query: 'সমবায় ব্যাংক থেকে কিষাণ ক্রেডিট কার্ডের (KCC) ঋণের নিয়মাবলী কী?' },
      { label: 'অভিযোগ দায়ের পদ্ধতি', query: 'সমবায় সমিতির বিরুদ্ধে সরকারি পোর্টালে অভিযোগ জানানোর নিয়ম কী?' }
    ]
  };

  const currentPopularQuestions = popularQuestions[language] || popularQuestions.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onAskQuestion(searchInput.trim());
    }
  };

  return (
    <section id="hero-section" className="bg-[#f8fafc] border-b border-slate-300">
      {/* 1. Official Government Notification Flash Ticker */}
      <div className="bg-[#e2e8f0] border-b border-slate-300 py-1.5 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#0B3B60] text-white px-2.5 py-0.5 rounded font-bold text-[11px] uppercase tracking-wider shrink-0 shadow-2xs">
            <Bell className="w-3 h-3 text-amber-300" />
            <span>{language === 'hi' ? 'नवीनतम सूचनाएं' : 'LATEST UPDATES'}</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee inline-block text-slate-800 font-medium text-xs">
              {tickerNotices.map((notice, idx) => (
                <span key={idx} className="mr-8 inline-block">
                  {notice}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Government Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="bg-gradient-to-r from-[#0B3B60] via-[#104b78] to-[#0d3454] rounded-2xl text-white p-6 sm:p-10 shadow-lg border-2 border-[#1c5d94] relative overflow-hidden">
          {/* Subtle National Ashoka Chakra background pattern */}
          <div className="absolute right-0 top-0 bottom-0 opacity-5 pointer-events-none flex items-center pr-6">
            <svg viewBox="0 0 100 100" className="w-96 h-96 stroke-current fill-none">
              <circle cx="50" cy="50" r="45" strokeWidth="2" />
              <circle cx="50" cy="50" r="10" strokeWidth="2" />
              {[...Array(24)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <div className="max-w-3xl relative z-10 space-y-4">
            {/* Official Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'सहकारिता मंत्रालय, भारत सरकार का आधिकारिक विधिक सहायता तंत्र' : 'Official Statutory Legal & Governance Assistance System'}</span>
            </div>

            {/* Main Portal Headline */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {language === 'hi'
                ? 'सहकारी कानून, पैक्स नियम व सरकारी योजनाओं का प्रामाणिक मार्गदर्शन'
                : 'Statutory Cooperative Law, Model PACS Bye-Laws & Government Schemes Portal'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {language === 'hi'
                ? 'मल्टी-स्टेट सहकारी समिति अधिनियम, मॉडल पैक्स उप-नियम 2024, नाबार्ड दिशानिर्देश, फसल बीमा (PMFBY) व किसान क्रेडिट कार्ड से संबंधित आधिकारिक वैधानिक धाराओं सहित जानकारी प्राप्त करें।'
                : 'Directly grounded in Multi-State Co-operative Societies Act, Model PACS Bye-Laws 2024, NABARD circulars, PMFBY guidelines, and verified Central Government schemes.'}
            </p>

            {/* Department Filter Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-amber-200">{language === 'hi' ? 'विभागीय क्षेत्र:' : 'Departmental Focus:'}</span>
              {[
                { id: 'all', label: language === 'hi' ? 'सभी क्षेत्र' : 'All Departments' },
                { id: 'pacs', label: language === 'hi' ? 'पैक्स व ग्राम सहकारी' : 'PACS Modernization' },
                { id: 'mscs', label: language === 'hi' ? 'मल्टी-स्टेट समितियां (MSCS)' : 'Multi-State Societies' },
                { id: 'credit', label: language === 'hi' ? 'कृषि ऋण व केसीसी' : 'Credit & KCC Subvention' },
                { id: 'dispute', label: language === 'hi' ? 'विवाद व शिकायत निवारण' : 'Grievance Redressal' }
              ].map((dept) => (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setSelectedDept(dept.id as any)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedDept === dept.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {dept.label}
                </button>
              ))}
            </div>

            {/* Main Central Government Search Bar */}
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                  <Search className="w-5 h-5 text-[#0B3B60]" />
                </div>

                <input
                  id="hero-question-input"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'कानूनी धारा, पैक्स नियम या योजना का नाम खोजें (उदा. पैक्स सदस्यता नियम, पीएमएफबीवाई 72 घंटे)...'
                      : 'Search statutory rules, PACS bye-laws, or scheme details (e.g. PACS membership, PMFBY claim)...'
                  }
                  className="w-full pl-12 pr-32 sm:pr-36 py-4 bg-white text-slate-900 rounded-xl shadow-md border border-slate-300 focus:outline-none focus:ring-3 focus:ring-amber-400 text-xs sm:text-sm font-medium placeholder:text-slate-400"
                />

                <div className="absolute inset-y-2 right-2 flex items-center">
                  <button
                    type="submit"
                    id="hero-submit-btn"
                    disabled={!searchInput.trim()}
                    className="bg-[#0B3B60] hover:bg-[#07253d] disabled:bg-slate-300 text-white px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                  >
                    {language === 'hi' ? 'खोजें (Search)' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {/* Popular Query Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                {language === 'hi' ? 'त्वरित प्रश्न:' : 'Common Inquiries:'}
              </span>
              {currentPopularQuestions.map((qItem, idx) => (
                <button
                  key={idx}
                  id={`popular-q-${idx}`}
                  onClick={() => onAskQuestion(qItem.query)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-[11px] font-medium text-slate-100 hover:text-white transition-all cursor-pointer"
                >
                  {qItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Official National Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs text-center">
            <div className="text-xl sm:text-2xl font-black text-[#0B3B60]">63,000+</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
              {language === 'hi' ? 'कम्प्यूटरीकृत पैक्स समितियां' : 'Computerized PACS'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs text-center">
            <div className="text-xl sm:text-2xl font-black text-[#0B3B60]">8.5+ Lakh</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
              {language === 'hi' ? 'पंजीकृत सहकारी समितियां' : 'Registered Cooperatives'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs text-center">
            <div className="text-xl sm:text-2xl font-black text-[#0B3B60]">100%</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
              {language === 'hi' ? 'राजपत्र व अधिनियम प्रामाणिक' : 'Statutory Act Grounded'}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs text-center">
            <div className="text-xl sm:text-2xl font-black text-[#0B3B60]">28 States & 8 UTs</div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
              {language === 'hi' ? 'अखिल भारतीय व्याप्ति' : 'Pan-India Coverage'}
            </div>
          </div>
        </div>

        {/* 4. Primary Government Service Gateways */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0B3B60]" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {language === 'hi' ? 'प्रमुख नागरिक एवं प्रशासनिक पोर्टल' : 'Citizen & Institutional Service Gateways'}
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Government of India
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gateway 1: AI Sahayak */}
            <div
              id="action-direct-chat"
              onClick={onOpenDirectChat}
              className="bg-white border border-slate-200 hover:border-[#0B3B60] rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-[#0B3B60] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 text-[#0B3B60]" />
                </div>
                <div className="text-xs font-bold text-[#0B3B60] uppercase tracking-wider">AI Sahayak</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {language === 'hi' ? 'एआई सहकार मित्र चैट' : 'Statutory AI Advisor'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'hi'
                    ? 'कानूनी धाराओं और दिशानिर्देशों के साथ तत्काल प्रामाणिक उत्तर पाएं।'
                    : 'Instant legal citations, statutory act clauses, and official guidelines.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B3B60] group-hover:translate-x-1 transition-transform">
                <span>{language === 'hi' ? 'परामर्श लें' : 'Start Advisory'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Gateway 2: Structured Navigator */}
            <div
              id="action-guided-assistance"
              onClick={onOpenGuided}
              className="bg-white border border-slate-200 hover:border-[#0B3B60] rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Acts & Bye-Laws</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {language === 'hi' ? 'अधिनियम व नियम नेविगेटर' : 'Statutory Act Navigator'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'hi'
                    ? 'मल्टी-स्टेट अधिनियम, मॉडल पैक्स उप-नियम और वैधानिक प्रावधानों की सूची।'
                    : 'Explore categorized MSCS sections, model bye-laws, and election rules.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>{language === 'hi' ? 'नियम देखें' : 'Explore Acts'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Gateway 3: CRCS Official Portal link */}
            <a
              href="https://crcs.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-slate-200 hover:border-[#0B3B60] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Scale className="w-5 h-5 text-amber-800" />
                </div>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">CRCS Portal</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {language === 'hi' ? 'सीआरसीएस पंजीयक पोर्टल' : 'CRCS Multi-State Portal'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'hi'
                    ? 'मल्टी-स्टेट सहकारी समितियों का ऑनलाइन पंजीकरण, रिटर्न व शिकायत निवारण।'
                    : 'Online registration, annual returns, and grievance redressal system.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>crcs.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </a>

            {/* Gateway 4: PMFBY Portal link */}
            <a
              href="https://pmfby.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-slate-200 hover:border-[#0B3B60] rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">PMFBY Portal</div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना' : 'PMFBY Crop Insurance'}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {language === 'hi'
                    ? 'फसल बीमा प्रीमियम गणना, 72 घंटे में नुकसान सूचना व क्लेम स्थिति।'
                    : 'Premium calculation, 72-hour loss intimation, and claim tracking.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                <span>pmfby.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </a>
          </div>
        </div>

        {/* 5. Statutory Guarantees & Verification Notice */}
        <div className="mt-10 pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span><strong>Exact Legal Acts:</strong> MSCS Act 2002 & 2023 Amendment</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span><strong>Official Guidelines:</strong> Model PACS Bye-Laws 2024</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span><strong>Verified Portals:</strong> cooperation.gov.in & crcs.gov.in</span>
          </div>
        </div>
      </div>
    </section>
  );
};
