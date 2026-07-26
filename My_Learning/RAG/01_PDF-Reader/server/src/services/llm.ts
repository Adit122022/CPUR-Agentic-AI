import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { config } from '../config/env';
import { SearchResult } from './vectorStore';

export interface RagResponse {
  question: string;
  answer: string;
  sources: Array<{
    content: string;
    score: number;
    metadata: Record<string, any>;
  }>;
  modelUsed: string;
}

export class LlmService {
  /**
   * Synthesize RAG answer using retrieved context passages
   */
  async generateAnswer(question: string, contextChunks: SearchResult[]): Promise<RagResponse> {
    if (!contextChunks || contextChunks.length === 0) {
      return {
        question,
        answer: "I couldn't find any relevant information in the uploaded PDF document to answer your question.",
        sources: [],
        modelUsed: 'none',
      };
    }

    const contextText = contextChunks
      .map((c, i) => `[Source ${i + 1} (Score: ${(c.score * 100).toFixed(1)}%, Page: ${c.metadata?.loc?.pageNumber || c.metadata?.page || 'N/A'})]:\n${c.content}`)
      .join('\n\n');

    // If Mistral API key is provided, use ChatMistralAI
    if (config.mistralApiKey) {
      try {
        console.log('🤖 Generating answer with Mistral AI LLM...');
        const chat = new ChatMistralAI({
          apiKey: config.mistralApiKey,
          model: 'mistral-tiny',
          temperature: 0.2,
        });

        const systemPrompt = `You are an expert AI Assistant specializing in document QA. 
Answer the user's question accurately using ONLY the provided document context below.
If the answer cannot be determined from the context, state clearly that the document does not contain that information.
Cite the relevant source sections where appropriate.

Context:
${contextText}`;

        const response = await chat.invoke([
          new SystemMessage(systemPrompt),
          new HumanMessage(question),
        ]);

        const answerText = typeof response.content === 'string' 
          ? response.content 
          : JSON.stringify(response.content);

        return {
          question,
          answer: answerText,
          sources: contextChunks,
          modelUsed: 'Mistral AI (mistral-tiny)',
        };
      } catch (err: any) {
        console.warn('⚠️ Mistral API call failed, falling back to smart context synthesizer:', err?.message);
      }
    }

    // Smart Local Fallback Synthesizer
    console.log('💡 Synthesizing answer with Smart Local Context Synthesizer...');
    const topChunk = contextChunks[0];
    
    let answerText = `Based on the document context retrieved from your PDF:\n\n`;
    if (topChunk) {
      answerText += `${topChunk.content.trim()}\n\n`;
    }
    
    if (contextChunks.length > 1) {
      answerText += `**Additional Relevant Context:**\n`;
      for (let i = 1; i < contextChunks.length; i++) {
        const chunk = contextChunks[i];
        if (chunk) {
          answerText += `- ${chunk.content.trim().slice(0, 250)}...\n`;
        }
      }
    }

    return {
      question,
      answer: answerText,
      sources: contextChunks,
      modelUsed: 'Smart Local Context Synthesizer (Retrieval Grounded)',
    };
  }
}

export const llmService = new LlmService();
