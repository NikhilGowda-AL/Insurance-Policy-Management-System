'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { fetchCurrentUser } from '@/services/auth.service';

export function useAuth() {
  const { user, isHydrated, setUser, setHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated) return;
    let active = true;

    fetchCurrentUser().then((sessionUser) => {
      if (!active) return;
      setUser(sessionUser);
      setHydrated(true);
    });

    return () => {
      active = false;
    };
  }, [isHydrated, setUser, setHydrated]);

  return { user, isHydrated };
}
