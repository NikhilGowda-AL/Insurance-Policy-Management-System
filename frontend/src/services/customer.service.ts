import { apiClient } from '@/lib/axios';
import { ApiSuccessResponse, Customer, PaginationMeta } from '@/types';

export interface CustomerFormPayload {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  aadhaar: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export async function createCustomerRequest(payload: CustomerFormPayload): Promise<Customer> {
  const res = await apiClient.post<ApiSuccessResponse<{ customer: Customer }>>('/customers', payload);
  return res.data.data.customer;
}

export async function updateCustomerRequest(id: string, payload: CustomerFormPayload): Promise<Customer> {
  const res = await apiClient.put<ApiSuccessResponse<{ customer: Customer }>>(`/customers/${id}`, payload);
  return res.data.data.customer;
}

export async function getCustomerRequest(id: string): Promise<Customer> {
  const res = await apiClient.get<ApiSuccessResponse<{ customer: Customer }>>(`/customers/${id}`);
  return res.data.data.customer;
}

export async function searchCustomersRequest(params: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ customers: Customer[]; meta: PaginationMeta }> {
  const res = await apiClient.get<ApiSuccessResponse<{ customers: Customer[] }>>('/customers/search', {
    params
  });
  return { customers: res.data.data.customers, meta: res.data.meta as PaginationMeta };
}
