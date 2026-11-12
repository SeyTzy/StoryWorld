import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Serve static uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Health check endpoint
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'StoryWorld API is running smoothly',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API v1 routes
  app.use('/api/v1', apiRoutes);

  // 404 handler for unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: `រកមិនឃើញផ្លូវ API នេះទេ: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Unhandled Error]:', err);
    const status = err.statusCode || 500;
    const message = err.message || 'មានបញ្ហាបច្ចេកទេសក្នុងម៉ាស៊ីនបម្រើ (Internal Server Error)';
    res.status(status).json({
      status: 'error',
      message,
    });
  });

  return app;
};
