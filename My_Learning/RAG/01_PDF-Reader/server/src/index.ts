import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';
import { pipeline } from '@huggingface/transformers';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (.env)
dotenv.config();

/**
 * ====================================================================
 * WHAT IS RAG? (Retrieval-Augmented Generation)
 * ====================================================================
 * RAG has 4 main steps:
 * 1. LOAD & SPLIT: Read PDF document & break large text into small chunks.
 * 2. EMBED & STORE: Convert text chunks to vector numbers & save in Pinecone.
 * 3. RETRIEVE: Take user question -> convert to vector -> find closest chunks.
 * 4. GENERATE: Pass retrieved context + user question to LLM to get answer.
 * ====================================================================
 */

// Custom Local HuggingFace Embeddings (Free, runs on your computer without API key!)
class LocalHuggingFaceEmbeddings extends Embeddings {
  private pipe: any;

  constructor(fields?: EmbeddingsParams) {
    super(fields ?? {});
  }

  private async init() {
    if (!this.pipe) {
      // Load MiniLM model (384-dimensional vector embedding)
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    await this.init();
    const results: number[][] = [];
    for (const text of documents) {
      const output = await this.pipe(text, { pooling: 'mean', normalize: true });
      results.push(Array.from(output.data));
    }
    return results;
  }

  async embedQuery(text: string): Promise<number[]> {
    await this.init();
    const output = await this.pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}

async function main() {
  console.log('--- 🚀 BASIC RAG WORKFLOW DEMO ---\n');

  // STEP 1: LOAD & SPLIT PDF DOCUMENT
  console.log('📌 STEP 1: Loading PDF file & splitting into text chunks...');
  const pdfPath = path.resolve(__dirname, '../../pdf/sanju.pdf');
  
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();
  console.log(`   -> Loaded ${docs.length} page(s) from PDF.`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,     // Each chunk will be max 500 characters
    chunkOverlap: 50,   // 50 characters overlap between chunks for context continuity
  });

  const chunks = await splitter.splitDocuments(docs);
  console.log(`   -> Split PDF into ${chunks.length} small chunks.\n`);

  // STEP 2: EMBED CHUNKS & STORE IN PINECONE
  console.log('📌 STEP 2: Converting chunks to Embeddings & storing in Pinecone...');
  const embeddings = new LocalHuggingFaceEmbeddings();
  
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  
  // Pinecone index name (must exist in Pinecone dashboard with 384 dimensions)
  const indexName = process.env.PINECONE_INDEX_NAME || '01-pdf-reader-rag';
  const pineconeIndex = pinecone.index(indexName);

  // Upload first 20 chunks as a quick demo batch
  const demoChunks = chunks.slice(0, 20);
  console.log(`   -> Uploading ${demoChunks.length} chunks to Pinecone index '${indexName}'...`);
  
  const vectorStore = await PineconeStore.fromDocuments(demoChunks, embeddings, {
    pineconeIndex,
  });
  console.log('   -> ✅ Vector storage complete!\n');

  // STEP 3: RETRIEVAL (Search matching chunks for a question)
  const userQuestion = "What is this document about?";
  console.log(`📌 STEP 3: Retrieving context for question: "${userQuestion}"...`);
  
  // Perform similarity search to find top 2 matching chunks
  const searchResults = await vectorStore.similaritySearchWithScore(userQuestion, 2);
  
  console.log(`   -> Found ${searchResults.length} relevant chunks from Pinecone:\n`);
  searchResults.forEach(([doc, score], i) => {
    console.log(`   --- [Chunk ${i + 1} | Similarity Score: ${(score * 100).toFixed(1)}%] ---`);
    console.log(`   Content: ${doc.pageContent.trim()}`);
    console.log(`   Page: ${doc.metadata?.loc?.pageNumber || 'N/A'}\n`);
  });

  // STEP 4: GENERATION (Create final prompt with retrieved context)
  console.log('📌 STEP 4: Constructing Augmented Prompt for LLM...');
  const retrievedContext = searchResults.map(([doc]) => doc.pageContent).join('\n---\n');

  const finalPrompt = `
[SYSTEM INSTRUCTION]
You are a helpful AI assistant. Answer the user's question based strictly on the context below.

[CONTEXT FROM PDF]
${retrievedContext}

[USER QUESTION]
${userQuestion}

[ANSWER]
`;

  console.log("Final Prompt : ",finalPrompt);
  console.log('✅ RAG Workflow completed successfully!');
}

main().catch((err) => {
  console.error('❌ Error during RAG execution:', err);
});
