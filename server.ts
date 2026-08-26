import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { authRouter } from './src/server/routes/auth';
import { driveRouter } from './src/server/routes/drive';
import { ragRouter } from './src/server/routes/rag';
import { chatRouter } from './src/server/routes/chat';
import { CATEGORIES } from './src/data/categories';
import { VERIFIED_SCHEMES, VERIFIED_SERVICES } from './src/data/schemesAndServices';
import { VERIFIED_KNOWLEDGE_DOCUMENTS } from './src/data/knowledgeBase';
import { vectorStore } from './src/server/services/vectorService';
import { config } from './src/server/config/env';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/drive', driveRouter);
app.use('/api/rag', ragRouter);
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!config.geminiApiKey,
    driveFolderConfigured: !!config.driveKnowledgeFolderId,
    driveConnected: !!(config.adminAccessToken || config.googleRefreshToken),
    stats: vectorStore.getStats(),
    timestamp: new Date().toISOString()
  });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Schemes endpoint
app.get('/api/schemes', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...VERIFIED_SCHEMES];

  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(s =>
      s.name.en.toLowerCase().includes(q) ||
      s.name.hi.toLowerCase().includes(q) ||
      s.shortDescription.en.toLowerCase().includes(q) ||
      s.ministry.en.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// Services endpoint
app.get('/api/services', (req, res) => {
  const { category } = req.query;
  let filtered = [...VERIFIED_SERVICES];
  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }
  res.json(filtered);
});

// Knowledge base sources endpoint
app.get('/api/sources', (req, res) => {
  res.json(VERIFIED_KNOWLEDGE_DOCUMENTS);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SahakarSetu Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
