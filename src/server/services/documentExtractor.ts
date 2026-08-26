import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedDocument {
  fullText: string;
  pages: ExtractedPage[];
  pageCount: number;
  headings: string[];
}

/**
 * Extract clean textual content from various document formats (PDF, DOCX, Google Docs, TXT, MD)
 */
export async function extractDocumentContent(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<ExtractedDocument> {
  const cleanMime = mimeType.toLowerCase();
  const lowerName = fileName.toLowerCase();

  // 1. Handle PDF Documents
  if (cleanMime.includes('pdf') || lowerName.endsWith('.pdf')) {
    return await extractPdfContent(buffer);
  }

  // 2. Handle DOCX Word Documents
  if (
    cleanMime.includes('wordprocessingml') ||
    cleanMime.includes('msword') ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.doc')
  ) {
    return await extractDocxContent(buffer);
  }

  // 3. Handle Plain Text, Markdown, CSV, or exported Google Docs
  const rawText = buffer.toString('utf-8');
  return extractPlainTextContent(rawText);
}

/**
 * Extract PDF text with page tracking
 */
async function extractPdfContent(buffer: Buffer): Promise<ExtractedDocument> {
  const pages: ExtractedPage[] = [];
  const headings: string[] = [];

  let currentPage = 1;
  const renderOptions = {
    pagerender: function (pageData: any) {
      return pageData.getTextContent().then(function (textContent: any) {
        let lastY: number | null = null;
        let text = '';
        for (const item of textContent.items) {
          if (lastY === item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }

        pages.push({
          pageNumber: currentPage,
          text: cleanExtractedText(text)
        });
        currentPage++;
        return text;
      });
    }
  };

  try {
    const data = await pdfParse(buffer, renderOptions);
    const fullText = cleanExtractedText(data.text);
    detectHeadings(fullText, headings);

    return {
      fullText,
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
      pageCount: data.numpages || (pages.length || 1),
      headings
    };
  } catch (err: any) {
    console.warn('Advanced PDF page rendering failed, falling back to standard extraction:', err?.message);
    const simpleData = await pdfParse(buffer);
    const fullText = cleanExtractedText(simpleData.text);
    detectHeadings(fullText, headings);

    return {
      fullText,
      pages: [{ pageNumber: 1, text: fullText }],
      pageCount: simpleData.numpages || 1,
      headings
    };
  }
}

/**
 * Extract DOCX text
 */
async function extractDocxContent(buffer: Buffer): Promise<ExtractedDocument> {
  const result = await mammoth.extractRawText({ buffer });
  const fullText = cleanExtractedText(result.value);
  const headings: string[] = [];
  detectHeadings(fullText, headings);

  // Estimate page division roughly every 450 words
  const words = fullText.split(/\s+/);
  const pages: ExtractedPage[] = [];
  const wordsPerPage = 450;
  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageText = words.slice(i, i + wordsPerPage).join(' ');
    pages.push({
      pageNumber: Math.floor(i / wordsPerPage) + 1,
      text: pageText
    });
  }

  return {
    fullText,
    pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
    pageCount: pages.length || 1,
    headings
  };
}

/**
 * Extract Plain Text / Markdown
 */
function extractPlainTextContent(text: string): ExtractedDocument {
  const cleaned = cleanExtractedText(text);
  const headings: string[] = [];
  detectHeadings(cleaned, headings);

  // Detect explicit page breaks or approximate
  const rawPages = cleaned.split(/(?:--- Page \d+ ---|\f|\n\s*===+\s*\n)/i);
  const pages: ExtractedPage[] = [];

  if (rawPages.length > 1) {
    rawPages.forEach((p, idx) => {
      if (p.trim()) {
        pages.push({
          pageNumber: idx + 1,
          text: p.trim()
        });
      }
    });
  } else {
    // Estimate page division
    const words = cleaned.split(/\s+/);
    const wordsPerPage = 450;
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageText = words.slice(i, i + wordsPerPage).join(' ');
      pages.push({
        pageNumber: Math.floor(i / wordsPerPage) + 1,
        text: pageText
      });
    }
  }

  return {
    fullText: cleaned,
    pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: cleaned }],
    pageCount: pages.length || 1,
    headings
  };
}

/**
 * Clean whitespace and control characters
 */
function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract structural headings (Chapters, Sections, Acts, Clauses)
 */
function detectHeadings(text: string, output: string[]) {
  const lines = text.split('\n');
  const headingRegex = /^(?:#+\s*|Chapter\s+\d+|Section\s+\d+|Clause\s+\d+|Article\s+\d+|Part\s+[IVXLCDM\d]+|भाग\s+\d+|धारा\s+\d+|नियम\s+\d+)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 120 && headingRegex.test(trimmed)) {
      output.push(trimmed);
    }
  }
}
