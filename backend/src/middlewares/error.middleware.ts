import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../config/logger';
import { MESSAGES } from '../constants/messages';
import { isProduction } from '../config/env';

interface MongoDuplicateKeyError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { path: req.path, stack: err.stack });
    }
    ApiResponse.error(res, err.statusCode, err.message, err.errors);
    return;
  }

  const mongoErr = err as MongoDuplicateKeyError;
  if (mongoErr.code === 11000) {
    const field = Object.keys(mongoErr.keyPattern ?? {})[0] ?? 'field';
    ApiResponse.error(res, 409, `A record with this ${field} already exists`, {
      [field]: 'Already exists'
    });
    return;
  }

  logger.error(err.message, { path: req.path, stack: err.stack });
  ApiResponse.error(
    res,
    500,
    isProduction ? MESSAGES.GENERIC.SERVER_ERROR : err.message
  );
}
