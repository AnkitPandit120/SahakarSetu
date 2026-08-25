import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Scale
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
    <div id="about-view" className="py-12 bg-slate-50 min-h-[calc(100vh-65px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-3 shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>Public Service Information Mandate</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.aboutHeading}
          </h1>
        </div>

        {/* Section 1: What is this platform? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-800" />
            <span>{t.aboutWhatIsThis}</span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {t.aboutWhatIsThisText}
          </p>
        </div>

        {/* Section 2: How does it work? */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-800" />
            <span>{t.aboutHowItWorks}</span>
          </h2>
          <div className="space-y-3">
            {t.aboutHowItWorksSteps.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Verified Statutory Knowledge Base Repository */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-800" />
            <span>Verified Grounding Knowledge Repositories</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our system searches and grounds all responses against authentic government circulars, statutory acts, and official operational guidelines:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {VERIFIED_KNOWLEDGE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {doc.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {doc.authority} • {doc.yearOrVersion}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => onOpenKnowledgeDoc(doc.title, undefined, doc.officialUrl)}
                    className="text-xs font-semibold text-slate-900 hover:text-slate-700 underline"
                  >
                    View Details
                  </button>
                  <a
                    href={doc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700"
                    title="Open official site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Safety & Disclaimer Notice */}
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
            <span>{t.aboutSafetyHeading}</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            {t.aboutSafetyText}
          </p>
          <p className="text-xs text-amber-900/80 pt-2 border-t border-amber-200">
            For formal legal representation, please consult a registered advocate, district cooperative registrar, or the District Legal Services Authority (DLSA).
          </p>
        </div>
      </div>
    </div>
  );
};
