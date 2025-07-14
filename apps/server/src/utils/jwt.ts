import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors';

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { userId: string };
  } catch (e) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
