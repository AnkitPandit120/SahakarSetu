import React, { useState } from 'react';
import {
  Scale,
  IndianRupee,
  Building2,
  ShieldCheck,
  Warehouse,
  FileText,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Landmark
} from 'lucide-react';
import { CategoryItem, Language, TopicItem } from '../types';
import { CATEGORIES } from '../data/categories';
import { TRANSLATIONS } from '../data/translations';

interface GuidedAssistanceViewProps {
  language: Language;
  onSelectTopic: (topic: TopicItem, category: CategoryItem) => void;
  onDirectQuestion: (question: string) => void;
}

export const GuidedAssistanceView: React.FC<GuidedAssistanceViewProps> = ({
  language,
  onSelectTopic,
  onDirectQuestion
}) => {
  const t = TRANSLATIONS[language];
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(CATEGORIES[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-[#0B3B60]" />;
      case 'IndianRupee':
        return <IndianRupee className="w-5 h-5 text-[#0B3B60]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#0B3B60]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#0B3B60]" />;
      case 'Warehouse':
        return <Warehouse className="w-5 h-5 text-[#0B3B60]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#0B3B60]" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-[#0B3B60]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[#0B3B60]" />;
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategoryId(prev => (prev === id ? null : id));
  };

  return (
    <div id="guided-assistance-view" className="py-10 bg-[#f8fafc] min-h-[calc(100vh-65px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Official Header Banner */}
        <div className="mb-8 bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#0B3B60] text-xs font-bold mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सहकारी वैधानिक विषयवार संकलन' : 'Categorized Statutory Subject Catalog'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.guidedHeading}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {t.guidedSubheading}
            </p>
          </div>

          <div className="bg-[#0B3B60] text-white p-3 rounded-lg text-xs shrink-0 text-center">
            <div className="font-bold text-amber-300">7 Core Categories</div>
            <div className="text-[11px] text-slate-200">Official Bye-Laws & Acts</div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3.5">
          {CATEGORIES.map((category) => {
            const isExpanded = expandedCategoryId === category.id;
            const categoryName = category.name[language] || category.name.en;
            const categoryDesc = category.description[language] || category.description.en;
            const categoryExamples = category.examples[language] || category.examples.en;

            return (
              <div
                key={category.id}
                id={`guided-category-card-${category.id}`}
                className={`bg-white border rounded-xl transition-all shadow-2xs ${
                  isExpanded ? 'border-[#0B3B60] shadow-xs' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="p-5 flex items-start sm:items-center justify-between cursor-pointer gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                      {getIcon(category.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {categoryName}
                        </h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {category.topics.length} {language === 'hi' ? 'विषय' : 'Topics'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {categoryDesc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    aria-label="Toggle category topics"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[#0B3B60]" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Topics List */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3">
                    <div className="text-[11px] font-bold text-[#0B3B60] uppercase tracking-wider">
                      {language === 'hi' ? 'विशिष्ट वैधानिक विषय चुनें:' : 'Select Specific Statutory Topic:'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {category.topics.map((topic) => {
                        const topicTitle = topic.title[language] || topic.title.en;
                        const topicDesc = topic.description[language] || topic.description.en;

                        return (
                          <div
                            key={topic.id}
                            id={`guided-topic-${topic.id}`}
                            onClick={() => onSelectTopic(topic, category)}
                            className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg cursor-pointer transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0B3B60]">
                                {topicTitle}
                              </h4>
                              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                {topicDesc}
                              </p>
                            </div>
                            <div className="mt-2 pt-1.5 flex items-center justify-end text-[11px] font-bold text-[#0B3B60]">
                              <span>{language === 'hi' ? 'विस्तार से समझें' : 'Get Legal Answer'}</span>
                              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Common Query Examples */}
                    {categoryExamples && categoryExamples.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-600 mr-2">
                          {language === 'hi' ? 'सामान्य प्रश्न:' : 'Common Inquiries:'}
                        </span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {categoryExamples.map((ex, exIdx) => (
                            <button
                              key={exIdx}
                              type="button"
                              onClick={() => onDirectQuestion(ex)}
                              className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                            >
                              "{ex}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
