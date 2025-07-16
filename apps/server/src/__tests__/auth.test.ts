import request from 'supertest';
import app from '../app';

describe('Authentication Flow', () => {
  const email = 'test@example.com';
  const password = '12345678';

  let cookies = '';

  it('it should return JWT after signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email, password });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(email);

    const setCookie = res.headers['set-cookie'];
    expect(setCookie).toBeDefined();

    const cookieString = Array.isArray(setCookie)
      ? setCookie.join('; ')
      : setCookie;
    expect(cookieString).toContain('access_token');
    expect(cookieString).toContain('refresh_token');

    cookies = setCookie;
  });

  it('it should return JWT login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    const setCookie = res.headers['set-cookie'];

    expect(setCookie).toBeDefined();

    const cookieString = Array.isArray(setCookie)
      ? setCookie.join('; ')
      : setCookie;

    expect(cookieString).toContain('access_token');
    expect(cookieString).toContain('refresh_token');

    cookies = setCookie;

    expect(res.status).toBe(200);
  });

  it('/api/users/me should returns current user with cookies', async () => {
    const res = await request(app).get('/api/users/me').set('Cookie', cookies);

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

    expect(res.status).toBe(404);
  });
});
