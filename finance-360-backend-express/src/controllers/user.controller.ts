import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class UserController {
  static async updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedUserId = req.user!.id;
      const targetUserId = req.params.id as string;
      const updatedUser = await UserService.updateUser(authenticatedUserId, targetUserId, req.body);
      sendSuccess(res, updatedUser, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
