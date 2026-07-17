import { customerRepository } from '../repositories/customer.repository';
import { policyRepository } from '../repositories/policy.repository';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/roles';
import { PAN_MANDATORY_PREMIUM_THRESHOLD, PolicyStatus } from '../constants/policy';
import { generatePolicyNumber } from '../helpers/generatePolicyNumber';
import { parsePagination, buildMeta } from '../helpers/pagination';
import { IssuePolicyInput } from '../validators/policy.validator';
import { RequestingUser } from './customer.service';
import { IPolicy } from '../interfaces/policy.interface';

const MAX_POLICY_NUMBER_RETRIES = 5;

export class PolicyService {
  async issuePolicy(agentId: string, input: IssuePolicyInput) {
    const customer = await customerRepository.findById(input.customerId);
    if (!customer) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }

    if (customer.agentId.toString() !== agentId) {
      throw ApiError.forbidden(MESSAGES.CUSTOMER.OWNERSHIP_VIOLATION);
    }

    if (input.premium > PAN_MANDATORY_PREMIUM_THRESHOLD && !customer.pan) {
      throw ApiError.badRequest(MESSAGES.VALIDATION.FAILED, {
        pan: `PAN is mandatory on the customer profile for premiums above ${PAN_MANDATORY_PREMIUM_THRESHOLD}`
      });
    }

    const policyHolderName = `${customer.firstName} ${customer.lastName}`.trim().toLowerCase();
    if (input.nomineeName.trim().toLowerCase() === policyHolderName) {
      throw ApiError.badRequest(MESSAGES.VALIDATION.FAILED, {
        nomineeName: 'Nominee cannot be the same person as the policyholder'
      });
    }

    let policy: IPolicy | null = null;
    let attempts = 0;
    while (!policy && attempts < MAX_POLICY_NUMBER_RETRIES) {
      try {
        policy = await policyRepository.create({
          customerId: customer._id,
          agentId: agentId as unknown as IPolicy['agentId'],
          policyNumber: generatePolicyNumber(),
          policyType: input.policyType,
          premium: input.premium,
          premiumFrequency: input.premiumFrequency,
          policyTerm: input.policyTerm,
          nomineeName: input.nomineeName,
          nomineeRelation: input.nomineeRelation,
          startDate: input.startDate,
          status: PolicyStatus.ACTIVE
        });
      } catch (error) {
        const mongoErr = error as { code?: number };
        if (mongoErr.code === 11000) {
          attempts += 1;
          continue;
        }
        throw error;
      }
    }

    if (!policy) {
      throw ApiError.internal('Could not generate a unique policy number. Please try again.');
    }

    return policy.toObject();
  }

  async getPoliciesForCustomer(
    customerId: string,
    requestingUser: RequestingUser,
    query: Record<string, unknown>
  ) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }

    if (
      requestingUser.role === UserRole.AGENT &&
      customer.agentId.toString() !== requestingUser.userId
    ) {
      throw ApiError.forbidden(MESSAGES.POLICY.OWNERSHIP_VIOLATION);
    }

    const { page, limit } = parsePagination(query);
    const { items, total } = await policyRepository.findByCustomer(customerId, page, limit);

    return {
      policies: items.map((p) => p.toObject()),
      meta: buildMeta(page, limit, total)
    };
  }
}

export const policyService = new PolicyService();
