import { apiClient } from '@/lib/axios';
import { Agent, ApiSuccessResponse, PaginationMeta } from '@/types';

export async function createAgentRequest(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<Agent> {
  const res = await apiClient.post<ApiSuccessResponse<{ agent: Agent }>>('/admin/agents', payload);
  return res.data.data.agent;
}

export async function listAgentsRequest(params: {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  limit?: number;
}): Promise<{ agents: Agent[]; meta: PaginationMeta }> {
  const res = await apiClient.get<ApiSuccessResponse<{ agents: Agent[] }>>('/admin/agents', { params });
  return { agents: res.data.data.agents, meta: res.data.meta as PaginationMeta };
}

export async function deactivateAgentRequest(id: string): Promise<Agent> {
  const res = await apiClient.delete<ApiSuccessResponse<{ agent: Agent }>>(`/admin/agents/${id}`);
  return res.data.data.agent;
}

export async function activateAgentRequest(id: string): Promise<Agent> {
  const res = await apiClient.put<ApiSuccessResponse<{ agent: Agent }>>(`/admin/agents/${id}/activate`);
  return res.data.data.agent;
}

export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get<ApiSuccessResponse<DashboardStats>>('/admin/stats');
  return res.data.data;
}
