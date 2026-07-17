import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import customerRoutes from './customer.routes';
import policyRoutes from './policy.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/customers', customerRoutes);
router.use('/policies', policyRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', data: { uptime: process.uptime() } });
});

export default router;
