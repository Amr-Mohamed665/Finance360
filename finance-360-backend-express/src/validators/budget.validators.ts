import { z } from 'zod';

export const createBudgetSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
  month: z
    .number({ message: 'Month must be a number' })
    .int('Month must be an integer')
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12'),
  year: z
    .number({ message: 'Year must be a number' })
    .int('Year must be an integer')
    .positive('Year must be greater than 0'),
  categoryId: z.string().uuid('Invalid category ID format'),
});

export const updateBudgetSchema = createBudgetSchema.partial();
