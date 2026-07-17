import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      next(ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED));
      return;
    }
    if (!allowedRoles.includes((req as any).user.role as UserRole)) {
      next(ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN));
      return;
    }
    next();
  };
}
