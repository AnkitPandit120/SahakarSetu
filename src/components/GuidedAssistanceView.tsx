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
  HelpCircle
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
        return <Scale className="w-5 h-5 text-slate-800" />;
      case 'IndianRupee':
        return <IndianRupee className="w-5 h-5 text-slate-800" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-slate-800" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-slate-800" />;
      case 'Warehouse':
        return <Warehouse className="w-5 h-5 text-slate-800" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-slate-800" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-slate-800" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-800" />;
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategoryId(prev => (prev === id ? null : id));
  };

  return (
    <div id="guided-assistance-view" className="py-12 bg-slate-50 min-h-[calc(100vh-65px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-3 shadow-2xs">
            <span>Structured Knowledge Navigator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.guidedHeading}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {t.guidedSubheading}
          </p>
        </div>

        {/* Categories List / Grid */}
        <div className="space-y-4">
          {CATEGORIES.map((category, index) => {
            const isExpanded = expandedCategoryId === category.id;
            const categoryName = category.name[language] || category.name.en;
            const categoryDesc = category.description[language] || category.description.en;
            const categoryExamples = category.examples[language] || category.examples.en;

            return (
              <div
                key={category.id}
                id={`guided-category-card-${category.id}`}
                className={`bg-white border rounded-2xl transition-all shadow-xs ${
                  isExpanded ? 'border-slate-400 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="p-6 flex items-start sm:items-center justify-between cursor-pointer gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {getIcon(category.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">0{index + 1}</span>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                          {categoryName}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        {categoryDesc}
                      </p>

                      {/* Examples Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {categoryExamples.map((ex, exIdx) => (
                          <span
                            key={exIdx}
                            className="inline-block text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg shrink-0"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Subtopics Expansion */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Select a focused statutory topic:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {category.topics.map((topic) => {
                        const topicTitle = topic.title[language] || topic.title.en;
                        const topicDesc = topic.description[language] || topic.description.en;

                        return (
                          <div
                            key={topic.id}
                            id={`guided-topic-${topic.id}`}
                            onClick={() => onSelectTopic(topic, category)}
                            className="p-5 bg-white border border-slate-200 hover:border-slate-400 rounded-xl cursor-pointer transition-all hover:shadow-sm group flex flex-col justify-between"
                          >
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition-colors mb-1.5">
                                {topicTitle}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {topicDesc}
                              </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-900 pt-3 border-t border-slate-100">
                              <span>Ask AI Guide</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
