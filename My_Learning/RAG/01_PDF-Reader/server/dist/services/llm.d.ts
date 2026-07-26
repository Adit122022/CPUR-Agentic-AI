import { SearchResult } from './vectorStore';
export interface RagResponse {
    question: string;
    answer: string;
    sources: Array<{
        content: string;
        score: number;
        metadata: Record<string, any>;
    }>;
    modelUsed: string;
}
export declare class LlmService {
    /**
     * Synthesize RAG answer using retrieved context passages
     */
    generateAnswer(question: string, contextChunks: SearchResult[]): Promise<RagResponse>;
}
export declare const llmService: LlmService;
//# sourceMappingURL=llm.d.ts.map