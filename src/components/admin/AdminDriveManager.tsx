import React, { useState } from 'react';
import {
  HardDrive,
  RefreshCw,
  Sliders,
  FolderTree,
  FileText,
  Search,
  CheckCircle2,
  ExternalLink,
  Layers,
  Database,
  Tag,
  Clock,
  Sparkles,
  CloudCheck,
  AlertCircle
} from 'lucide-react';

interface AdminDriveManagerProps {
  language: 'en' | 'hi';
  driveStats: any;
  indexedDocs: any[];
  isSyncingDrive: boolean;
  driveSyncReport: string | null;
  isConfiguringFolder: boolean;
  setIsConfiguringFolder: (val: boolean) => void;
  inputFolderId: string;
  setInputFolderId: (val: string) => void;
  isSavingFolder: boolean;
  onTriggerDriveSync: () => void;
  onConnectGoogleDrive?: () => void;
  onSaveFolderConfiguration: () => void;
}

export const AdminDriveManager: React.FC<AdminDriveManagerProps> = ({
  language,
  driveStats,
  indexedDocs,
  isSyncingDrive,
  driveSyncReport,
  isConfiguringFolder,
  setIsConfiguringFolder,
  inputFolderId,
  setInputFolderId,
  isSavingFolder,
  onTriggerDriveSync,
  onConnectGoogleDrive,
  onSaveFolderConfiguration
}) => {
  const isHi = language === 'hi';
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'all' | 'drive' | 'seed'>('all');

  const categories = Array.from(
    new Set(indexedDocs.map(d => d.category || 'Statutory Act'))
  );

  const driveDocsCount = indexedDocs.filter(d => !d.fileId?.startsWith('drive-') && !d.fileId?.startsWith('seed-')).length;
  const seedDocsCount = indexedDocs.filter(d => d.fileId?.startsWith('drive-') || d.fileId?.startsWith('seed-')).length;

  const filteredDocs = indexedDocs.filter(doc => {
    const isSeed = doc.fileId?.startsWith('drive-') || doc.fileId?.startsWith('seed-');
    if (selectedSourceFilter === 'drive' && isSeed) return false;
    if (selectedSourceFilter === 'seed' && !isSeed) return false;

    const title = (doc.fileName || doc.title || '').toLowerCase();
    const cat = (doc.category || 'Statutory Act').toLowerCase();
    const matchesSearch = !docSearchQuery || title.includes(docSearchQuery.toLowerCase()) || cat.includes(docSearchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || (doc.category || 'Statutory Act') === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Status in Executive White Card */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {isHi ? 'गूगल ड्राइव वैधानिक ज्ञानकोष सिंक' : 'Google Drive Statutory Knowledge Engine'}
                </h3>
                {driveDocsCount > 0 ? (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                    {isHi ? 'ड्राइव सक्रिय' : 'Drive Active'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                    {isHi ? 'OAuth प्रमाणीकरण उपलब्ध' : 'OAuth Ready'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'सभी वैधानिक अधिनियम, मॉडल उप-नियम और नीतियां सीधे मंत्रालय के सुरक्षित Google Drive फ़ोल्डर से अनुक्रमित होती हैं।'
                  : 'All statutory acts, model bye-laws, and circulars are indexed directly from the Ministry\'s designated Google Drive folder.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onConnectGoogleDrive && (
              <button
                type="button"
                onClick={onConnectGoogleDrive}
                disabled={isSyncingDrive}
                className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Connect Google Drive with 1-click OAuth"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? 'गूगल ड्राइव कनेक्ट करें' : 'Connect Google Drive'}</span>
              </button>
            )}

            <button
              onClick={onTriggerDriveSync}
              disabled={isSyncingDrive}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingDrive ? 'animate-spin' : ''}`} />
              <span>{isSyncingDrive ? (isHi ? 'सिंक हो रहा है...' : 'Syncing Drive Knowledge...') : (isHi ? 'अभी ड्राइव सिंक करें' : 'Sync Drive Knowledge Now')}</span>
            </button>

            <button
              onClick={() => setIsConfiguringFolder(!isConfiguringFolder)}
              className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>{isHi ? 'फ़ोल्डर सेटिंग्स' : 'Folder Settings'}</span>
            </button>
          </div>
        </div>

        {/* Sync Report Banner */}
        {driveSyncReport && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{driveSyncReport}</span>
          </div>
        )}

        {/* Folder Configuration Accordion */}
        {isConfiguringFolder && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'गूगल ड्राइव फ़ोल्डर ID कॉन्फ़िगर करें' : 'Configure Google Drive Target Folder ID'}</span>
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputFolderId}
                onChange={e => setInputFolderId(e.target.value)}
                placeholder="e.g. 1a2B3c4D5e6F7g8H9..."
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
              <button
                onClick={onSaveFolderConfiguration}
                disabled={isSavingFolder}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50"
              >
                {isSavingFolder ? (isHi ? 'सहेज रहे हैं...' : 'Saving...') : (isHi ? 'सहेजें' : 'Save Folder ID')}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {isHi
                ? 'Google Drive में अपने ज्ञानकोष फ़ोल्डर का URL खोलें और URL के अंत में दिए गए Folder ID को यहां पेस्ट करें।'
                : 'Open your knowledge base folder in Google Drive and paste the Folder ID from the URL string.'}
            </p>
          </div>
        )}
      </div>

      {/* Currently Indexed Documents Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-slate-900">
              {isHi ? 'वर्तमान अनुक्रमित वैधानिक दस्तावेज़' : 'Currently Indexed Statutory Documents'} ({indexedDocs.length})
            </h4>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-200">
              {isHi ? 'सक्रिय वेक्टर डेटाबेस' : 'Active Vector DB'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Source Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedSourceFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSourceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'सभी' : 'All'} ({indexedDocs.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedSourceFilter('drive')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedSourceFilter === 'drive' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{isHi ? 'ड्राइव' : 'Drive'}</span>
                <span className="text-[10px] opacity-75">({driveDocsCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSourceFilter('seed')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedSourceFilter === 'seed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{isHi ? 'आधारभूत' : 'Baseline'}</span>
                <span className="text-[10px] opacity-75">({seedDocsCount})</span>
              </button>
            </div>

            {/* Search Docs */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={docSearchQuery}
                onChange={e => setDocSearchQuery(e.target.value)}
                placeholder={isHi ? 'दस्तावेज़ खोजें...' : 'Search documents...'}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 w-44"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">{isHi ? 'सभी श्रेणियां' : 'All Categories'}</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredDocs.map((doc, idx) => {
            const isSeed = doc.fileId?.startsWith('drive-') || doc.fileId?.startsWith('seed-');
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs hover:border-slate-300 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                    <span className="truncate">{doc.fileName || doc.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-slate-700">{doc.category || 'Statutory Act'}</span>
                    </div>
                    {isSeed ? (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{isHi ? 'वैधानिक आधारभूत' : 'Statutory Seed'}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                        <HardDrive className="w-2.5 h-2.5" />
                        <span>{isHi ? 'गूगल ड्राइव फ़ाइल' : 'Google Drive File'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-medium text-slate-600">{doc.chunkCount || 12} {isHi ? 'वेक्टर चंक्स' : 'chunks'}</span>
                    <span>•</span>
                    <span>{isHi ? 'संशोधित:' : 'Modified:'} {doc.modifiedTime ? new Date(doc.modifiedTime).toLocaleDateString() : (isHi ? 'हाल ही में' : 'Recent')}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
                    {isHi ? 'अनुक्रमित' : 'Indexed'}
                  </span>
                  {(doc.driveUrl || doc.officialUrl) && (
                    <a
                      href={doc.driveUrl || doc.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 mt-1"
                      title="View Document"
                    >
                      <span>{isHi ? 'खोलें' : 'View'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
