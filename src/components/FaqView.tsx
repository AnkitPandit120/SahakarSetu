import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Building2,
  Scale,
  Vote,
  ShieldAlert,
  Bot,
  Filter,
  PhoneCall,
  ArrowRight,
  BookOpen,
  FileCheck,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { FAQS_DATA, FAQ_CATEGORIES, FaqItem, FaqCategory } from '../data/faqs';

interface FaqViewProps {
  language: Language;
  onAskAi: (question: string) => void;
  onOpenKnowledgeDoc?: (title: string, section?: string, url?: string) => void;
  onNavigateToTab?: (tab: 'chat' | 'guided' | 'services' | 'schemes') => void;
}

export const FaqView: React.FC<FaqViewProps> = ({
  language,
  onAskAi,
  onOpenKnowledgeDoc,
  onNavigateToTab
}) => {
  const isHi = language === 'hi';
  const isMr = language === 'mr';
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set([FAQS_DATA[0]?.id || ''])
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  // Dynamic Category Icons Map
  const getCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Vote':
        return <Vote className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Toggle Single Accordion
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand / Collapse All
  const handleExpandAll = () => {
    setExpandedIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Copy Question & Answer to Clipboard
  const handleCopyFaq = (faq: FaqItem) => {
    const q = faq.question[language] || faq.question.en;
    const a = faq.answer[language] || faq.answer.en;
    const ref = faq.statutoryReference
      ? `\n\n[Statutory Source: ${faq.statutoryReference.actOrPolicy}, ${faq.statutoryReference.sectionOrClause}]`
      : '';
    const textToCopy = `Q: ${q}\n\nA: ${a}${ref}\n\nVia Sahakar Setu - Ministry of Cooperation Portal`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(faq.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // User Helpful / Unhelpful reaction
  const handleFeedback = (id: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackState(prev => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type
    }));
  };

  // Filtered FAQs based on Category and Search Query
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter(faq => {
      // Category filter
      if (selectedCategory !== 'all' && faq.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const qText = (faq.question[language] || faq.question.en || '').toLowerCase();
      const aText = (faq.answer[language] || faq.answer.en || '').toLowerCase();
      const tags = (faq.tags || []).join(' ').toLowerCase();
      const refText = faq.statutoryReference
        ? `${faq.statutoryReference.actOrPolicy} ${faq.statutoryReference.sectionOrClause}`.toLowerCase()
        : '';

      return (
        qText.includes(q) ||
        aText.includes(q) ||
        tags.includes(q) ||
        refText.includes(q)
      );
    });
  }, [selectedCategory, searchQuery, language]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FAQS_DATA.length };
    FAQS_DATA.forEach(faq => {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div id="faq-section" className="bg-[#f8fafc] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* 1. Page Header & National Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-xs font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {isHi
                    ? 'अक्सर पूछे जाने वाले प्रश्न एवं वैधानिक समाधान'
                    : isMr
                    ? 'वारंवार विचारले जाणारे प्रश्न आणि उत्तरे'
                    : isBn
                    ? 'সাধারণ জিজ্ঞাসা ও আইনি সমাধান'
                    : 'Frequently Asked Questions & Statutory Guidance'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B3B60] tracking-tight">
                {isHi
                  ? 'सहकारिता प्रश्नोत्तरी एवं सहायता केंद्र'
                  : isMr
                  ? 'सहकारी प्रश्नोत्तरे आणि मदत केंद्र'
                  : isBn
                  ? 'সমবায় প্রশ্নোত্তর ও সহায়তা কেন্দ্র'
                  : 'Cooperative FAQ & Citizen Assistance Desk'}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {isHi
                  ? 'प्राथमिक कृषि साख समितियों (PACS), बहु-राज्य सहकारी अधिनियम, केंद्रीय योजनाओं, अनाज भंडारण और विवाद समाधान पर प्रामाणिक उत्तर एवं नियम देखें।'
                  : isMr
                  ? 'पॅक्स (PACS), बहुराज्य सहकारी कायदा, शासकीय योजना, धान्य साठवणूक आणि तक्रार निवारणाबाबत खात्रीशीर कायदेशीर उत्तरे येथे मिळतील.'
                  : isBn
                  ? 'প্যাকস (PACS), মাল্টি-স্টেট সমবায় আইন, সরকারি প্রকল্প ও বিরোধ নিষ্পত্তির নির্ভরযোগ্য উত্তর জানুন।'
                  : 'Verified statutory answers and official guidance on PACS Model Bye-Laws, MSCS Act 2023, Central Grain Storage Plan, and grievance redressal.'}
              </p>
            </div>

            {/* Quick Action to AI Sahayak */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onAskAi(isHi ? 'पैक्स के मॉडल उप-नियमों के मुख्य बिंदु क्या हैं?' : 'What are the main provisions of PACS Model Bye-Laws?')}
                className="px-4 py-3 bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'एआई सहकार मित्र से पूछें' : 'Ask AI Sahayak'}</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                id="faq-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isHi
                    ? 'प्रश्न खोजें (उदा: मॉडल उप-नियम, धारा 84, सीएससी, अनाज गोदाम, चुनाव आरक्षण)...'
                    : isMr
                    ? 'प्रश्न शोधा (उदा: मॉडेल पोटनियम, कलम ८४, सीएससी, धान्य साठवणूक, निवडणूक)...'
                    : isBn
                    ? 'প্রশ্ন খুঁজুন (যেমন: মডেল উপ-আইন, ধারা ৮৪, সিএসসি, নির্বাচন)...'
                    : 'Search FAQs by keywords (e.g., Model Bye-Laws, Section 84, Grain Storage, CSC, Elections)...'
                }
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0B3B60] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                  title="Clear search"
                >
                  <span className="text-xs font-bold font-mono">✕</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Category Filters & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            {FAQ_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  id={`faq-cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0B3B60] text-white border-[#0B3B60] shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {getCategoryIcon(cat.iconName, isSelected ? 'w-3.5 h-3.5 text-amber-300' : 'w-3.5 h-3.5 text-slate-500')}
                  <span>{cat.label[language] || cat.label.en}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/20 text-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expand/Collapse All Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-auto shrink-0 text-xs">
            <span className="text-slate-500 font-medium">
              {isHi
                ? `${filteredFaqs.length} प्रश्न उपलब्ध`
                : `${filteredFaqs.length} questions found`}
            </span>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1 text-slate-700 hover:text-[#0B3B60] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isHi ? 'सभी खोलें' : 'Expand All'}
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1 text-slate-700 hover:text-[#0B3B60] font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isHi ? 'सभी बंद करें' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* 3. FAQ List Accordion */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700">
              <Search className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'कोई प्रश्न नहीं मिला' : 'No matching questions found'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi
                  ? `"${searchQuery}" के लिए कोई पूर्वनिर्धारित प्रश्न नहीं मिला। आप इसे सीधे एआई सहकार मित्र से पूछ सकते हैं।`
                  : `We couldn't find a FAQ for "${searchQuery}". Ask our verified AI Sahayak directly!`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAskAi(searchQuery)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? `"${searchQuery}" पर एआई से पूछें` : `Ask AI Sahayak: "${searchQuery}"`}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIds.has(faq.id);
              const question = faq.question[language] || faq.question.en;
              const answer = faq.answer[language] || faq.answer.en;
              const keyPoints = faq.keyPoints ? (faq.keyPoints[language] || faq.keyPoints.en || []) : [];
              const isCopied = copiedId === faq.id;
              const currentFeedback = feedbackState[faq.id];

              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#0B3B60]/30 shadow-md ring-1 ring-[#0B3B60]/10'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* FAQ Header / Question Banner */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/70 transition-colors"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        Q{index + 1}
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {question}
                        </h2>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                          {faq.statutoryReference && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1">
                              <FileCheck className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{faq.statutoryReference.actOrPolicy}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl border transition-transform duration-200 shrink-0 ${
                        isExpanded
                          ? 'bg-[#0B3B60] text-white border-[#0B3B60] rotate-180'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* FAQ Body / Answer Content */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-4">
                      {/* Answer Text */}
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-4">
                        {answer}
                      </p>

                      {/* Key Points Checklist */}
                      {keyPoints.length > 0 && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#0B3B60]" />
                            <span>{isHi ? 'मुख्य वैधानिक बिंदु' : 'Key Statutory Provisions'}</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            {keyPoints.map((pt, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#138808] font-bold mt-0.5">✓</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Statutory Citation Card */}
                      {faq.statutoryReference && (
                        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-amber-950">
                            <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                            <div>
                              <span className="font-bold">{faq.statutoryReference.actOrPolicy}</span>
                              <span className="text-slate-400 mx-1.5">•</span>
                              <span className="text-slate-700">{faq.statutoryReference.sectionOrClause}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {onOpenKnowledgeDoc && (
                              <button
                                type="button"
                                onClick={() =>
                                  onOpenKnowledgeDoc(
                                    faq.statutoryReference!.actOrPolicy,
                                    faq.statutoryReference!.sectionOrClause,
                                    faq.statutoryReference!.officialUrl
                                  )
                                }
                                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{isHi ? 'दस्तावेज़ देखें' : 'View Document'}</span>
                              </button>
                            )}
                            <a
                              href={faq.statutoryReference.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1"
                            >
                              <span>{isHi ? 'आधिकारिक स्रोत' : 'Official Source'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Bottom Interactive Toolbar: Ask AI, Copy, Helpful Feedback */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                        {/* Ask AI Sahayak Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const prompt = faq.aiPrompt[language] || faq.aiPrompt.en || question;
                            onAskAi(prompt);
                          }}
                          className="px-3.5 py-2 bg-[#0B3B60] hover:bg-[#07253d] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>
                            {isHi
                              ? 'एआई सहकार मित्र से इस पर अधिक चर्चा करें'
                              : 'Ask AI Sahayak for Step-by-Step Help'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* Secondary Actions: Copy & Feedback */}
                        <div className="flex items-center gap-2 ml-auto">
                          {/* Copy */}
                          <button
                            type="button"
                            onClick={() => handleCopyFaq(faq)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Copy Question & Answer"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">{isHi ? 'कॉपी हो गया' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>{isHi ? 'कॉपी' : 'Copy'}</span>
                              </>
                            )}
                          </button>

                          {/* Thumbs Feedback */}
                          <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 text-xs">
                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'helpful')}
                              className={`p-1.5 rounded transition-colors ${
                                currentFeedback === 'helpful'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'
                              }`}
                              title="Helpful answer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'unhelpful')}
                              className={`p-1.5 rounded transition-colors ${
                                currentFeedback === 'unhelpful'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'text-slate-500 hover:text-rose-700 hover:bg-slate-100'
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Still Need Help? Quick Action Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B3B60] to-[#07253d] rounded-2xl p-6 sm:p-8 text-white shadow-md border border-[#1a517f]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHi ? 'सीधी सहायता उपलब्ध' : 'Direct Assistance Available'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isHi
                  ? 'क्या आपको अपना विशिष्ट प्रश्न नहीं मिला?'
                  : 'Didn’t find the specific answer you were looking for?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {isHi
                  ? 'हमारे एआई सहकार मित्र से अपनी भाषा में कोई भी प्रश्न पूछें, या राष्ट्रीय किसान एवं सहकारिता हेल्पलाइनों पर सीधे संपर्क करें।'
                  : 'Ask AI Sahayak in plain language for instant verified statutory guidance, or connect directly with official national helplines.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onAskAi(isHi ? 'नमस्ते, मुझे सहकारिता योजनाओं के बारे में जानकारी चाहिए।' : 'Hello, I need guidance on cooperative sector schemes and services.')}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span>{isHi ? 'सहकार मित्र से चैट करें' : 'Open AI Chat'}</span>
              </button>

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('guided')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>{isHi ? 'मार्गदर्शित विषय देखें' : 'Guided Navigator'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
