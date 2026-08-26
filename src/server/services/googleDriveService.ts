export interface DriveRemoteFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  category: string;
  authority: string;
  parentFolderId?: string;
  parentFolderName?: string;
}

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

/**
 * Determine standardized category string from folder name or file path
 */
export function inferCategoryFromFolder(folderName: string, fileName?: string): string {
  const norm = `${folderName || ''} ${fileName || ''}`.toLowerCase();

  if (norm.includes('law') || norm.includes('act') || norm.includes('statute') || norm.includes('rule') || norm.includes('legal')) {
    return 'law';
  }
  if (norm.includes('scheme') || norm.includes('yojana') || norm.includes('government scheme') || norm.includes('subsidy')) {
    return 'schemes';
  }
  if (norm.includes('agri') || norm.includes('farm') || norm.includes('crop') || norm.includes('pmfby') || norm.includes('kcc')) {
    return 'agriculture';
  }
  if (norm.includes('pacs') || norm.includes('bye-law') || norm.includes('byelaw') || norm.includes('society') || norm.includes('cooperative')) {
    return 'pacs';
  }
  if (norm.includes('finan') || norm.includes('bank') || norm.includes('loan') || norm.includes('credit') || norm.includes('audit')) {
    return 'finance';
  }
  if (norm.includes('grievance') || norm.includes('ombudsman') || norm.includes('complaint') || norm.includes('dispute') || norm.includes('arbitration')) {
    return 'grievance';
  }
  return 'general';
}

/**
 * Infer governing authority name from category or file name
 */
export function inferAuthority(category: string, fileName: string): string {
  const norm = fileName.toLowerCase();
  if (norm.includes('mscs') || norm.includes('multi-state') || norm.includes('crcs')) {
    return 'Central Registrar of Cooperative Societies (CRCS), Govt of India';
  }
  if (norm.includes('pacs') || norm.includes('model byelaw')) {
    return 'Ministry of Cooperation, Government of India';
  }
  if (norm.includes('pmfby') || norm.includes('pm-kisan') || norm.includes('fasal')) {
    return 'Ministry of Agriculture & Farmers Welfare, Govt of India';
  }
  if (norm.includes('rbi') || norm.includes('nabard') || norm.includes('kcc')) {
    return 'Reserve Bank of India / NABARD';
  }

  switch (category) {
    case 'law':
      return 'Ministry of Law & Justice / Ministry of Cooperation';
    case 'schemes':
      return 'Government of India - Department of Agriculture';
    case 'pacs':
      return 'Ministry of Cooperation, Govt of India';
    case 'finance':
      return 'NABARD / Reserve Bank of India';
    case 'grievance':
      return 'Office of the Cooperative Ombudsman & RCS';
    default:
      return 'Government of India / Statutory Authority';
  }
}

/**
 * Get folder metadata by ID
 */
export async function getFolderMetadata(
  folderId: string,
  accessToken: string
): Promise<DriveFolderInfo> {
  const url = `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,webViewLink,mimeType`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch Drive folder metadata (${folderId}): ${errText}`);
  }

  const data = await response.json() as { id: string; name: string; webViewLink?: string };
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink
  };
}

/**
 * List all available top-level and shared folders in Drive for easy admin selection
 */
export async function listUserDriveFolders(
  accessToken: string
): Promise<DriveFolderInfo[]> {
  const query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=50&fields=files(id,name,webViewLink)`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to list Drive folders: ${errText}`);
  }

  const data = await response.json() as { files: Array<{ id: string; name: string; webViewLink?: string }> };
  return data.files || [];
}

/**
 * List all knowledge documents located inside the designated Google Drive knowledge folder and its sub-folders
 */
export async function listFilesInsideKnowledgeFolder(
  rootFolderId: string,
  accessToken: string
): Promise<DriveRemoteFile[]> {
  const filesFound: DriveRemoteFile[] = [];

  // Supported MIME types
  const validMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.google-apps.document',
    'text/plain',
    'text/markdown',
    'text/csv'
  ];

  // Helper to process a folder
  async function scanFolder(folderId: string, folderName: string) {
    const query = `'${folderId}' in parents and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=100&fields=files(id,name,mimeType,modifiedTime,size,webViewLink)`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to list contents of folder "${folderName}" (${folderId}): ${errText}`);
    }

    const data = await response.json() as {
      files: Array<{
        id: string;
        name: string;
        mimeType: string;
        modifiedTime: string;
        size?: string;
        webViewLink?: string;
      }>;
    };

    for (const item of data.files || []) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        // Recursively scan subfolders (e.g. /Law/, /Government Schemes/, etc.)
        await scanFolder(item.id, item.name);
      } else if (validMimes.includes(item.mimeType) || item.name.match(/\.(pdf|docx|doc|txt|md)$/i)) {
        const category = inferCategoryFromFolder(folderName, item.name);
        const authority = inferAuthority(category, item.name);

        filesFound.push({
          id: item.id,
          name: item.name,
          mimeType: item.mimeType,
          modifiedTime: item.modifiedTime,
          size: item.size,
          webViewLink: item.webViewLink || `https://drive.google.com/file/d/${item.id}/view`,
          category,
          authority,
          parentFolderId: folderId,
          parentFolderName: folderName
        });
      }
    }
  }

  // Fetch root folder metadata
  let rootName = 'Root Knowledge Folder';
  try {
    const meta = await getFolderMetadata(rootFolderId, accessToken);
    rootName = meta.name;
  } catch (e) {
    console.warn(`Could not fetch root folder name for ${rootFolderId}, continuing with default name.`);
  }

  await scanFolder(rootFolderId, rootName);
  return filesFound;
}

/**
 * Download raw binary content or export Google Doc as plain text
 */
export async function downloadDriveFileContent(
  fileId: string,
  mimeType: string,
  accessToken: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  // If it's a native Google Docs file, export as text/plain
  if (mimeType === 'application/vnd.google-apps.document') {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
    const response = await fetch(exportUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Doc export failed (${fileId}): ${err}`);
    }

    const arrayBuf = await response.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuf),
      mimeType: 'text/plain'
    };
  }

  // Regular binary file (PDF, DOCX, TXT)
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Drive file download failed (${fileId}): ${err}`);
  }

  const arrayBuf = await response.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuf),
    mimeType
  };
}
