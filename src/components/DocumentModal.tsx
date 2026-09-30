import React from 'react';
import { X, FileText, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';
import { VERIFIED_KNOWLEDGE_DOCUMENTS } from '../data/knowledgeBase';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string | null;
  sectionName?: string;
  officialUrl?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  sectionName,
  officialUrl
}) => {
  if (!isOpen || !documentTitle) return null;

  const cleanTitle = documentTitle.toLowerCase().trim();

  // Look up document in verified knowledge base by title, filename, category, or ID
  const matchedDoc = VERIFIED_KNOWLEDGE_DOCUMENTS.find(doc => {
    const docTitle = doc.title.toLowerCase();
    const docId = (doc.id || '').toLowerCase();
    const docFileName = (doc.fileName || '').toLowerCase();

    return (
      docTitle.includes(cleanTitle) ||
      cleanTitle.includes(docTitle) ||
      (docFileName && (docFileName.includes(cleanTitle) || cleanTitle.includes(docFileName))) ||
      (docId && cleanTitle.includes(docId)) ||
      (cleanTitle.includes('traffic') && docId.includes('traffic')) ||
      (cleanTitle.includes('vehicle') && docId.includes('traffic')) ||
      (cleanTitle.includes('motor') && docId.includes('traffic')) ||
      (cleanTitle.includes('land') && docId.includes('land')) ||
      (cleanTitle.includes('svamitva') && docId.includes('land')) ||
      (cleanTitle.includes('mutation') && docId.includes('land')) ||
      (cleanTitle.includes('quick_ref') && docId.includes('laws')) ||
      (cleanTitle.includes('quick reference') && docId.includes('laws')) ||
      (cleanTitle.includes('farmer') && docId.includes('farmer')) ||
      (cleanTitle.includes('pacs') && docId.includes('farmer'))
    );
  }) || VERIFIED_KNOWLEDGE_DOCUMENTS[0];

  const targetUrl = officialUrl || matchedDoc.officialUrl;
  const displayTitle = matchedDoc.title || documentTitle;
  const displayAuthority = matchedDoc.authority || 'Government of India / Statutory Authority';
  const displayYear = matchedDoc.yearOrVersion || '2026 Statutory Registry';
  const displayDesc = matchedDoc.description || 'Official statutory document indexed in the Ministry Google Drive Knowledge Base.';
  const displaySections = matchedDoc.sections || matchedDoc.keySections || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Verified Public Record</span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg leading-snug">
                {displayTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {displayAuthority} • {displayYear}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {sectionName && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900">Referenced Section / Clause:</span>
              <p className="text-slate-700 font-medium mt-0.5">{sectionName}</p>
            </div>
          )}

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">Official Summary & Scope</h4>
            <p className="text-slate-600 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          {displaySections.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Key Statutory Sections Included</h4>
              <div className="space-y-2">
                {displaySections.map((sec, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span>{sec.section}: {sec.title}</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Official government gazette & ministry publication
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Open Official Government Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
