export type Language = 'en' | 'hi' | 'mr' | 'bn';

export type SourceType = 'KNOWLEDGE_BASE' | 'GOVERNMENT_PORTAL' | 'VERIFIED_WEB';

export interface SourceItem {
  id: string;
  title: string;
  authority: string;
  documentName: string;
  section?: string;
  chapter?: string;
  pageNumber?: string | number;
  clause?: string;
  officialUrl: string;
  sourceType: SourceType;
  summary?: string;
}

export interface StructuredAnswer {
  answer: string;
  importantNotes?: string[];
  sources: SourceItem[];
  sourceType: SourceType;
  categoryId?: string;
  followUpQuestions?: string[];
  confidenceNote?: string;
  legalDisclaimer: string;
  language: Language;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structured?: StructuredAnswer;
  isError?: boolean;
  feedback?: 'helpful' | 'unhelpful' | null;
}

export interface TopicItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  prompt: Record<Language, string>;
  tags?: string[];
}

export interface CategoryItem {
  id: string;
  iconName: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  examples: Record<Language, string[]>;
  topics: TopicItem[];
}

export interface ServiceItem {
  id: string;
  title: Record<Language, string>;
  shortDescription: Record<Language, string>;
  targetUsers: Record<Language, string>;
  category: string;
  requiredDocuments: Record<Language, string[]>;
  officialSource: string;
  officialUrl: string;
  feeInfo?: Record<Language, string>;
  timeline?: Record<Language, string>;
}

export interface SchemeItem {
  id: string;
  name: Record<Language, string>;
  ministry: Record<Language, string>;
  category: 'Agriculture' | 'Cooperative' | 'Finance' | 'Rural Development' | 'Insurance';
  shortDescription: Record<Language, string>;
  targetUsers: Record<Language, string>;
  eligibility: Record<Language, string[]>;
  benefits: Record<Language, string[]>;
  applicationProcess: Record<Language, string[]>;
  requiredDocuments: Record<Language, string[]>;
  officialSource: string;
  officialUrl: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  authority: string;
  category: string;
  yearOrVersion: string;
  officialUrl: string;
  description: string;
  sections?: {
    section: string;
    title: string;
    content: string;
  }[];
  keySections?: {
    section: string;
    title: string;
    content: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  state?: string;
  language?: Language;
  savedQueries?: string[];
  bookmarkedSchemes?: string[];
  bookmarks?: {
    id: string;
    title: string;
    type: 'answer' | 'scheme' | 'service';
    timestamp: string;
    snippet: string;
  }[];
}
