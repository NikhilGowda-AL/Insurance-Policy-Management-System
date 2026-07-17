import { z } from 'zod';

const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
const aadhaarRegex = /^\d{12}$/;
const mobileRegex = /^[6789]\d{9}$/;
const pinRegex = /^\d{6}$/;

export const createCustomerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters').max(60),
    lastName: z.string().trim().min(1, 'Last name is required').max(60),
    dob: z.coerce.date({ errorMap: () => ({ message: 'Enter a valid date of birth' }) }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { errorMap: () => ({ message: 'Select a gender' }) }),
    mobile: z.string().regex(mobileRegex, 'Mobile must be 10 digits starting with 6, 7, 8 or 9'),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    aadhaar: z.string().regex(aadhaarRegex, 'Aadhaar must be exactly 12 digits'),
    pan: z
      .string()
      .trim()
      .toUpperCase()
      .regex(panRegex, 'PAN must be in format ABCDE1234F')
      .optional()
      .or(z.literal('')),
    address: z.string().trim().min(5, 'Address is required').max(250),
    city: z.string().trim().min(2, 'City is required').max(60),
    state: z.string().trim().min(2, 'State is required').max(60),
    pinCode: z.string().regex(pinRegex, 'PIN code must be exactly 6 digits')
  })
});

export const updateCustomerSchema = createCustomerSchema;

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>['body'];
