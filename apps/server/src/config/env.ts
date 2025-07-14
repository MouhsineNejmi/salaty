import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.url('Invalid CLIENT_URL'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.url('Invalid DATABASE_URL'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    z.treeifyError(_env.error)
  );
  process.exit(1);
}

export const env = _env.data;
