import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';
import { MESSAGES } from '../constants/messages';
import { env, isProduction } from '../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: env.cookieMaxAgeMs,
  path: '/',
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, userType } = req.body;
  const { token, user } = await authService.login(email, password, userType);

  res.cookie(env.cookieName, token, cookieOptions);
  ApiResponse.success(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, { user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  ApiResponse.success(res, 200, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  ApiResponse.success(res, 200, 'Current user fetched', { user: (req as any).user });
});
