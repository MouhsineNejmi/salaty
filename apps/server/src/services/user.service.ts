import { db } from '../config/db';
import { NotFoundError } from '../errors';

export class UserService {
  static async getCurrentUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundError('User not found');

    return user;
  }

  // Future: updateProfile, changePassword, etc.
}
