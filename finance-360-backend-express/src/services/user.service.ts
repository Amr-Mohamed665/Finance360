import { prisma } from "../config/database";
import { hashPassword } from "../utils/password";
import { AppError } from "../middleware/error.middleware";

export class UserService {
  static async updateUser(
    authenticatedUserId: string,
    targetUserId: string,
    data: { username?: string; email?: string; password?: string },
  ) {
    if (authenticatedUserId !== targetUserId) {
      throw new AppError(
        "Unauthorized: You can only update your own account",
        403,
      );
    }

    if (data.email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: data.email, NOT: { id: targetUserId } },
      });
      if (existingEmail) {
        throw new AppError("Email is already in use", 409);
      }
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await hashPassword(data.password);

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        confirmed: true,
        blocked: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
