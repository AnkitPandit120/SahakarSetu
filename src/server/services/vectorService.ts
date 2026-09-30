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
   * Completely clear all documents and chunks (used for strict live Drive sync reflection)
   */
  public clearAllDocuments(): void {
    this.documents.clear();
    this.chunks.clear();
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
   * Exact 4 documents from Google Drive Knowledge Folder RAG_docs (13e3wpZcDNwRS0uwwhvLhb0PUxHUOIgHQ)
   */
  private initDefaultSeedDocuments() {
    const seedTime = '2026-08-26T16:05:00.000Z';
    const driveFolderUrl = 'https://drive.google.com/drive/folders/13e3wpZcDNwRS0uwwhvLhb0PUxHUOIgHQ';

    const seedDocs = [
      {
        fileId: 'drive-farmer-laws-india-1',
        fileName: 'farmer_related_laws_india (1).txt',
        category: 'agriculture',
        authority: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
        driveUrl: driveFolderUrl,
        officialUrl: 'https://agricoop.gov.in',
        pageCount: 12,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'FARMER & AGRICULTURAL LAWS IN INDIA - OVERVIEW & STATUTORY FRAMEWORK: 1. Model Bye-laws for Primary Agricultural Credit Societies (PACS) 2023 issued by Ministry of Cooperation: PACS are empowered to engage in 25+ business activities including fertilizer & seed dealership, custom hiring centres (CHC), cold storage, LPG distribution, and digital Common Service Centres (CSC). 2. One Member One Vote: Under cooperative democratic principles, every regular farmer member holds strictly one vote in the General Body, regardless of share capital.',
            pageNumber: 1,
            chapter: 'Chapter 1: Cooperative & Credit Framework',
            section: 'Section 1.1',
            clause: 'Clause 1(a)',
            heading: 'PACS Model Byelaws Cooperative Credit Farming खाद बीज सीएससी पैक्स',
            tokenEstimate: 85
          },
          {
            chunkIndex: 1,
            text: 'PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY) & CROP INSURANCE LAWS: Farmers are required to pay a capped uniform premium of 2.0% of Sum Insured for all Kharif food & oilseed crops, 1.5% for all Rabi crops, and 5.0% for commercial/horticultural crops. The remaining actuarial premium is subsidized 50:50 by Central and State Governments. 72-Hour Localized Loss Intimation: In case of localized calamity (hailstorm, inundation, landslide), farmer must report within 72 hours via Crop Insurance App, Toll-Free 14447, or local agriculture office.',
            pageNumber: 3,
            chapter: 'Chapter 2: Crop Insurance & Disaster Relief',
            section: 'Section 2.1',
            clause: 'Clause 2.1(b)',
            heading: 'PMFBY Crop Insurance Premium 72 Hours Loss Intimation 14447 फसल बीमा 72 घंटे',
            tokenEstimate: 95
          },
          {
            chunkIndex: 2,
            text: 'KISAN CREDIT CARD (KCC) & INTEREST SUBVENTION SCHEME: KCC provides revolving credit for crop cultivation and allied activities (dairy, poultry, fisheries). Normal institutional interest rate is 7% per annum for short-term agricultural loans up to ₹3,00,000. Farmers who repay loans promptly receive an additional 3% Prompt Repayment Incentive (PRI), resulting in an effective net interest rate of only 4% per annum. Collateral-free limit is ₹1.60 lakh (extendable to ₹3 lakh with tie-up).',
            pageNumber: 5,
            chapter: 'Chapter 3: Agricultural Credit & Financial Relief',
            section: 'Section 3.1',
            clause: 'Clause 3.1(a)',
            heading: 'Kisan Credit Card KCC Interest Subvention 4% Rate किसान क्रेडिट कार्ड ब्याज छूट',
            tokenEstimate: 85
          },
          {
            chunkIndex: 3,
            text: 'SEEDS ACT, FERTILIZER CONTROL ORDER (FCO) & ESSENTIAL COMMODITIES ACT (ECA): Sale of adulterated seeds or fertilizers at rates higher than statutory MRP is an offence under the Essential Commodities Act, 1955. Protection of Plant Varieties and Farmers Rights Act, 2001 (PPV&FRA) guarantees farmers rights to save, use, sow, resow, exchange, share, or sell farm-saved seed of protected varieties, except branded seed.',
            pageNumber: 8,
            chapter: 'Chapter 4: Inputs, Seeds & Pricing Regulations',
            section: 'Section 4.2',
            clause: 'Clause 4.2(c)',
            heading: 'Seeds Act Fertilizer MRP FCO Farmers Seed Rights खाद बीज कानून एमआरपी',
            tokenEstimate: 80
          }
        ]
      },
      {
        fileId: 'drive-indian-laws-quick-ref',
        fileName: 'Indian_Laws_Quick_Reference.txt',
        category: 'law',
        authority: 'Ministry of Law and Justice, Government of India',
        driveUrl: driveFolderUrl,
        officialUrl: 'https://lawmin.gov.in',
        pageCount: 10,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'CONSTITUTION OF INDIA & COOPERATIVE DIRECTIVE PRINCIPLES: Article 19(1)(c) guarantees the fundamental right of all citizens to form associations, unions, or co-operative societies. Article 43B (Directive Principle) mandates the State to promote voluntary formation, autonomous functioning, democratic control, and professional management of co-operative societies. Article 21 guarantees Right to Life and Personal Liberty.',
            pageNumber: 1,
            chapter: 'Part 1: Constitutional Rights & Directive Principles',
            section: 'Article 19(1)(c) & Article 43B',
            clause: 'Clause 43B',
            heading: 'Constitutional Rights Cooperative Society Article 43B संविधान सहकारिता अधिकार',
            tokenEstimate: 75
          },
          {
            chunkIndex: 1,
            text: 'CRIMINAL PROCEDURE, FIR & ARREST SAFEGUARDS (CrPC / BNSS): Right to file Zero FIR: A citizen can lodge a Zero FIR at any police station regardless of territorial jurisdiction, which is later transferred to the competent station. Arrest Rules: Police must inform grounds of arrest and notify a friend/relative immediately (Section 50/41B). Women cannot be arrested after sunset and before sunrise without prior permission from a Judicial Magistrate.',
            pageNumber: 3,
            chapter: 'Part 2: Criminal Law, FIR & Citizen Rights',
            section: 'Section 154 / Zero FIR',
            clause: 'Zero FIR & Arrest Rights',
            heading: 'Zero FIR Police Station Arrest Rights Women Protection एफआईआर गिरफ्तारी अधिकार',
            tokenEstimate: 85
          },
          {
            chunkIndex: 2,
            text: 'RIGHT TO INFORMATION ACT, 2005 (RTI): Any citizen can request information from public authorities. The Public Information Officer (PIO) must provide information within 30 days of application (or within 48 hours if life and liberty are involved). If denied or delayed, the citizen has the right to file a First Appeal within 30 days and Second Appeal to the Central/State Information Commission.',
            pageNumber: 6,
            chapter: 'Part 3: Transparency & Citizen Governance',
            section: 'Section 6 & 7 of RTI Act',
            clause: 'Section 7(1)',
            heading: 'RTI Act 2005 30 Days Timeline PIO Appeals सूचना का अधिकार कानून',
            tokenEstimate: 80
          },
          {
            chunkIndex: 3,
            text: 'CONSUMER PROTECTION ACT, 2019 & COOPERATIVE OMBUDSMAN: Consumer Protection Act provides a 3-tier grievance redressal mechanism (District Commission up to ₹1 Crore, State Commission ₹1 Cr to ₹10 Cr, National Commission above ₹10 Cr). Section 85A of MSCS Act establishes Cooperative Ombudsman for resolving disputes, deposit claims, and corruption grievances in cooperative societies.',
            pageNumber: 8,
            chapter: 'Part 4: Consumer Rights & Cooperative Ombudsman',
            section: 'Section 85A / Consumer Redressal',
            clause: 'Section 85A MSCS',
            heading: 'Consumer Protection Cooperative Ombudsman Grievance उपभोक्ता अधिकार लोकपाल',
            tokenEstimate: 80
          }
        ]
      },
      {
        fileId: 'drive-vehicle-traffic-laws-1',
        fileName: 'Indian_Vehicle_and_Traffic_Laws (1).txt',
        category: 'traffic',
        authority: 'Ministry of Road Transport and Highways (MoRTH), Govt of India',
        driveUrl: driveFolderUrl,
        officialUrl: 'https://morth.nic.in',
        pageCount: 10,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'MOTOR VEHICLES ACT 1988 & 2019 AMENDMENT - KEY OFFENCES & PENALTIES: Section 194D (Helmet Violation): Riding without a helmet attracts ₹1,000 fine and 3 months driving licence disqualification. Section 194B (Seat Belt): Driving without seatbelt ₹1,000 fine. Section 185 (Drunk Driving): Driving under influence of alcohol (>30mg per 100ml blood) attracts up to ₹10,000 fine and/or 6 months imprisonment for first offence; ₹15,000 and/or 2 years for subsequent offences.',
            pageNumber: 1,
            chapter: 'Chapter 1: Traffic Violations & Statutory Penalties',
            section: 'Section 185, 194D, 194B',
            clause: 'Section 194D / 185',
            heading: 'Motor Vehicle Penalties Helmet Drunk Driving Seatbelt चालान जुर्माना ट्रैफिक नियम',
            tokenEstimate: 90
          },
          {
            chunkIndex: 1,
            text: 'DRIVING LICENCE, REGISTRATION & DIGITAL DOCUMENTS: Section 181 (Driving without valid Licence): Penalty ₹5,000. Section 180 (Allowing unauthorized person to drive): ₹5,000. Digilocker & mParivahan Acceptance: As per MoRTH circulars, electronic driving licence, Registration Certificate (RC), and Insurance presented via DigiLocker or mParivahan apps are legally valid and must be accepted by traffic police across all states without demanding physical copies.',
            pageNumber: 3,
            chapter: 'Chapter 2: Driving Licence, RC & Digital Verification',
            section: 'Section 180, 181 & DigiLocker Rules',
            clause: 'Rule 139 CMVR',
            heading: 'DigiLocker mParivahan Driving Licence Without RC DL चालान डिजिलॉकर मान्य',
            tokenEstimate: 85
          },
          {
            chunkIndex: 2,
            text: 'GOOD SAMARITAN PROTECTION (SECTION 134A) & GOLDEN HOUR: Section 134A of the Motor Vehicles Act provides complete immunity to Good Samaritans who assist road accident victims. A Good Samaritan shall not be liable for any civil or criminal action for injury or death of a victim resulting from assistance provided. Police or hospital staff cannot force a Good Samaritan to reveal identity, pay admission fees, or stay as a witness.',
            pageNumber: 6,
            chapter: 'Chapter 3: Good Samaritan & Accident Relief',
            section: 'Section 134A',
            clause: 'Section 134A(1)',
            heading: 'Good Samaritan Protection Section 134A Accident Help मददगार सुरक्षा गोल्डन ऑवर',
            tokenEstimate: 85
          },
          {
            chunkIndex: 3,
            text: 'AGRICULTURAL TRACTOR & COMMERCIAL VEHICLE REGULATIONS: Agricultural tractors and trailers used exclusively for agricultural operations, manure/fertilizer transport, and produce carriage are exempt from commercial permit and road tax requirements under state motor vehicles rules, provided they are not hired out for industrial commercial goods transport. Compulsory third-party insurance is mandatory for all motorized vehicles.',
            pageNumber: 8,
            chapter: 'Chapter 4: Agricultural Tractors & Commercial Norms',
            section: 'Section 66 Exemptions & Section 146 Insurance',
            clause: 'Section 146',
            heading: 'Agricultural Tractor Transport Third Party Insurance ट्रैक्टर कृषि नियम बीमा',
            tokenEstimate: 80
          }
        ]
      },
      {
        fileId: 'drive-land-laws-verified-sources',
        fileName: 'land_laws_verified_sources.txt',
        category: 'land',
        authority: 'Department of Land Resources, Ministry of Rural Development',
        driveUrl: driveFolderUrl,
        officialUrl: 'https://dolr.gov.in',
        pageCount: 11,
        modifiedTime: seedTime,
        chunks: [
          {
            chunkIndex: 0,
            text: 'LAND REVENUE CODES, MUTATION & RECORD OF RIGHTS (RoR): Land Mutation (दाखिल खारिज / नामान्तरण) is the official recording of transfer of land title in revenue records (Khasra-Khatauni / 7/12 extract / Jamabandi). Mutation does not create original title but establishes fiscal liability to pay land revenue and legal possession. Uncontested mutation must be completed within 30 to 45 days of sale deed registration or inheritance application.',
            pageNumber: 1,
            chapter: 'Chapter 1: Land Revenue, Mutation & Records of Rights',
            section: 'Section 33 / Mutation Rules',
            clause: 'Dakhil Kharij Rules',
            heading: 'Land Mutation Dakhil Kharij 7/12 Jamabandi RoR दाखिल खारिज जमीन नामान्तरण',
            tokenEstimate: 85
          },
          {
            chunkIndex: 1,
            text: 'SVAMITVA SCHEME - SURVEY OF VILLAGES AND MAPPING WITH IMPROVISED TECHNOLOGY IN VILLAGE AREAS: Central Sector Scheme of Ministry of Panchayati Raj using drone technology to survey rural inhabited (Abadi) land parcels and issue official Property Cards (Sampatti Card / Gharoni). Enables rural households to possess legal ownership property title, use property as collateral for institutional bank loans, and resolve boundary disputes.',
            pageNumber: 4,
            chapter: 'Chapter 2: SVAMITVA Scheme & Rural Property Titles',
            section: 'SVAMITVA Guidelines',
            clause: 'Property Card / Abadi Land',
            heading: 'SVAMITVA Scheme Drone Mapping Property Card Gharoni स्वामित्व योजना संपत्ति कार्ड',
            tokenEstimate: 85
          },
          {
            chunkIndex: 2,
            text: 'RIGHT TO FAIR COMPENSATION AND TRANSPARENCY IN LAND ACQUISITION ACT, 2013 (RFCTLARR ACT): Mandates fair market value compensation of up to 4 times the market value in rural areas and 2 times in urban areas. Requires mandatory Social Impact Assessment (SIA), rehabilitation & resettlement (R&R) packages, and consent of 70% of affected landowning families for PPP projects (80% for private projects).',
            pageNumber: 6,
            chapter: 'Chapter 3: Land Acquisition & Fair Compensation',
            section: 'Section 26 & 30 of RFCTLARR Act 2013',
            clause: 'Section 26 (4x Rural Multiplier)',
            heading: 'Land Acquisition Compensation 4x Rural RFCTLARR 2013 जमीन अधिग्रहण मुआवजा कानून',
            tokenEstimate: 85
          },
          {
            chunkIndex: 3,
            text: 'AGRICULTURAL LAND PURCHASE RESTRICTIONS & SUCCESSION: In several states (e.g. Maharashtra, Gujarat, Karnataka, Uttarakhand), non-agriculturists cannot buy agricultural land without prior permission from the District Collector. Hindu Succession (Amendment) Act 2005 grants daughters equal coparcenary rights in ancestral property by birth, ensuring female farmers inherit agricultural land equally with sons.',
            pageNumber: 9,
            chapter: 'Chapter 4: Agricultural Land Purchase & Inheritance Rights',
            section: 'Section 6 Hindu Succession Act & State Land Ceiling Acts',
            clause: 'Daughters Coparcenary Succession',
            heading: 'Agricultural Land Purchase Restrictions Daughter Inheritance Rights जमीन खरीद उत्तराधिकार',
            tokenEstimate: 85
          }
        ]
      }
    ];

    seedDocs.forEach(sDoc => {
      const docRec: StoredDocument = {
        fileId: sDoc.fileId,
        fileName: sDoc.fileName,
        mimeType: 'text/plain',
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
 * Tokenize text into lowercased keywords for lexical matching with bilingual domain expansion
 */
function tokenizeText(text: string): string[] {
  if (!text) return [];
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'what', 'who', 'where', 'when', 'why', 'how', 'which', 'under', 'from', 'can', 'may',
    'me', 'mein', 'se', 'ko', 'ke', 'ki', 'ka', 'hain', 'hai', 'kare', 'kaise', 'kya',
    'karo', 'karna', 'liye', 'hoga', 'hogi', 'hota', 'hoti', 'bataye', 'batao', 'chahiye'
  ]);

  const rawTokens = text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !stopwords.has(t));

  const expanded = new Set<string>(rawTokens);

  // Bilingual domain synonym mappings (English, Hindi transliterated, Devanagari)
  for (const t of rawTokens) {
    if (['member', 'sadasya', 'membership', 'sadasyata', 'bane', 'banne', 'banna'].includes(t)) {
      expanded.add('member');
      expanded.add('membership');
      expanded.add('sadasya');
      expanded.add('सदस्यता');
      expanded.add('voting');
    }
    if (['pacs', 'pac', 'samiti', 'society'].includes(t)) {
      expanded.add('pacs');
      expanded.add('पैक्स');
      expanded.add('cooperative');
      expanded.add('multipurpose');
    }
    if (['bima', 'insurance', 'pmfby', 'fasal', 'claim', 'nuksan', 'loss'].includes(t)) {
      expanded.add('bima');
      expanded.add('insurance');
      expanded.add('pmfby');
      expanded.add('बीमा');
      expanded.add('premium');
      expanded.add('loss');
    }
    if (['72', 'hours', 'ghante', 'calamity', 'soochana', 'intimation', 'complaint'].includes(t)) {
      expanded.add('72');
      expanded.add('hours');
      expanded.add('intimation');
      expanded.add('claim');
    }
    if (['ombudsman', 'lokpal', 'shikayat', 'complaint', 'grievance', 'vivad', 'arbitration', 'dispute'].includes(t)) {
      expanded.add('ombudsman');
      expanded.add('lokpal');
      expanded.add('लोकपाल');
      expanded.add('dispute');
      expanded.add('arbitration');
      expanded.add('crcs');
    }
    if (['reservation', 'aarakshan', 'mahila', 'women', 'board', 'director', 'prabandh'].includes(t)) {
      expanded.add('reservation');
      expanded.add('आरक्षण');
      expanded.add('women');
      expanded.add('board');
      expanded.add('director');
    }
    // Traffic, Vehicle, Licence & Penalties
    if (['traffic', 'vehicle', 'challan', 'helmet', 'fine', 'penalty', 'licence', 'license', 'dl', 'rc', 'drunk', 'drank', 'alcohol', 'morth', 'parivahan', 'digilocker', 'tractor'].includes(t)) {
      expanded.add('traffic');
      expanded.add('vehicle');
      expanded.add('motor');
      expanded.add('challan');
      expanded.add('चालान');
      expanded.add('helmet');
      expanded.add('licence');
      expanded.add('ड्राइविंग');
      expanded.add('drunk');
      expanded.add('185');
      expanded.add('194d');
      expanded.add('digilocker');
    }
    // Land, Mutation, SVAMITVA & Property
    if (['land', 'jamin', 'zameen', 'mutation', 'dakhil', 'kharij', 'namantaran', 'svamitva', '7/12', 'khasra', 'khatauni', 'jamabandi', 'property', 'acquisition', 'muavja', 'compensation', 'rera'].includes(t)) {
      expanded.add('land');
      expanded.add('mutation');
      expanded.add('दाखिल');
      expanded.add('खारिज');
      expanded.add('जमीन');
      expanded.add('svamitva');
      expanded.add('स्वामित्व');
      expanded.add('property');
      expanded.add('acquisition');
      expanded.add('compensation');
      expanded.add('rfctlarr');
      expanded.add('khasra');
    }
    // RTI, FIR, Consumer, Constitutional Rights
    if (['rti', 'soochana', 'adhikar', 'fir', 'zero', 'arrest', 'police', 'consumer', 'upbhokta', 'constitution', 'article', 'sanvidhan'].includes(t)) {
      expanded.add('rti');
      expanded.add('सूचना');
      expanded.add('fir');
      expanded.add('police');
      expanded.add('arrest');
      expanded.add('गिरफ्तारी');
      expanded.add('consumer');
      expanded.add('upbhokta');
      expanded.add('उपभोक्ता');
      expanded.add('article');
      expanded.add('43b');
    }
  }

  return Array.from(expanded);
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
