import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { policyService } from '../services/policy.service';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/roles';

export const issuePolicy = asyncHandler(async (req: Request, res: Response) => {
  const policy = await policyService.issuePolicy((req as any).user.userId, req.body);
  ApiResponse.success(res, 201, MESSAGES.POLICY.ISSUED, { policy });
});

export const getPoliciesForCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { policies, meta } = await policyService.getPoliciesForCustomer(
    req.params.customerId,
    { userId: (req as any).user.userId, role: (req as any).user.role as UserRole },
    req.query as Record<string, unknown>
  );
  ApiResponse.success(res, 200, 'Policies fetched', { policies }, meta);
});
