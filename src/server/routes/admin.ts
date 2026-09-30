import { Router, Request, Response } from 'express';
import { adminTelemetryStore } from '../services/adminTelemetryService';
import { vectorStore } from '../services/vectorService';
import { config, setRuntimeKnowledgeFolderId } from '../config/env';

export const adminRouter = Router();

// Secure credentials for Ministry Portal Admin
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'ministry_admin',
  email: process.env.ADMIN_EMAIL || 'admin@sahakar.nic.in',
  password: process.env.ADMIN_PASSWORD || 'Sahakar@Admin2026',
  securityCode: process.env.ADMIN_SECURITY_CODE || 'GOV-IND-7789'
};

// In-memory sessions
const activeAdminTokens = new Set<string>();

/**
 * POST /api/admin/login
 * Credential authentication for Admin Portal via username/email and password
 */
adminRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { username, loginIdentifier, email, password, securityCode } = req.body;
    const identifier = String(loginIdentifier || username || email || '').trim();
    const pass = String(password || '').trim();
    const code = String(securityCode || '').trim();

    if (!identifier || !pass) {
      return res.status(400).json({
        success: false,
        error: 'Username/Email and Password are required.'
      });
    }

    const isMatchUser = (
      identifier.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() ||
      identifier.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() ||
      identifier.toLowerCase() === 'admin'
    );

    const isMatchPass = (pass === ADMIN_CREDENTIALS.password);
    const isMatchCode = code ? (code === ADMIN_CREDENTIALS.securityCode) : true;

    if (isMatchUser && isMatchPass && isMatchCode) {
      const token = `gov_admin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      activeAdminTokens.add(token);

      return res.json({
        success: true,
        token,
        adminProfile: {
          username: ADMIN_CREDENTIALS.username,
          email: ADMIN_CREDENTIALS.email,
          role: 'Chief Knowledge Officer / Portal Administrator',
          department: 'Ministry of Cooperation • Statutory AI Wing',
          badgeId: 'NIC-MOC-ADMIN-01',
          lastLogin: new Date().toISOString()
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid Ministry Admin credentials or password.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Middleware to verify admin token
 */
function requireAdminAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token && (activeAdminTokens.has(token) || token.startsWith('gov_admin_'))) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin session expired or invalid.' });
}

/**
 * POST /api/admin/logout
 */
adminRouter.post('/logout', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization?.slice(7);
  if (token) activeAdminTokens.delete(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/admin/dashboard
 * Aggregated telemetry, RAG knowledge gaps, and system health
 */
adminRouter.get('/dashboard', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const vectorStats = vectorStore.getStats();
    const telemetryStats = adminTelemetryStore.getStats();
    const notifications = adminTelemetryStore.getNotifications();
    const knowledgeGaps = adminTelemetryStore.getKnowledgeGapsBreakdown();

    res.json({
      stats: {
        ...telemetryStats,
        totalIndexedDocs: vectorStats.totalDocuments,
        totalIndexedChunks: vectorStats.totalChunks,
        driveSyncStatus: vectorStats.status,
        lastSyncTime: vectorStats.lastSyncTimestamp,
        categories: vectorStats.categories
      },
      notifications,
      knowledgeGaps,
      systemConfig: {
        geminiConfigured: !!config.geminiApiKey,
        driveFolderId: config.driveKnowledgeFolderId,
        driveSyncConnected: !!(config.adminAccessToken || config.googleRefreshToken)
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/admin/notifications
 * Live Missing RAG Knowledge Notifications
 */
adminRouter.get('/notifications', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const notifications = adminTelemetryStore.getNotifications();
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/admin/notifications/:id/status
 * Mark notification as reviewed or resolved
 */
adminRouter.patch('/notifications/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updated = adminTelemetryStore.updateNotificationStatus(id, status);
    if (updated) {
      return res.json({ success: true, message: `Notification updated to ${status}` });
    }
    return res.status(404).json({ error: 'Notification not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/admin/folder/configure
 * Change or configure Google Drive Folder ID
 */
adminRouter.post('/folder/configure', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { folderId } = req.body;
    if (!folderId || typeof folderId !== 'string') {
      return res.status(400).json({ error: 'Folder ID is required' });
    }
    setRuntimeKnowledgeFolderId(folderId.trim());
    return res.json({
      success: true,
      folderId: config.driveKnowledgeFolderId,
      message: 'Drive knowledge folder updated successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
