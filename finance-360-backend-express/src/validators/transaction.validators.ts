import { z } from 'zod';

export const TransactionTypeEnum = z.enum(['income', 'expense']);

export const createTransactionSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  type: TransactionTypeEnum,
  description: z.string().trim().min(1, 'Description is required'),
  date: z.coerce.date({ message: 'Valid date is required' }),
  categoryId: z.string().uuid('Invalid category ID format'),
});

export const updateTransactionSchema = createTransactionSchema.partial();
