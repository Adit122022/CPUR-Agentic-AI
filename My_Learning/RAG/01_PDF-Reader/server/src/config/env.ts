import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  pineconeApiKey: process.env.PINECONE_API_KEY || '',
  pineconeIndexName: process.env.PINECONE_INDEX_NAME || '01-pdf-reader-rag',
  mistralApiKey: process.env.MISTRAL_API_KEY || '',
  embeddingProvider: (process.env.EMBEDDING_PROVIDER || 'local').toLowerCase() as 'local' | 'mistral',
  port: parseInt(process.env.PORT || '3000', 10),
  defaultPdfPath: path.resolve(__dirname, '../../../pdf/SD.pdf'),
};

export function validateConfig() {
  if (!config.pineconeApiKey) {
    console.warn('⚠️ WARNING: PINECONE_API_KEY is not defined in .env!');
  }
}
