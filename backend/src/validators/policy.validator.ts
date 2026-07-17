import { z } from 'zod';
import { PolicyType, PremiumFrequency, VALID_POLICY_TERMS, MIN_PREMIUM } from '../constants/policy';

export const issuePolicySchema = z.object({
  body: z
    .object({
      customerId: z.string().min(1, 'Customer is required'),
      policyType: z.nativeEnum(PolicyType, { errorMap: () => ({ message: 'Select a policy type' }) }),
      premium: z.coerce.number().min(MIN_PREMIUM, `Minimum premium is ${MIN_PREMIUM}`),
      premiumFrequency: z.nativeEnum(PremiumFrequency, {
        errorMap: () => ({ message: 'Select a premium frequency' })
      }),
      policyTerm: z.coerce
        .number()
        .refine((val) => (VALID_POLICY_TERMS as readonly number[]).includes(val), {
          message: `Policy term must be one of ${VALID_POLICY_TERMS.join(', ')} years`
        }),
      nomineeName: z.string().trim().min(2, 'Nominee name is required').max(120),
      nomineeRelation: z.string().trim().min(2, 'Nominee relation is required').max(60),
      startDate: z.coerce.date({ errorMap: () => ({ message: 'Enter a valid start date' }) })
    })
    .refine((data) => data.startDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0), {
      message: 'Start date cannot be in the past',
      path: ['startDate']
    })
});

export type IssuePolicyInput = z.infer<typeof issuePolicySchema>['body'];
