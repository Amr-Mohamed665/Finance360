import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .min(6, 'Email must be at least 6 characters long')
    .trim()
    .toLowerCase()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});
