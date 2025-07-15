import { api } from '../fetcher';

export async function login(data: { email: string; password: string }) {
  return await api<{ message: string }>('/auth/login', {
    method: 'POST',
    data,
  });
}

export async function signup(data: { email: string; password: string }) {
  return await api<{ message: string }>('/auth/signup', {
    method: 'POST',
    data,
  });
}

export async function getMe() {
  return await api<{ id: string; email: string }>('/me');
}

export async function refresh() {
  return await api('/auth/refresh', {
    method: 'POST',
  });
}

export async function logout() {
  return await api('/auth/logout', {
    method: 'POST',
  });
}
