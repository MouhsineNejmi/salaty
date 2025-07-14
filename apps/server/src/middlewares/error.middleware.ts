import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serialize() });
  }

  console.error('[InternalError]', err);

  return res.status(500).json({
    errors: [{ message: 'Something went wrong' }],
  });
}
