'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, FilePlus, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import { useAuthStore } from '@/store/auth.store';
import { searchCustomersRequest } from '@/services/customer.service';
import { Customer } from '@/types';
import { formatDate } from '@/utils/format';

function AgentDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchCustomersRequest({ page: 1, limit: 5 })
      .then((res) => {
        setCustomers(res.customers);
        setTotal(res.meta.total);
      })
      .catch(() => toast.error('Could not load your customers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell user={user} title="Agent Dashboard">
      {loading ? (
        <PageLoader label="Loading your workspace" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="My Customers" value={total} icon={Users} tone="primary" />
            <Link href="/agent/customers/new">
              <Card className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-5 text-center hover:border-primary">
                <UserPlus className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-ink">Onboard a customer</p>
              </Card>
            </Link>
            <Link href="/agent/policies">
              <Card className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 p-5 text-center hover:border-primary">
                <FilePlus className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-ink">Issue a policy</p>
              </Card>
            </Link>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Recent Customers</h2>
              <Link href="/agent/customers" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {customers.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted">
                  You haven&apos;t onboarded any customers yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {customers.map((c) => (
                    <li key={c.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <Link
                          href={`/agent/customers/${c.id}`}
                          className="text-sm font-medium text-ink hover:text-primary"
                        >
                          {c.firstName} {c.lastName}
                        </Link>
                        <p className="text-xs text-muted">{c.city}, {c.state}</p>
                      </div>
                      <span className="font-mono-tab text-xs text-muted">{formatDate(c.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}

export default function AgentDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <AgentDashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
