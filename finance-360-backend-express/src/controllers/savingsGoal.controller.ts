import { Response, NextFunction } from 'express';
import { SavingsGoalService } from '../services/savingsGoal.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SavingsGoalController {
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const goal = await SavingsGoalService.createSavingsGoal(userId, req.body);
      sendSuccess(res, goal, 'Savings goal created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const goals = await SavingsGoalService.getSavingsGoals(userId);
      sendSuccess(res, goals);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const goal = await SavingsGoalService.getSavingsGoalById(userId, id);
      sendSuccess(res, goal);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const goal = await SavingsGoalService.updateSavingsGoal(userId, id, req.body);
      sendSuccess(res, goal, 'Savings goal updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      await SavingsGoalService.deleteSavingsGoal(userId, id);
      sendSuccess(res, null, 'Savings goal deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
