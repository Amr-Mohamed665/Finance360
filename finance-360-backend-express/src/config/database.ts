import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/finance360";
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

/**
 * Helper to convert Prisma Decimal values to Javascript numbers or clean values for API JSON response.
 */
export function formatDecimal(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'object' && 'toNumber' in value) {
    return value.toNumber();
  }
  return Number(value);
}
