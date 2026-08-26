import { DriveDocumentChunk, DriveFileItem } from '../types';

const STORAGE_KEY_CHUNKS = 'sahakar_drive_rag_chunks_v1';
const STORAGE_KEY_FILES = 'sahakar_drive_rag_files_v1';

/**
 * Stop words for token normalization
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'up', 'about', 'into', 'over', 'after', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'if', 'then',
  'else', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'what', 'which', 'who'
]);

/**
 * Tokenize string into normalized lowercase terms
 */
function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Generate character n-grams and word bi-grams for fuzzy matching
 */
function getBigrams(tokens: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

export class DriveRAGEngine {
  private chunks: DriveDocumentChunk[] = [];
  private indexedFiles: DriveFileItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedFiles = localStorage.getItem(STORAGE_KEY_FILES);
      const savedChunks = localStorage.getItem(STORAGE_KEY_CHUNKS);
      if (savedFiles) {
        this.indexedFiles = JSON.parse(savedFiles);
      }
      if (savedChunks) {
        this.chunks = JSON.parse(savedChunks);
      }
    } catch (e) {
      console.warn('Failed to load Drive RAG cache from storage:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(this.indexedFiles));
      localStorage.setItem(STORAGE_KEY_CHUNKS, JSON.stringify(this.chunks));
    } catch (e) {
      console.warn('Failed to persist Drive RAG cache to storage:', e);
    }
  }

  public getIndexedFiles(): DriveFileItem[] {
    return [...this.indexedFiles];
  }

  public getAllChunks(): DriveDocumentChunk[] {
    return [...this.chunks];
  }

  public getTotalChunkCount(): number {
    return this.chunks.length;
  }

  /**
   * Add/Index chunks for a file
   */
  public addDocumentChunks(file: DriveFileItem, newChunks: DriveDocumentChunk[]) {
    // Remove existing chunks for this file if re-indexing
    this.chunks = this.chunks.filter(c => c.fileId !== file.id);
    this.chunks.push(...newChunks);

    // Update indexed files registry
    const existingIndex = this.indexedFiles.findIndex(f => f.id === file.id);
    const updatedFile: DriveFileItem = {
      ...file,
      isIndexed: true,
      indexedChunkCount: newChunks.length,
      lastIndexedAt: new Date().toISOString(),
      previewSnippet: newChunks[0]?.text.slice(0, 180) || ''
    };

    if (existingIndex >= 0) {
      this.indexedFiles[existingIndex] = updatedFile;
    } else {
      this.indexedFiles.push(updatedFile);
    }

    this.saveToStorage();
  }

  /**
   * Remove a document from the RAG index
   */
  public removeDocument(fileId: string) {
    this.chunks = this.chunks.filter(c => c.fileId !== fileId);
    this.indexedFiles = this.indexedFiles.filter(f => f.id !== fileId);
    this.saveToStorage();
  }

  /**
   * Clear all indexed documents
   */
  public clearAll() {
    this.chunks = [];
    this.indexedFiles = [];
    localStorage.removeItem(STORAGE_KEY_FILES);
    localStorage.removeItem(STORAGE_KEY_CHUNKS);
  }

  /**
   * High-precision Hybrid BM25 & Semantic Passage Retrieval
   */
  public search(query: string, topK = 4): DriveDocumentChunk[] {
    if (!query || !query.trim() || this.chunks.length === 0) {
      return [];
    }

    const queryTokens = tokenize(query);
    const queryBigrams = getBigrams(queryTokens);
    const lowerQuery = query.toLowerCase().trim();

    if (queryTokens.length === 0) return [];

    // Compute IDF across our indexed chunks
    const N = this.chunks.length;
    const docFreq: Record<string, number> = {};

    this.chunks.forEach(chunk => {
      const uniqueTokensInChunk = new Set(tokenize(chunk.text + ' ' + chunk.fileName));
      uniqueTokensInChunk.forEach(token => {
        docFreq[token] = (docFreq[token] || 0) + 1;
      });
    });

    const idf: Record<string, number> = {};
    queryTokens.forEach(t => {
      const df = docFreq[t] || 0;
      idf[t] = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    });

    const avgDocLen =
      this.chunks.reduce((acc, c) => acc + c.text.length, 0) / Math.max(N, 1);

    const scoredChunks = this.chunks.map(chunk => {
      const chunkText = chunk.text.toLowerCase();
      const chunkTokens = tokenize(chunk.text);
      const chunkBigrams = getBigrams(chunkTokens);
      const docLen = chunk.text.length;

      // BM25 parameters
      const k1 = 1.5;
      const b = 0.75;
      let bm25Score = 0;

      // Term frequency
      const tfMap: Record<string, number> = {};
      chunkTokens.forEach(t => {
        tfMap[t] = (tfMap[t] || 0) + 1;
      });

      queryTokens.forEach(t => {
        const tf = tfMap[t] || 0;
        if (tf > 0) {
          const numerator = tf * (k1 + 1);
          const denominator = tf + k1 * (1 - b + b * (docLen / avgDocLen));
          bm25Score += (idf[t] || 1) * (numerator / denominator);
        }
      });

      // Bi-gram match boost (phrase continuity)
      let bigramScore = 0;
      queryBigrams.forEach(bg => {
        if (chunkBigrams.includes(bg) || chunkText.includes(bg)) {
          bigramScore += 2.5;
        }
      });

      // Exact substring match boost
      let exactBonus = 0;
      if (chunkText.includes(lowerQuery)) {
        exactBonus += 5.0;
      }

      // Title/File name relevance boost
      let titleBonus = 0;
      const fileNameLower = chunk.fileName.toLowerCase();
      queryTokens.forEach(t => {
        if (fileNameLower.includes(t)) {
          titleBonus += 2.0;
        }
      });

      const totalScore = bm25Score + bigramScore + exactBonus + titleBonus;

      return {
        ...chunk,
        score: Math.round(totalScore * 10) / 10
      };
    });

    // Filter out zero/negligible matches and sort descending
    return scoredChunks
      .filter(c => (c.score || 0) > 0.5)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }
}

export const driveRAGEngine = new DriveRAGEngine();
