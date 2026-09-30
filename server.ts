import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './src/server/routes/auth';
import { driveRouter } from './src/server/routes/drive';
import { ragRouter } from './src/server/routes/rag';
import { chatRouter } from './src/server/routes/chat';
import { speechRouter } from './src/server/routes/speech';
import { adminRouter } from './src/server/routes/admin';
import { CATEGORIES } from './src/data/categories';
import { VERIFIED_SCHEMES, VERIFIED_SERVICES } from './src/data/schemesAndServices';
import { VERIFIED_KNOWLEDGE_DOCUMENTS } from './src/data/knowledgeBase';
import { vectorStore } from './src/server/services/vectorService';
import { config } from './src/server/config/env';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 1. API ROUTES (FIRST)
  app.use('/api/auth', authRouter);
  app.use('/api/drive', driveRouter);
  app.use('/api/rag', ragRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/speech', speechRouter);
  app.use('/api/admin', adminRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      architecture: 'Full-Stack React + Vite + Express + Gemini RAG',
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

  // Download all project images as ZIP archive
  app.get('/api/download-images', (req, res) => {
    const zipPath = path.resolve(process.cwd(), 'public/sahakarsetu_all_images.zip');
    res.download(zipPath, 'sahakarsetu_all_images.zip');
  });

  // 2. VITE MIDDLEWARE (Handles React SPA during dev, static files in prod)
  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
        watch: isHmrDisabled ? null : {},
      },
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
    console.log(`SahakarSetu React App running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

