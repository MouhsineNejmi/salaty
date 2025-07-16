import { z } from 'zod';

export const CreateStoreSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Store name must be at least 2 characters long' }),
  slug: z
    .string()
    .min(2, { message: 'Store slug must be at least 2 characters long' })
    .regex(/^[a-z0-9-]+$/),
  logo: z.url().optional(),
  favicon: z.url().optional(),
  description: z.any().optional(), // JSON from rich text editor
  currency: z.string().optional(),
});

export type CreateStoreDto = z.infer<typeof CreateStoreSchema>;
