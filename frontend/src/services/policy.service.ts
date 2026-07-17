import { apiClient } from '@/lib/axios';
import { ApiSuccessResponse, PaginationMeta, Policy } from '@/types';

export interface IssuePolicyPayload {
  customerId: string;
  policyType: string;
  premium: number;
  premiumFrequency: string;
  policyTerm: number;
  nomineeName: string;
  nomineeRelation: string;
  startDate: string;
}

export async function issuePolicyRequest(payload: IssuePolicyPayload): Promise<Policy> {
  const res = await apiClient.post<ApiSuccessResponse<{ policy: Policy }>>('/policies/issue', payload);
  return res.data.data.policy;
}

export async function getPoliciesForCustomerRequest(
  customerId: string,
  params: { page?: number; limit?: number } = {}
): Promise<{ policies: Policy[]; meta: PaginationMeta }> {
  const res = await apiClient.get<ApiSuccessResponse<{ policies: Policy[] }>>(
    `/policies/customer/${customerId}`,
    { params }
  );
  return { policies: res.data.data.policies, meta: res.data.meta as PaginationMeta };
}
