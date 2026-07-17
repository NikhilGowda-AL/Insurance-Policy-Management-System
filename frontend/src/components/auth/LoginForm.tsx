'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginRequest } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { normalizeApiError } from '@/utils/errors';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  userType: 'ADMIN' | 'AGENT';
  onSwitchType: () => void;
}

export default function LoginForm({ userType, onSwitchType }: LoginFormProps) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError('');
    try {
      const user = await loginRequest(values.email, values.password, userType);
      
      if (userType === 'ADMIN' && user.role !== 'ADMIN') {
        setServerError('This account is not authorized as an admin. Please use the agent login.');
        return;
      }
      if (userType === 'AGENT' && user.role !== 'AGENT') {
        setServerError('This account is not authorized as an agent. Please use the admin login.');
        return;
      }

      setUser(user);
      setHydrated(true);
      toast.success(`Welcome back, ${user.name}`);
      router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/agent/dashboard');
    } catch (error) {
      const normalized = normalizeApiError(error);
      setServerError(normalized.message);
    }
  }

  const typeLabel = userType === 'ADMIN' ? 'Administrator' : 'Insurance Agent';
  const typeIcon = userType === 'ADMIN' ? '👨‍💼' : '🤝';

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-accent">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="font-display text-2xl text-ink">IPMS</h1>
          <p className="text-sm text-muted">Insurance Policy Management System</p>
        </div>

        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-4 py-2">
          <span className="text-lg">{typeIcon}</span>
          <span className="text-sm font-medium text-ink">{typeLabel} Login</span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border border-border bg-surface p-6 shadow-sm"
          noValidate
        >
          {serverError && (
            <p className="rounded-md bg-danger-light px-3 py-2 text-sm text-danger" role="alert">
              {serverError}
            </p>
          )}
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-center text-xs text-muted">
            Access is provisioned by your administrator. Contact them if you need an account.
          </p>
          <button
            type="button"
            onClick={onSwitchType}
            className="text-sm font-medium text-accent transition-colors hover:text-accent/80 cursor-pointer"
          >
            {userType === 'ADMIN' ? 'Sign in as Agent' : 'Sign in as Administrator'}
          </button>
        </div>
      </div>
    </div>
  );
}
