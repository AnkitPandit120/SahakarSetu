import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';

let aiInstance: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const key = config.geminiApiKey;
  if (!key) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'sahakar-setu-rag-engine'
        }
      }
    });
  }
  return aiInstance;
}

/**
 * Generate embedding vector for a single text using Gemini text-embedding-004
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getAIClient();
  const clean = text.trim();
  if (!clean) return new Array(768).fill(0);

  if (client) {
    try {
      const response = await client.models.embedContent({
        model: 'text-embedding-004',
        contents: clean
      });

      if (response.embeddings && response.embeddings[0]?.values) {
        return response.embeddings[0].values;
      } else if ((response as any).embedding?.values) {
        return (response as any).embedding.values;
      }
    } catch (err: any) {
      console.warn('Gemini embedding failed, using dense semantic fallback vector:', err?.message);
    }
  }

  // Deterministic 768-dim hash vector fallback for offline/preview environments
  return generateDeterministicFallbackVector(clean, 768);
}

/**
 * Generate embeddings in batches to respect rate limits
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize: number = 10
): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchPromises = batch.map(t => generateEmbedding(t));
    const results = await Promise.all(batchPromises);
    embeddings.push(...results);

    // Minor delay between batches to prevent rate limiting
    if (i + batchSize < texts.length) {
      await new Promise(res => setTimeout(res, 80));
    }
  }

  return embeddings;
}

/**
 * Deterministic dense semantic hash vector (768 dimensions)
 */
function generateDeterministicFallbackVector(text: string, dimensions: number = 768): number[] {
  const vector = new Array(dimensions).fill(0);
  const words = text.toLowerCase().match(/[\w\u0900-\u097F]+/gu) || [text];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += 1.0;
  }

  // Normalize to unit length
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}
