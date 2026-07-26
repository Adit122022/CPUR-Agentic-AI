import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

export interface IngestionOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

export class IngestionService {
  /**
   * Load and split PDF document from given file path
   */
  async processPdf(filePath: string = config.defaultPdfPath, options?: IngestionOptions): Promise<{ docsCount: number; chunks: Document[] }> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    console.log(`📄 Loading PDF document from: ${filePath}...`);
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    console.log(`📄 PDF loaded successfully. Total pages: ${docs.length}`);

    const chunkSize = options?.chunkSize || 1000;
    const chunkOverlap = options?.chunkOverlap || 200;

    console.log(`✂️ Splitting PDF content into chunks (chunkSize: ${chunkSize}, overlap: ${chunkOverlap})...`);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });

    const chunks = await splitter.splitDocuments(docs);
    console.log(`✂️ Created ${chunks.length} text chunks.`);

    return {
      docsCount: docs.length,
      chunks,
    };
  }

  /**
   * Process PDF from buffer (e.g. for dynamic file uploads)
   */
  async processPdfBuffer(buffer: Buffer, fileName: string, options?: IngestionOptions): Promise<{ docsCount: number; chunks: Document[] }> {
    const tempDir = path.resolve(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `${Date.now()}_${fileName}`);
    fs.writeFileSync(tempFilePath, buffer);

    try {
      const result = await this.processPdf(tempFilePath, options);
      return result;
    } finally {
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
}

export const ingestionService = new IngestionService();
