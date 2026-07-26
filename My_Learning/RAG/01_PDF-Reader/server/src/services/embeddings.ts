import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';
import { MistralAIEmbeddings } from '@langchain/mistralai';
import { pipeline } from '@huggingface/transformers';
import { config } from '../config/env';

/**
 * Custom Local HuggingFace Embeddings Wrapper using @huggingface/transformers
 * Uses Xenova/all-MiniLM-L6-v2 (384-dimensional dense vectors)
 */
export class LocalHuggingFaceEmbeddings extends Embeddings {
  private pipe: any = null;

  constructor(fields?: EmbeddingsParams) {
    super(fields ?? {});
  }

  private async init() {
    if (!this.pipe) {
      console.log('🤖 Initializing local transformer model (Xenova/all-MiniLM-L6-v2)...');
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log('✅ Local embedding model ready!');
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

let activeEmbeddingsInstance: Embeddings | null = null;

export function getEmbeddingsService(): Embeddings {
  if (activeEmbeddingsInstance) {
    return activeEmbeddingsInstance;
  }

  if (config.embeddingProvider === 'mistral' && config.mistralApiKey) {
    console.log('🔮 Using Mistral AI Embeddings service');
    activeEmbeddingsInstance = new MistralAIEmbeddings({
      apiKey: config.mistralApiKey,
      model: 'mistral-embed',
    });
  } else {
    console.log('🧠 Using Local HuggingFace Embeddings (MiniLM-L6-v2, 384 dims)');
    activeEmbeddingsInstance = new LocalHuggingFaceEmbeddings();
  }

  return activeEmbeddingsInstance;
}
