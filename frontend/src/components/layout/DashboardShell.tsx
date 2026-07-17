'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SessionUser } from '@/types';

export function DashboardShell({
  user,
  title,
  children
}: {
  user: SessionUser;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-paper">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} title={title} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
