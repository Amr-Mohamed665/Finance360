import { prisma, formatDecimal } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export class BudgetService {
  private static formatBudget(budget: any) {
    return {
      ...budget,
      amount: formatDecimal(budget.amount),
    };
  }

  static async createBudget(
    userId: string,
    data: {
      amount: number;
      month: number;
      year: number;
      categoryId: string;
    }
  ) {
    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new AppError('Invalid category ID or category does not belong to user', 400);
    }

    // Check unique budget constraint before creating
    const existing = await prisma.budget.findUnique({
      where: {
        userId_categoryId_month_year: {
          userId,
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
        },
      },
    });

    if (existing) {
      throw new AppError(
        'A budget for this category, month, and year already exists.',
        409
      );
    }

    const budget = await prisma.budget.create({
      data: {
        amount: data.amount,
        month: data.month,
        year: data.year,
        categoryId: data.categoryId,
        userId,
      },
      include: {
        category: true,
      },
    });

    return this.formatBudget(budget);
  }

  static async getBudgets(userId: string) {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return budgets.map((b) => this.formatBudget(b));
  }

  static async getBudgetById(userId: string, id: string) {
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    return this.formatBudget(budget);
  }

  static async updateBudget(
    userId: string,
    id: string,
    data: {
      amount?: number;
      month?: number;
      year?: number;
      categoryId?: string;
    }
  ) {
    const existingBudget = await this.getBudgetById(userId, id); // Ownership check

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });
      if (!category) {
        throw new AppError('Invalid category ID or category does not belong to user', 400);
      }
    }

    const updated = await prisma.budget.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return this.formatBudget(updated);
  }

  static async deleteBudget(userId: string, id: string) {
    await this.getBudgetById(userId, id); // Ownership check

    return prisma.budget.delete({
      where: { id },
    });
  }
}
