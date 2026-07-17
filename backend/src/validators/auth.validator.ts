import { z } from 'zod';
import { UserRole } from '../constants/roles';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    userType: z.enum([UserRole.ADMIN, UserRole.AGENT], {
      errorMap: () => ({ message: 'User type must be ADMIN or AGENT' })
    })
  })
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
