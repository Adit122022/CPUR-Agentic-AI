"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mistralai_1 = require("@langchain/mistralai");
const dotenv_1 = __importDefault(require("dotenv"));
const pinecone_1 = require("@pinecone-database/pinecone");
dotenv_1.default.config();
async function runDemo() {
    const apiKey = process.env.PINECONE_API_KEY || "";
    const pc = new pinecone_1.Pinecone({ apiKey });
    const index = pc.index("cohort-2-rag");
    const mistralKey = process.env.MISTRAL_API_KEY || "";
    if (!mistralKey) {
        console.log("No MISTRAL_API_KEY found in .env, skipping classCode demo.");
        return;
    }
    const embeddings = new mistralai_1.MistralAIEmbeddings({
        apiKey: mistralKey,
        model: "mistral-embed"
    });
    const queryEmbedding = await embeddings.embedQuery("how was the internship experience?");
    console.log("Query Embedding generated:", queryEmbedding.slice(0, 5), "...");
    const result = await index.query({
        vector: queryEmbedding,
        topK: 2,
        includeMetadata: true
    });
    console.log("Pinecone Search Result:", JSON.stringify(result));
}
// Uncomment to run standalone
// runDemo().catch(console.error);
//# sourceMappingURL=classCode.js.map