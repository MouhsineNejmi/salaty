import request from 'supertest';
import app from '../app';

describe('Authentication Flow', () => {
  const email = 'test@example.com';
  const password = '12345678';

  it('it should return JWT after signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('it should return JWT login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('/api/users/me should returns current user', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    const token = login.body.token;

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(email);
  });

  it('/api/users/me should fail without token', async () => {
    const res = await request(app).get('/api/users/me');

    expect(res.status).toBe(401);
  });

  it('/api/auth/login should fail with bad credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'wrongpass' });

    expect(res.status).toBe(401);
  });
});
