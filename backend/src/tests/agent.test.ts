import request from 'supertest';
import app from '../app';
import { UserRole } from '../constants/roles';
import { createAndLoginUser } from './testHelpers';
import { MESSAGES } from '../constants/messages';

describe('Admin - Agent management API', () => {
  it('allows an admin to create a new agent', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.create.agent');

    const res = await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'New Agent', email: 'new.agent@ipms.local', password: 'Password@123' });

    expect(res.status).toBe(201);
    expect(res.body.data.agent.email).toBe('new.agent@ipms.local');
    expect(res.body.data.agent.active).toBe(true);
  });

  it('rejects agent creation from a non-admin user', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.forbidden.create');

    const res = await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'New Agent', email: 'blocked.agent@ipms.local', password: 'Password@123' });

    expect(res.status).toBe(403);
  });

  it('prevents creating two agents with the same email', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.dup.agent');

    await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'Agent One', email: 'dup.agent@ipms.local', password: 'Password@123' });

    const res = await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'Agent Two', email: 'dup.agent@ipms.local', password: 'Password@123' });

    expect(res.status).toBe(409);
  });

  it('lists agents with pagination metadata', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.list.agent');

    await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'List Agent', email: 'list.agent@ipms.local', password: 'Password@123' });

    const res = await request(app).get('/api/admin/agents?page=1&limit=10').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.meta).toHaveProperty('total');
    expect(Array.isArray(res.body.data.agents)).toBe(true);
  });

  it('deactivates an agent', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.deactivate');

    const createRes = await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'Deactivate Me', email: 'deactivate.me@ipms.local', password: 'Password@123' });

    const agentId = createRes.body.data.agent.id;

    const res = await request(app).delete(`/api/admin/agents/${agentId}`).set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.agent.active).toBe(false);
  });

  it('blocks a deactivated agent from logging in', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.deactivate.login');

    const createRes = await request(app)
      .post('/api/admin/agents')
      .set('Cookie', cookie)
      .send({ name: 'Blocked Agent', email: 'blocked.login@ipms.local', password: 'Password@123' });

    const agentId = createRes.body.data.agent.id;
    await request(app).delete(`/api/admin/agents/${agentId}`).set('Cookie', cookie);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'blocked.login@ipms.local', password: 'Password@123', userType: 'AGENT' });

    expect(loginRes.status).toBe(403);
    expect(loginRes.body.message).toBe(MESSAGES.AUTH.ACCOUNT_INACTIVE);
  });
});
