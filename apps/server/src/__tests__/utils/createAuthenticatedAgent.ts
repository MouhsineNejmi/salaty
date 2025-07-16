import request from 'supertest';
import app from '../../app';

export const createAuthenticatedAgent = async () => {
  const email = 'test@example.com';
  const password = '12345678';

  // Signup or login
  // await request(app).post('/api/auth/signup').send({ email, password });

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  const cookie = login.headers['set-cookie'];

  return request.agent(app).set('Cookie', cookie);
};
