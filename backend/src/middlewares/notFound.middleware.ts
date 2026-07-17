import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

export function notFoundHandler(req: Request, res: Response): void {
  ApiResponse.error(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}
