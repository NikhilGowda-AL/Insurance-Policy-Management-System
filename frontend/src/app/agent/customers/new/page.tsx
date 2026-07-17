'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardBody } from '@/components/ui/Card';
import { CustomerForm } from '@/features/customers/CustomerForm';
import { useAuthStore } from '@/store/auth.store';
import { createCustomerRequest, CustomerFormPayload } from '@/services/customer.service';
import { normalizeApiError } from '@/utils/errors';

function NewCustomerContent() {
  const user = useAuthStore((s) => s.user)!;
  const router = useRouter();

  async function handleSubmit(values: CustomerFormPayload) {
    try {
      const customer = await createCustomerRequest(values);
      toast.success('Customer onboarded successfully');
      router.push(`/agent/customers/${customer.id}`);
    } catch (error) {
      const normalized = normalizeApiError(error);
      toast.error(normalized.message);
      throw error;
    }
  }

  return (
    <DashboardShell user={user} title="Onboard Customer">
      <Card className="mx-auto max-w-3xl">
        <CardBody>
          <CustomerForm onSubmit={handleSubmit} submitLabel="Create Customer" />
        </CardBody>
      </Card>
    </DashboardShell>
  );
}

export default function NewCustomerPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allow={['AGENT']}>
        <NewCustomerContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
