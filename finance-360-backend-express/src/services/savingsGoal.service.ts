import { prisma, formatDecimal } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export class SavingsGoalService {
  private static formatGoal(goal: any) {
    return {
      ...goal,
      targetAmount: formatDecimal(goal.targetAmount),
      currentAmount: formatDecimal(goal.currentAmount),
    };
  }

  static async createSavingsGoal(
    userId: string,
    data: {
      name: string;
      targetAmount: number;
      currentAmount?: number;
      deadline?: Date;
    }
  ) {
    const goal = await prisma.savingsGoal.create({
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount ?? 0,
        deadline: data.deadline || null,
        userId,
      },
    });

    return this.formatGoal(goal);
  }

  static async getSavingsGoals(userId: string) {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return goals.map((g) => this.formatGoal(g));
  }

  static async getSavingsGoalById(userId: string, id: string) {
    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      throw new AppError('Savings goal not found', 404);
    }

    return this.formatGoal(goal);
  }

  static async updateSavingsGoal(
    userId: string,
    id: string,
    data: {
      name?: string;
      targetAmount?: number;
      currentAmount?: number;
      deadline?: Date;
    }
  ) {
    await this.getSavingsGoalById(userId, id); // Verify ownership

    const updated = await prisma.savingsGoal.update({
      where: { id },
      data,
    });

    return this.formatGoal(updated);
  }

  static async deleteSavingsGoal(userId: string, id: string) {
    await this.getSavingsGoalById(userId, id); // Verify ownership

    return prisma.savingsGoal.delete({
      where: { id },
    });
  }
}
