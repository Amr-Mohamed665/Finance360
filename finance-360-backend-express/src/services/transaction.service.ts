import { prisma, formatDecimal } from '../config/database';
import { TransactionType } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

export class TransactionService {
  private static formatTransaction(tx: any) {
    return {
      ...tx,
      amount: formatDecimal(tx.amount),
    };
  }

  static async createTransaction(
    userId: string,
    data: {
      amount: number;
      type: TransactionType;
      description: string;
      date: Date;
      categoryId: string;
    }
  ) {
    // 1. Verify category exists and belongs to authenticated user
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
    });

    if (!category) {
      throw new AppError('Invalid category ID or category does not belong to user', 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: data.date,
        categoryId: data.categoryId,
        userId,
      },
      include: {
        category: true,
      },
    });

    return this.formatTransaction(transaction);
  }

  static async getTransactions(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    return transactions.map((tx) => this.formatTransaction(tx));
  }

  static async getTransactionById(userId: string, id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    return this.formatTransaction(transaction);
  }

  static async updateTransaction(
    userId: string,
    id: string,
    data: {
      amount?: number;
      type?: TransactionType;
      description?: string;
      date?: Date;
      categoryId?: string;
    }
  ) {
    await this.getTransactionById(userId, id); // Verify transaction ownership

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, userId },
      });

      if (!category) {
        throw new AppError('Invalid category ID or category does not belong to user', 400);
      }
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return this.formatTransaction(updated);
  }

  static async deleteTransaction(userId: string, id: string) {
    await this.getTransactionById(userId, id); // Verify ownership

    return prisma.transaction.delete({
      where: { id },
    });
  }
}
