import { ExtractedDocument } from './documentExtractor';

export interface DocumentChunk {
  chunkIndex: number;
  text: string;
  pageNumber: number;
  chapter?: string;
  section?: string;
  subsection?: string;
  clause?: string;
  heading?: string;
  tokenEstimate: number;
}

export interface ChunkingOptions {
  maxChunkSize?: number;
  overlapSize?: number;
}

const DEFAULT_MAX_CHUNK_SIZE = 800; // Characters (~180-200 tokens)
const DEFAULT_OVERLAP_SIZE = 150;

/**
 * Split an extracted document into semantically coherent chunks while preserving legal references & page context.
 */
export function chunkDocument(
  doc: ExtractedDocument,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const maxChunkSize = options.maxChunkSize || DEFAULT_MAX_CHUNK_SIZE;
  const overlapSize = options.overlapSize || DEFAULT_OVERLAP_SIZE;
  const chunks: DocumentChunk[] = [];

  let globalChunkIndex = 0;

  for (const page of doc.pages) {
    const pageText = page.text.trim();
    if (!pageText) continue;

    // Split page into semantic paragraphs / blocks
    const blocks = pageText.split(/(?:\n\s*\n|\n(?=[A-Z0-9#\(\[\.]{2,}\b))/);
    
    let currentChunkText = '';
    let currentChapter: string | undefined;
    let currentSection: string | undefined;
    let currentClause: string | undefined;
    let currentHeading: string | undefined;

    for (const block of blocks) {
      const cleanBlock = block.trim();
      if (!cleanBlock) continue;

      // Detect legal metadata in block
      const detected = detectLegalStructures(cleanBlock);
      if (detected.chapter) currentChapter = detected.chapter;
      if (detected.section) currentSection = detected.section;
      if (detected.clause) currentClause = detected.clause;
      if (detected.heading) currentHeading = detected.heading;

      if ((currentChunkText + '\n\n' + cleanBlock).length <= maxChunkSize) {
        currentChunkText = currentChunkText ? `${currentChunkText}\n\n${cleanBlock}` : cleanBlock;
      } else {
        // If current chunk has content, flush it
        if (currentChunkText.trim()) {
          chunks.push({
            chunkIndex: globalChunkIndex++,
            text: currentChunkText.trim(),
            pageNumber: page.pageNumber,
            chapter: currentChapter,
            section: currentSection,
            clause: currentClause,
            heading: currentHeading,
            tokenEstimate: Math.ceil(currentChunkText.length / 4)
          });
        }

        // If the single block itself exceeds maxChunkSize, split by sentence
        if (cleanBlock.length > maxChunkSize) {
          const subChunks = splitLargeBlock(cleanBlock, maxChunkSize, overlapSize);
          for (const sub of subChunks) {
            chunks.push({
              chunkIndex: globalChunkIndex++,
              text: sub.trim(),
              pageNumber: page.pageNumber,
              chapter: currentChapter,
              section: currentSection,
              clause: currentClause,
              heading: currentHeading,
              tokenEstimate: Math.ceil(sub.length / 4)
            });
          }
          currentChunkText = '';
        } else {
          // Carry over small overlap from previous chunk for smooth semantic continuity
          const previousTail = currentChunkText.slice(-overlapSize).trim();
          currentChunkText = previousTail ? `${previousTail}\n\n${cleanBlock}` : cleanBlock;
        }
      }
    }

    // Flush any remaining text on the page
    if (currentChunkText.trim()) {
      chunks.push({
        chunkIndex: globalChunkIndex++,
        text: currentChunkText.trim(),
        pageNumber: page.pageNumber,
        chapter: currentChapter,
        section: currentSection,
        clause: currentClause,
        heading: currentHeading,
        tokenEstimate: Math.ceil(currentChunkText.length / 4)
      });
    }
  }

  return chunks;
}

/**
 * Detects Chapter, Section, Subsection, and Clause headers from text block
 */
function detectLegalStructures(text: string): {
  chapter?: string;
  section?: string;
  clause?: string;
  heading?: string;
} {
  const res: { chapter?: string; section?: string; clause?: string; heading?: string } = {};

  // Match Chapter / भाग
  const chapterMatch = text.match(/(?:Chapter|CHAPTER|भाग)\s+([IVXLCDM\d]+[A-Za-z]?)(?:\s*[-:–]\s*([^\n\.]+))?/i);
  if (chapterMatch) {
    res.chapter = chapterMatch[0].trim();
  }

  // Match Section / धारा / नियम
  const sectionMatch = text.match(/(?:Section|SECTION|Sec\.|धारा|कलम|ধারা)\s*(\d+[A-Za-z]?(?:\(\d+\))*(?:\([a-z]\))*)(?:\s*[-:–\.]\s*([^\n\.]+))?/i);
  if (sectionMatch) {
    res.section = sectionMatch[0].trim();
  }

  // Match Clause / उपनियम / অনুচ্ছেদ
  const clauseMatch = text.match(/(?:Clause|CLAUSE|उपनियम|क्लॉज|অনুচ্ছেদ)\s*(\d+(?:\.\d+)*)/i);
  if (clauseMatch) {
    res.clause = clauseMatch[0].trim();
  }

  // Match General Heading (# or capitalized header)
  const headingMatch = text.match(/^(?:#{1,4}\s*|(?:\d+\.\d+)\s+)([^\n]+)/m);
  if (headingMatch) {
    res.heading = headingMatch[1].trim();
  }

  return res;
}

/**
 * Split large blocks by sentence with overlap
 */
function splitLargeBlock(text: string, maxSize: number, overlap: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
  const parts: string[] = [];
  let current = '';

  for (const s of sentences) {
    if ((current + s).length <= maxSize) {
      current += s;
    } else {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = s;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}
