'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FilePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/Loader';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { useAuthStore } from '@/store/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCustomersRequest } from '@/services/customer.service';
import { getPoliciesForCustomerRequest } from '@/services/policy.service';
import { Customer, Policy } from '@/types';
import { formatCurrency, toTitleCase } from '@/utils/format';

const statusVariant: Record<Policy['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  ACTIVE: 'success',
  LAPSED: 'warning',
  CANCELLED: 'danger',
  MATURED: 'neutral'
};

function PoliciesContent() {
  const user = useAuthStore((s) => s.user)!;
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  useEffect(() => {
    setLoadingCustomers(true);
    searchCustomersRequest({ q: debounced || undefined, limit: 8 })
      .then((res) => setCustomers(res.customers))
      .catch(() => toast.error('Could not load customers'))
      .finally(() => setLoadingCustomers(false));
  }, [debounced]);

  useEffect(() => {
    if (!selected) return;
    setLoadingPolicies(true);
    getPoliciesForCustomerRequest(selected.id, { limit: 50 })
      .then((res) => setPolicies(res.policies))
      .catch(() => toast.error('Could not load policies'))
      .finally(() => setLoadingPolicies(false));
  }, [selected]);

  return (
    <DashboardShell user={user} title="Policies">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <SearchBar
              placeholder="Search your customers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </CardHeader>
          <CardBody className="p-0">
            {loadingCustomers ? (
              <SkeletonList rows={4} />
            ) : customers.length === 0 ? (
              <EmptyState title="No customers found" />
            ) : (
              <ul className="divide-y divide-border">
                {customers.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelected(c)}
                      className={`flex cursor-pointer w-full items-center justify-between px-5 py-3 text-left hover:bg-paper ${
                        selected?.id === c.id ? 'bg-primary-light' : ''
                      }`}
                    >
                      <span className="text-sm font-medium text-ink">
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="font-mono-tab text-xs text-muted">{c.mobile}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">
              {selected ? `${selected.firstName} ${selected.lastName}'s Policies` : 'Select a customer'}
            </h2>
            {selected && (
              <Link href={`/agent/policies/issue?customerId=${selected.id}`}>
                <Button size="sm">
                  <FilePlus className="h-3.5 w-3.5" /> Issue Policy
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardBody className="p-0">
            {!selected ? (
              <EmptyState
                title="No customer selected"
                description="Choose a customer on the left to view their policies."
              />
            ) : loadingPolicies ? (
              <SkeletonList rows={3} />
            ) : policies.length === 0 ? (
              <EmptyState
                title="No policies yet"
                description="This customer doesn't have any policies on file."
                action={
                  <Link href={`/agent/policies/issue?customerId=${selected.id}`}>
                    <Button>Issue First Policy</Button>
                  </Link>
                }
              />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Policy Number</Th>
                    <Th>Type</Th>
                    <Th>Premium</Th>
                    <Th>Status</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {policies.map((p) => (
                    <Tr key={p._id}>
                      <Td className="font-mono-tab font-medium">{p.policyNumber}</Td>
                      <Td>{toTitleCase(p.policyType)}</Td>
                      <Td className="font-mono-tab">
                        {formatCurrency(p.premium)}
                        <span className="text-muted"> / {toTitleCase(p.premiumFrequency)}</span>
                      </Td>
                      <Td>
                        <Badge variant={statusVariant[p.status]}>{toTitleCase(p.status)}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}

export default function PoliciesPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <PoliciesContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
