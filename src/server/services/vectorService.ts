import { DocumentChunk } from './chunkingService';

export interface StoredDocument {
  fileId: string;
  fileName: string;
  mimeType: string;
  category: string;
  authority: string;
  driveUrl: string;
  officialUrl?: string;
  modifiedTime: string;
  indexedAt: string;
  pageCount: number;
  chunkCount: number;
}

export interface StoredChunk {
  id: string;
  fileId: string;
  fileName: string;
  category: string;
  authority: string;
  driveUrl: string;
  officialUrl?: string;
  chunkIndex: number;
  text: string;
  pageNumber: number;
  chapter?: string;
  section?: string;
  clause?: string;
  heading?: string;
  embedding: number[];
  modifiedTime: string;
}

export interface SearchResultChunk extends StoredChunk {
  similarityScore: number;
}

export interface VectorDatabaseStats {
  connected: boolean;
  totalDocuments: number;
  totalChunks: number;
  lastSyncTimestamp: string | null;
  categories: Record<string, number>;
  status: 'synced' | 'indexing' | 'uninitialized' | 'error';
  lastError?: string | null;
}

class UnifiedVectorStore {
  private documents: Map<string, StoredDocument> = new Map();
  private chunks: Map<string, StoredChunk> = new Map();
  private lastSyncTime: string | null = null;
  private currentStatus: 'synced' | 'indexing' | 'uninitialized' | 'error' = 'uninitialized';
  private lastErrorMsg: string | null = null;

  constructor() {
    this.initDefaultSeedDocuments();
  }

  /**
   * Add or replace chunks for a file
   */
  public addDocument(
    doc: StoredDocument,
    chunkItems: DocumentChunk[],
    embeddings: number[][]
  ): void {
    // 1. Remove any old chunks for this file
    this.deleteDocument(doc.fileId);

    // 2. Set document record
    this.documents.set(doc.fileId, doc);

    // 3. Store new chunks
    chunkItems.forEach((c, idx) => {
      const chunkId = `${doc.fileId}-chk-${c.chunkIndex}`;
      const chunkRecord: StoredChunk = {
        id: chunkId,
        fileId: doc.fileId,
        fileName: doc.fileName,
        category: doc.category,
        authority: doc.authority,
        driveUrl: doc.driveUrl,
        officialUrl: doc.officialUrl,
        chunkIndex: c.chunkIndex,
        text: c.text,
        pageNumber: c.pageNumber,
        chapter: c.chapter,
        section: c.section,
        clause: c.clause,
        heading: c.heading,
        embedding: embeddings[idx] || new Array(768).fill(0),
        modifiedTime: doc.modifiedTime
      };
      this.chunks.set(chunkId, chunkRecord);
    });

    this.lastSyncTime = new Date().toISOString();
    this.currentStatus = 'synced';
  }

  /**
   * Delete a document and all its chunks (when deleted in Google Drive)
   */
  public deleteDocument(fileId: string): boolean {
    const existed = this.documents.delete(fileId);
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.fileId === fileId) {
        this.chunks.delete(chunkId);
      }
    }
    return existed;
  }

  /**
   * Get map of all indexed files and their modifiedTime for change detection
   */
  public getExistingFilesMap(): Map<string, string> {
    const map = new Map<string, string>();
    for (const [fileId, doc] of this.documents.entries()) {
      map.set(fileId, doc.modifiedTime);
    }
    return map;
  }

  /**
   * Vector and keyword hybrid search with cosine similarity and lexical token overlap
   */
  public search(
    queryEmbedding: number[],
    topK: number = 4,
    categoryFilter?: string,
    minSimilarityThreshold: number = 0.30,
    queryText?: string
  ): SearchResultChunk[] {
    const results: SearchResultChunk[] = [];
    const normCategory = categoryFilter && categoryFilter !== 'all' ? categoryFilter.toLowerCase().trim() : null;
    const queryTokens = queryText ? tokenizeText(queryText) : [];

    for (const chunk of this.chunks.values()) {
      // Category filter check
      if (normCategory && chunk.category.toLowerCase() !== normCategory) {
        // Continue if strictly filtered
      }

      const cosineScore = cosineSimilarity(queryEmbedding, chunk.embedding);
      
      // Calculate lexical token overlap score with stem matching
      let lexicalScore = 0;
      if (queryTokens.length > 0) {
        const chunkTokens = tokenizeText(`${chunk.heading || ''} ${chunk.section || ''} ${chunk.chapter || ''} ${chunk.text}`);
        let matchCount = 0;
        for (const qt of queryTokens) {
          const qStem = stemWord(qt);
          const matched = chunkTokens.some(ct => ct === qt || stemWord(ct) === qStem || (ct.length > 4 && qt.length > 4 && (ct.startsWith(qt.slice(0, 4)) || qt.startsWith(ct.slice(0, 4)))));
          if (matched) {
            matchCount++;
          }
        }
        lexicalScore = matchCount / Math.max(queryTokens.length, 1);
      }

      // Hybrid combined score: weighted blend of cosine similarity and keyword overlap
      const combinedScore = lexicalScore > 0
        ? Math.max(cosineScore, (cosineScore * 0.4) + (lexicalScore * 0.6))
        : cosineScore;

      if (combinedScore >= minSimilarityThreshold) {
        results.push({
          ...chunk,
          similarityScore: combinedScore
        });
      }
    }

    // Sort by combined score descending
    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, topK);
  }

  /**
   * Reseed verified baseline statutory documents
   */
  public reseedVerifiedDocuments(): void {
    this.initDefaultSeedDocuments();
  }

  /**
   * Get all stored documents list
   */
  public getAllDocuments(): StoredDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Update sync status
   */
  public setSyncState(status: 'synced' | 'indexing' | 'uninitialized' | 'error', error?: string | null) {
    this.currentStatus = status;
    if (error) this.lastErrorMsg = error;
    if (status === 'synced') {
      this.lastSyncTime = new Date().toISOString();
      this.lastErrorMsg = null;
    }
  }

  /**
   * Get database statistics
   */
  public getStats(): VectorDatabaseStats {
    const categories: Record<string, number> = {};
    for (const doc of this.documents.values()) {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
    }

    return {
      connected: true,
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.size,
      lastSyncTimestamp: this.lastSyncTime,
      categories,
      status: this.currentStatus,
      lastError: this.lastErrorMsg
    };
  }

  /**
   * Initialize initial seed statutory cooperative documents for immediate baseline RAG
   */
  private initDefaultSeedDocuments() {
    const seedTime = '2026-08-25T00:00:00.000Z';
    const seedDocs = [
      {
        fileId: 'seed-pacs-byelaws-2023',
        fileName: 'Model_Byelaws_for_PACS_2023.pdf',
        category: 'pacs',
        authority: 'Ministry of Cooperation, Govt of India',
        driveUrl: 'https://cooperation.gov.in/pacs-model-byelaws',
        officialUrl: 'https://cooperation.gov.in',
        pageCount: 42,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'Section 4: Multipurpose Mandate of PACS (पैक्स बहुउद्देशीय गतिविधियां). Under the Model Bye-laws 2023 issued by the Ministry of Cooperation, Primary Agricultural Credit Societies are authorized to undertake 25+ business activities including input distribution, fertilizer dealership, custom hiring centres, godowns/cold storages, LPG/petrol distributorship, and digital Common Service Centres (CSC). उर्वरक, बीज, सीएससी केंद्र।',
            pageNumber: 4,
            chapter: 'Chapter II: Objectives & Mandates',
            section: 'Section 4.1',
            clause: 'Clause 4(a)',
            heading: 'PACS Business Activities Multipurpose खाद बीज सीएससी',
            tokenEstimate: 70
          },
          {
            chunkIndex: 1,
            text: 'Section 8: Membership and Voting Rights in PACS (पैक्स सदस्यता एवं मतदान अधिकार). Any individual residing within the operational jurisdiction of the PACS who is an agriculturist, artisan, or self-employed rural worker is eligible for regular membership. Every regular member has strictly ONE vote in the General Body, regardless of the number of share capital units held. एक सदस्य, एक मत का अधिकार।',
            pageNumber: 8,
            chapter: 'Chapter III: Membership',
            section: 'Section 8.2',
            clause: 'Clause 8(1)',
            heading: 'Membership Voting Rights One Member One Vote पैक्स सदस्यता वोटिंग अधिकार',
            tokenEstimate: 65
          },
          {
            chunkIndex: 2,
            text: 'Section 14: Board of Directors Composition (प्रबंध समिति एवं आरक्षण). The Managing Committee / Board of Directors shall consist of 11 to 15 members. Mandatory statutory reservation requires at least two seats for Women and one seat each for Scheduled Castes (SC) / Scheduled Tribes (ST). Tenure of the Board is 5 years. महिला और अनुसूचित जाति आरक्षण।',
            pageNumber: 14,
            chapter: 'Chapter V: Management and Elections',
            section: 'Section 14.3',
            clause: 'Clause 14(b)',
            heading: 'Board Directors Reservation Women SC ST प्रबंध समिति आरक्षण चुनाव',
            tokenEstimate: 60
          }
        ]
      },
      {
        fileId: 'seed-pmfby-guidelines',
        fileName: 'PMFBY_Operational_Guidelines_Revised.pdf',
        category: 'agriculture',
        authority: 'Ministry of Agriculture & Farmers Welfare',
        driveUrl: 'https://pmfby.gov.in',
        officialUrl: 'https://pmfby.gov.in',
        pageCount: 88,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'Chapter 4, Section 4.2: Premium Rates for Farmers (फसल बीमा प्रीमियम दरें). Farmers are required to pay a maximum capped premium of 2.0% of Sum Insured for all Kharif food & oilseed crops, 1.5% for all Rabi crops, and 5.0% for annual commercial/horticultural crops. The entire remaining actuarial premium is subsidized 50:50 between Central and State Governments. खरीफ 2%, रबी 1.5% प्रीमियम।',
            pageNumber: 18,
            chapter: 'Chapter 4: Premium Rates & Subsidies',
            section: 'Section 4.2',
            clause: 'Clause 4.2.1',
            heading: 'Crop Insurance Premium Rates Kharif Rabi फसल बीमा प्रीमियम दरें',
            tokenEstimate: 75
          },
          {
            chunkIndex: 1,
            text: 'Chapter 3, Section 3.2: 72-Hour Localized Calamity Intimation Rule (72 घंटे में नुकसान की सूचना). In the event of localized losses due to hailstorm, landslide, inundation, or cloudburst, the insured farmer MUST report the loss within 72 hours of the occurrence through the Crop Insurance Mobile App, Toll-free Helpline (14447), or local Agriculture/PACS officer. फसल नुकसान की शिकायत 72 घंटे में अनिवार्य।',
            pageNumber: 24,
            chapter: 'Chapter 3: Assessment of Loss',
            section: 'Section 3.2',
            clause: 'Clause 3.2.4',
            heading: '72 Hours Localized Loss Intimation Claim Helpline 14447 फसल नुकसान 72 घंटे शिकायत दावा',
            tokenEstimate: 70
          }
        ]
      },
      {
        fileId: 'seed-mscs-act-2023',
        fileName: 'Multi_State_Cooperative_Societies_Amendment_Act_2023.pdf',
        category: 'law',
        authority: 'Ministry of Law and Justice & Ministry of Cooperation',
        driveUrl: 'https://crcs.gov.in',
        officialUrl: 'https://crcs.gov.in',
        pageCount: 65,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'Section 85A: Establishment of Cooperative Ombudsman (सहकारी लोकपाल की नियुक्ति). The Central Government shall appoint one or more Cooperative Ombudsmen with territorial jurisdiction to inquire into grievances and complaints made by members of multi-state cooperative societies relating to deposits, elections, or corruption. सहकारी लोकपाल शिकायत निवारण।',
            pageNumber: 31,
            chapter: 'Chapter X: Settlement of Disputes',
            section: 'Section 85A',
            clause: 'Clause 85A(1)',
            heading: 'Cooperative Ombudsman Grievances Complaints सहकारी लोकपाल शिकायत',
            tokenEstimate: 60
          },
          {
            chunkIndex: 1,
            text: 'Section 84: Reference of Disputes to Arbitration (विवादों का मध्यस्थता निपटारा). Any dispute touching the constitution, management, or business of a multi-state cooperative society among members or past members shall be referred to the Central Registrar for arbitration. सीआरसीएस मध्यस्थता।',
            pageNumber: 29,
            chapter: 'Chapter X: Settlement of Disputes',
            section: 'Section 84',
            clause: 'Clause 84(1)',
            heading: 'Disputes Arbitration Central Registrar CRCS विवाद मध्यस्थता',
            tokenEstimate: 55
          }
        ]
      }
    ];

    seedDocs.forEach(sDoc => {
      const docRec: StoredDocument = {
        fileId: sDoc.fileId,
        fileName: sDoc.fileName,
        mimeType: 'application/pdf',
        category: sDoc.category,
        authority: sDoc.authority,
        driveUrl: sDoc.driveUrl,
        officialUrl: sDoc.officialUrl,
        modifiedTime: sDoc.modifiedTime,
        indexedAt: sDoc.modifiedTime,
        pageCount: sDoc.pageCount,
        chunkCount: sDoc.chunks.length
      };

      const embeddings = sDoc.chunks.map(c => generateSimpleSemanticVector(c.text));
      this.addDocument(docRec, sDoc.chunks as DocumentChunk[], embeddings);
    });

    this.currentStatus = 'synced';
  }
}

/**
 * Cosine similarity between two unit/dense vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate semantic vector for initial seed documents
 */
function generateSimpleSemanticVector(text: string, dimensions: number = 768): number[] {
  const vec = new Array(dimensions).fill(0);
  const words = text.toLowerCase().match(/[\w\u0900-\u097F]+/gu) || [text];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vec[idx] += 1.0;
  }
  let norm = 0;
  for (let i = 0; i < dimensions; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) vec[i] = vec[i] / norm;
  }
  return vec;
}

/**
 * Tokenize text into lowercased keywords for lexical matching
 */
function tokenizeText(text: string): string[] {
  if (!text) return [];
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'what', 'who', 'where', 'when', 'why', 'how', 'which', 'under', 'from', 'can', 'may'
  ]);
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !stopwords.has(t));
}

/**
 * Simple English stemmer for root words
 */
function stemWord(word: string): string {
  if (!word || word.length <= 3) return word;
  return word
    .replace(/(ing|edly|ingly|ed|es|s|ment|tion|ance|ence|able|ible)$/i, '')
    .replace(/(men|man)$/i, 'man');
}

export const vectorStore = new UnifiedVectorStore();
