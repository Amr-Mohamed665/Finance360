import { z } from 'zod';

export const createSavingsGoalSchema = z.object({
  name: z.string().trim().min(1, 'Savings goal name is required'),
  targetAmount: z
    .number({ message: 'Target amount must be a number' })
    .positive('Target amount must be greater than 0'),
  currentAmount: z
    .number({ message: 'Current amount must be a number' })
    .min(0, 'Current amount must be greater than or equal to 0')
    .default(0),
  deadline: z.coerce.date().optional(),
});

export const updateSavingsGoalSchema = createSavingsGoalSchema.partial();
