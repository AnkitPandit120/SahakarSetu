import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  FileText,
  AlertCircle,
  FolderTree,
  Folder,
  Sliders,
  Database,
  ArrowRight,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';
import { Language } from '../types';

interface DriveFoldersViewProps {
  language: Language;
}

interface KBStats {
  googleDriveConnected: boolean;
  folderId: string | null;
  folderName?: string | null;
  totalDocuments: number;
  totalChunks: number;
  lastSync: string | null;
  status: string;
  categories: Record<string, number>;
  lastError?: string | null;
}

interface IndexedDocItem {
  fileId: string;
  fileName: string;
  category: string;
  authority: string;
  driveUrl: string;
  officialUrl?: string;
  modifiedTime: string;
  pageCount: number;
  chunkCount: number;
}

export const DriveFoldersView: React.FC<DriveFoldersViewProps> = ({ language }) => {
  const [stats, setStats] = useState<KBStats | null>(null);
  const [documents, setDocuments] = useState<IndexedDocItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReportMessage, setSyncReportMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Folder Configuration Modal / Input state
  const [isConfiguringFolder, setIsConfiguringFolder] = useState(false);
  const [inputFolderId, setInputFolderId] = useState('');
  const [isSavingFolder, setIsSavingFolder] = useState(false);

  // Available Folders List from Drive API (if OAuth token active)
  const [availableFolders, setAvailableFolders] = useState<Array<{ id: string; name: string; webViewLink?: string }>>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  // Fetch status and indexed documents from backend
  const fetchStatus = async () => {
    try {
      setErrorMessage(null);
      const [statusRes, docsRes, driveRes] = await Promise.all([
        fetch('/api/rag/status'),
        fetch('/api/rag/documents'),
        fetch('/api/drive/status')
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        const driveData = driveRes.ok ? await driveRes.json() : {};
        setStats({
          ...statusData.knowledgeBase,
          folderName: driveData.folderName || statusData.knowledgeBase?.folderName
        });
        if (driveData.folderId && !inputFolderId) {
          setInputFolderId(driveData.folderId);
        }
      }

      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData);
      }
    } catch (err: any) {
      console.error('Failed to load RAG status:', err);
      setErrorMessage('Could not connect to backend RAG service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Trigger Google Drive Knowledge Base Sync
  const handleSyncKnowledgeBase = async () => {
    setIsSyncing(true);
    setSyncReportMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/rag/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: stats?.folderId || inputFolderId || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete synchronization');
      }

      setSyncReportMessage(data.message || 'Synchronization successfully completed.');
      await fetchStatus();
    } catch (err: any) {
      console.error('Sync failed:', err);
      setErrorMessage(err.message || 'Synchronization failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save new Knowledge Folder ID
  const handleSaveFolderConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputFolderId.trim()) return;

    setIsSavingFolder(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/drive/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: inputFolderId.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save folder configuration');
      }

      setIsConfiguringFolder(false);
      setSyncReportMessage(`Knowledge Base root folder set to: ${inputFolderId.trim()}`);
      await fetchStatus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update folder.');
    } finally {
      setIsSavingFolder(false);
    }
  };

  // Load available Drive folders from API
  const handleLoadDriveFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const res = await fetch('/api/drive/folders');
      if (res.ok) {
        const list = await res.json();
        setAvailableFolders(list);
      }
    } catch (err: any) {
      console.warn('Could not load drive folders list:', err.message);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  // Disconnect Google Drive
  const handleDisconnect = async () => {
    try {
      await fetch('/api/auth/disconnect', { method: 'POST' });
      await fetchStatus();
      setSyncReportMessage('Google Drive session disconnected.');
    } catch (err: any) {
      setErrorMessage('Failed to disconnect.');
    }
  };

  const isConnected = stats?.googleDriveConnected ?? false;

  const formatDate = (isoStr: string | null | undefined) => {
    if (!isoStr) return 'Never';
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="drive-folders-view" className="py-8 bg-slate-50 min-h-[calc(100vh-140px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase mb-1">
              <span>सहकारिता मंत्रालय (Ministry of Cooperation)</span>
              <span>•</span>
              <span className="text-emerald-700">RAG Knowledge Base Status</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <HardDrive className="w-6 h-6 text-emerald-700" />
              <span>{language === 'hi' ? 'गूगल ड्राइव ज्ञानकोष स्थिति' : 'Knowledge Base & Drive Synchronization'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {language === 'hi'
                ? 'गूगल ड्राइव आपके आरएजी ज्ञानकोष का एकमात्र प्रामाणिक स्रोत (Single Source of Truth) है। दस्तावेज़ सीधे गूगल ड्राइव में प्रबंधित किए जाते हैं।'
                : 'Google Drive is the single source of truth for the RAG knowledge base. Manage, edit, or delete documents directly in Google Drive and click Sync below.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              id="sync-kb-header-btn"
              onClick={handleSyncKnowledgeBase}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Drive Knowledge...' : 'Sync Knowledge Base'}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold ml-2">×</button>
          </div>
        )}

        {syncReportMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{syncReportMessage}</span>
            </div>
            <button onClick={() => setSyncReportMessage(null)} className="text-emerald-700 font-bold ml-2">×</button>
          </div>
        )}

        {/* Core Status Card (Requested Format) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                System Status
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700" />
                <span>Knowledge Base Status</span>
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                id="configure-folder-btn"
                onClick={() => {
                  setIsConfiguringFolder(true);
                  handleLoadDriveFolders();
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>Configure Folder</span>
              </button>

              {!isConnected ? (
                <a
                  href="/api/auth/google"
                  className="px-3.5 py-2 bg-[#0B3B60] hover:bg-[#07253d] text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Connect Google Drive</span>
                </a>
              ) : (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>

          {/* Metric Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Google Drive Connection Status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase">Google Drive</div>
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900">
                {isConnected ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-emerald-800">Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="text-slate-700">Ready / Seed Mode</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {stats?.folderId ? `Folder: ${stats.folderId.slice(0, 14)}...` : 'Standard Knowledge Root'}
              </div>
            </div>

            {/* 2. Documents Count */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase">Documents</div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.totalDocuments ?? documents.length}
              </div>
              <div className="text-[11px] text-slate-500">
                Across {Object.keys(stats?.categories || {}).length || 4} categories
              </div>
            </div>

            {/* 3. Indexed Chunks Count */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase">Indexed Passages</div>
              <div className="text-2xl font-black text-emerald-800">
                {stats?.totalChunks ?? 0}
              </div>
              <div className="text-[11px] text-slate-500">
                With legal structure tags
              </div>
            </div>

            {/* 4. Last Sync & Status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase">Last Sync</div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {formatDate(stats?.lastSync)}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{stats?.status || '✓ Up to date'}</span>
              </div>
            </div>
          </div>

          {/* Direct Drive Folder link notice */}
          {stats?.folderId && (
            <div className="mt-5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950">
                <Folder className="w-4 h-4 text-emerald-700" />
                <span>
                  Designated Google Drive Folder:{' '}
                  <strong>{stats.folderName || stats.folderId}</strong>
                </span>
              </div>
              <a
                href={`https://drive.google.com/drive/folders/${stats.folderId}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Live List of Indexed Documents */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Indexed Documents in RAG Store ({documents.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These documents are read from Google Drive and indexed for vector search with section & page metadata.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200 self-start sm:self-auto">
              Read-Only Sync Mode
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No documents indexed yet. Click "Sync Knowledge Base" above to scan and index your Google Drive folder.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.fileId} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{doc.fileName}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded shrink-0">
                        {doc.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Authority: <span className="text-slate-700">{doc.authority}</span> • {doc.chunkCount} indexed passages • {doc.pageCount} pages
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {doc.driveUrl && (
                      <a
                        href={doc.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1 text-[11px]"
                        title="View file in Drive"
                      >
                        <span>Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configure Folder Modal */}
        {isConfiguringFolder && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
              <div className="px-6 py-4 bg-[#0B3B60] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold">Configure Google Drive Knowledge Folder</h3>
                </div>
                <button
                  onClick={() => setIsConfiguringFolder(false)}
                  className="p-1 text-slate-300 hover:text-white rounded-lg"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveFolderConfig} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Google Drive Folder ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1A2b3C4d5E6F7g8H9i0J..."
                    value={inputFolderId}
                    onChange={e => setInputFolderId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Enter the Google Drive folder ID from your folder URL (e.g. <code>drive.google.com/drive/folders/<strong>FOLDER_ID</strong></code>).
                  </p>
                </div>

                {/* Available folders picker from Google Drive API if available */}
                {availableFolders.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Or Select from Detected Drive Folders
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
                      {availableFolders.map(folder => (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => setInputFolderId(folder.id)}
                          className={`w-full p-2 text-left flex items-center justify-between hover:bg-emerald-50/50 transition-colors ${
                            inputFolderId === folder.id ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{folder.name}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">
                            {folder.id.slice(0, 8)}...
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsConfiguringFolder(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingFolder || !inputFolderId.trim()}
                    className="px-4 py-2 bg-[#0B3B60] hover:bg-[#07253d] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingFolder ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Folder Configuration</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
