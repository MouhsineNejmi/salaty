import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.email({ message: 'Invalid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(32, { message: 'Password must be at most 32 characters' }),
});

export const LoginSchema = SignupSchema;

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
