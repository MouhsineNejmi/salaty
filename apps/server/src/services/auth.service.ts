import bcrypt from 'bcrypt';

import { db } from '../config/db';
import { ConflictError, UnauthorizedError } from '../errors';
import { signToken } from '../utils/jwt';

export class AuthService {
  static async signup({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictError('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { email, password: hashedPassword },
    });

    return signToken(user.id);
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return signToken(user.id);
  }
}
