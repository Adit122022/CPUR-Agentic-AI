import { Document } from '@langchain/core/documents';
export interface IngestionOptions {
    chunkSize?: number;
    chunkOverlap?: number;
}
export declare class IngestionService {
    /**
     * Load and split PDF document from given file path
     */
    processPdf(filePath?: string, options?: IngestionOptions): Promise<{
        docsCount: number;
        chunks: Document[];
    }>;
    /**
     * Process PDF from buffer (e.g. for dynamic file uploads)
     */
    processPdfBuffer(buffer: Buffer, fileName: string, options?: IngestionOptions): Promise<{
        docsCount: number;
        chunks: Document[];
    }>;
}
export declare const ingestionService: IngestionService;
//# sourceMappingURL=ingestion.d.ts.map