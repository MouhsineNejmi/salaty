// services/store.service.ts

import { db } from '../config/db';
import { CreateStoreDto } from '@salaty/shared';

export class StoreService {
  static async getStoresByOwnerId(ownerId: string) {
    return await db.store.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        favicon: true,
        currency: true,
      },
    });
  }

  static async createStore(data: CreateStoreDto & { ownerId: string }) {
    return await db.store.create({
      data,
    });
  }
}
