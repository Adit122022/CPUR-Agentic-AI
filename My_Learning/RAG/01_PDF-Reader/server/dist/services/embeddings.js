"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalHuggingFaceEmbeddings = void 0;
exports.getEmbeddingsService = getEmbeddingsService;
const embeddings_1 = require("@langchain/core/embeddings");
const mistralai_1 = require("@langchain/mistralai");
const transformers_1 = require("@huggingface/transformers");
const env_1 = require("../config/env");
/**
 * Custom Local HuggingFace Embeddings Wrapper using @huggingface/transformers
 * Uses Xenova/all-MiniLM-L6-v2 (384-dimensional dense vectors)
 */
class LocalHuggingFaceEmbeddings extends embeddings_1.Embeddings {
    pipe = null;
    constructor(fields) {
        super(fields ?? {});
    }
    async init() {
        if (!this.pipe) {
            console.log('🤖 Initializing local transformer model (Xenova/all-MiniLM-L6-v2)...');
            this.pipe = await (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('✅ Local embedding model ready!');
        }
    }
    async embedDocuments(documents) {
        await this.init();
        const results = [];
        for (const text of documents) {
            const output = await this.pipe(text, { pooling: 'mean', normalize: true });
            results.push(Array.from(output.data));
        }
        return results;
    }
    async embedQuery(text) {
        await this.init();
        const output = await this.pipe(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }
}
exports.LocalHuggingFaceEmbeddings = LocalHuggingFaceEmbeddings;
let activeEmbeddingsInstance = null;
function getEmbeddingsService() {
    if (activeEmbeddingsInstance) {
        return activeEmbeddingsInstance;
    }
    if (env_1.config.embeddingProvider === 'mistral' && env_1.config.mistralApiKey) {
        console.log('🔮 Using Mistral AI Embeddings service');
        activeEmbeddingsInstance = new mistralai_1.MistralAIEmbeddings({
            apiKey: env_1.config.mistralApiKey,
            model: 'mistral-embed',
        });
    }
    else {
        console.log('🧠 Using Local HuggingFace Embeddings (MiniLM-L6-v2, 384 dims)');
        activeEmbeddingsInstance = new LocalHuggingFaceEmbeddings();
    }
    return activeEmbeddingsInstance;
}
//# sourceMappingURL=embeddings.js.map