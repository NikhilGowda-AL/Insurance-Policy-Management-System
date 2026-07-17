import { Router } from 'express';
import { createCustomer, updateCustomer, getCustomer, searchCustomers } from '../controllers/customer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(authenticate, authorize(UserRole.AGENT));

router.post('/', validate(createCustomerSchema), createCustomer);
router.get('/search', searchCustomers);
router.get('/:id', getCustomer);
router.put('/:id', validate(updateCustomerSchema), updateCustomer);

export default router;
