import request from 'supertest';
import app from '../app';
import { db } from '../config/db';
import { createAuthenticatedAgent } from './utils/createAuthenticatedAgent';

describe('Store API', () => {
  const validStore = {
    name: 'My Test Store',
    slug: 'my-test-store',
    description: { text: 'Great stuff' },
    currency: 'USD',
  };

  it('should create a store and link to user', async () => {
    const agent = await createAuthenticatedAgent();

    const res = await agent.post('/api/stores').send(validStore);

    console.log('status: ', res.status);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(validStore.name);
    expect(res.body.slug).toBe(validStore.slug);
    expect(res.body.currency).toBe(validStore.currency);
    expect(res.body.ownerId).toBeDefined();

    const storeInDb = await db.store.findUnique({
      where: { slug: validStore.slug },
      include: { owner: true },
    });

    expect(storeInDb).not.toBeNull();
    expect(storeInDb?.owner.email).toBe('test@example.com');
  });

  it('should reject duplicate slug', async () => {
    const agent = await createAuthenticatedAgent();

    await agent
      .post('/api/stores')
      .send({ ...validStore, slug: 'duplicate-store' });

    const res = await agent
      .post('/api/stores')
      .send({ ...validStore, slug: 'duplicate-store' });

    expect(res.status).toBe(409);
  });

  it('should fallback to MAD as default currency if not specified', async () => {
    const agent = await createAuthenticatedAgent();

    const res = await agent.post('/api/stores').send({
      ...validStore,
      slug: 'no-currency',
      currency: undefined,
    });

    expect(res.status).toBe(201);
    expect(res.body.currency).toBe('MAD');
  });

  it('should reject unauthenticated access', async () => {
    const res = await request(app).post('/api/stores').send(validStore);
    expect(res.status).toBe(401);
  });

  it('should validate missing fields (Zod)', async () => {
    const agent = await createAuthenticatedAgent();

    const res = await agent.post('/api/stores').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
