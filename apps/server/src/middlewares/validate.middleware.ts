import z from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';

export const validate = (
  schema: z.Schema<any>,
  type: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[type]);
    if (!result.success) {
      const message = JSON.stringify(z.treeifyError(result.error), null, 2);
      return next(new BadRequestError(message));
    }

    req[type] = result.data;
    next();
  };
};
