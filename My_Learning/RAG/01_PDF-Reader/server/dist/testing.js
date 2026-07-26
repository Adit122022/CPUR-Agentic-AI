"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const textsplitters_1 = require("@langchain/textsplitters");
const pinecone_1 = require("@langchain/pinecone");
const pinecone_2 = require("@pinecone-database/pinecone");
const embeddings_1 = require("@langchain/core/embeddings");
const transformers_1 = require("@huggingface/transformers");
require("dotenv/config");
// Custom Local HuggingFace Embeddings Wrapper using Transformers.js
class LocalHuggingFaceEmbeddings extends embeddings_1.Embeddings {
    pipe;
    constructor(fields) {
        super(fields ?? {});
    }
    async init() {
        if (!this.pipe) {
            // Small, fast, free, local embedding model (384 dimensions)
            this.pipe = await (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
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
async function main() {
    console.log('1. Loading PDF...');
    const pdfPath = '../pdf/SD.pdf';
    const loader = new pdf_1.PDFLoader(pdfPath);
    const docs = await loader.load();
    console.log(`Loaded ${docs.length} pages.`);
    console.log('2. Splitting PDF into chunks...');
    const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);
    console.log(`Total chunks created: ${chunks.length}`);
    console.log('3. Initializing Local Embedding Model...');
    const embeddings = new LocalHuggingFaceEmbeddings();
    console.log('4. Connecting to Pinecone...');
    const pinecone = new pinecone_2.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index('01-pdf-reader-rag');
    console.log('5. Storing vectors in Pinecone (Batch Mode)...');
    // Local model overhead se bachne ke liye 50 chunks ke batches me upload
    const batchSize = 50;
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        await pinecone_1.PineconeStore.fromDocuments(batch, embeddings, {
            pineconeIndex,
        });
        console.log(`Uploaded chunks ${i + 1} to ${Math.min(i + batchSize, chunks.length)} / ${chunks.length}`);
    }
    console.log('✅ Success: All local embeddings stored in Pinecone successfully!');
}
main().catch((err) => {
    console.error('❌ Error during ingestion:', err);
});
//# sourceMappingURL=testing.js.map