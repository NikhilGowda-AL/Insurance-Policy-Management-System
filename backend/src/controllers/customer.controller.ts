import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { customerService } from '../services/customer.service';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/roles';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer((req as any).user.userId, req.body);
  ApiResponse.success(res, 201, MESSAGES.CUSTOMER.CREATED, { customer });
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(
    req.params.id,
    { userId: (req as any).user.userId, role: (req as any).user.role as UserRole },
    req.body
  );
  ApiResponse.success(res, 200, MESSAGES.CUSTOMER.UPDATED, { customer });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id, {
    userId: (req as any).user.userId,
    role: (req as any).user.role as UserRole
  });
  ApiResponse.success(res, 200, 'Customer fetched', { customer });
});

export const searchCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { customers, meta } = await customerService.searchCustomers(
    { userId: (req as any).user.userId, role: (req as any).user.role as UserRole },
    req.query as Record<string, unknown>
  );
  ApiResponse.success(res, 200, 'Customers fetched', { customers }, meta);
});
