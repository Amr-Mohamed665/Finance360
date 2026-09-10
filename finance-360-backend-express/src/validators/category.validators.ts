import { z } from 'zod';

export const CategoryTypeEnum = z.enum(['income', 'expense', 'both']);

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  type: CategoryTypeEnum,
  icon: z.string().trim().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
