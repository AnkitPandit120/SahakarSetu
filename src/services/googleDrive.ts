import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFileItem, DriveDocumentChunk } from '../types';

// Initialize Firebase App instance safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Provider with Drive Readonly and Drive.File scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.file');
// Request additional standard profile scopes
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

// In-memory token cache (strictly conforming to security requirements)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initialize Auth State Listener
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not in memory after reload -> user will need to connect with popup
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign In with Drive permissions
 */
export const signInWithGoogleDrive = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Retrieve active in-memory access token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out and clear cached token
 */
export const disconnectGoogleDrive = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Sign out error:', e);
  } finally {
    cachedAccessToken = null;
  }
};

/**
 * List files from Google Drive
 */
export const listDriveFiles = async (
  query?: string,
  token?: string
): Promise<DriveFileItem[]> => {
  const activeToken = token || cachedAccessToken;
  if (!activeToken) {
    throw new Error('Authentication required: Google Drive access token is not available.');
  }

  // Construct query to retrieve relevant files (Docs, Sheets, PDFs, Text files, markdown, etc.)
  let qFilter = "trashed = false and mimeType != 'application/vnd.google-apps.folder'";
  if (query && query.trim()) {
    const escapedQuery = query.replace(/'/g, "\\'");
    qFilter += ` and (name contains '${escapedQuery}' or fullText contains '${escapedQuery}')`;
  }

  const fields = 'files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,thumbnailLink)';
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=50&orderBy=modifiedTime desc&q=${encodeURIComponent(qFilter)}&fields=${encodeURIComponent(fields)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${activeToken}`
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Google Drive API error: ${response.status}`);
  }

  const data = await response.json();
  const rawFiles = data.files || [];

  return rawFiles.map((f: any) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: f.size ? parseInt(f.size, 10) : undefined,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
    iconLink: f.iconLink,
    isIndexed: false
  }));
};

/**
 * Fetch and extract text from a Google Drive file
 */
export const extractDriveFileText = async (
  fileId: string,
  mimeType: string,
  token?: string
): Promise<string> => {
  const activeToken = token || cachedAccessToken;
  if (!activeToken) {
    throw new Error('Authentication required: Google Drive access token is not available.');
  }

  let textContent = '';

  try {
    if (mimeType === 'application/vnd.google-apps.document') {
      // Export Google Doc as plain text
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
      const res = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error(`Failed to export Google Doc: ${res.statusText}`);
      textContent = await res.text();
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      // Export Google Sheet as CSV
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`;
      const res = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error(`Failed to export Google Sheet: ${res.statusText}`);
      textContent = await res.text();
    } else if (
      mimeType.startsWith('text/') ||
      mimeType === 'application/json' ||
      mimeType === 'application/xml' ||
      mimeType === 'text/markdown' ||
      mimeType === 'text/csv'
    ) {
      // Fetch direct raw file content
      const contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const res = await fetch(contentUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error(`Failed to read file media: ${res.statusText}`);
      textContent = await res.text();
    } else if (mimeType === 'application/pdf') {
      // For PDF files: fetch file info and text snippet
      const contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const res = await fetch(contentUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const rawBuffer = await res.arrayBuffer();
        // Extract plain text ASCII strings from PDF stream
        const bytes = new Uint8Array(rawBuffer);
        let extracted = '';
        let currentString = '';
        for (let i = 0; i < bytes.length; i++) {
          const charCode = bytes[i];
          // Printable ASCII characters and newlines
          if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
            currentString += String.fromCharCode(charCode);
          } else {
            if (currentString.length > 4 && !/^\s+$/.test(currentString)) {
              extracted += currentString + ' ';
            }
            currentString = '';
          }
        }
        textContent = extracted.slice(0, 100000); // safety cap
      }
    } else {
      // Generic fallback: fetch metadata description and name
      const metaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,description,properties`;
      const res = await fetch(metaUrl, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const meta = await res.json();
        textContent = `${meta.name}\n${meta.description || ''}`;
      }
    }
  } catch (err: any) {
    console.error(`Error extracting text for file ${fileId}:`, err);
    throw new Error(`Failed to read file content: ${err.message}`);
  }

  return cleanExtractedText(textContent);
};

/**
 * Clean extracted text for semantic RAG chunking
 */
function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Chunk a document into semantic passages for RAG retrieval
 */
export const chunkDocument = (
  file: DriveFileItem,
  fullText: string,
  targetChunkSize = 750,
  overlap = 120
): DriveDocumentChunk[] => {
  if (!fullText || !fullText.trim()) return [];

  const chunks: DriveDocumentChunk[] = [];
  const paragraphs = fullText.split(/\n\n+/);
  
  let currentChunk = '';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    if (currentChunk.length + trimmedPara.length <= targetChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedPara;
    } else {
      // If single paragraph is larger than targetChunkSize, split by sentence
      if (trimmedPara.length > targetChunkSize) {
        const sentences = trimmedPara.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmedPara];
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length <= targetChunkSize) {
            currentChunk += (currentChunk ? ' ' : '') + sentence.trim();
          } else {
            if (currentChunk.trim()) {
              chunks.push({
                id: `chunk-${file.id}-${chunkIndex}`,
                fileId: file.id,
                fileName: file.name,
                text: currentChunk.trim(),
                chunkIndex,
                webViewLink: file.webViewLink,
                authority: 'Google Drive Document'
              });
              chunkIndex++;
              // Retain overlap from end of currentChunk
              const overlapText = currentChunk.slice(-overlap);
              currentChunk = overlapText + ' ' + sentence.trim();
            } else {
              currentChunk = sentence.trim();
            }
          }
        }
      } else {
        if (currentChunk.trim()) {
          chunks.push({
            id: `chunk-${file.id}-${chunkIndex}`,
            fileId: file.id,
            fileName: file.name,
            text: currentChunk.trim(),
            chunkIndex,
            webViewLink: file.webViewLink,
            authority: 'Google Drive Document'
          });
          chunkIndex++;
          const overlapText = currentChunk.slice(-overlap);
          currentChunk = overlapText + '\n\n' + trimmedPara;
        } else {
          currentChunk = trimmedPara;
        }
      }
    }
  }

  // Push remainder
  if (currentChunk.trim()) {
    chunks.push({
      id: `chunk-${file.id}-${chunkIndex}`,
      fileId: file.id,
      fileName: file.name,
      text: currentChunk.trim(),
      chunkIndex,
      webViewLink: file.webViewLink,
      authority: 'Google Drive Document'
    });
  }

  // Update total chunks count on each
  chunks.forEach(c => {
    c.totalChunks = chunks.length;
  });

  return chunks;
};

/**
 * Find or create a folder in Google Drive by name and optional parent folder ID
 */
export const findOrCreateDriveFolder = async (
  folderName: string,
  parentId?: string,
  token?: string
): Promise<{ id: string; name: string; webViewLink: string; isNew: boolean }> => {
  const activeToken = token || cachedAccessToken;
  if (!activeToken) {
    throw new Error('Authentication required: Google Drive access token is not available.');
  }

  // Check if folder already exists
  let q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName.replace(/'/g, "\\'")}' and trashed = false`;
  if (parentId) {
    q += ` and '${parentId}' in parents`;
  }

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink)`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${activeToken}` }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const existing = data.files[0];
      return {
        id: existing.id,
        name: existing.name,
        webViewLink: existing.webViewLink || `https://drive.google.com/drive/folders/${existing.id}`,
        isNew: false
      };
    }
  }

  // Create new folder
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  if (parentId) {
    metadata.parents = [parentId];
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create folder "${folderName}": ${createRes.statusText}`);
  }

  const created = await createRes.json();
  return {
    id: created.id,
    name: created.name,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
    isNew: true
  };
};

/**
 * Upload or create a text / markdown file in a specific Google Drive folder using multipart upload
 */
export const createDriveDocument = async (
  fileName: string,
  content: string,
  parentFolderId?: string,
  mimeType = 'text/markdown',
  token?: string
): Promise<{ id: string; name: string; webViewLink: string }> => {
  const activeToken = token || cachedAccessToken;
  if (!activeToken) {
    throw new Error('Authentication required: Google Drive access token is not available.');
  }

  // Check if file with same name already exists in this folder to avoid duplicates
  let checkQ = `name = '${fileName.replace(/'/g, "\\'")}' and trashed = false`;
  if (parentFolderId) {
    checkQ += ` and '${parentFolderId}' in parents`;
  }
  const checkUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(checkQ)}&fields=files(id,name,webViewLink)`;
  const checkRes = await fetch(checkUrl, {
    headers: { Authorization: `Bearer ${activeToken}` }
  });

  if (checkRes.ok) {
    const existingData = await checkRes.json();
    if (existingData.files && existingData.files.length > 0) {
      const existing = existingData.files[0];
      return {
        id: existing.id,
        name: existing.name,
        webViewLink: existing.webViewLink || `https://drive.google.com/file/d/${existing.id}/view`
      };
    }
  }

  // Create multipart body for Google Drive upload API
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: any = {
    name: fileName,
    mimeType: mimeType
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n` +
    content +
    closeDelimiter;

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType,size,modifiedTime';
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to create file "${fileName}": ${uploadRes.statusText}`);
  }

  const result = await uploadRes.json();
  return {
    id: result.id,
    name: result.name,
    webViewLink: result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`
  };
};

