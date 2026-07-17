'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loader';
import Link from 'next/link';
import { ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (user) {
      router.replace(user.role === 'ADMIN' ? '/admin/dashboard' : '/agent/dashboard');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return <PageLoader label="Loading IPMS" />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-12 flex flex-col items-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-accent">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h1 className="font-display text-3xl text-ink">IPMS</h1>
            <p className="text-sm text-muted">Insurance Policy Management System</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/admin/login">
              <div className="group cursor-pointer rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:border-accent hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-surface">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h2 className="mb-2 font-display text-xl text-ink">Administrator</h2>
                <p className="text-sm text-muted">
                  Access admin dashboard to manage policies, customers, and system settings.
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-accent">
                  <span>Sign in as Admin</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>

            <Link href="/agent/login">
              <div className="group cursor-pointer rounded-lg border border-border bg-surface p-8 shadow-sm transition-all hover:border-accent hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-surface">
                  <Zap className="h-7 w-7" />
                </div>
                <h2 className="mb-2 font-display text-xl text-ink">Insurance Agent</h2>
                <p className="text-sm text-muted">
                  Access agent dashboard to manage customer policies and handle transactions.
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-accent">
                  <span>Sign in as Agent</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          </div>

          <p className="mt-12 text-center text-xs text-muted">
            Access is provisioned by your administrator. Contact them if you need an account.
          </p>
        </div>
      </div>
    );
  }

  return <PageLoader label="Loading IPMS" />;
}
