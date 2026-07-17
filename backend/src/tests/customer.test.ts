import request from 'supertest';
import app from '../app';
import { UserRole } from '../constants/roles';
import { createAndLoginUser, validCustomerPayload } from './testHelpers';

describe('Customer API', () => {
  it('allows an agent to create a customer with valid details', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.create');

    const res = await request(app)
      .post('/api/customers')
      .set('Cookie', cookie)
      .send(validCustomerPayload());

    expect(res.status).toBe(201);
    expect(res.body.data.customer.aadhaar).toBe('XXXX-XXXX-9012');
  });

  it('rejects customer creation for an admin (admins cannot manage customers)', async () => {
    const { cookie } = await createAndLoginUser(UserRole.ADMIN, 'admin.blocked');

    const res = await request(app)
      .post('/api/customers')
      .set('Cookie', cookie)
      .send(validCustomerPayload());

    expect(res.status).toBe(403);
  });

  it('rejects a customer younger than 18', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.minor');
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 10);

    const res = await request(app)
      .post('/api/customers')
      .set('Cookie', cookie)
      .send(validCustomerPayload({ dob: dob.toISOString().slice(0, 10), aadhaar: '111122223333' }));

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('dob');
  });

  it('rejects a duplicate Aadhaar number', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.dup.aadhaar');

    await request(app).post('/api/customers').set('Cookie', cookie).send(validCustomerPayload());

    const res = await request(app)
      .post('/api/customers')
      .set('Cookie', cookie)
      .send(validCustomerPayload({ email: 'other@example.com' }));

    expect(res.status).toBe(409);
    expect(res.body.errors).toHaveProperty('aadhaar');
  });

  it('rejects an invalid mobile number', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.badmobile');

    const res = await request(app)
      .post('/api/customers')
      .set('Cookie', cookie)
      .send(validCustomerPayload({ mobile: '1234567890', aadhaar: '999988887777' }));

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('mobile');
  });

  it('prevents an agent from viewing a customer owned by another agent', async () => {
    const agentA = await createAndLoginUser(UserRole.AGENT, 'agent.owner.a');
    const agentB = await createAndLoginUser(UserRole.AGENT, 'agent.owner.b');

    const createRes = await request(app)
      .post('/api/customers')
      .set('Cookie', agentA.cookie)
      .send(validCustomerPayload({ aadhaar: '555566667777' }));

    const customerId = createRes.body.data.customer.id;

    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set('Cookie', agentB.cookie);

    expect(res.status).toBe(403);
  });

  it('scopes customer search to the requesting agent only', async () => {
    const agentA = await createAndLoginUser(UserRole.AGENT, 'agent.search.a');
    const agentB = await createAndLoginUser(UserRole.AGENT, 'agent.search.b');

    await request(app)
      .post('/api/customers')
      .set('Cookie', agentA.cookie)
      .send(validCustomerPayload({ aadhaar: '111111111111', email: 'a@example.com' }));

    await request(app)
      .post('/api/customers')
      .set('Cookie', agentB.cookie)
      .send(validCustomerPayload({ aadhaar: '222222222222', email: 'b@example.com' }));

    const res = await request(app)
      .get('/api/customers/search')
      .set('Cookie', agentA.cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.customers).toHaveLength(1);
    expect(res.body.data.customers[0].aadhaar).toBe('XXXX-XXXX-1111');
  });
});
