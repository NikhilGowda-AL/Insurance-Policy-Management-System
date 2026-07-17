'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, LayoutDashboard, Users, FileText, UserCog, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/agents', label: 'Agents', icon: UserCog }
];

const agentNav: NavItem[] = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agent/customers', label: 'Customers', icon: Users },
  { href: '/agent/policies', label: 'Policies', icon: FileText }
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = role === 'ADMIN' ? adminNav : agentNav;

  return (
    <aside className="hidden w-60 flex-col bg-ink text-white md:flex">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <ShieldCheck className="h-6 w-6 text-accent" aria-hidden="true" />
        <span className="font-display text-lg tracking-wide">IPMS</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors cursor-pointer
                ${active ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
        Insurance Policy Management System
      </div>
    </aside>
  );
}
