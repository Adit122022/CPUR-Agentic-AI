import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import { config } from '../config/env';
import { getEmbeddingsService } from './embeddings';

export interface SearchResult {
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export class VectorStoreService {
  private pinecone: Pinecone | null = null;

  private getPineconeClient(): Pinecone {
    if (!this.pinecone) {
      if (!config.pineconeApiKey) {
        throw new Error('Pinecone API Key is missing. Please set PINECONE_API_KEY in .env file.');
      }
      this.pinecone = new Pinecone({
        apiKey: config.pineconeApiKey,
      });
    }
    return this.pinecone;
  }

  public getIndexName(): string {
    return config.pineconeIndexName;
  }

  public getIndex() {
    const client = this.getPineconeClient();
    return client.Index(this.getIndexName());
  }

  /**
   * Ingest documents in batches into Pinecone
   */
  async ingestDocuments(
    chunks: Document[],
    batchSize = 50,
    onProgress?: (processed: number, total: number) => void
  ): Promise<{ totalIndexed: number }> {
    const embeddings = getEmbeddingsService();
    const index = this.getIndex();

    let processed = 0;
    const total = chunks.length;

    console.log(`🌲 Starting ingestion of ${total} chunks into Pinecone index '${this.getIndexName()}'...`);

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      
      await PineconeStore.fromDocuments(batch, embeddings, {
        pineconeIndex: index,
      });

      processed += batch.length;
      if (onProgress) {
        onProgress(processed, total);
      }
      console.log(`📦 Processed batch ${Math.floor(i / batchSize) + 1}: ${processed}/${total} chunks uploaded.`);
    }

    console.log(`✅ Pinecone Ingestion Complete: ${total} chunks stored.`);
    return { totalIndexed: total };
  }

  /**
   * Search vector store for topK relevant chunks matching query
   */
  async similaritySearch(query: string, topK = 4): Promise<SearchResult[]> {
    const embeddings = getEmbeddingsService();
    const index = this.getIndex();

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    const results = await vectorStore.similaritySearchWithScore(query, topK);

    return results.map(([doc, score]) => ({
      content: doc.pageContent,
      score: score,
      metadata: doc.metadata,
    }));
  }

  /**
   * Get Pinecone index stats
   */
  async getStatus(): Promise<{ connected: boolean; indexName: string; stats?: any; error?: string }> {
    try {
      const index = this.getIndex();
      const stats = await index.describeIndexStats();
      return {
        connected: true,
        indexName: this.getIndexName(),
        stats,
      };
    } catch (err: any) {
      return {
        connected: false,
        indexName: this.getIndexName(),
        error: err?.message || 'Failed to connect to Pinecone index',
      };
    }
  }
}

export const vectorStoreService = new VectorStoreService();
