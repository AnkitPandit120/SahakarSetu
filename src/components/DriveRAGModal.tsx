import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  CheckCircle2,
  RefreshCw,
  Search,
  FileText,
  FileSpreadsheet,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  Database,
  Sparkles,
  Trash2,
  Lock,
  ArrowRight,
  Sliders,
  ChevronRight,
  Eye,
  Zap,
  Info,
  FolderPlus,
  FolderTree,
  Folder,
  UploadCloud,
  FileUp
} from 'lucide-react';
import { DriveFileItem, DriveDocumentChunk, Language } from '../types';
import {
  signInWithGoogleDrive,
  disconnectGoogleDrive,
  listDriveFiles,
  extractDriveFileText,
  chunkDocument,
  getDriveAccessToken,
  findOrCreateDriveFolder,
  createDriveDocument
} from '../services/googleDrive';
import { SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE } from '../data/driveSeedData';
import { driveRAGEngine } from '../services/ragEngine';

interface DriveRAGModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onIndexUpdated?: () => void;
}

export const DriveRAGModal: React.FC<DriveRAGModalProps> = ({
  isOpen,
  onClose,
  language,
  onIndexUpdated
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // File browser state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMimeFilter, setSelectedMimeFilter] = useState<'all' | 'doc' | 'sheet' | 'pdf' | 'text'>('all');
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [indexingFileId, setIndexingFileId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Preview & Sandbox state
  const [activeTab, setActiveTab] = useState<'files' | 'structure' | 'indexed' | 'sandbox'>('files');
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<DriveFileItem | null>(null);
  const [previewChunks, setPreviewChunks] = useState<DriveDocumentChunk[]>([]);
  
  // Folder Provisioning State
  const [isProvisioningHierarchy, setIsProvisioningHierarchy] = useState(false);
  const [provisioningProgress, setProvisioningProgress] = useState<string | null>(null);
  const [createdStructureLog, setCreatedStructureLog] = useState<{
    mainFolder?: { name: string; link: string };
    subFolders: { name: string; link: string; docsCount: number }[];
  } | null>(null);

  // Custom document creator modal state
  const [isCreatingCustomDoc, setIsCreatingCustomDoc] = useState(false);
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [customDocCategory, setCustomDocCategory] = useState('01_Model_Byelaws_and_Statutory_Rules');
  const [customDocContent, setCustomDocContent] = useState('');
  const [isSubmittingCustomDoc, setIsSubmittingCustomDoc] = useState(false);
  
  // Sandbox test search
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxResults, setSandboxResults] = useState<DriveDocumentChunk[]>([]);

  // Initialize and check connection state
  useEffect(() => {
    const token = getDriveAccessToken();
    if (token) {
      setIsConnected(true);
      fetchFiles();
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const { user, accessToken } = await signInWithGoogleDrive();
      setIsConnected(true);
      setUserEmail(user.email || null);
      setUserName(user.displayName || null);
      setUserPhoto(user.photoURL || null);
      setStatusMessage('Successfully connected to Google Drive.');
      // Fetch files immediately
      await fetchFiles(accessToken);
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setAuthError(err.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectGoogleDrive();
    setIsConnected(false);
    setUserEmail(null);
    setUserName(null);
    setUserPhoto(null);
    setFiles([]);
    setStatusMessage('Disconnected from Google Drive.');
  };

  const fetchFiles = async (token?: string) => {
    setIsFetchingFiles(true);
    setStatusMessage(null);
    try {
      const activeToken = token || getDriveAccessToken();
      if (!activeToken) return;

      const driveFiles = await listDriveFiles(searchQuery, activeToken);
      const indexedList = driveRAGEngine.getIndexedFiles();

      // Merge indexed status with drive files
      const merged = driveFiles.map(f => {
        const found = indexedList.find(idx => idx.id === f.id);
        if (found) {
          return {
            ...f,
            isIndexed: true,
            indexedChunkCount: found.indexedChunkCount,
            lastIndexedAt: found.lastIndexedAt
          };
        }
        return f;
      });

      setFiles(merged);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setStatusMessage(`Error listing Drive files: ${err.message}`);
    } finally {
      setIsFetchingFiles(false);
    }
  };

  const handleIndexFile = async (file: DriveFileItem) => {
    setIndexingFileId(file.id);
    setStatusMessage(`Indexing "${file.name}" into RAG Vector Store...`);
    try {
      const text = await extractDriveFileText(file.id, file.mimeType);
      if (!text || !text.trim()) {
        throw new Error('No readable text could be extracted from this document.');
      }

      const chunks = chunkDocument(file, text);
      driveRAGEngine.addDocumentChunks(file, chunks);

      // Update file state in local list
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? {
                ...f,
                isIndexed: true,
                indexedChunkCount: chunks.length,
                lastIndexedAt: new Date().toISOString()
              }
            : f
        )
      );

      setStatusMessage(`Indexed ${chunks.length} passages from "${file.name}".`);
      if (onIndexUpdated) onIndexUpdated();
    } catch (err: any) {
      console.error('Indexing failed:', err);
      setStatusMessage(`Indexing failed: ${err.message}`);
    } finally {
      setIndexingFileId(null);
    }
  };

  const handleRemoveIndex = (fileId: string, fileName: string) => {
    driveRAGEngine.removeDocument(fileId);
    setFiles(prev =>
      prev.map(f =>
        f.id === fileId
          ? {
              ...f,
              isIndexed: false,
              indexedChunkCount: undefined,
              lastIndexedAt: undefined
            }
          : f
      )
    );
    setStatusMessage(`Removed "${fileName}" from RAG Index.`);
    if (onIndexUpdated) onIndexUpdated();
  };

  const handleIndexAll = async () => {
    const unindexed = filteredFiles.filter(f => !f.isIndexed);
    if (unindexed.length === 0) return;

    setStatusMessage(`Indexing ${unindexed.length} documents into RAG store...`);
    for (const file of unindexed) {
      setIndexingFileId(file.id);
      try {
        const text = await extractDriveFileText(file.id, file.mimeType);
        if (text && text.trim()) {
          const chunks = chunkDocument(file, text);
          driveRAGEngine.addDocumentChunks(file, chunks);
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id
                ? {
                    ...f,
                    isIndexed: true,
                    indexedChunkCount: chunks.length,
                    lastIndexedAt: new Date().toISOString()
                  }
                : f
            )
          );
        }
      } catch (e) {
        console.warn(`Could not index ${file.name}:`, e);
      }
    }
    setIndexingFileId(null);
    setStatusMessage(`Batch indexing complete!`);
    if (onIndexUpdated) onIndexUpdated();
  };

  const handleClearAllIndex = () => {
    if (confirm('Are you sure you want to clear all indexed Drive passages?')) {
      driveRAGEngine.clearAll();
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          isIndexed: false,
          indexedChunkCount: undefined,
          lastIndexedAt: undefined
        }))
      );
      setStatusMessage('All indexed RAG data cleared.');
      if (onIndexUpdated) onIndexUpdated();
    }
  };

  /**
   * Provision the Main folder, sub-folders, and seed original cooperative documents in Google Drive
   */
  const handleProvisionFolderStructure = async () => {
    const activeToken = getDriveAccessToken();
    if (!activeToken) {
      setAuthError('Please sign in to Google Drive first.');
      return;
    }

    setIsProvisioningHierarchy(true);
    setProvisioningProgress('Creating main root folder in Google Drive...');
    setCreatedStructureLog(null);

    try {
      // 1. Create/Find Main Folder
      const mainFolder = await findOrCreateDriveFolder(
        SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.mainFolderName,
        undefined,
        activeToken
      );

      setProvisioningProgress(`Root folder "${mainFolder.name}" ready. Creating sub-folders...`);
      const subLogs: { name: string; link: string; docsCount: number }[] = [];

      // 2. Loop through sub-folders and create them
      for (const subDef of SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.subFolders) {
        setProvisioningProgress(`Creating sub-folder "${subDef.folderName}"...`);
        const subFolder = await findOrCreateDriveFolder(
          subDef.folderName,
          mainFolder.id,
          activeToken
        );

        // 3. Upload/Create documents in this sub-folder
        let createdDocsInSub = 0;
        for (const doc of subDef.documents) {
          setProvisioningProgress(`Uploading original document "${doc.fileName}" to ${subDef.folderName}...`);
          const createdDoc = await createDriveDocument(
            doc.fileName,
            doc.content,
            subFolder.id,
            doc.mimeType,
            activeToken
          );
          createdDocsInSub++;

          // Auto-index this document into RAG immediately
          try {
            const fakeFileItem: DriveFileItem = {
              id: createdDoc.id,
              name: createdDoc.name,
              mimeType: 'text/markdown',
              webViewLink: createdDoc.webViewLink,
              isIndexed: true
            };
            const chunks = chunkDocument(fakeFileItem, doc.content);
            driveRAGEngine.addDocumentChunks(fakeFileItem, chunks);
          } catch (e) {
            console.warn('Auto index chunk error:', e);
          }
        }

        subLogs.push({
          name: subFolder.name,
          link: subFolder.webViewLink,
          docsCount: createdDocsInSub
        });
      }

      setCreatedStructureLog({
        mainFolder: { name: mainFolder.name, link: mainFolder.webViewLink },
        subFolders: subLogs
      });

      setStatusMessage('Successfully created main folder, sub-folders, and uploaded original documents to Google Drive!');
      
      // Refresh drive files list
      await fetchFiles(activeToken);
      if (onIndexUpdated) onIndexUpdated();
    } catch (err: any) {
      console.error('Provisioning failed:', err);
      setAuthError(`Folder structure creation failed: ${err.message}`);
    } finally {
      setIsProvisioningHierarchy(false);
      setProvisioningProgress(null);
    }
  };

  /**
   * Handle uploading a custom document to a selected sub-folder
   */
  const handleUploadCustomDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDocTitle.trim() || !customDocContent.trim()) return;

    const activeToken = getDriveAccessToken();
    if (!activeToken) {
      setAuthError('Please sign in to Google Drive first.');
      return;
    }

    setIsSubmittingCustomDoc(true);
    try {
      // Find or create main folder
      const mainFolder = await findOrCreateDriveFolder(
        SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.mainFolderName,
        undefined,
        activeToken
      );

      // Find or create selected sub-folder
      const subFolder = await findOrCreateDriveFolder(
        customDocCategory,
        mainFolder.id,
        activeToken
      );

      const fileName = customDocTitle.endsWith('.md') || customDocTitle.endsWith('.txt')
        ? customDocTitle
        : `${customDocTitle.replace(/\s+/g, '_')}.md`;

      const created = await createDriveDocument(
        fileName,
        customDocContent,
        subFolder.id,
        'text/markdown',
        activeToken
      );

      // Index in RAG
      const fileItem: DriveFileItem = {
        id: created.id,
        name: created.name,
        mimeType: 'text/markdown',
        webViewLink: created.webViewLink,
        isIndexed: true
      };
      const chunks = chunkDocument(fileItem, customDocContent);
      driveRAGEngine.addDocumentChunks(fileItem, chunks);

      setStatusMessage(`Document "${fileName}" uploaded to "${subFolder.name}" and indexed for RAG!`);
      setCustomDocTitle('');
      setCustomDocContent('');
      setIsCreatingCustomDoc(false);

      await fetchFiles(activeToken);
      if (onIndexUpdated) onIndexUpdated();
    } catch (err: any) {
      console.error('Custom doc creation error:', err);
      setAuthError(`Document upload error: ${err.message}`);
    } finally {
      setIsSubmittingCustomDoc(false);
    }
  };

  const handlePreviewChunks = (file: DriveFileItem) => {
    setSelectedFileForPreview(file);
    const allChunks = driveRAGEngine.getAllChunks().filter(c => c.fileId === file.id);
    setPreviewChunks(allChunks);
  };

  const handleSandboxSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxQuery.trim()) return;
    const results = driveRAGEngine.search(sandboxQuery, 6);
    setSandboxResults(results);
  };

  const filteredFiles = files.filter(f => {
    if (selectedMimeFilter === 'doc') {
      return f.mimeType.includes('document') || f.name.endsWith('.docx') || f.name.endsWith('.doc');
    }
    if (selectedMimeFilter === 'sheet') {
      return f.mimeType.includes('spreadsheet') || f.name.endsWith('.xlsx') || f.name.endsWith('.csv');
    }
    if (selectedMimeFilter === 'pdf') {
      return f.mimeType.includes('pdf') || f.name.endsWith('.pdf');
    }
    if (selectedMimeFilter === 'text') {
      return f.mimeType.startsWith('text/') || f.name.endsWith('.txt') || f.name.endsWith('.md');
    }
    return true;
  });

  const indexedFilesList = driveRAGEngine.getIndexedFiles();
  const totalChunksCount = driveRAGEngine.getTotalChunkCount();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        id="drive-rag-modal-card"
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Google Drive RAG Knowledge Hub
                </h2>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Retrieval-Augmented Generation
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Index bylaws, circulars & reports from your Google Drive to ground the AI Sahayak with exact citations
              </p>
            </div>
          </div>
          <button
            id="close-drive-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Status & Auth Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {!isConnected ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-medium text-slate-700">
                  Google Drive not connected. Sign in with Google to index your cooperative documents.
                </span>
              </div>
              
              {/* Official styled Google Sign In button */}
              <button
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoadingAuth}
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-300 rounded-lg shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoadingAuth ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div className="text-sm">
                  <span className="font-semibold text-slate-800">Connected:</span>{' '}
                  <span className="text-slate-600 font-mono text-xs">{userEmail || 'Google Drive Active'}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-medium">
                  <Database className="w-3.5 h-3.5" />
                  <span>{indexedFilesList.length} files indexed ({totalChunksCount} passages)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="refresh-drive-btn"
                  onClick={() => fetchFiles()}
                  disabled={isFetchingFiles}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFiles ? 'animate-spin' : ''}`} />
                  <span>Refresh Drive</span>
                </button>
                <button
                  id="disconnect-drive-btn"
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        {authError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {statusMessage && (
          <div className="mx-6 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              id="tab-drive-structure"
              onClick={() => setActiveTab('structure')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'structure'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Folders & Seeding Hub</span>
            </button>
            <button
              id="tab-drive-files"
              onClick={() => setActiveTab('files')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'files'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Drive Files ({filteredFiles.length})</span>
            </button>
            <button
              id="tab-indexed-kb"
              onClick={() => setActiveTab('indexed')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'indexed'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>RAG Knowledge Base ({indexedFilesList.length})</span>
            </button>
            <button
              id="tab-rag-sandbox"
              onClick={() => setActiveTab('sandbox')}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'sandbox'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>RAG Retrieval Sandbox</span>
            </button>
          </div>

          {activeTab === 'files' && isConnected && filteredFiles.some(f => !f.isIndexed) && (
            <button
              id="batch-index-btn"
              onClick={handleIndexAll}
              disabled={indexingFileId !== null}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors mb-2 disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Index All Found Documents</span>
            </button>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* FOLDERS & SEEDING STRUCTURE TAB */}
          {activeTab === 'structure' && (
            <div className="space-y-6">
              {/* Structure Provisioning Hero Card */}
              <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-800/80 shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <FolderTree className="w-5 h-5" />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight">
                      Google Drive Folder Hierarchy & Document Provisioning
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed mb-5">
                    Automatically create the primary root directory <strong>"{SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.mainFolderName}"</strong>, generate categorized sub-folders, and upload authentic model byelaws, subsidy circulars, and dispute resolution guidelines directly into your connected Google Drive.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      id="provision-drive-hierarchy-btn"
                      onClick={handleProvisionFolderStructure}
                      disabled={isProvisioningHierarchy || !isConnected}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isProvisioningHierarchy ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Provisioning Drive Structure...</span>
                        </>
                      ) : (
                        <>
                          <FolderPlus className="w-4 h-4 text-slate-950" />
                          <span>Create Folder Hierarchy & Upload Documents</span>
                        </>
                      )}
                    </button>

                    <button
                      id="open-custom-doc-modal-btn"
                      onClick={() => setIsCreatingCustomDoc(true)}
                      disabled={!isConnected}
                      className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs sm:text-sm font-semibold rounded-xl border border-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Upload Custom Cooperative Document</span>
                    </button>
                  </div>

                  {provisioningProgress && (
                    <div className="mt-4 p-3 bg-emerald-900/90 border border-emerald-700 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                      <span className="font-mono">{provisioningProgress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Created Structure Log Card (if generated in current session) */}
              {createdStructureLog && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Folders & Documents Successfully Provisioned in Drive</span>
                    </div>
                    {createdStructureLog.mainFolder && (
                      <a
                        href={createdStructureLog.mainFolder.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                      >
                        <span>Open Root in Google Drive</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {createdStructureLog.subFolders.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                        <div className="font-bold text-slate-900 truncate mb-1 flex items-center gap-1.5">
                          <Folder className="w-3.5 h-3.5 text-amber-500" />
                          <span>{sub.name}</span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {sub.docsCount} original documents created & indexed
                        </div>
                        <a
                          href={sub.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 text-[11px]"
                        >
                          <span>Open Folder</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hierarchy Blueprint Visualizer */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-emerald-600" />
                  <span>Folder Structure & Original Document Catalog</span>
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  The following tree represents the standardized cooperative hierarchy designed for rural PACS & societies:
                </p>

                {/* Root folder container */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900">
                    <Folder className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>{SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.mainFolderName}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-normal">
                      Root Directory
                    </span>
                  </div>

                  {/* Sub folders tree */}
                  <div className="pl-6 sm:pl-8 space-y-4 border-l-2 border-slate-200 ml-2.5">
                    {SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.subFolders.map((sub, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-amber-600 fill-amber-200" />
                            <span className="text-xs font-bold text-slate-900 font-mono">{sub.folderName}</span>
                          </div>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                            {sub.documents.length} Seed Docs
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">{sub.description}</p>

                        {/* Documents list */}
                        <div className="space-y-1.5 pt-1">
                          {sub.documents.map((doc, dIdx) => (
                            <div
                              key={dIdx}
                              className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 rounded-lg flex items-start justify-between gap-3 text-xs transition-colors"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span className="truncate">{doc.title}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {doc.fileName} • <span className="text-emerald-700 font-sans font-medium">{doc.category}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom Document Upload Form Modal */}
              {isCreatingCustomDoc && (
                <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileUp className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-sm font-bold">Upload Custom Cooperative Document</h3>
                      </div>
                      <button
                        onClick={() => setIsCreatingCustomDoc(false)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleUploadCustomDoc} className="p-6 space-y-4 overflow-y-auto flex-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Document Title / File Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Village_PACS_Annual_General_Meeting_Minutes_2025"
                          value={customDocTitle}
                          onChange={e => setCustomDocTitle(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Target Google Drive Sub-Folder
                        </label>
                        <select
                          value={customDocCategory}
                          onChange={e => setCustomDocCategory(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {SAHAKAR_COOPERATIVE_DRIVE_STRUCTURE.subFolders.map((sub, i) => (
                            <option key={i} value={sub.folderName}>
                              {sub.folderName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Document Content (Markdown or Plain Text)
                        </label>
                        <textarea
                          required
                          rows={8}
                          placeholder="Paste or type byelaw resolutions, audit notes, circular guidelines or member regulations..."
                          value={customDocContent}
                          onChange={e => setCustomDocContent(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setIsCreatingCustomDoc(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingCustomDoc}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmittingCustomDoc ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading to Drive...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Save & Index Document</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              {isConnected && (
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="drive-search-input"
                      type="text"
                      placeholder="Search Google Drive files..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && fetchFiles()}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'doc', label: 'Docs' },
                        { id: 'sheet', label: 'Sheets' },
                        { id: 'pdf', label: 'PDFs' },
                        { id: 'text', label: 'Text/MD' }
                      ] as const
                    ).map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedMimeFilter(type.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          selectedMimeFilter === type.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Table / List */}
              {!isConnected ? (
                <div className="py-14 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Connect Google Drive to Enable RAG
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    Connect your cooperative folder or personal Google Drive to index local rules, PACS audit sheets, byelaws, and circulars directly into the AI knowledge engine.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoadingAuth}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>Authorize Google Drive</span>
                  </button>
                </div>
              ) : isFetchingFiles ? (
                <div className="py-16 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600">
                    Scanning Google Drive documents...
                  </p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="py-12 text-center border border-slate-200 rounded-xl bg-slate-50">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No documents found matching the filter.</p>
                  <p className="text-xs text-slate-500 mt-1">Try changing the search query or file filter.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-200">
                  {filteredFiles.map(file => {
                    const isDoc = file.mimeType.includes('document');
                    const isSheet = file.mimeType.includes('spreadsheet');
                    const isPdf = file.mimeType.includes('pdf');
                    const isCurrentlyIndexing = indexingFileId === file.id;

                    return (
                      <div
                        key={file.id}
                        className="p-4 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 mt-0.5 shrink-0">
                            {isDoc ? (
                              <FileText className="w-5 h-5 text-blue-600" />
                            ) : isSheet ? (
                              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                            ) : isPdf ? (
                              <FileText className="w-5 h-5 text-rose-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {file.name}
                              </h4>
                              {file.isIndexed && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full shrink-0">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Indexed ({file.indexedChunkCount} chunks)</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span>
                                {file.size ? `${Math.round(file.size / 1024)} KB` : 'Google Doc'}
                              </span>
                              {file.modifiedTime && (
                                <span>• Modified {new Date(file.modifiedTime).toLocaleDateString()}</span>
                              )}
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-medium"
                              >
                                <span>Drive Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {file.isIndexed ? (
                            <>
                              <button
                                onClick={() => handlePreviewChunks(file)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect</span>
                              </button>
                              <button
                                onClick={() => handleIndexFile(file)}
                                disabled={isCurrentlyIndexing}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                                title="Re-index document"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlyIndexing ? 'animate-spin' : ''}`} />
                                <span>Re-index</span>
                              </button>
                              <button
                                onClick={() => handleRemoveIndex(file.id, file.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove from RAG index"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleIndexFile(file)}
                              disabled={isCurrentlyIndexing}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                              {isCurrentlyIndexing ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Chunking...</span>
                                </>
                              ) : (
                                <>
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Index for RAG</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'indexed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    {indexedFilesList.length}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Active RAG Vector Store
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {totalChunksCount} total text passages extracted and available for instant AI retrieval.
                    </p>
                  </div>
                </div>

                {indexedFilesList.length > 0 && (
                  <button
                    onClick={handleClearAllIndex}
                    className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Index</span>
                  </button>
                )}
              </div>

              {indexedFilesList.length === 0 ? (
                <div className="py-14 text-center border border-slate-200 rounded-xl bg-slate-50">
                  <Database className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">No documents indexed in RAG store yet.</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Go to the "Drive Files" tab, connect your Google Drive, and click "Index for RAG" on your cooperative files.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {indexedFilesList.map(file => (
                    <div
                      key={file.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <h5 className="text-sm font-bold text-slate-900 truncate">
                            {file.name}
                          </h5>
                        </div>
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md shrink-0">
                          {file.indexedChunkCount} Chunks
                        </span>
                      </div>

                      {file.previewSnippet && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-2.5 font-serif italic border border-slate-100 line-clamp-3">
                          "{file.previewSnippet}..."
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                        <span>Indexed {file.lastIndexedAt ? new Date(file.lastIndexedAt).toLocaleTimeString() : ''}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreviewChunks(file)}
                            className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1"
                          >
                            <span>View Chunks</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>RAG Vector Search Sandbox</span>
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Test semantic vector retrieval against your indexed Google Drive documents in real-time.
                </p>

                <form onSubmit={handleSandboxSearch} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter test query (e.g., 'What are quorum rules for general body meeting?')"
                    value={sandboxQuery}
                    onChange={e => setSandboxQuery(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Run Query</span>
                  </button>
                </form>
              </div>

              {sandboxResults.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Top Retrieved Chunks ({sandboxResults.length} matches)
                  </h5>
                  {sandboxResults.map((chunk, idx) => (
                    <div
                      key={chunk.id || idx}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-300 transition-colors shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{chunk.fileName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">Passage {chunk.chunkIndex + 1}</span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                          Score: {chunk.score}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                        {chunk.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chunk Inspection Sub-Modal / Drawer */}
        {selectedFileForPreview && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold truncate max-w-lg">
                    Passage Chunks: {selectedFileForPreview.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {previewChunks.length} semantic passages extracted for RAG retrieval
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFileForPreview(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                {previewChunks.map((chunk, i) => (
                  <div key={chunk.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between mb-1.5 text-slate-500 font-semibold">
                      <span>Passage #{chunk.chunkIndex + 1} of {chunk.totalChunks || previewChunks.length}</span>
                      <span>{chunk.text.length} characters</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{chunk.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedFileForPreview(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Passages from indexed files are automatically cited in AI Sahayak responses.</span>
          </div>
          <button
            id="close-drive-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
