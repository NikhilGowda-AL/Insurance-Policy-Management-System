import { Router } from 'express';
import { issuePolicy, getPoliciesForCustomer } from '../controllers/policy.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { issuePolicySchema } from '../validators/policy.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(authenticate, authorize(UserRole.AGENT));

router.post('/issue', validate(issuePolicySchema), issuePolicy);
router.get('/customer/:customerId', getPoliciesForCustomer);

export default router;
