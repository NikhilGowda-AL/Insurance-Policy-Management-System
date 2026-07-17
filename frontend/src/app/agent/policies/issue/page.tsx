'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { PageLoader } from '@/components/ui/Loader';
import { PolicyForm } from '@/features/policies/PolicyForm';
import { useAuthStore } from '@/store/auth.store';
import { useDebounce } from '@/hooks/useDebounce';
import { searchCustomersRequest, getCustomerRequest } from '@/services/customer.service';
import { issuePolicyRequest, IssuePolicyPayload } from '@/services/policy.service';
import { normalizeApiError } from '@/utils/errors';
import { Customer } from '@/types';

function CustomerPicker({ onSelect }: { onSelect: (customer: Customer) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchCustomersRequest({ q: debounced, limit: 8 })
      .then((res) => setResults(res.customers))
      .finally(() => setLoading(false));
  }, [debounced]);

  return (
    <div className="space-y-3">
      <SearchBar
        placeholder="Search a customer by name, mobile or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p className="text-sm text-muted">Searching...</p>}
      {results.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-paper cursor-pointer"
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
    </div>
  );
}

function IssuePolicyContent() {
  const user = useAuthStore((s) => s.user)!;
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get('customerId');

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(!!preselectedId);

  useEffect(() => {
    if (!preselectedId) return;
    getCustomerRequest(preselectedId)
      .then(setCustomer)
      .catch(() => toast.error('Could not load the selected customer'))
      .finally(() => setLoadingCustomer(false));
  }, [preselectedId]);

  async function handleSubmit(values: IssuePolicyPayload) {
    try {
      const policy = await issuePolicyRequest(values);
      toast.success(`Policy ${policy.policyNumber} issued successfully`);
      router.push(`/agent/customers/${values.customerId}`);
    } catch (error) {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message);
      throw error;
    }
  }

  return (
    <DashboardShell user={user} title="Issue Policy">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <h2 className="font-display text-lg text-ink">
            {customer ? `${customer.firstName} ${customer.lastName}` : 'Select a customer'}
          </h2>
          {customer && <p className="text-sm text-muted">{customer.mobile} · {customer.city}</p>}
        </CardHeader>
        <CardBody>
          {loadingCustomer ? (
            <PageLoader label="Loading customer" />
          ) : !customer ? (
            <CustomerPicker onSelect={setCustomer} />
          ) : (
            <PolicyForm customerId={customer.id} onSubmit={handleSubmit} />
          )}
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

export default function IssuePolicyPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <Suspense fallback={<PageLoader label="Loading" />}>
          <IssuePolicyContent />
        </Suspense>
      </RoleGuard>
    </ProtectedRoute>
  );
}
