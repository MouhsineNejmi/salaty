// services/store.service.ts

import { db } from '../config/db';
import { CreateStoreDto } from '@salaty/shared';

export class StoreService {
  static async createStore(data: CreateStoreDto & { ownerId: string }) {
    return db.store.create({
      data,
    });
  }
}
