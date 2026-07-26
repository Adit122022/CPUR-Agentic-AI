"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.config = {
    pineconeApiKey: process.env.PINECONE_API_KEY || '',
    pineconeIndexName: process.env.PINECONE_INDEX_NAME || '01-pdf-reader-rag',
    mistralApiKey: process.env.MISTRAL_API_KEY || '',
    embeddingProvider: (process.env.EMBEDDING_PROVIDER || 'local').toLowerCase(),
    port: parseInt(process.env.PORT || '3000', 10),
    defaultPdfPath: path_1.default.resolve(__dirname, '../../../pdf/SD.pdf'),
};
function validateConfig() {
    if (!exports.config.pineconeApiKey) {
        console.warn('⚠️ WARNING: PINECONE_API_KEY is not defined in .env!');
    }
}
//# sourceMappingURL=env.js.map