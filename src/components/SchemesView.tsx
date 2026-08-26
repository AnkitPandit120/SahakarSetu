import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Gift,
  FileText,
  ExternalLink,
  MessageSquare,
  Building,
  Landmark,
  BadgePercent
} from 'lucide-react';
import { Language, SchemeItem } from '../types';
import { VERIFIED_SCHEMES } from '../data/schemesAndServices';
import { TRANSLATIONS } from '../data/translations';

interface SchemesViewProps {
  language: Language;
  onAskAboutScheme: (schemeName: string) => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({
  language,
  onAskAboutScheme
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'Agriculture', 'Cooperative', 'Finance', 'Insurance', 'Rural Development'];

  const filteredSchemes = VERIFIED_SCHEMES.filter((scheme) => {
    const matchesCat = selectedCategory === 'all' || scheme.category === selectedCategory;
    const name = (scheme.name[language] || scheme.name.en).toLowerCase();
    const desc = (scheme.shortDescription[language] || scheme.shortDescription.en).toLowerCase();
    const ministry = (scheme.ministry[language] || scheme.ministry.en).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || desc.includes(q) || ministry.includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div id="schemes-view" className="py-10 bg-[#f8fafc] min-h-[calc(100vh-65px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Official Header Banner */}
        <div className="mb-8 bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'केंद्रीय एवं राज्य कल्याणकारी योजनाएं' : 'Central & State Sponsored Welfare Schemes'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.schemesHeading}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {t.schemesSubheading}
            </p>
          </div>

          <div className="bg-[#0B3B60] text-white p-3 rounded-lg text-xs shrink-0 text-center">
            <div className="font-bold text-amber-300">Centrally Sponsored (CSS)</div>
            <div className="text-[11px] text-slate-200">DBT & Interest Subvention</div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`scheme-filter-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B3B60] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? (language === 'hi' ? 'सभी योजनाएं (All)' : t.filterAll) : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'योजना या मंत्रालय खोजें...' : 'Search schemes or ministry...'}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60]"
            />
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-5">
          {filteredSchemes.map((scheme) => {
            const name = scheme.name[language] || scheme.name.en;
            const ministry = scheme.ministry[language] || scheme.ministry.en;
            const desc = scheme.shortDescription[language] || scheme.shortDescription.en;
            const eligibility = scheme.eligibility[language] || scheme.eligibility.en;
            const benefits = scheme.benefits[language] || scheme.benefits.en;
            const docs = scheme.requiredDocuments[language] || scheme.requiredDocuments.en;

            return (
              <div
                key={scheme.id}
                id={`scheme-card-${scheme.id}`}
                className="bg-white border border-slate-300 rounded-xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#0B3B60] transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3B60] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {scheme.category}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">
                        {ministry}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
                      {name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAskAboutScheme(name)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B3B60] hover:bg-[#07253d] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'एआई से पूछें' : 'Ask AI Guide'}</span>
                    </button>
                  </div>
                </div>

                {/* Grid of Eligibility, Benefits & Docs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Eligibility */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.eligibilityLabel}</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {eligibility}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#0B3B60]" />
                      <span>{t.benefitsLabel}</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {benefits}
                    </p>
                  </div>

                  {/* Required Documents */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-700" />
                      <span>{t.requiredDocsLabel}</span>
                    </h4>
                    <ul className="space-y-0.5 text-slate-600 text-[11px] pl-4 list-disc">
                      {docs.map((doc, dIdx) => (
                        <li key={dIdx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Portal Link */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0B3B60] hover:text-[#07253d] inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span>{language === 'hi' ? 'आधिकारिक सरकारी योजना पोर्टल खोलें' : 'Open Official Scheme Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
