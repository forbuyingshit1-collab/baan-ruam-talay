import winston from 'winston';
import { config } from '../config/index.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }: { level: string; message: string; timestamp: string; stack?: string }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.isDev ? 'debug' : 'info',
  format: config.isProd ? jsonFormat : logFormat,
  transports: [
    new winston.transports.Console({
      format: config.isDev
        ? winston.format.combine(winston.format.colorize(), logFormat)
        : jsonFormat,
    }),
  ],
});

export const requestLogger = (req: { method: string; url: string }, duration: number) => {
  logger.info(`${req.method} ${req.url} - ${duration}ms`);
};
