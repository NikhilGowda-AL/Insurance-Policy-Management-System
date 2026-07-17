import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { UserRole } from '../constants/roles';
import { env } from '../config/env';
import { MESSAGES } from '../constants/messages';

async function createUser(overrides: Partial<{ email: string; password: string; role: UserRole; active: boolean }> = {}) {
  return User.create({
    name: 'Test User',
    email: overrides.email ?? 'test.user@ipms.local',
    password: overrides.password ?? 'Password@123',
    role: overrides.role ?? UserRole.AGENT,
    active: overrides.active ?? true
  });
}

describe('Auth API', () => {
  describe('POST /api/auth/login', () => {
    it('logs in a valid, active user and sets an HTTP-only cookie', async () => {
      await createUser({ email: 'agent@ipms.local', password: 'Password@123', role: UserRole.AGENT });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'agent@ipms.local', password: 'Password@123', userType: 'AGENT' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe(MESSAGES.AUTH.LOGIN_SUCCESS);
      expect(res.body.data.user.email).toBe('agent@ipms.local');
      expect(res.body.data.user.role).toBe('AGENT');

      const cookieHeader = res.headers['set-cookie']?.[0] ?? '';
      expect(cookieHeader).toContain(env.cookieName);
      expect(cookieHeader.toLowerCase()).toContain('httponly');
      expect(cookieHeader.toLowerCase()).toContain('samesite=lax');
    });

    it('rejects a login when the email is not registered under the selected role', async () => {
      await createUser({ email: 'agent.only@ipms.local', password: 'Password@123', role: UserRole.AGENT });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'agent.only@ipms.local', password: 'Password@123', userType: 'ADMIN' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(MESSAGES.AUTH.INVALID_CREDENTIALS);
    });

    it('rejects a login for an email that does not exist at all', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@ipms.local', password: 'Password@123', userType: 'AGENT' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe(MESSAGES.AUTH.INVALID_CREDENTIALS);
    });

    it('rejects a login for a deactivated account before checking the password', async () => {
      await createUser({
        email: 'inactive@ipms.local',
        password: 'Password@123',
        role: UserRole.AGENT,
        active: false
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inactive@ipms.local', password: 'WrongPassword', userType: 'AGENT' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(MESSAGES.AUTH.ACCOUNT_INACTIVE);
    });

    it('rejects an incorrect password for an active account with a matching role', async () => {
      await createUser({ email: 'agent2@ipms.local', password: 'Password@123', role: UserRole.AGENT });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'agent2@ipms.local', password: 'WrongPassword', userType: 'AGENT' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(MESSAGES.AUTH.INVALID_CREDENTIALS);
    });

    it('returns a 422 validation error for a malformed email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'Password@123', userType: 'AGENT' });

      expect(res.status).toBe(422);
      expect(res.body.message).toBe(MESSAGES.VALIDATION.FAILED);
      expect(res.body.errors).toHaveProperty('email');
    });

    it('returns a 422 validation error when userType is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'agent@ipms.local', password: 'Password@123' });

      expect(res.status).toBe(422);
      expect(res.body.message).toBe(MESSAGES.VALIDATION.FAILED);
      expect(res.body.errors).toHaveProperty('userType');
    });

    it('returns a 422 validation error when userType is not ADMIN or AGENT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'agent@ipms.local', password: 'Password@123', userType: 'SUPERUSER' });

      expect(res.status).toBe(422);
      expect(res.body.errors).toHaveProperty('userType');
    });
  });

  describe('Protected routes', () => {
    it('rejects access without a valid session cookie', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
