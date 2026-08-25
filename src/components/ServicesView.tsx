import React, { useState } from 'react';
import {
  ExternalLink,
  Shield,
  FileCheck,
  Clock,
  Users,
  Search,
  MessageSquareQuote
} from 'lucide-react';
import { Language, ServiceItem } from '../types';
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

  const filteredServices = VERIFIED_SERVICES.filter(service => {
    const title = (service.title[language] || service.title.en).toLowerCase();
    const desc = (service.shortDescription[language] || service.shortDescription.en).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div id="services-view" className="py-12 bg-slate-50 min-h-[calc(100vh-65px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Heading banner */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-3 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>Public Service Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.servicesHeading}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {t.servicesSubheading}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search public services & portals..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 shadow-sm"
          />
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      {service.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Target Users */}
                  <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-1.5 border border-slate-100">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.targetUsersLabel}:</span>
                    </div>
                    <p className="text-slate-600 pl-5">{target}</p>

                    {/* Timeline if available */}
                    {timeline && (
                      <div className="pt-1.5 border-t border-slate-200/60 mt-1.5">
                        <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t.timelineLabel}:</span>
                        </div>
                        <p className="text-slate-600 pl-5">{timeline}</p>
                      </div>
                    )}
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                      <span>{t.requiredDocsLabel}:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {docs.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <span className="text-slate-500 font-bold">•</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                  <a
                    href={service.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    <span>{t.applyPortalBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => onAskAboutService(title)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
                    title="Ask AI Assistant about this service"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>Ask AI</span>
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
