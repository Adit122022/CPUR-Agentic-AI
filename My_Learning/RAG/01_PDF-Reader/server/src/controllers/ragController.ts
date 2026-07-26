import { Request, Response } from 'express';
import { ingestionService } from '../services/ingestion';
import { vectorStoreService } from '../services/vectorStore';
import { llmService } from '../services/llm';
import { config } from '../config/env';
import fs from 'fs';
import path from 'path';

export class RagController {
  /**
   * GET /api/status - Get current system status
   */
  async getStatus(req: Request, res: Response) {
    try {
      const vectorStatus = await vectorStoreService.getStatus();
      const pdfExists = fs.existsSync(config.defaultPdfPath);
      let pdfFileName = 'SD.pdf';
      let pdfSizeBytes = 0;

      if (pdfExists) {
        const stats = fs.statSync(config.defaultPdfPath);
        pdfSizeBytes = stats.size;
      }

      res.json({
        success: true,
        system: {
          embeddingProvider: config.embeddingProvider,
          hasMistralKey: Boolean(config.mistralApiKey),
          hasPineconeKey: Boolean(config.pineconeApiKey),
          indexName: config.pineconeIndexName,
          port: config.port,
        },
        pdfDocument: {
          exists: pdfExists,
          path: config.defaultPdfPath,
          fileName: pdfFileName,
          sizeBytes: pdfSizeBytes,
        },
        vectorStore: vectorStatus,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to fetch system status',
      });
    }
  }

  /**
   * POST /api/ingest - Ingest default or specified PDF into Pinecone
   */
  async ingestDocument(req: Request, res: Response) {
    try {
      const customPath = req.body?.pdfPath;
      const targetPath = customPath || config.defaultPdfPath;
      const chunkSize = req.body?.chunkSize || 1000;
      const chunkOverlap = req.body?.chunkOverlap || 200;

      console.log(`🚀 Starting PDF ingestion pipeline for: ${targetPath}`);

      // Step 1: Load and split PDF
      const { docsCount, chunks } = await ingestionService.processPdf(targetPath, {
        chunkSize,
        chunkOverlap,
      });

      // Step 2: Embed and store chunks in Pinecone
      const batchSize = req.body?.batchSize || 50;
      const { totalIndexed } = await vectorStoreService.ingestDocuments(chunks, batchSize);

      res.json({
        success: true,
        message: `Successfully ingested ${totalIndexed} text chunks into Pinecone index '${config.pineconeIndexName}'.`,
        details: {
          totalPages: docsCount,
          totalChunks: chunks.length,
          totalIndexed,
          chunkSize,
          chunkOverlap,
        },
      });
    } catch (error: any) {
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
  async queryRag(req: Request, res: Response) {
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
      const searchResults = await vectorStoreService.similaritySearch(question, topK);

      // Step 2: Synthesize context-augmented answer
      const ragResponse = await llmService.generateAnswer(question, searchResults);

      res.json({
        success: true,
        data: ragResponse,
      });
    } catch (error: any) {
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
  async uploadAndIngest(req: Request, res: Response) {
    try {
      const { fileBase64, fileName = 'uploaded_document.pdf' } = req.body;

      if (!fileBase64) {
        return res.status(400).json({
          success: false,
          error: 'Missing fileBase64 parameter',
        });
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      const { docsCount, chunks } = await ingestionService.processPdfBuffer(buffer, fileName);
      const { totalIndexed } = await vectorStoreService.ingestDocuments(chunks);

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
    } catch (error: any) {
      console.error('❌ Upload Error:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'PDF upload and ingestion failed',
      });
    }
  }
}

export const ragController = new RagController();
