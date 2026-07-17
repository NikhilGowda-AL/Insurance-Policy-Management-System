'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardBody } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Loader';
import { CustomerForm } from '@/features/customers/CustomerForm';
import { useAuthStore } from '@/store/auth.store';
import { getCustomerRequest, updateCustomerRequest, CustomerFormPayload } from '@/services/customer.service';
import { normalizeApiError } from '@/utils/errors';
import { Customer } from '@/types';

function EditCustomerContent() {
  const user = useAuthStore((s) => s.user)!;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCustomerRequest(params.id);
      setCustomer(data);
    } catch {
      toast.error('Could not load customer');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(values: CustomerFormPayload) {
    try {
      await updateCustomerRequest(params.id, values);
      toast.success('Customer updated successfully');
      router.push(`/agent/customers/${params.id}`);
    } catch (error) {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message);
      throw error;
    }
  }

  if (loading || !customer) {
    return (
      <DashboardShell user={user} title="Edit Customer">
        <PageLoader label="Loading customer" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} title={`Edit ${customer.firstName} ${customer.lastName}`}>
      <Card className="mx-auto max-w-3xl">
        <CardBody>
          <CustomerForm
            defaultValues={{
              firstName: customer.firstName,
              lastName: customer.lastName,
              dob: customer.dob.slice(0, 10),
              gender: customer.gender,
              mobile: customer.mobile,
              email: customer.email,
              aadhaar: customer.aadhaar,
              pan: customer.pan ?? '',
              address: customer.address,
              city: customer.city,
              state: customer.state,
              pinCode: customer.pinCode
            }}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

export default function EditCustomerPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <EditCustomerContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
