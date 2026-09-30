import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'env/.env') });

export interface ServerConfig {
  geminiApiKey: string;
  groqApiKey: string;
  elevenLabsApiKey: string;
  appUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleRefreshToken: string;
  driveKnowledgeFolderId: string;
  databaseUrl: string;
  sessionSecret: string;
  adminAccessToken: string | null;
}

// In-memory runtime state for dynamic tokens / folder configuration
let runtimeAccessToken: string | null = null;
let runtimeKnowledgeFolderId: string | null = null;

export function cleanFolderId(input: string | null | undefined): string {
  if (!input) return '';
  const trimmed = input.trim();
  const urlMatch = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
  return urlMatch ? urlMatch[1] : trimmed;
}

export const config: ServerConfig = {
  get geminiApiKey() {
    return process.env.GEMINI_API_KEY || '';
  },
  get groqApiKey() {
    return process.env.GROQ_API_KEY || '';
  },
  get elevenLabsApiKey() {
    const key = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_LABS_API_KEY;
    // If environment variable is still the older expired key, use the newly updated key
    if (!key || key.startsWith('sk_209d')) {
      return 'sk_c26f84622c048611452a963a9e8a1f21bf87d84415924fc7';
    }
    return key;
  },
  get appUrl() {
    return process.env.APP_URL || 'http://localhost:3000';
  },
  get googleClientId() {
    return '396032484925-o9msaklbqkghnilcugtgbfglpuuv9mn6.apps.googleusercontent.com';
  },
  get googleClientSecret() {
    return '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';
  },
  get googleRedirectUri() {
    return process.env.GOOGLE_REDIRECT_URI || `${this.appUrl}/api/auth/google/callback`;
  },
  get googleRefreshToken() {
    return process.env.GOOGLE_REFRESH_TOKEN || '';
  },
  get driveKnowledgeFolderId() {
    if (runtimeKnowledgeFolderId) {
      return cleanFolderId(runtimeKnowledgeFolderId);
    }
    return cleanFolderId(process.env.DRIVE_KNOWLEDGE_FOLDER_ID && !process.env.DRIVE_KNOWLEDGE_FOLDER_ID.includes('1S6vh6BejlCwJiSPApa846qk1TxXFOanc') ? process.env.DRIVE_KNOWLEDGE_FOLDER_ID : '13e3wpZcDNwRS0uwwhvLhb0PUxHUOIgHQ');
  },
  get databaseUrl() {
    return process.env.DATABASE_URL || '';
  },
  get sessionSecret() {
    return process.env.SESSION_SECRET || 'sahakar-setu-secure-session-2026';
  },
  get adminAccessToken() {
    return runtimeAccessToken;
  }
};

export function setRuntimeAccessToken(token: string | null) {
  runtimeAccessToken = token;
}

export function setRuntimeKnowledgeFolderId(folderId: string | null) {
  if (!folderId) {
    runtimeKnowledgeFolderId = null;
    return;
  }
  runtimeKnowledgeFolderId = cleanFolderId(folderId);
}
