'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { POLICY_TERMS, PREMIUM_FREQUENCIES, POLICY_TYPES, MIN_PREMIUM } from '@/lib/constants';
import { IssuePolicyPayload } from '@/services/policy.service';
import { normalizeApiError } from '@/utils/errors';

const policySchema = z.object({
  policyType: z.string().min(1, 'Select a policy type'),
  premium: z.coerce.number().min(MIN_PREMIUM, `Minimum premium is ₹${MIN_PREMIUM.toLocaleString('en-IN')}`),
  premiumFrequency: z.string().min(1, 'Select a premium frequency'),
  policyTerm: z.coerce.number().refine((v) => (POLICY_TERMS as readonly number[]).includes(v), {
    message: `Term must be one of ${POLICY_TERMS.join(', ')} years`
  }),
  nomineeName: z.string().min(2, 'Nominee name is required'),
  nomineeRelation: z.string().min(2, 'Nominee relation is required'),
  startDate: z.string().min(1, 'Start date is required')
});

export type PolicyFormValues = z.infer<typeof policySchema>;

interface PolicyFormProps {
  customerId: string;
  onSubmit: (values: IssuePolicyPayload) => Promise<void>;
}

export function PolicyForm({ customerId, onSubmit }: PolicyFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: { startDate: new Date().toISOString().slice(0, 10) }
  });

  async function handleFormSubmit(values: PolicyFormValues) {
    try {
      await onSubmit({ ...values, customerId } as IssuePolicyPayload);
    } catch (error) {
      const normalized = normalizeApiError(error);
      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof PolicyFormValues, { message });
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Policy type"
          options={[...POLICY_TYPES]}
          placeholder="Select policy type"
          error={errors.policyType?.message}
          {...register('policyType')}
        />
        <Select
          label="Premium frequency"
          options={[...PREMIUM_FREQUENCIES]}
          placeholder="Select frequency"
          error={errors.premiumFrequency?.message}
          {...register('premiumFrequency')}
        />
        <Input
          label="Premium amount (₹)"
          type="number"
          min={MIN_PREMIUM}
          hint={`Minimum ₹${MIN_PREMIUM.toLocaleString('en-IN')}. PAN required above ₹50,000.`}
          error={errors.premium?.message}
          {...register('premium')}
        />
        <Select
          label="Policy term"
          options={POLICY_TERMS.map((t) => ({ value: String(t), label: `${t} years` }))}
          placeholder="Select term"
          error={errors.policyTerm?.message}
          {...register('policyTerm')}
        />
        <Input
          label="Start date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nominee name"
          hint="Cannot be the same as the policyholder"
          error={errors.nomineeName?.message}
          {...register('nomineeName')}
        />
        <Input
          label="Nominee relation"
          placeholder="e.g. Spouse, Parent, Child"
          error={errors.nomineeRelation?.message}
          {...register('nomineeRelation')}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={isSubmitting}>
          Issue Policy
        </Button>
      </div>
    </form>
  );
}
