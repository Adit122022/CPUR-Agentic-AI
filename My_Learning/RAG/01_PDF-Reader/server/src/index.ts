import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

async function main() {
  const loader = new PDFLoader('../pdf/SD.pdf');
  const docs = await loader.load();
  
  // Safe access with optional chaining ?.
  console.log(docs[0]?.pageContent?.slice(0, 500));
}

main(); 