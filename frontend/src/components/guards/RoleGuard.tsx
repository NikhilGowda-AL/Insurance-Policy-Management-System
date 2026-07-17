'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { PageLoader } from '@/components/ui/Loader';

export function RoleGuard({ allow, children }: { allow: UserRole[]; children: ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && user && !allow.includes(user.role)) {
      router.replace(user.role === 'ADMIN' ? '/admin/dashboard' : '/agent/dashboard');
    }
  }, [isHydrated, user, allow, router]);

  if (!isHydrated || !user || !allow.includes(user.role)) {
    return <PageLoader label="Loading" />;
  }

  return <>{children}</>;
}
