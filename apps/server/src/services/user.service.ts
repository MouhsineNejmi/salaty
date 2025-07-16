import { db } from '../config/db';
import { NotFoundError, UnauthorizedError } from '../errors';
import { sanitizeUser } from '../utils';

export class UserService {
  static async getCurrentUser(userId: string | undefined) {
    if (!userId) throw new UnauthorizedError('You are not logged in!');

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundError('User not found');

    return sanitizeUser(user);
  }

  // Future: updateProfile, changePassword, etc.
}
