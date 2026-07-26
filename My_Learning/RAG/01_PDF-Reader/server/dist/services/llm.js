"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = exports.LlmService = void 0;
const mistralai_1 = require("@langchain/mistralai");
const messages_1 = require("@langchain/core/messages");
const env_1 = require("../config/env");
class LlmService {
    /**
     * Synthesize RAG answer using retrieved context passages
     */
    async generateAnswer(question, contextChunks) {
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
        if (env_1.config.mistralApiKey) {
            try {
                console.log('🤖 Generating answer with Mistral AI LLM...');
                const chat = new mistralai_1.ChatMistralAI({
                    apiKey: env_1.config.mistralApiKey,
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
                    new messages_1.SystemMessage(systemPrompt),
                    new messages_1.HumanMessage(question),
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
            }
            catch (err) {
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
exports.LlmService = LlmService;
exports.llmService = new LlmService();
//# sourceMappingURL=llm.js.map