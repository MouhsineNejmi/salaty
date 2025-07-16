export interface StoreEntity {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  favicon?: string;
  description?: unknown;
  currency: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
