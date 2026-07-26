"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestionService = exports.IngestionService = void 0;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const textsplitters_1 = require("@langchain/textsplitters");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
class IngestionService {
    /**
     * Load and split PDF document from given file path
     */
    async processPdf(filePath = env_1.config.defaultPdfPath, options) {
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`PDF file not found at path: ${filePath}`);
        }
        console.log(`📄 Loading PDF document from: ${filePath}...`);
        const loader = new pdf_1.PDFLoader(filePath);
        const docs = await loader.load();
        console.log(`📄 PDF loaded successfully. Total pages: ${docs.length}`);
        const chunkSize = options?.chunkSize || 1000;
        const chunkOverlap = options?.chunkOverlap || 200;
        console.log(`✂️ Splitting PDF content into chunks (chunkSize: ${chunkSize}, overlap: ${chunkOverlap})...`);
        const splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
        });
        const chunks = await splitter.splitDocuments(docs);
        console.log(`✂️ Created ${chunks.length} text chunks.`);
        return {
            docsCount: docs.length,
            chunks,
        };
    }
    /**
     * Process PDF from buffer (e.g. for dynamic file uploads)
     */
    async processPdfBuffer(buffer, fileName, options) {
        const tempDir = path_1.default.resolve(__dirname, '../../temp');
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        const tempFilePath = path_1.default.join(tempDir, `${Date.now()}_${fileName}`);
        fs_1.default.writeFileSync(tempFilePath, buffer);
        try {
            const result = await this.processPdf(tempFilePath, options);
            return result;
        }
        finally {
            // Clean up temp file
            if (fs_1.default.existsSync(tempFilePath)) {
                fs_1.default.unlinkSync(tempFilePath);
            }
        }
    }
}
exports.IngestionService = IngestionService;
exports.ingestionService = new IngestionService();
//# sourceMappingURL=ingestion.js.map