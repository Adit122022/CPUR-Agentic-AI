import express from 'express';
import path from 'path';
import apiRoutes from './routes/api';
import { config, validateConfig } from './config/env';

// Validate env vars
validateConfig();

const app = express();

// Body parser middleware (supports large PDF base64 payloads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve frontend UI static files
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// Mount RAG API endpoints
app.use('/api', apiRoutes);

// Fallback SPA routing compatible with Express 5+
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Server
app.listen(config.port, () => {
  console.log(`
=====================================================
🚀 RAG Application Server active!
🌐 UI Dashboard: http://localhost:${config.port}
📌 API Status:   http://localhost:${config.port}/api/status
🌲 Pinecone Index: ${config.pineconeIndexName}
=====================================================
  `);
});