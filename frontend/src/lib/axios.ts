import axios from 'axios';
import { API_URL } from './constants';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      const isLoginRequest = error?.config?.url?.includes('/auth/login');
      if (!isLoginRequest && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
