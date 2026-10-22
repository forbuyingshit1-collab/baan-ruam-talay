import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { webhookRoutes } from './routes/webhook.routes.js';
import { googleSheetsService } from './services/google-sheets.service.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  logger.info(`➡️  ${req.method} ${req.url}`);

  _res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`⬅️  ${req.method} ${req.url} ${_res.statusCode} - ${duration}ms`);
  });

  next();
});

app.use('/', webhookRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function startServer(): Promise<void> {
  try {
    if (config.googleSheets.serviceAccountEmail && config.googleSheets.privateKey) {
      await googleSheetsService.initialize();
      logger.info('✅ Google Sheets connected');
    } else {
      logger.warn('⚠️  Google Sheets credentials not configured');
    }

    app.listen(config.port, () => {
      logger.info(`🚀 Baan Ruam Talay Bot running on port ${config.port}`);
      logger.info(`📍 Webhook URL: http://localhost:${config.port}/webhook`);
      logger.info(`🔍 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app };
