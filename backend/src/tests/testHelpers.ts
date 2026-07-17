import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { UserRole } from '../constants/roles';

export async function createAndLoginUser(role: UserRole, emailPrefix: string) {
  const email = `${emailPrefix}@ipms.local`;
  const password = 'Password@123';

  const user = await User.create({ name: 'Test User', email, password, role, active: true });

  const res = await request(app).post('/api/auth/login').send({ email, password, userType: role });
  const cookie = res.headers['set-cookie']?.[0] ?? '';

  return { user, cookie };
}

export function validCustomerPayload(overrides: Record<string, unknown> = {}) {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    dob: '1990-05-15',
    gender: 'FEMALE',
    mobile: '9876543210',
    email: 'jane.doe@example.com',
    aadhaar: '123456789012',
    address: '221B Baker Street',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560001',
    ...overrides
  };
}
