'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { login, signup } from '@/lib/api/auth';
import { SignupSchema, LoginSchema } from '@salaty/shared';

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

      console.log('CLICKED!!!!!');

      toast(`✅ ${mode.toUpperCase()} Success`, {
        position: 'top-center',
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-4 max-w-md mx-auto'
    >
      <h2 className='text-2xl font-semibold text-center capitalize'>{mode}</h2>

      {error && (
        <Alert variant='destructive'>
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <div>
        <Input
          placeholder='Email'
          {...form.register('email')}
          type='email'
          autoComplete='email'
        />
        {form.formState.errors.email && (
          <p className='text-sm text-red-500 mt-1'>
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder='Password'
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
    </form>
  );
}
