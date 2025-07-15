import { User } from '@prisma/client';

export function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}
