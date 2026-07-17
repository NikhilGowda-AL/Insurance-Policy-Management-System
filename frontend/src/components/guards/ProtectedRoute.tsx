'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Loader';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/login');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) {
    return <PageLoader label="Checking your session" />;
  }

  return <>{children}</>;
}
