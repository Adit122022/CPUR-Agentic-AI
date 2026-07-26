import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';
dotenv.config();

async function runDemo() {
  const apiKey = process.env.PINECONE_API_KEY || "";
  const pc = new Pinecone({ apiKey });
  const index = pc.index("cohort-2-rag");

  const mistralKey = process.env.MISTRAL_API_KEY || "";
  if (!mistralKey) {
    console.log("No MISTRAL_API_KEY found in .env, skipping classCode demo.");
    return;
  }

  const embeddings = new MistralAIEmbeddings({
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