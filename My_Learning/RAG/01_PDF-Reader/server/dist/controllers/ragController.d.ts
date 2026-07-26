import { Request, Response } from 'express';
export declare class RagController {
    /**
     * GET /api/status - Get current system status
     */
    getStatus(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/ingest - Ingest default or specified PDF into Pinecone
     */
    ingestDocument(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/query - Perform similarity retrieval and answer synthesis
     */
    queryRag(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * POST /api/upload - Handle Base64 PDF Upload and Ingest
     */
    uploadAndIngest(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const ragController: RagController;
//# sourceMappingURL=ragController.d.ts.map