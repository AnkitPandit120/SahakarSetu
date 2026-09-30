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
 * Valid supported MIME types and file extensions for Knowledge Base indexing
 */
export const SUPPORTED_KNOWLEDGE_MIMES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.google-apps.document',
  'application/vnd.google-apps.spreadsheet',
  'text/plain',
  'text/markdown',
  'text/x-markdown',
  'text/csv',
  'application/rtf',
  'text/rtf',
  'text/html'
];

export const SUPPORTED_EXTENSIONS_REGEX = /\.(pdf|docx|doc|txt|md|markdown|csv|rtf|html|htm)$/i;

/**
 * Check if a file item is a valid indexable knowledge document
 */
export function isValidKnowledgeDocument(mimeType: string, fileName: string): boolean {
  if (!mimeType && !fileName) return false;
  const cleanMime = (mimeType || '').toLowerCase();
  const cleanName = (fileName || '').toLowerCase();

  return (
    SUPPORTED_KNOWLEDGE_MIMES.includes(cleanMime) ||
    cleanMime.startsWith('text/') ||
    cleanMime.includes('document') ||
    cleanMime.includes('word') ||
    cleanMime.includes('pdf') ||
    SUPPORTED_EXTENSIONS_REGEX.test(cleanName)
  );
}

/**
 * Determine standardized category string from folder name or file path
 */
export function inferCategoryFromFolder(folderName: string, fileName?: string): string {
  const norm = `${folderName || ''} ${fileName || ''}`.toLowerCase();

  if (norm.includes('traffic') || norm.includes('vehicle') || norm.includes('motor') || norm.includes('challan') || norm.includes('morth') || norm.includes('helmet') || norm.includes('driving')) {
    return 'traffic';
  }
  if (norm.includes('land') || norm.includes('mutation') || norm.includes('svamitva') || norm.includes('property') || norm.includes('revenue') || norm.includes('dakhil') || norm.includes('jamabandi') || norm.includes('7/12') || norm.includes('khasra')) {
    return 'land';
  }
  if (norm.includes('scheme') || norm.includes('yojana') || norm.includes('government scheme') || norm.includes('subsidy') || norm.includes('pm-kisan') || norm.includes('kisan')) {
    return 'schemes';
  }
  if (norm.includes('agri') || norm.includes('farm') || norm.includes('crop') || norm.includes('pmfby') || norm.includes('kcc') || norm.includes('seed') || norm.includes('fertilizer') || norm.includes('fco')) {
    return 'agriculture';
  }
  if (norm.includes('pacs') || norm.includes('bye-law') || norm.includes('byelaw') || norm.includes('society') || norm.includes('cooperative') || norm.includes('sahakar') || norm.includes('mscs') || norm.includes('crcs')) {
    return 'pacs';
  }
  if (norm.includes('finan') || norm.includes('bank') || norm.includes('loan') || norm.includes('credit') || norm.includes('audit') || norm.includes('subvention') || norm.includes('nabard')) {
    return 'finance';
  }
  if (norm.includes('grievance') || norm.includes('ombudsman') || norm.includes('complaint') || norm.includes('dispute') || norm.includes('arbitration') || norm.includes('lokpal')) {
    return 'grievance';
  }
  if (norm.includes('law') || norm.includes('act') || norm.includes('statute') || norm.includes('rule') || norm.includes('legal') || norm.includes('reference') || norm.includes('rti') || norm.includes('fir') || norm.includes('constitution') || norm.includes('consumer')) {
    return 'law';
  }
  return 'general';
}

/**
 * Infer governing authority name from category or file name
 */
export function inferAuthority(category: string, fileName: string): string {
  const norm = fileName.toLowerCase();
  if (norm.includes('vehicle') || norm.includes('traffic') || norm.includes('morth')) {
    return 'Ministry of Road Transport and Highways (MoRTH), Govt of India';
  }
  if (norm.includes('land') || norm.includes('svamitva') || norm.includes('revenue') || norm.includes('dolr')) {
    return 'Department of Land Resources & Ministry of Panchayati Raj';
  }
  if (norm.includes('mscs') || norm.includes('multi-state') || norm.includes('crcs')) {
    return 'Central Registrar of Cooperative Societies (CRCS), Govt of India';
  }
  if (norm.includes('pacs') || norm.includes('model byelaw')) {
    return 'Ministry of Cooperation, Government of India';
  }
  if (norm.includes('pmfby') || norm.includes('pm-kisan') || norm.includes('fasal') || norm.includes('farmer') || norm.includes('seed')) {
    return 'Ministry of Agriculture & Farmers Welfare, Govt of India';
  }
  if (norm.includes('rbi') || norm.includes('nabard') || norm.includes('kcc')) {
    return 'Reserve Bank of India / NABARD';
  }
  if (norm.includes('rti') || norm.includes('constitution') || norm.includes('quick_ref') || norm.includes('quick reference')) {
    return 'Ministry of Law and Justice, Government of India';
  }

  switch (category) {
    case 'traffic':
      return 'Ministry of Road Transport and Highways (MoRTH), Govt of India';
    case 'land':
      return 'Department of Land Resources & Ministry of Panchayati Raj';
    case 'law':
      return 'Ministry of Law and Justice, Government of India';
    case 'schemes':
      return 'Government of India - Department of Agriculture';
    case 'pacs':
      return 'Ministry of Cooperation, Govt of India';
    case 'agriculture':
      return 'Ministry of Agriculture & Farmers Welfare, Govt of India';
    case 'finance':
      return 'NABARD / Reserve Bank of India';
    case 'grievance':
      return 'Office of the Cooperative Ombudsman & RCS';
    default:
      return 'Government of India / Statutory Authority';
  }
}

/**
 * Get folder metadata by ID with shared drive support
 */
export async function getFolderMetadata(
  folderId: string,
  accessToken: string
): Promise<DriveFolderInfo> {
  const url = `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,webViewLink,mimeType&supportsAllDrives=true`;
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
 * List all available top-level and shared folders in Drive for easy admin selection (with full pagination)
 */
export async function listUserDriveFolders(
  accessToken: string
): Promise<DriveFolderInfo[]> {
  const allFolders: DriveFolderInfo[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=100&fields=nextPageToken,files(id,name,webViewLink)&supportsAllDrives=true&includeItemsFromAllDrives=true`;
    if (pageToken) {
      url += `&pageToken=${encodeURIComponent(pageToken)}`;
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to list Drive folders: ${errText}`);
    }

    const data = await response.json() as {
      nextPageToken?: string;
      files: Array<{ id: string; name: string; webViewLink?: string }>;
    };

    if (data.files && data.files.length > 0) {
      allFolders.push(...data.files);
    }
    pageToken = data.nextPageToken;
  } while (pageToken && allFolders.length < 500);

  return allFolders;
}

/**
 * List all knowledge documents located inside the designated Google Drive knowledge folder and its sub-folders.
 * Fully paginated with nextPageToken loop and supportsAllDrives / includeItemsFromAllDrives enabled.
 */
export async function listFilesInsideKnowledgeFolder(
  rootFolderId: string,
  accessToken: string
): Promise<DriveRemoteFile[]> {
  const filesFound: DriveRemoteFile[] = [];
  const visitedFolderIds = new Set<string>();

  // Helper to recursively process a folder and all its pages
  async function scanFolder(folderId: string, folderName: string) {
    if (visitedFolderIds.has(folderId)) {
      return;
    }
    visitedFolderIds.add(folderId);

    let pageToken: string | undefined = undefined;

    do {
      const query = `'${folderId}' in parents and trashed = false`;
      let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=100&fields=nextPageToken,files(id,name,mimeType,modifiedTime,size,webViewLink,parents)&supportsAllDrives=true&includeItemsFromAllDrives=true`;
      if (pageToken) {
        url += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to list contents of folder "${folderName}" (${folderId}): ${errText}`);
      }

      const data = await response.json() as {
        nextPageToken?: string;
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
          // Recursively scan subfolders (e.g. /Law/, /Agriculture/, /Traffic/, etc.)
          await scanFolder(item.id, item.name);
        } else if (isValidKnowledgeDocument(item.mimeType, item.name)) {
          const category = inferCategoryFromFolder(folderName, item.name);
          const authority = inferAuthority(category, item.name);

          filesFound.push({
            id: item.id,
            name: item.name,
            mimeType: item.mimeType,
            modifiedTime: item.modifiedTime || new Date().toISOString(),
            size: item.size,
            webViewLink: item.webViewLink || `https://drive.google.com/file/d/${item.id}/view`,
            category,
            authority,
            parentFolderId: folderId,
            parentFolderName: folderName
          });
        }
      }

      pageToken = data.nextPageToken;
    } while (pageToken);
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
 * Download raw binary content or export Google Doc / Sheet as plain text / CSV
 */
export async function downloadDriveFileContent(
  fileId: string,
  mimeType: string,
  accessToken: string
): Promise<{ buffer: Buffer; mimeType: string }> {
  // 1. Native Google Docs file -> export as text/plain
  if (mimeType === 'application/vnd.google-apps.document') {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain&supportsAllDrives=true`;
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

  // 2. Native Google Sheets file -> export as text/csv
  if (mimeType === 'application/vnd.google-apps.spreadsheet') {
    const exportUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv&supportsAllDrives=true`;
    const response = await fetch(exportUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Sheet export failed (${fileId}): ${err}`);
    }

    const arrayBuf = await response.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuf),
      mimeType: 'text/csv'
    };
  }

  // 3. Regular binary file (PDF, DOCX, TXT, CSV, RTF, MD)
  const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`;
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

