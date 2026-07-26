import { Document } from '@langchain/core/documents';
export interface SearchResult {
    content: string;
    score: number;
    metadata: Record<string, any>;
}
export declare class VectorStoreService {
    private pinecone;
    private getPineconeClient;
    getIndexName(): string;
    getIndex(): import("@pinecone-database/pinecone").Index<import("@pinecone-database/pinecone").RecordMetadata>;
    /**
     * Ingest documents in batches into Pinecone
     */
    ingestDocuments(chunks: Document[], batchSize?: number, onProgress?: (processed: number, total: number) => void): Promise<{
        totalIndexed: number;
    }>;
    /**
     * Search vector store for topK relevant chunks matching query
     */
    similaritySearch(query: string, topK?: number): Promise<SearchResult[]>;
    /**
     * Get Pinecone index stats
     */
    getStatus(): Promise<{
        connected: boolean;
        indexName: string;
        stats?: any;
        error?: string;
    }>;
}
export declare const vectorStoreService: VectorStoreService;
//# sourceMappingURL=vectorStore.d.ts.map