import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Scale,
  Landmark,
  Building2,
  Users
} from 'lucide-react';
import { Language } from '../types';
import { VERIFIED_KNOWLEDGE_DOCUMENTS } from '../data/knowledgeBase';
import { TRANSLATIONS } from '../data/translations';

interface AboutViewProps {
  language: Language;
  onOpenKnowledgeDoc: (title: string, section?: string, url?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  language,
  onOpenKnowledgeDoc
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div id="about-view" className="py-10 bg-[#f8fafc] min-h-[calc(100vh-65px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Official Ministry Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0B3B60] text-xs font-bold mb-3 shadow-2xs">
            <Landmark className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सहकारिता मंत्रालय, भारत सरकार' : 'Ministry of Cooperation, Government of India'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.aboutHeading}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            National Legal & Governance Knowledge Mandate under "सहकार से समृद्धि" (Prosperity through Cooperation)
          </p>
        </div>

        {/* Section 1: Official Portal Mandate */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0B3B60]" />
            <span>{t.aboutWhatIsThis}</span>
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            {t.aboutWhatIsThisText}
          </p>
        </div>

        {/* Section 2: How does the Statutory Grounding Engine work? */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>{t.aboutHowItWorks}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {t.aboutHowItWorksSteps.map((step, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Verified Statutory Knowledge Repositories */}
        <div className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#0B3B60]" />
              <span>Verified Statutory Gazette & Acts Repository</span>
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              100% Authentic
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Every AI consultation is grounded strictly on Gazette of India notifications, official parliament acts, and model circulars:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {VERIFIED_KNOWLEDGE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {doc.title}
                  </div>
                  <div className="text-[11px] text-[#0B3B60] font-semibold mt-0.5">
                    {doc.authority} • {doc.yearOrVersion}
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenKnowledgeDoc(doc.title, undefined, doc.officialUrl)}
                    className="text-xs font-bold text-[#0B3B60] hover:underline"
                  >
                    View Official Text
                  </button>
                  <a
                    href={doc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-800"
                    title="Open official site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Statutory Legal Disclaimer */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 sm:p-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-800" />
            <span>{t.aboutSafetyHeading}</span>
          </h2>
          <p className="text-xs text-amber-950 leading-relaxed">
            {t.aboutSafetyText}
          </p>
          <p className="text-[11px] text-amber-900/90 pt-1.5 border-t border-amber-200">
            For formal dispute petitions and arbitrations under Section 84 of the MSCS Act, citizens should approach the Central Registrar of Cooperative Societies (CRCS) or District Cooperative Courts.
          </p>
        </div>
      </div>
    </div>
  );
};
