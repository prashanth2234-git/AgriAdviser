import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    code: errorCode,
    statusCode,
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred processing your request',
      details: env.NODE_ENV === 'development' ? err.details || err.stack : undefined,
    },
  });
}
