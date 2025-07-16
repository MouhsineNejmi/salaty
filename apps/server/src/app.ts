import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { storesRouter } from './routes/store.routes';

import { errorHandler } from './middlewares/error.middleware';
import { NotFoundError } from './errors';

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/stores', storesRouter);

app.all(/(.*)/, (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});
// Error handler
app.use(errorHandler);

export default app;
