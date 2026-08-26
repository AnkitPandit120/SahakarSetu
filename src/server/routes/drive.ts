import { Router, Request, Response } from 'express';
import { config, setRuntimeKnowledgeFolderId, setRuntimeAccessToken } from '../config/env';
import { getAuthorizedDriveToken } from '../config/google';
import { listUserDriveFolders, getFolderMetadata } from '../services/googleDriveService';

export const driveRouter = Router();

/**
 * GET /api/drive/status
 * Get connection state and current target knowledge folder
 */
driveRouter.get('/status', async (req: Request, res: Response) => {
  try {
    let isConnected = false;
    let folderName: string | null = null;
    let authMethod: 'environment_refresh_token' | 'admin_token' | 'none' = 'none';

    if (config.adminAccessToken) {
      isConnected = true;
      authMethod = 'admin_token';
    } else if (config.googleRefreshToken && config.googleClientId) {
      isConnected = true;
      authMethod = 'environment_refresh_token';
    }

    const folderId = config.driveKnowledgeFolderId;
    if (isConnected && folderId) {
      try {
        const token = await getAuthorizedDriveToken();
        const meta = await getFolderMetadata(folderId, token);
        folderName = meta.name;
      } catch (e: any) {
        console.warn('Could not retrieve folder metadata:', e.message);
      }
    }

    res.json({
      connected: isConnected,
      authMethod,
      folderId: folderId || null,
      folderName: folderName || (folderId ? 'Designated Drive Folder' : null)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/drive/folders
 * List folders in Drive for folder picker
 */
driveRouter.get('/folders', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const customToken = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : undefined;
    const token = await getAuthorizedDriveToken(customToken);

    const folders = await listUserDriveFolders(token);
    res.json(folders);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list folders' });
  }
});

/**
 * POST /api/drive/config
 * Set designated knowledge folder ID
 */
driveRouter.post('/config', (req: Request, res: Response) => {
  const { folderId, accessToken } = req.body;
  if (!folderId || typeof folderId !== 'string') {
    return res.status(400).json({ error: 'Valid folderId is required' });
  }

  setRuntimeKnowledgeFolderId(folderId.trim());
  if (accessToken && typeof accessToken === 'string') {
    setRuntimeAccessToken(accessToken.trim());
  }

  res.json({
    success: true,
    folderId: config.driveKnowledgeFolderId,
    message: `Knowledge folder set to ${config.driveKnowledgeFolderId}`
  });
});
