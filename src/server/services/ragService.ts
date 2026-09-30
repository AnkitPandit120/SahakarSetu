import { config } from '../config/env';
import { getAuthorizedDriveToken, refreshGoogleAccessToken } from '../config/google';
import { listFilesInsideKnowledgeFolder, downloadDriveFileContent, DriveRemoteFile } from './googleDriveService';
import { extractDocumentContent } from './documentExtractor';
import { chunkDocument } from './chunkingService';
import { generateEmbedding, generateEmbeddingsBatch } from './embeddingService';
import { vectorStore, StoredDocument, SearchResultChunk } from './vectorService';
import { performTrustedWebSearch } from './webSearchService';
import { generateGroundedRAGAnswer, getNoReliableSourceResponse, ChatAnswerResponse } from './geminiService';
import { generateGroqGeneralAnswer } from './groqService';

export interface SyncReport {
  timestamp: string;
  totalDriveFilesFound: number;
  newFilesIndexed: number;
  modifiedFilesUpdated: number;
  deletedFilesRemoved: number;
  unchangedFilesSkipped: number;
  failedFilesCount: number;
  failedDetails: Array<{ fileName: string; fileId: string; error: string }>;
  indexedDocuments: Array<{
    fileId: string;
    fileName: string;
    category: string;
    action: 'indexed' | 'updated' | 'skipped' | 'deleted';
    chunkCount: number;
  }>;
}

export interface ChatQueryPayload {
  message: string;
  language?: string;
  category?: string;
  conversationId?: string;
}

/**
 * Execute full differential synchronization against the designated Google Drive Knowledge Folder
 */
export async function syncKnowledgeBase(
  customFolderId?: string,
  customToken?: string
): Promise<SyncReport> {
  const folderId = customFolderId || config.driveKnowledgeFolderId;

  vectorStore.setSyncState('indexing');

  let token: string | null = null;
  try {
    token = await getAuthorizedDriveToken(customToken);
  } catch (authErr: any) {
    // When Google Drive token is not configured, safely refresh verified statutory knowledge base
    console.log('Google Drive OAuth token not provided. Refreshing verified statutory seed knowledge base.');
    vectorStore.reseedVerifiedDocuments();
    vectorStore.setSyncState('synced');
    const existingDocs = vectorStore.getAllDocuments();
    return {
      timestamp: new Date().toISOString(),
      totalDriveFilesFound: existingDocs.length,
      newFilesIndexed: 0,
      modifiedFilesUpdated: 0,
      deletedFilesRemoved: 0,
      unchangedFilesSkipped: existingDocs.length,
      failedFilesCount: 0,
      failedDetails: [],
      indexedDocuments: existingDocs.map(d => ({
        fileId: d.fileId,
        fileName: d.fileName,
        category: d.category,
        action: 'skipped',
        chunkCount: d.chunkCount
      }))
    };
  }

  if (!folderId) {
    throw new Error('No Google Drive Knowledge Folder ID specified. Please set DRIVE_KNOWLEDGE_FOLDER_ID in environment or configure it in the Admin settings.');
  }

  const report: SyncReport = {
    timestamp: new Date().toISOString(),
    totalDriveFilesFound: 0,
    newFilesIndexed: 0,
    modifiedFilesUpdated: 0,
    deletedFilesRemoved: 0,
    unchangedFilesSkipped: 0,
    failedFilesCount: 0,
    failedDetails: [],
    indexedDocuments: []
  };

  try {
    let remoteFiles: DriveRemoteFile[] = [];
    try {
      // 1. Fetch all eligible files currently present in the Drive folder
      remoteFiles = await listFilesInsideKnowledgeFolder(folderId, token);
    } catch (listErr: any) {
      const errStr = (listErr.message || '').toLowerCase();
      const isAuthErr = errStr.includes('autherror') || errStr.includes('invalid credentials') || errStr.includes('401') || errStr.includes('403') || errStr.includes('unauthorized');

      if (isAuthErr && config.googleRefreshToken) {
        console.log('Attempting token refresh after Drive list auth failure...');
        try {
          token = await refreshGoogleAccessToken(config.googleRefreshToken);
          remoteFiles = await listFilesInsideKnowledgeFolder(folderId, token);
        } catch (refreshErr: any) {
          console.warn('Token refresh retry failed:', refreshErr.message);
        }
      }

      // If remoteFiles still could not be fetched due to auth
      if (remoteFiles.length === 0 && (isAuthErr || listErr)) {
        console.warn(`Drive listing warning: ${listErr.message}`);
        // If it's an auth error, return report with notice rather than crashing
        if (isAuthErr) {
          vectorStore.setSyncState('synced');
          const existingDocs = vectorStore.getAllDocuments();
          return {
            timestamp: new Date().toISOString(),
            totalDriveFilesFound: existingDocs.length,
            newFilesIndexed: 0,
            modifiedFilesUpdated: 0,
            deletedFilesRemoved: 0,
            unchangedFilesSkipped: existingDocs.length,
            failedFilesCount: 1,
            failedDetails: [{
              fileName: 'Google Drive Authentication',
              fileId: folderId,
              error: 'Google Drive authorization is required or expired. Please connect Google Drive using OAuth in the dashboard.'
            }],
            indexedDocuments: existingDocs.map(d => ({
              fileId: d.fileId,
              fileName: d.fileName,
              category: d.category,
              action: 'skipped',
              chunkCount: d.chunkCount
            }))
          };
        }
        throw listErr;
      }
    }

    report.totalDriveFilesFound = remoteFiles.length;

    // 2. Get currently stored files map { [fileId]: modifiedTime }
    const existingMap = vectorStore.getExistingFilesMap();
    const remoteFileIdSet = new Set<string>();

    // 3. Process remote files: Detect New, Modified, or Unchanged
    for (const file of remoteFiles) {
      remoteFileIdSet.add(file.id);
      const existingModifiedTime = existingMap.get(file.id);

      // A) Unchanged File -> Skip re-embedding to save compute & time
      if (existingModifiedTime && existingModifiedTime === file.modifiedTime) {
        report.unchangedFilesSkipped++;
        report.indexedDocuments.push({
          fileId: file.id,
          fileName: file.name,
          category: file.category,
          action: 'skipped',
          chunkCount: 0
        });
        continue;
      }

      // B) New or Modified File -> Download, Extract, Chunk, Embed & Store
      const isModification = !!existingModifiedTime;
      try {
        const { buffer, mimeType } = await downloadDriveFileContent(file.id, file.mimeType, token);
        const extracted = await extractDocumentContent(buffer, mimeType, file.name);

        if (!extracted.fullText || !extracted.fullText.trim()) {
          throw new Error('No readable text content extracted from file.');
        }

        const chunks = chunkDocument(extracted, { maxChunkSize: 800, overlapSize: 150 });
        if (chunks.length === 0) {
          throw new Error('Failed to generate chunks from extracted content.');
        }

        // Generate embeddings for chunks
        const chunkTexts = chunks.map(c => c.text);
        const embeddings = await generateEmbeddingsBatch(chunkTexts, 8);

        const docRecord: StoredDocument = {
          fileId: file.id,
          fileName: file.name,
          mimeType: file.mimeType,
          category: file.category,
          authority: file.authority,
          driveUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
          officialUrl: file.webViewLink,
          modifiedTime: file.modifiedTime,
          indexedAt: new Date().toISOString(),
          pageCount: extracted.pageCount,
          chunkCount: chunks.length
        };

        vectorStore.addDocument(docRecord, chunks, embeddings);

        if (isModification) {
          report.modifiedFilesUpdated++;
          report.indexedDocuments.push({
            fileId: file.id,
            fileName: file.name,
            category: file.category,
            action: 'updated',
            chunkCount: chunks.length
          });
        } else {
          report.newFilesIndexed++;
          report.indexedDocuments.push({
            fileId: file.id,
            fileName: file.name,
            category: file.category,
            action: 'indexed',
            chunkCount: chunks.length
          });
        }
      } catch (docErr: any) {
        console.error(`Failed to index file "${file.name}" (${file.id}):`, docErr);
        report.failedFilesCount++;
        report.failedDetails.push({
          fileName: file.name,
          fileId: file.id,
          error: docErr.message || 'Unknown processing error'
        });
      }
    }

    // 4. Detect & Remove Stale/Deleted Files (including hardcoded seed files that do not exist in live Google Drive)
    for (const storedFileId of existingMap.keys()) {
      if (!remoteFileIdSet.has(storedFileId)) {
        vectorStore.deleteDocument(storedFileId);
        report.deletedFilesRemoved++;
        report.indexedDocuments.push({
          fileId: storedFileId,
          fileName: 'Removed Stale Document',
          category: 'statutory',
          action: 'deleted',
          chunkCount: 0
        });
      }
    }

    vectorStore.setSyncState('synced');
    return report;
  } catch (err: any) {
    vectorStore.setSyncState('error', err.message);
    throw err;
  }
}

import { adminTelemetryStore } from './adminTelemetryService';

/**
 * Handle user query with prioritized RAG pipeline and trusted web search fallback
 */
export async function handleUserChatQuery(payload: ChatQueryPayload): Promise<ChatAnswerResponse> {
  const { message, language = 'en', category } = payload;
  if (!message || !message.trim()) {
    throw new Error('Message is required');
  }

  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(message);

  // 2. Perform vector search in vector database with hybrid matching
  const minSimilarity = 0.20;
  const retrievedChunks: SearchResultChunk[] = vectorStore.search(
    queryEmbedding,
    4,
    category,
    minSimilarity,
    message
  );

  // 3. If high-confidence RAG passages found in vector DB, synthesize with RAG context
  if (retrievedChunks.length > 0 && retrievedChunks[0].similarityScore >= 0.25) {
    adminTelemetryStore.recordQueryEvent({
      query: message,
      language,
      category,
      isRagHit: true
    });
    return await generateGroundedRAGAnswer(message, language, retrievedChunks);
  }

  // 4. No reliable RAG result -> Fallback to Internet Web Search Grounding
  const webAnswer = await performTrustedWebSearch(message, language);
  if (webAnswer.hasAnswer && webAnswer.answer) {
    adminTelemetryStore.recordQueryEvent({
      query: message,
      language,
      category,
      isRagHit: false,
      webSources: (webAnswer.sources || []).map(s => ({ title: s.title, officialUrl: s.officialUrl }))
    });

    return {
      answer: webAnswer.answer,
      sourceType: 'web',
      isInternetFallback: true,
      disclaimer: webAnswer.disclaimer,
      sources: (webAnswer.sources || []).map(s => ({
        title: s.title,
        authority: s.authority,
        officialUrl: s.officialUrl,
        sourceType: 'web'
      })),
      followUpQuestions: webAnswer.followUpQuestions || [
        'How can I verify this on the official government portal?',
        'Which government authority or department administers this?',
        'What statutory documents or forms are officially required?'
      ]
    };
  }

  // 5. Try Groq statutory assistant if configured before no-source fallback
  if (config.groqApiKey) {
    try {
      const groqGeneral = await generateGroqGeneralAnswer(message, language);
      if (groqGeneral) return groqGeneral;
    } catch (groqErr: any) {
      console.warn('Groq general query fallback error:', groqErr?.message);
    }
  }

  // 6. If neither AI nor trusted web search has reliable info -> Return honest no-hallucination fallback
  adminTelemetryStore.recordQueryEvent({
    query: message,
    language,
    category,
    isRagHit: false
  });
  return getNoReliableSourceResponse(language, message);
}
