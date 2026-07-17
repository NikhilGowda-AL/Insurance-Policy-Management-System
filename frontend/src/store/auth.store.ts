import { create } from 'zustand';
import { SessionUser } from '@/types';

interface AuthState {
  user: SessionUser | null;
  isHydrated: boolean;
  setUser: (user: SessionUser | null) => void;
  setHydrated: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  setUser: (user) => set({ user }),
  setHydrated: (value) => set({ isHydrated: value }),
  clear: () => set({ user: null })
}));
