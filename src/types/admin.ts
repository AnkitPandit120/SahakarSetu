export interface MissingRagQueryNotification {
  id: string;
  query: string;
  language: string;
  category?: string;
  timestamp: string;
  fallbackSourceType: 'web' | 'no_source';
  status: 'pending' | 'reviewed' | 'resolved';
  webSourcesFound?: Array<{ title: string; officialUrl: string }>;
  suggestedAction?: string;
}

export interface AdminStats {
  totalUserQueries: number;
  ragHits: number;
  webFallbacks: number;
  unresolvedMissingQueries: number;
  totalIndexedDocs: number;
  totalIndexedChunks: number;
  driveSyncStatus: string;
  lastSyncTime: string | null;
}

export interface KnowledgeGapCategory {
  category: string;
  count: number;
  examples: string[];
}
