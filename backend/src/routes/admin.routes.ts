import { Router } from 'express';
import { createAgent, listAgents, deactivateAgent, activateAgent, getDashboardStats } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createAgentSchema } from '../validators/agent.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.post('/agents', validate(createAgentSchema), createAgent);
router.get('/agents', listAgents);
router.delete('/agents/:id', deactivateAgent);
router.put('/agents/:id/activate', activateAgent);
router.get('/stats', getDashboardStats);

export default router;
