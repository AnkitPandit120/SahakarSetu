import { Router, Request, Response } from 'express';
import { getGoogleAuthUrl, exchangeCodeForTokens } from '../config/google';
import { config, setRuntimeAccessToken } from '../config/env';

export const authRouter = Router();

/**
 * GET /api/auth/google
 * Initiate Google OAuth 2.0 flow
 */
authRouter.get('/google', (req: Request, res: Response) => {
  try {
    const authUrl = getGoogleAuthUrl();
    res.redirect(authUrl);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate OAuth URL' });
  }
});

/**
 * GET /api/auth/google/callback
 * Handle OAuth redirect
 */
authRouter.get('/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Authentication error: ${error}`);
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    // Redirect back to app with connection confirmation
    res.redirect('/?drive_connected=true');
  } catch (err: any) {
    res.status(500).send(`Failed to exchange token: ${err.message}`);
  }
});

/**
 * POST /api/auth/disconnect
 * Disconnect active session
 */
authRouter.post('/disconnect', (req: Request, res: Response) => {
  setRuntimeAccessToken(null);
  res.json({ success: true, message: 'Google Drive disconnected' });
});
