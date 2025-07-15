import express, { NextFunction, Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { SignupSchema, LoginSchema } from '@salaty/shared';
import { AuthService } from '../services/auth.service';

const router = express.Router();

router.post(
  '/signup',
  validate(SignupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await AuthService.signup(req.body, res);
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  validate(LoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await AuthService.login(req.body, res);
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/auth/refresh', (req: Request, res: Response) => {
  return AuthService.refresh(req, res);
});

router.post('/logout', (req: Request, res: Response) => {
  AuthService.clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out' });
});

export { router as authRouter };
