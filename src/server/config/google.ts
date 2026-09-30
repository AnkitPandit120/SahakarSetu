import { config, setRuntimeAccessToken } from './env';

export interface GoogleAuthTokens {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

/**
 * Generate Google OAuth 2.0 Authorization URL with minimum read-only Drive scopes
 */
export function getGoogleAuthUrl(state?: string): string {
  const clientId = config.googleClientId;
  const redirectUri = config.googleRedirectUri;
  
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in environment.');
  }

  // Minimum required read-only scope for Drive and user info
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    ...(state ? { state } : {})
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange OAuth authorization code for Access & Refresh tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleAuthTokens> {
  const clientId = config.googleClientId;
  const clientSecret = config.googleClientSecret;
  const redirectUri = config.googleRedirectUri;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth Client credentials (ID/Secret) are missing.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google token exchange failed: ${errorText}`);
  }

  const tokens = await response.json() as GoogleAuthTokens;
  if (tokens.access_token) {
    setRuntimeAccessToken(tokens.access_token);
  }
  return tokens;
}

/**
 * Refresh Google Access Token using Refresh Token
 */
export async function refreshGoogleAccessToken(refreshToken?: string): Promise<string> {
  const tokenToUse = refreshToken || config.googleRefreshToken;
  const clientId = config.googleClientId;
  const clientSecret = config.googleClientSecret;

  if (!tokenToUse) {
    // If runtime token is already active, return it
    if (config.adminAccessToken) {
      return config.adminAccessToken;
    }
    throw new Error('No Google Refresh Token or Active Access Token configured.');
  }

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth Client ID/Secret required to refresh token.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokenToUse,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google access token refresh failed: ${errorText}`);
  }

  const data = await response.json() as { access_token: string };
  setRuntimeAccessToken(data.access_token);
  return data.access_token;
}

/**
 * Check if a token string looks like a valid Google OAuth access token rather than internal admin token
 */
export function isGoogleOAuthToken(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const t = token.trim();
  if (t.startsWith('adm_') || t.startsWith('gov_admin_')) return false;
  // Google OAuth 2.0 access tokens typically start with ya29. or are bearer tokens
  return t.length > 20;
}

/**
 * Resolve an active access token for Google Drive API operations
 */
export async function getAuthorizedDriveToken(customToken?: string): Promise<string> {
  if (customToken && isGoogleOAuthToken(customToken)) {
    return customToken.trim();
  }
  if (config.adminAccessToken && isGoogleOAuthToken(config.adminAccessToken)) {
    return config.adminAccessToken;
  }
  if (config.googleRefreshToken) {
    try {
      return await refreshGoogleAccessToken(config.googleRefreshToken);
    } catch (e: any) {
      console.warn('Failed to refresh Google access token via refresh token:', e.message);
    }
  }
  throw new Error('Google Drive authorization required. Please authenticate via Google OAuth or connect Google Drive in the dashboard.');
}
