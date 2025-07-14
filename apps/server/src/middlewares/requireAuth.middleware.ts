import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = header.split(' ')[1];
  const payload = verifyToken(token);
  (req as any).userId = payload.userId;
  next();
};
