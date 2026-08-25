import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Gift,
  FileText,
  ExternalLink,
  MessageSquare,
  Building
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
    <div id="schemes-view" className="py-12 bg-slate-50 min-h-[calc(100vh-65px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Title */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-3 shadow-2xs">
            <Building className="w-3.5 h-3.5 text-slate-700" />
            <span>Central & State Welfare Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.schemesHeading}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {t.schemesSubheading}
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`scheme-filter-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? t.filterAll : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes or ministry..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-6">
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
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                        {scheme.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {ministry}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onAskAboutScheme(name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask AI Guide</span>
                    </button>
                  </div>
                </div>

                {/* Grid of Eligibility, Benefits & Docs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Eligibility */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
                      <span>Key Eligibility Criteria</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {eligibility.map((el, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-slate-400">•</span>
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-slate-700" />
                      <span>Key Scheme Benefits</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {benefits.map((ben, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-slate-700">•</span>
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-700" />
                      <span>Required Documents</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-600">
                      {docs.map((doc, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold text-slate-400">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer link to official portal */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Official Portal: <strong>{scheme.officialSource}</strong></span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-700 font-semibold underline"
                  >
                    <span>Visit Official Portal</span>
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
