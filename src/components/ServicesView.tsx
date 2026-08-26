import React, { useState } from 'react';
import {
  ExternalLink,
  Shield,
  FileCheck,
  Clock,
  Users,
  Search,
  MessageSquare,
  Landmark,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { VERIFIED_SERVICES } from '../data/schemesAndServices';
import { TRANSLATIONS } from '../data/translations';

interface ServicesViewProps {
  language: Language;
  onAskAboutService: (serviceTitle: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  language,
  onAskAboutService
}) => {
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'PACS Modernization', 'Multi-State Governance', 'Financial Credit & KCC', 'Dispute & Grievances'];

  const filteredServices = VERIFIED_SERVICES.filter(service => {
    const title = (service.title[language] || service.title.en).toLowerCase();
    const desc = (service.shortDescription[language] || service.shortDescription.en).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery = title.includes(q) || desc.includes(q);
    const matchesCat = activeCategory === 'all' || service.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    return matchesQuery && matchesCat;
  });

  return (
    <div id="services-view" className="py-10 bg-[#f8fafc] min-h-[calc(100vh-65px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Official Header Banner */}
        <div className="mb-8 bg-white border border-slate-300 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#0B3B60] text-xs font-bold mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सहकारिता मंत्रालय नागरिक सेवा निर्देशिका' : 'Ministry of Cooperation Public Service Directory'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.servicesHeading}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {t.servicesSubheading}
            </p>
          </div>

          <div className="bg-[#0B3B60] text-white p-3 rounded-lg text-xs shrink-0 text-center">
            <div className="font-bold text-amber-300">National Service SLA</div>
            <div className="text-[11px] text-slate-200">Standardized Timeframes</div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0B3B60] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? (language === 'hi' ? 'सभी सेवाएं (All)' : 'All Services') : cat}
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
              placeholder={language === 'hi' ? 'सेवा का नाम खोजें...' : 'Search services & portals...'}
              className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-[#0B3B60] focus:border-[#0B3B60]"
            />
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredServices.map((service) => {
            const title = service.title[language] || service.title.en;
            const desc = service.shortDescription[language] || service.shortDescription.en;
            const target = service.targetUsers[language] || service.targetUsers.en;
            const docs = service.requiredDocuments[language] || service.requiredDocuments.en;
            const timeline = service.timeline ? (service.timeline[language] || service.timeline.en) : null;

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="bg-white border border-slate-300 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#0B3B60] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B3B60] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {service.category}
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Govt Verified</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Target Users & SLA Timeline */}
                  <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1 border border-slate-200">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0B3B60]" />
                      <span>{t.targetUsersLabel}:</span>
                      <span className="font-normal text-slate-600">{target}</span>
                    </div>

                    {timeline && (
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 pt-1 border-t border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-[#0B3B60]" />
                        <span>{t.timelineLabel}:</span>
                        <span className="font-bold text-emerald-700">{timeline}</span>
                      </div>
                    )}
                  </div>

                  {/* Required Documents Checklist */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1">
                      <FileCheck className="w-3.5 h-3.5 text-[#0B3B60]" />
                      <span>{t.requiredDocsLabel}:</span>
                    </h4>
                    <ul className="space-y-0.5 text-xs text-slate-600 pl-4 list-disc">
                      {docs.map((doc, dIdx) => (
                        <li key={dIdx}>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="mt-5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                  <a
                    href={service.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0B3B60] hover:bg-[#07253d] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                  >
                    <span>{t.applyPortalBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onAskAboutService(title)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    <span>{language === 'hi' ? 'एआई गाइड से पूछें' : 'Ask AI Guide'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
