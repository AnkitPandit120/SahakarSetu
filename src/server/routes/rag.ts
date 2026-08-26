import { Router, Request, Response } from 'express';
import { syncKnowledgeBase } from '../services/ragService';
import { vectorStore } from '../services/vectorService';
import { config } from '../config/env';

export const ragRouter = Router();

/**
 * POST /api/rag/sync
 * Run intelligent differential synchronization against Google Drive
 */
ragRouter.post('/sync', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const customToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.body.accessToken;
    const folderId = req.body.folderId || config.driveKnowledgeFolderId;

    if (!folderId) {
      return res.status(400).json({
        error: 'DRIVE_KNOWLEDGE_FOLDER_ID is not configured. Please provide a folderId or set it in the Admin settings.'
      });
    }

    const report = await syncKnowledgeBase(folderId, customToken);
    res.json({
      success: true,
      message: `Synchronization complete. Indexed ${report.newFilesIndexed} new, updated ${report.modifiedFilesUpdated}, removed ${report.deletedFilesRemoved}, skipped ${report.unchangedFilesSkipped} unchanged.`,
      report
    });
  } catch (err: any) {
    console.error('RAG sync failed:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Synchronization failed'
    });
  }
});

/**
 * GET /api/rag/status
 * Get synchronization status and knowledge stats
 */
ragRouter.get('/status', (req: Request, res: Response) => {
  try {
    const stats = vectorStore.getStats();
    res.json({
      knowledgeBase: {
        googleDriveConnected: !!(config.adminAccessToken || config.googleRefreshToken),
        folderId: config.driveKnowledgeFolderId || null,
        totalDocuments: stats.totalDocuments,
        totalChunks: stats.totalChunks,
        lastSync: stats.lastSyncTimestamp,
        status: stats.status === 'synced' ? 'Up to date' : stats.status === 'indexing' ? 'Indexing...' : stats.status === 'error' ? 'Error' : 'Ready for Sync',
        categories: stats.categories,
        lastError: stats.lastError
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/rag/documents
 * List all indexed documents in the vector database
 */
ragRouter.get('/documents', (req: Request, res: Response) => {
  try {
    const docs = vectorStore.getAllDocuments();
    res.json(docs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
