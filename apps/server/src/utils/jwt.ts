import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors';

const ACCESS_TOKEN_EXP = '15m';
const REFRESH_TOKEN_EXP = '7d';

export type JWT_PAYLOAD = { id: string; email: string };

export const signToken = (
  payload: JWT_PAYLOAD,
  type: 'access_token' | 'refresh_token' = 'access_token'
) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: type === 'access_token' ? ACCESS_TOKEN_EXP : REFRESH_TOKEN_EXP,
  });
};

export const verifyToken = (token: string): JWT_PAYLOAD => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWT_PAYLOAD;
  } catch (e) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
