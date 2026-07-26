"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorStoreService = exports.VectorStoreService = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
const pinecone_2 = require("@langchain/pinecone");
const env_1 = require("../config/env");
const embeddings_1 = require("./embeddings");
class VectorStoreService {
    pinecone = null;
    getPineconeClient() {
        if (!this.pinecone) {
            if (!env_1.config.pineconeApiKey) {
                throw new Error('Pinecone API Key is missing. Please set PINECONE_API_KEY in .env file.');
            }
            this.pinecone = new pinecone_1.Pinecone({
                apiKey: env_1.config.pineconeApiKey,
            });
        }
        return this.pinecone;
    }
    getIndexName() {
        return env_1.config.pineconeIndexName;
    }
    getIndex() {
        const client = this.getPineconeClient();
        return client.Index(this.getIndexName());
    }
    /**
     * Ingest documents in batches into Pinecone
     */
    async ingestDocuments(chunks, batchSize = 50, onProgress) {
        const embeddings = (0, embeddings_1.getEmbeddingsService)();
        const index = this.getIndex();
        let processed = 0;
        const total = chunks.length;
        console.log(`🌲 Starting ingestion of ${total} chunks into Pinecone index '${this.getIndexName()}'...`);
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            await pinecone_2.PineconeStore.fromDocuments(batch, embeddings, {
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
    async similaritySearch(query, topK = 4) {
        const embeddings = (0, embeddings_1.getEmbeddingsService)();
        const index = this.getIndex();
        const vectorStore = await pinecone_2.PineconeStore.fromExistingIndex(embeddings, {
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
    async getStatus() {
        try {
            const index = this.getIndex();
            const stats = await index.describeIndexStats();
            return {
                connected: true,
                indexName: this.getIndexName(),
                stats,
            };
        }
        catch (err) {
            return {
                connected: false,
                indexName: this.getIndexName(),
                error: err?.message || 'Failed to connect to Pinecone index',
            };
        }
    }
}
exports.VectorStoreService = VectorStoreService;
exports.vectorStoreService = new VectorStoreService();
//# sourceMappingURL=vectorStore.js.map