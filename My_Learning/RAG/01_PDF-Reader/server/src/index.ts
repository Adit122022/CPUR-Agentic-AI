import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import dotenv from "dotenv"

async function main() {
  const pdfPath = '../pdf/SD.pdf';
  const loader = new PDFLoader(pdfPath);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  console.log('Total chunks:', chunks.length);

}

main().catch((err) => {
  console.error('PDF split failed:', err);
});