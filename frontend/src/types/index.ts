export type UserRole = 'ADMIN' | 'AGENT';

export interface AuthUser {
  userId: string;
  role: UserRole;
  email: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Customer {
  id: string;
  _id?: string;
  agentId: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  gender: Gender;
  mobile: string;
  email: string;
  aadhaar: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  createdAt: string;
  updatedAt: string;
}

export type PolicyType = 'TERM_LIFE' | 'HEALTH' | 'MOTOR';
export type PremiumFrequency = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
export type PolicyStatus = 'ACTIVE' | 'LAPSED' | 'CANCELLED' | 'MATURED';

export interface Policy {
  _id: string;
  customerId: string;
  agentId: string;
  policyNumber: string;
  policyType: PolicyType;
  premium: number;
  premiumFrequency: PremiumFrequency;
  policyTerm: number;
  nomineeName: string;
  nomineeRelation: string;
  startDate: string;
  status: PolicyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string> | null;
}
