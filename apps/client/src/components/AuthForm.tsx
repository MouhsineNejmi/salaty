'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { SignupSchema, LoginSchema } from '@salaty/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle } from '@/components/ui/alert';

import { login, signup } from '@/lib/api/auth';

type Mode = 'login' | 'signup';

type AuthFormProps = {
  mode: Mode;
};

const schemas = {
  login: LoginSchema,
  signup: SignupSchema,
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = schemas[mode];
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(data);
      } else {
        await signup(data);
      }

      toast(`✅ ${mode.toUpperCase()} Success`, {
        position: 'top-center',
      });
      router.push('/stores');
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Welcome back</CardTitle>
        <CardDescription>
          Enter your email and password below to{' '}
          {mode === 'login' ? 'login to your account' : 'create your account'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 max-w-md mx-auto'
        >
          {error && (
            <Alert variant='destructive'>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <div className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className='text-sm text-red-500 mt-1'>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className='grid gap-3'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                {mode === 'login' && (
                  <a
                    href='#'
                    className='ml-auto text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                )}
              </div>

              <Input
                placeholder='******'
                {...form.register('password')}
                type='password'
                autoComplete='current-password'
              />
              {form.formState.errors.password && (
                <p className='text-sm text-red-500 mt-1'>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>

            <div className='text-center text-sm'>
              Don&apos;t have an account?{' '}
              <Link
                href={mode === 'login' ? 'signup' : 'login'}
                className='underline underline-offset-4'
              >
                {mode === 'login' ? 'Sign up' : 'Login'}
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
