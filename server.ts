import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import authRoutes from './server/routes/authRoutes';
import skillRoutes from './server/routes/skillRoutes';
import careerRoutes from './server/routes/careerRoutes';
import assessmentRoutes from './server/routes/assessmentRoutes';
import learningRoutes from './server/routes/learningRoutes';
import practiceRoutes from './server/routes/practiceRoutes';
import progressRoutes from './server/routes/progressRoutes';
import recommendationRoutes from './server/routes/recommendationRoutes';
import adminRoutes from './server/routes/adminRoutes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'Capacity Connect' });
  });

  // Register API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/learning', learningRoutes);
  app.use('/api/practice', practiceRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
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
    console.log(`Capacity Connect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
