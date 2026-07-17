export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

export const POLICY_TERMS = [10, 15, 20, 25, 30] as const;

export const PREMIUM_FREQUENCIES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'HALF_YEARLY', label: 'Half-Yearly' },
  { value: 'YEARLY', label: 'Yearly' }
] as const;

export const POLICY_TYPES = [
  { value: 'TERM_LIFE', label: 'Term Life' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'MOTOR', label: 'Motor' }
] as const;

export const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
] as const;

export const MIN_PREMIUM = 5000;
export const PAN_MANDATORY_PREMIUM_THRESHOLD = 50000;
export const MIN_CUSTOMER_AGE = 18;
export const MAX_CUSTOMER_AGE = 65;
