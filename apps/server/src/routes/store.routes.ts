import express, { NextFunction, Request, Response } from 'express';
import { CreateStoreDto, CreateStoreSchema } from '@salaty/shared';

import { ConflictError, UnauthorizedError } from '../errors';
import { StoreService } from '../services/store.service';
import { validate } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/requireAuth.middleware';
import { generateFaviconUrl, generateLogoUrl, slugify } from '../utils';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req.user?.id;

    try {
      if (!ownerId)
        throw new UnauthorizedError(
          'You must be logged in order to see your stores!'
        );

      const stores = await StoreService.getStoresByOwnerId(ownerId);

      res.status(200).json(stores);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  requireAuth,
  validate(CreateStoreSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, slug, description, currency } = <CreateStoreDto>req.body;

    try {
      const ownerId = req.user?.id;
      if (!ownerId)
        throw new UnauthorizedError(
          'Unauthorized to create the store! You are not logged in.'
        );

      const logo = req.body.logo || generateLogoUrl(name);
      const favicon = req.body.favicon || generateFaviconUrl(slug);

      const store = await StoreService.createStore({
        name,
        slug: slugify(slug),
        description,
        currency,
        ownerId,
        logo,
        favicon,
      });

      return res.status(201).json(store);
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return next(new ConflictError('Store with this slug already exists.'));
      }

      next(error);
    }
  }
);

export { router as storesRouter };
