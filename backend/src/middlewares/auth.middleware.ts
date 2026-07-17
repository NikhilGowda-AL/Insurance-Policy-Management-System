import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { verifyAccessToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import { User } from '../models/User';

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[env.cookieName];

    if (!token) {
      throw ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED);
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId).select('active role email');
    if (!user) {
      throw ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED);
    }
    if (!user.active) {
      throw ApiError.forbidden(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    }

    (req as any).user = { userId: payload.userId, role: payload.role, email: payload.email };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(ApiError.unauthorized(MESSAGES.AUTH.SESSION_EXPIRED));
  }
}
