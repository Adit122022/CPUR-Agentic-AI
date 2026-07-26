import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';
/**
 * Custom Local HuggingFace Embeddings Wrapper using @huggingface/transformers
 * Uses Xenova/all-MiniLM-L6-v2 (384-dimensional dense vectors)
 */
export declare class LocalHuggingFaceEmbeddings extends Embeddings {
    private pipe;
    constructor(fields?: EmbeddingsParams);
    private init;
    embedDocuments(documents: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
export declare function getEmbeddingsService(): Embeddings;
//# sourceMappingURL=embeddings.d.ts.map