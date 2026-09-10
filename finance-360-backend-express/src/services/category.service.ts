import { prisma } from '../config/database';
import { CategoryType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class CategoryService {
  static async createCategory(
    userId: string,
    data: { name: string; type: CategoryType; icon?: string }
  ) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon || null,
        userId,
      },
    });
  }

  static async getCategories(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCategoryById(userId: string, id: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  static async updateCategory(
    userId: string,
    id: string,
    data: { name?: string; type?: CategoryType; icon?: string }
  ) {
    await this.getCategoryById(userId, id); // Enforces ownership & existence

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(userId: string, id: string) {
    await this.getCategoryById(userId, id); // Enforces ownership & existence

    return prisma.category.delete({
      where: { id },
    });
  }
}
