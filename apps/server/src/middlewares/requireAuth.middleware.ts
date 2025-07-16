import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new UnauthorizedError('Access token missing'));
  }

  try {
    const payload = verifyToken(token);
    (req as any).userId = payload.id;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};
