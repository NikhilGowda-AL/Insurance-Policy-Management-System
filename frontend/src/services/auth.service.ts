import { apiClient } from '@/lib/axios';
import { ApiSuccessResponse, SessionUser } from '@/types';

export async function loginRequest(email: string, password: string, userType: string): Promise<SessionUser> {
  const res = await apiClient.post<ApiSuccessResponse<{ user: SessionUser }>>('/auth/login', {
    email,
    password,
    userType
  });
  return res.data.data.user;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function fetchCurrentUser(): Promise<SessionUser | null> {
  try {
    const res = await apiClient.get<ApiSuccessResponse<{ user: { userId: string; role: string; email: string } }>>(
      '/auth/me'
    );
    const raw = res.data.data.user;
    return { id: raw.userId, email: raw.email, role: raw.role as SessionUser['role'], name: raw.email };
  } catch {
    return null;
  }
}
