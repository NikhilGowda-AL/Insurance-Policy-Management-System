'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Loader';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { useAuthStore } from '@/store/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCustomersRequest } from '@/services/customer.service';
import { Customer, PaginationMeta } from '@/types';
import { useRouter } from 'next/navigation';

function CustomersContent() {
  const user = useAuthStore((s) => s.user)!;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const router = useRouter();


  const load = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await searchCustomersRequest({ q: debouncedSearch, page, limit: 10 });
        setCustomers(res.customers);
        setMeta(res.meta);
      } catch {
        toast.error('Could not load customers');
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <DashboardShell user={user} title="Customers">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search by name, mobile or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Link href="/agent/customers/new">
          <Button>
            <UserPlus className="h-4 w-4" /> New Customer
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-sm">
        {loading ? (
          <SkeletonList rows={6} />
        ) : customers.length === 0 ? (
          <EmptyState
            title="No customers found"
            description="Onboard your first customer to start issuing policies."
            action={
              <Link href="/agent/customers/new">
                <Button>Onboard Customer</Button>
              </Link>
            }
          />
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Mobile</Th>
                  <Th>Aadhaar</Th>
                  <Th>City</Th>
                  <Th>Age</Th>
                </tr>
              </Thead>
              <Tbody>
  {customers.map((c) => (
    <Tr
      key={c.id}
      className="cursor-pointer transition-colors hover:bg-muted/50"
      onClick={() => router.push(`/agent/customers/${c.id}`)}
    >
      <Td className="font-medium">
        {c.firstName} {c.lastName}
      </Td>
      <Td className="font-mono-tab text-muted">{c.mobile}</Td>
      <Td className="font-mono-tab text-muted">{c.aadhaar}</Td>
      <Td>{c.city}</Td>
      <Td>{c.age}</Td>
    </Tr>
  ))}
</Tbody>
            </Table>
            <Pagination meta={meta} onPageChange={(page) => load(page)} />
          </>
        )}
      </div>
    </DashboardShell>
  );
}

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <CustomersContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
