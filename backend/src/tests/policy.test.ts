import request from 'supertest';
import app from '../app';
import { UserRole } from '../constants/roles';
import { createAndLoginUser, validCustomerPayload } from './testHelpers';

async function createCustomer(cookie: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/customers')
    .set('Cookie', cookie)
    .send(validCustomerPayload(overrides));
  return res.body.data.customer.id as string;
}

function validPolicyPayload(customerId: string, overrides: Record<string, unknown> = {}) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  return {
    customerId,
    policyType: 'TERM_LIFE',
    premium: 12000,
    premiumFrequency: 'YEARLY',
    policyTerm: 20,
    nomineeName: 'John Smith',
    nomineeRelation: 'Spouse',
    startDate: startDate.toISOString().slice(0, 10),
    ...overrides
  };
}

describe('Policy API', () => {
  it('issues a policy for an owned customer with valid details', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.issue');
    const customerId = await createCustomer(cookie, { aadhaar: '100000000001' });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId));

    expect(res.status).toBe(201);
    expect(res.body.data.policy.policyNumber).toMatch(/^POL-\d{4}-/);
    expect(res.body.data.policy.status).toBe('ACTIVE');
  });

  it('rejects a premium below the minimum threshold', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.minprem');
    const customerId = await createCustomer(cookie, { aadhaar: '100000000002' });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { premium: 1000 }));

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('premium');
  });

  it('rejects an invalid policy term', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.term');
    const customerId = await createCustomer(cookie, { aadhaar: '100000000003' });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { policyTerm: 12 }));

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('policyTerm');
  });

  it('rejects a start date in the past', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.pastdate');
    const customerId = await createCustomer(cookie, { aadhaar: '100000000004' });
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { startDate: pastDate.toISOString().slice(0, 10) }));

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('startDate');
  });

  it('rejects when the nominee name matches the policyholder name', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.nominee');
    const customerId = await createCustomer(cookie, {
      aadhaar: '100000000005',
      firstName: 'Alex',
      lastName: 'Carter'
    });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { nomineeName: 'Alex Carter' }));

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('nomineeName');
  });

  it('requires a PAN on file when premium exceeds the mandatory threshold', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.panreq');
    const customerId = await createCustomer(cookie, { aadhaar: '100000000006' });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { premium: 60000 }));

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('pan');
  });

  it('allows a high-premium policy when the customer has a PAN on file', async () => {
    const { cookie } = await createAndLoginUser(UserRole.AGENT, 'agent.policy.panok');
    const customerId = await createCustomer(cookie, {
      aadhaar: '100000000007',
      pan: 'ABCDE1234F'
    });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', cookie)
      .send(validPolicyPayload(customerId, { premium: 60000 }));

    expect(res.status).toBe(201);
  });

  it('prevents an agent from issuing a policy for another agent\'s customer', async () => {
    const agentA = await createAndLoginUser(UserRole.AGENT, 'agent.policy.owner.a');
    const agentB = await createAndLoginUser(UserRole.AGENT, 'agent.policy.owner.b');
    const customerId = await createCustomer(agentA.cookie, { aadhaar: '100000000008' });

    const res = await request(app)
      .post('/api/policies/issue')
      .set('Cookie', agentB.cookie)
      .send(validPolicyPayload(customerId));

    expect(res.status).toBe(403);
  });
});
