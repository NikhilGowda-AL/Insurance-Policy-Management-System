import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';
import { MESSAGES } from '../constants/messages';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({ body: req.body, query: req.query, params: req.params });
      req.body = parsed.body ?? req.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path[issue.path.length - 1]?.toString() ?? 'form';
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }
        ApiResponse.error(res, 422, MESSAGES.VALIDATION.FAILED, fieldErrors);
        return;
      }
      next(error);
    }
  };
}
