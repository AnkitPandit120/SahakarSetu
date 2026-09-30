import React from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Check,
  RotateCcw,
  Clock,
  Filter,
  Tag,
  AlertCircle
} from 'lucide-react';
import { MissingRagQueryNotification } from '../../types/admin';

interface AdminGapTelemetryProps {
  language: 'en' | 'hi';
  notifications: MissingRagQueryNotification[];
  selectedNotifFilter: 'all' | 'pending' | 'reviewed' | 'resolved';
  setSelectedNotifFilter: (val: 'all' | 'pending' | 'reviewed' | 'resolved') => void;
  searchQueryFilter: string;
  setSearchQueryFilter: (val: string) => void;
  onUpdateStatus: (id: string, newStatus: 'pending' | 'reviewed' | 'resolved') => void;
}

export const AdminGapTelemetry: React.FC<AdminGapTelemetryProps> = ({
  language,
  notifications,
  selectedNotifFilter,
  setSelectedNotifFilter,
  searchQueryFilter,
  setSearchQueryFilter,
  onUpdateStatus
}) => {
  const isHi = language === 'hi';

  const filteredNotifications = notifications.filter(notif => {
    if (selectedNotifFilter !== 'all' && notif.status !== selectedNotifFilter) return false;
    if (searchQueryFilter) {
      const q = searchQueryFilter.toLowerCase();
      return (
        notif.query.toLowerCase().includes(q) ||
        (notif.category && notif.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <div className="space-y-5">
      {/* Header & Controls in clean white card */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'RAG अनुपलब्ध डेटा सूचना केंद्र (Live Gap Telemetry)' : 'RAG Missing Knowledge Live Telemetry'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {isHi
                ? 'जब भी कोई नागरिक ऐसा विषय खोजता है जो स्थानीय RAG ज्ञानकोष में नहीं है, वह सूचना यहां दर्ज होती है ताकि संबंधित वैधानिक फाइल अपलोड की जा सके।'
                : 'Whenever a citizen searches for a statutory topic not present in the local RAG knowledge base, it is logged here so official legal files can be uploaded to Google Drive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQueryFilter}
                onChange={e => setSearchQueryFilter(e.target.value)}
                placeholder={isHi ? 'खोजें (Search gaps)...' : 'Search gaps...'}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 w-44 sm:w-56"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedNotifFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedNotifFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'सभी' : 'All'} ({notifications.length})
              </button>
              <button
                onClick={() => setSelectedNotifFilter('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedNotifFilter === 'pending'
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'लंबित' : 'Pending'} ({pendingCount})
              </button>
              <button
                onClick={() => setSelectedNotifFilter('resolved')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedNotifFilter === 'resolved'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isHi ? 'समाधानित' : 'Resolved'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white border border-slate-200/90 p-12 rounded-2xl text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isHi ? 'कोई लंबित ज्ञान अंतराल सूचना नहीं' : 'No Pending Knowledge Gap Alerts'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isHi
              ? 'सभी नागरिक प्रश्न स्थानीय RAG ज्ञानकोष द्वारा सफलतापूर्वक हल किए जा रहे हैं।'
              : 'All statutory questions asked by citizens are currently being answered by verified local legal documents.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`bg-white border p-5 rounded-2xl transition-all shadow-xs space-y-3.5 ${
                notif.status === 'pending'
                  ? 'border-rose-200 hover:border-rose-300'
                  : notif.status === 'reviewed'
                  ? 'border-amber-200 hover:border-amber-300'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        notif.status === 'pending'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : notif.status === 'reviewed'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {notif.status === 'pending'
                        ? isHi ? 'लंबित अंतराल (Missing in RAG)' : 'Missing in RAG'
                        : notif.status === 'reviewed'
                        ? isHi ? 'समीक्षाधीन (Under Review)' : 'Under Review'
                        : isHi ? 'दस्तावेज़ अपलोड (Resolved)' : 'Document Uploaded (Resolved)'}
                    </span>

                    {notif.category && (
                      <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 rounded-full text-[11px] font-semibold border border-sky-200">
                        {notif.category}
                      </span>
                    )}

                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(notif.timestamp).toLocaleString()}</span>
                    </span>
                  </div>

                  {/* Citizen Query */}
                  <div className="text-sm font-bold text-slate-900 pt-0.5">
                    &ldquo;{notif.query}&rdquo;
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  {notif.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => onUpdateStatus(notif.id, 'resolved')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isHi ? 'दस्तावेज़ जोड़ दिया गया' : 'Mark Resolved'}</span>
                      </button>

                      {notif.status === 'pending' && (
                        <button
                          onClick={() => onUpdateStatus(notif.id, 'reviewed')}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-200"
                        >
                          {isHi ? 'समीक्षा चिन्हित करें' : 'Mark Reviewed'}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(notif.id, 'pending')}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isHi ? 'पुनः लंबित करें' : 'Reopen Gap'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Suggested Action */}
              {notif.suggestedAction && (
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950">{isHi ? 'प्रशासक सुझाव: ' : 'Officer Action Suggestion: '}</span>
                    <span>{notif.suggestedAction}</span>
                  </div>
                </div>
              )}

              {/* Web Sources Found as Temporary Fallback */}
              {notif.webSourcesFound && notif.webSourcesFound.length > 0 && (
                <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">
                    {isHi ? 'नागरिक को दिए गए आपातकालीन वेब संदर्भ:' : 'Emergency fallback web citations provided to citizen:'}
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {notif.webSourcesFound.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-sky-700 rounded-lg text-[11px] font-medium border border-slate-200 transition-colors"
                      >
                        <span className="truncate max-w-[220px]">{src.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
