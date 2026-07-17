import { Router } from 'express';
import { login, logout, getCurrentUser } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

export default router;
