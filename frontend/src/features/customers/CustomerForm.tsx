'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { GENDERS } from '@/lib/constants';
import { CustomerFormPayload } from '@/services/customer.service';
import { normalizeApiError } from '@/utils/errors';

const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
const aadhaarRegex = /^\d{12}$/;
const mobileRegex = /^[6789]\d{9}$/;
const pinRegex = /^\d{6}$/;

const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { errorMap: () => ({ message: 'Select a gender' }) }),
  mobile: z.string().regex(mobileRegex, 'Must be 10 digits starting with 6, 7, 8 or 9'),
  email: z.string().email('Enter a valid email address'),
  aadhaar: z.string().regex(aadhaarRegex, 'Must be exactly 12 digits'),
  pan: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => val === '' || panRegex.test(val), 'PAN must be in format ABCDE1234F')
    .optional()
    .or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(pinRegex, 'Must be exactly 6 digits')
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormPayload) => Promise<void>;
  submitLabel: string;
}

export function CustomerForm({ defaultValues, onSubmit, submitLabel }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues
  });

  async function handleFormSubmit(values: CustomerFormValues) {
    try {
      await onSubmit({ ...values, pan: values.pan || undefined });
    } catch (error) {
      const normalized = normalizeApiError(error);
      Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof CustomerFormValues, { message });
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Date of birth" type="date" error={errors.dob?.message} {...register('dob')} />
        <Select
          label="Gender"
          options={[...GENDERS]}
          placeholder="Select gender"
          error={errors.gender?.message}
          {...register('gender')}
        />
        <Input
          label="Mobile number"
          placeholder="9876543210"
          error={errors.mobile?.message}
          {...register('mobile')}
        />
        <Input label="Email address" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Aadhaar number"
          placeholder="12 digits"
          error={errors.aadhaar?.message}
          {...register('aadhaar')}
        />
        <Input
          label="PAN (optional)"
          placeholder="ABCDE1234F"
          hint="Required if premium exceeds ₹50,000 at policy issuance"
          error={errors.pan?.message}
          {...register('pan')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Address" className="sm:col-span-2" error={errors.address?.message} {...register('address')} />
        <Input label="City" error={errors.city?.message} {...register('city')} />
        <Input label="State" error={errors.state?.message} {...register('state')} />
        <Input label="PIN code" error={errors.pinCode?.message} {...register('pinCode')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
