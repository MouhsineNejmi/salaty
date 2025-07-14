import express from 'express';
import { validate } from '../middlewares/validate.middleware';
import { SignupSchema, LoginSchema } from '@salaty/shared';
import { AuthService } from '../services/auth.service';

const router = express.Router();

router.post('/signup', validate(SignupSchema), async (req, res, next) => {
  try {
    const token = await AuthService.signup(req.body);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(LoginSchema), async (req, res, next) => {
  try {
    const token = await AuthService.login(req.body);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
