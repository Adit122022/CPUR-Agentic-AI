"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ragController = exports.RagController = void 0;
const ingestion_1 = require("../services/ingestion");
const vectorStore_1 = require("../services/vectorStore");
const llm_1 = require("../services/llm");
const env_1 = require("../config/env");
const fs_1 = __importDefault(require("fs"));
class RagController {
    /**
     * GET /api/status - Get current system status
     */
    async getStatus(req, res) {
        try {
            const vectorStatus = await vectorStore_1.vectorStoreService.getStatus();
            const pdfExists = fs_1.default.existsSync(env_1.config.defaultPdfPath);
            let pdfFileName = 'SD.pdf';
            let pdfSizeBytes = 0;
            if (pdfExists) {
                const stats = fs_1.default.statSync(env_1.config.defaultPdfPath);
                pdfSizeBytes = stats.size;
            }
            res.json({
                success: true,
                system: {
                    embeddingProvider: env_1.config.embeddingProvider,
                    hasMistralKey: Boolean(env_1.config.mistralApiKey),
                    hasPineconeKey: Boolean(env_1.config.pineconeApiKey),
                    indexName: env_1.config.pineconeIndexName,
                    port: env_1.config.port,
                },
                pdfDocument: {
                    exists: pdfExists,
                    path: env_1.config.defaultPdfPath,
                    fileName: pdfFileName,
                    sizeBytes: pdfSizeBytes,
                },
                vectorStore: vectorStatus,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error?.message || 'Failed to fetch system status',
            });
        }
    }
    /**
     * POST /api/ingest - Ingest default or specified PDF into Pinecone
     */
    async ingestDocument(req, res) {
        try {
            const customPath = req.body?.pdfPath;
            const targetPath = customPath || env_1.config.defaultPdfPath;
            const chunkSize = req.body?.chunkSize || 1000;
            const chunkOverlap = req.body?.chunkOverlap || 200;
            console.log(`🚀 Starting PDF ingestion pipeline for: ${targetPath}`);
            // Step 1: Load and split PDF
            const { docsCount, chunks } = await ingestion_1.ingestionService.processPdf(targetPath, {
                chunkSize,
                chunkOverlap,
            });
            // Step 2: Embed and store chunks in Pinecone
            const batchSize = req.body?.batchSize || 50;
            const { totalIndexed } = await vectorStore_1.vectorStoreService.ingestDocuments(chunks, batchSize);
            res.json({
                success: true,
                message: `Successfully ingested ${totalIndexed} text chunks into Pinecone index '${env_1.config.pineconeIndexName}'.`,
                details: {
                    totalPages: docsCount,
                    totalChunks: chunks.length,
                    totalIndexed,
                    chunkSize,
                    chunkOverlap,
                },
            });
        }
        catch (error) {
            console.error('❌ Ingestion Error:', error);
            res.status(500).json({
                success: false,
                error: error?.message || 'PDF document ingestion failed',
            });
        }
    }
    /**
     * POST /api/query - Perform similarity retrieval and answer synthesis
     */
    async queryRag(req, res) {
        try {
            const { question, topK = 4 } = req.body;
            if (!question || typeof question !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide a valid "question" string in the request body.',
                });
            }
            console.log(`🔎 Received RAG query: "${question}" (topK: ${topK})`);
            // Step 1: Retrieve topK relevant vector chunks from Pinecone
            const searchResults = await vectorStore_1.vectorStoreService.similaritySearch(question, topK);
            // Step 2: Synthesize context-augmented answer
            const ragResponse = await llm_1.llmService.generateAnswer(question, searchResults);
            res.json({
                success: true,
                data: ragResponse,
            });
        }
        catch (error) {
            console.error('❌ Query Error:', error);
            res.status(500).json({
                success: false,
                error: error?.message || 'RAG query processing failed',
            });
        }
    }
    /**
     * POST /api/upload - Handle Base64 PDF Upload and Ingest
     */
    async uploadAndIngest(req, res) {
        try {
            const { fileBase64, fileName = 'uploaded_document.pdf' } = req.body;
            if (!fileBase64) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing fileBase64 parameter',
                });
            }
            const buffer = Buffer.from(fileBase64, 'base64');
            const { docsCount, chunks } = await ingestion_1.ingestionService.processPdfBuffer(buffer, fileName);
            const { totalIndexed } = await vectorStore_1.vectorStoreService.ingestDocuments(chunks);
            res.json({
                success: true,
                message: `Successfully uploaded & indexed '${fileName}' (${totalIndexed} chunks).`,
                details: {
                    fileName,
                    totalPages: docsCount,
                    totalChunks: chunks.length,
                    totalIndexed,
                },
            });
        }
        catch (error) {
            console.error('❌ Upload Error:', error);
            res.status(500).json({
                success: false,
                error: error?.message || 'PDF upload and ingestion failed',
            });
        }
    }
}
exports.RagController = RagController;
exports.ragController = new RagController();
//# sourceMappingURL=ragController.js.map