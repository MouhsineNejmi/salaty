import { User } from '@prisma/client';

export function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Remove duplicate dashes
    .slice(0, 50); // Optional: limit slug length
