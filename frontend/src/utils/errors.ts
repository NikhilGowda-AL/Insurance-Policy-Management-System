import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types';

export interface NormalizedError {
  message: string;
  fieldErrors: Record<string, string>;
}

export function normalizeApiError(error: unknown): NormalizedError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return {
      message: data?.message ?? 'Something went wrong. Please try again.',
      fieldErrors: data?.errors ?? {}
    };
  }
  return { message: 'Something went wrong. Please try again.', fieldErrors: {} };
}
