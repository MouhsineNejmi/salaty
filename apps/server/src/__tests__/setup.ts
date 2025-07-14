import { db } from '../config/db';

afterAll(async () => {
  await db.user.deleteMany();
  await db.$disconnect();
});
