import { Response, NextFunction } from 'express';
import { BudgetService } from '../services/budget.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class BudgetController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const budget = await BudgetService.createBudget(userId, req.body);
      sendSuccess(res, budget, 'Budget created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const budgets = await BudgetService.getBudgets(userId);
      sendSuccess(res, budgets);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const budget = await BudgetService.getBudgetById(userId, id);
      sendSuccess(res, budget);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const budget = await BudgetService.updateBudget(userId, id, req.body);
      sendSuccess(res, budget, 'Budget updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      await BudgetService.deleteBudget(userId, id);
      sendSuccess(res, null, 'Budget deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
