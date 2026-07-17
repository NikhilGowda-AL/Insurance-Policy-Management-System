'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, Users, FileText, UserCog, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types';

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agents', label: 'Agents', icon: UserCog }
];

const agentNav = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agent/customers', label: 'Customers', icon: Users },
  { href: '/agent/policies', label: 'Policies', icon: FileText }
];

export function MobileSidebar({
  role,
  open,
  onClose
}: {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const items = role === 'ADMIN' ? adminNav : agentNav;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-ink/40 cursor-pointer" onClick={onClose} aria-hidden="true" />
      <aside className="relative z-10 flex h-full w-64 flex-col bg-ink text-white animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="flex items-center gap-2 font-display text-lg">
            <ShieldCheck className="h-6 w-6 text-accent" /> IPMS
          </span>
          <button onClick={onClose} aria-label="Close navigation" className="rounded-md p-1 hover:bg-white/10 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm cursor-pointer
                  ${active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
