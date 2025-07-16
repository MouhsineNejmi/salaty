import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.middleware';
import { UserService } from '../services/user.service';

const router = express.Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await UserService.getCurrentUser(req.user?.id);

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export { router as userRouter };
