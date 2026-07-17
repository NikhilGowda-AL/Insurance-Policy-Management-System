'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Pencil, FilePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader, SkeletonList } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { useAuthStore } from '@/store/auth.store';
import { getCustomerRequest } from '@/services/customer.service';
import { getPoliciesForCustomerRequest } from '@/services/policy.service';
import { Customer, Policy } from '@/types';
import { formatCurrency, formatDate, initials, toTitleCase } from '@/utils/format';

const statusVariant: Record<Policy['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  ACTIVE: 'success',
  LAPSED: 'warning',
  CANCELLED: 'danger',
  MATURED: 'neutral'
};

function CustomerDetailContent() {
  const user = useAuthStore((s) => s.user)!;
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomerRequest(params.id);
      setCustomer(data);
    } catch {
      toast.error('Could not load customer details');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const loadPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    try {
      const res = await getPoliciesForCustomerRequest(params.id, { limit: 50 });
      setPolicies(res.policies);
    } catch {
      toast.error('Could not load policies');
    } finally {
      setPoliciesLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
    loadPolicies();
  }, [load, loadPolicies]);

  if (loading || !customer) {
    return (
      <DashboardShell user={user} title="Customer">
        <PageLoader label="Loading customer" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} title={`${customer.firstName} ${customer.lastName}`}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light font-display text-lg text-primary-dark">
                {initials(customer.firstName, customer.lastName)}
              </span>
              <div>
                <h2 className="font-display text-lg text-ink">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-sm text-muted">{customer.city}, {customer.state}</p>
              </div>
            </div>
            <Link href={`/agent/customers/${customer.id}/edit`}>
              <Button variant="secondary" size="sm">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
              <Field label="Age" value={`${customer.age} years`} />
              <Field label="Gender" value={toTitleCase(customer.gender)} />
              <Field label="Mobile" value={customer.mobile} mono />
              <Field label="Email" value={customer.email} />
              <Field label="Aadhaar" value={customer.aadhaar} mono />
              <Field label="PAN" value={customer.pan ?? '—'} mono />
              <Field label="Address" value={customer.address} />
              <Field label="PIN Code" value={customer.pinCode} mono />
              <Field label="Onboarded" value={formatDate(customer.createdAt)} />
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Policies</h2>
            <Link href={`/agent/policies/issue?customerId=${customer.id}`}>
              <Button size="sm">
                <FilePlus className="h-3.5 w-3.5" /> Issue Policy
              </Button>
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            {policiesLoading ? (
              <SkeletonList rows={3} />
            ) : policies.length === 0 ? (
              <EmptyState
                title="No policies yet"
                description="Issue this customer's first policy to get started."
              />
            ) : (
              <Table>
                <Thead>
                  <tr>
                    <Th>Policy Number</Th>
                    <Th>Type</Th>
                    <Th>Premium</Th>
                    <Th>Term</Th>
                    <Th>Start Date</Th>
                    <Th>Status</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {policies.map((p) => (
                    <Tr key={p._id}>
                      <Td className="font-mono-tab font-medium">{p.policyNumber}</Td>
                      <Td>{toTitleCase(p.policyType)}</Td>
                      <Td className="font-mono-tab">
                        {formatCurrency(p.premium)} / {toTitleCase(p.premiumFrequency)}
                      </Td>
                      <Td>{p.policyTerm} yrs</Td>
                      <Td className="font-mono-tab">{formatDate(p.startDate)}</Td>
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

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className={`mt-1 text-sm text-ink ${mono ? 'font-mono-tab' : ''}`}>{value}</dd>
    </div>
  );
}

export default function CustomerDetailPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <CustomerDetailContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
