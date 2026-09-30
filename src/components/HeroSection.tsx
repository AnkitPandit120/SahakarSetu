import React from 'react';
import {
  MessageSquare,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  Building,
  Bell,
  Landmark,
  Scale,
  Users,
  ChevronRight,
  ExternalLink,
  Mic,
  Sparkles,
  Radio
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { GovernmentImageSlider } from './GovernmentImageSlider';

interface HeroSectionProps {
  language: Language;
  onAskQuestion: (question: string) => void;
  onOpenGuided: () => void;
  onOpenDirectChat: () => void;
  onOpenVoiceMode?: () => void;
  onOpenSpeechToSpeech?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onAskQuestion,
  onOpenGuided,
  onOpenDirectChat,
  onOpenSpeechToSpeech
}) => {
  const t = TRANSLATIONS[language];

  // Official Government Gazette & Policy Flash Ticker items
  const tickerNotices = [
    '🔔 भारत का राजपत्र: Model Bye-laws 2024 adopted across 63,000+ Primary Agricultural Credit Societies (PACS).',
    '📢 Ministry of Cooperation: National Cooperative Database covers over 8.5 Lakh societies across 28 States & 8 UTs.',
    '🌾 Central Scheme: Computerization of PACS with modern ERP & Common Service Centre (CSC) integration active.',
    '⚖️ Statutory Notice: Multi-State Co-operative Societies (Amendment) Act 2023 Rules notified for transparent governance.',
    '💳 KCC Saturation: Interest subvention of 3% for prompt repayment on crop loans through rural cooperative credit.'
  ];

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

      {/* 2. Full-Width Government Banner Carousel (Mann Ki Baat, Vibrant Villages, Modi, Yogi, Amit Shah, PACS) */}
      <GovernmentImageSlider
        language={language}
        onSelectQuery={onAskQuestion}
        onOpenDirectChat={onOpenDirectChat}
        onOpenGuided={onOpenGuided}
      />

      {/* 3. Official National Statistics Bar & Main Gateways */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
