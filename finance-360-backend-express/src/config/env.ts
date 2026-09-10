import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/finance360'),
  JWT_ACCESS_SECRET: z.string().default('default_access_secret_for_dev_change_in_prod'),
  JWT_REFRESH_SECRET: z.string().default('default_refresh_secret_for_dev_change_in_prod'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('3h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
