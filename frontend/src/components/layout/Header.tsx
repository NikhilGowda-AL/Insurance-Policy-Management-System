'use client';

import { Menu, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Dropdown } from '@/components/ui/Dropdown';
import { logoutRequest } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { SessionUser } from '@/types';
import { MobileSidebar } from './MobileSidebar';

export function Header({ user, title }: { user: SessionUser; title: string }) {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    try {
      await logoutRequest();
      clear();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Could not log out. Please try again.');
    }
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-1.5 text-ink hover:bg-paper md:hidden cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl text-ink">{title}</h1>
        </div>
        <Dropdown
          align="right"
          trigger={
            <span className="flex items-center gap-2 text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                <UserIcon className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            </span>
          }
          options={[{ label: 'Log out', onSelect: handleLogout, danger: true }]}
        />
      </header>
      <MobileSidebar role={user.role} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
