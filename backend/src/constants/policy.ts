export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  LAPSED = 'LAPSED',
  CANCELLED = 'CANCELLED',
  MATURED = 'MATURED'
}

export enum PremiumFrequency {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY'
}

export enum PolicyType {
  TERM_LIFE = 'TERM_LIFE',
  ENDOWMENT = 'ENDOWMENT',
  ULIP = 'ULIP',
  HEALTH = 'HEALTH',
  MOTOR = 'MOTOR'
}

export const VALID_POLICY_TERMS = [10, 15, 20, 25, 30] as const;

export const MIN_PREMIUM = 5000;
export const PAN_MANDATORY_PREMIUM_THRESHOLD = 50000;

export const MIN_CUSTOMER_AGE = 18;
export const MAX_CUSTOMER_AGE = 65;
