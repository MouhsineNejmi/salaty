import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { db } from '../config/db';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from '../errors';
import { signToken, verifyToken } from '../utils/jwt';
import { sanitizeUser } from '../utils';

export class AuthService {
  static sendAuthCookies(
    res: Response,
    payload: { id: string; email: string }
  ) {
    const accessToken = signToken(payload);
    const refreshToken = signToken(payload, 'refresh_token');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  }

  static clearAuthCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  static async signup(
    { email, password }: { email: string; password: string },
    res: Response
  ) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictError('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { email, password: hashedPassword },
    });

    this.sendAuthCookies(res, { id: user.id, email: user.email });

    return sanitizeUser(user);
  }

  static async login(
    { email, password }: { email: string; password: string },
    res: Response
  ) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new NotFoundError('Invalid credentials');
    }

    this.sendAuthCookies(res, { id: user.id, email: user.email });

    return sanitizeUser(user);
  }

  static refresh(req: Request, res: Response) {
    const token = req.cookies.refresh_token;

    if (!token) {
      throw new UnauthorizedError('Refresh token missing');
    }

    try {
      const payload = verifyToken(token);
      this.sendAuthCookies(res, { id: payload.id, email: payload.email });
    } catch (err) {
      throw new ForbiddenError('Invalid refresh token');
    }
  }
}
