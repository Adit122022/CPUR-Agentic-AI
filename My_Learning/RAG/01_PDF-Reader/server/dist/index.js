"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./routes/api"));
const env_1 = require("./config/env");
// Validate env vars
(0, env_1.validateConfig)();
const app = (0, express_1.default)();
// Body parser middleware (supports large PDF base64 payloads)
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Serve frontend UI static files
const publicDir = path_1.default.join(__dirname, '../public');
app.use(express_1.default.static(publicDir));
// Mount RAG API endpoints
app.use('/api', api_1.default);
// Serve SPA fallback
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
// Start Server
app.listen(env_1.config.port, () => {
    console.log(`
=====================================================
🚀 RAG Application Server active!
🌐 UI Dashboard: http://localhost:${env_1.config.port}
📌 API Status:   http://localhost:${env_1.config.port}/api/status
🌲 Pinecone Index: ${env_1.config.pineconeIndexName}
=====================================================
  `);
});
//# sourceMappingURL=index.js.map