import { customerRepository } from '../repositories/customer.repository';
import { policyRepository } from '../repositories/policy.repository';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import { UserRole } from '../constants/roles';
import { calculateAge } from '../helpers/calculateAge';
import { MIN_CUSTOMER_AGE, MAX_CUSTOMER_AGE } from '../constants/policy';
import { parsePagination, buildMeta } from '../helpers/pagination';
import { maskAadhaar, maskPan, maskMobile } from '../utils/mask';
import { CreateCustomerInput } from '../validators/customer.validator';
import { ICustomer } from '../interfaces/customer.interface';

export interface RequestingUser {
  userId: string;
  role: UserRole;
}

function maskCustomer(customer: ICustomer, requestingRole: UserRole) {
  const plain = customer.toObject();
  return {
    ...plain,
    id: customer._id.toString(),
    aadhaar: maskAadhaar(customer.aadhaar),
    pan: customer.pan ? maskPan(customer.pan) : undefined,
    mobile: maskMobile(customer.mobile),
    _rawAccessRole: requestingRole
  };
}

export class CustomerService {
  async createCustomer(agentId: string, input: CreateCustomerInput) {
    const age = calculateAge(input.dob);
    if (age < MIN_CUSTOMER_AGE || age > MAX_CUSTOMER_AGE) {
      throw ApiError.badRequest(MESSAGES.VALIDATION.FAILED, {
        dob: `Customer age must be between ${MIN_CUSTOMER_AGE} and ${MAX_CUSTOMER_AGE} years`
      });
    }

    const aadhaarExists = await customerRepository.findByAadhaar(input.aadhaar);
    if (aadhaarExists) {
      throw ApiError.conflict(MESSAGES.CUSTOMER.AADHAAR_EXISTS, { aadhaar: 'Already registered' });
    }

    if (input.pan) {
      const panExists = await customerRepository.findByPan(input.pan);
      if (panExists) {
        throw ApiError.conflict(MESSAGES.CUSTOMER.PAN_EXISTS, { pan: 'Already registered' });
      }
    }

    const customer = await customerRepository.create({
      ...input,
      pan: input.pan ? input.pan.toUpperCase() : undefined,
      age,
      agentId: agentId as unknown as ICustomer['agentId']
    });

    return maskCustomer(customer, UserRole.AGENT);
  }

  async updateCustomer(customerId: string, requestingUser: RequestingUser, input: CreateCustomerInput) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }

    this.assertOwnership(customer, requestingUser);

    const age = calculateAge(input.dob);
    if (age < MIN_CUSTOMER_AGE || age > MAX_CUSTOMER_AGE) {
      throw ApiError.badRequest(MESSAGES.VALIDATION.FAILED, {
        dob: `Customer age must be between ${MIN_CUSTOMER_AGE} and ${MAX_CUSTOMER_AGE} years`
      });
    }

    if (input.aadhaar !== customer.aadhaar) {
      const aadhaarExists = await customerRepository.findByAadhaar(input.aadhaar);
      if (aadhaarExists) {
        throw ApiError.conflict(MESSAGES.CUSTOMER.AADHAAR_EXISTS, { aadhaar: 'Already registered' });
      }
    }

    if (input.pan && input.pan.toUpperCase() !== customer.pan) {
      const panExists = await customerRepository.findByPan(input.pan);
      if (panExists) {
        throw ApiError.conflict(MESSAGES.CUSTOMER.PAN_EXISTS, { pan: 'Already registered' });
      }
    }

    const hasPolicies = (await policyRepository.findByCustomer(customerId, 1, 1)).total > 0;
    const updatePayload: Partial<ICustomer> = {
      ...input,
      pan: input.pan ? input.pan.toUpperCase() : undefined,
      age
    };
    if (hasPolicies) {
      delete (updatePayload as Record<string, unknown>).agentId;
    }

    const updated = await customerRepository.updateById(customerId, updatePayload);
    if (!updated) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }

    return maskCustomer(updated, requestingUser.role);
  }

  async getCustomerById(customerId: string, requestingUser: RequestingUser) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw ApiError.notFound(MESSAGES.CUSTOMER.NOT_FOUND);
    }
    this.assertOwnership(customer, requestingUser);
    const plain = customer.toObject();
    return { ...plain, id: customer._id.toString() };
  }

  async searchCustomers(requestingUser: RequestingUser, query: Record<string, unknown>) {
    const { page, limit } = parsePagination(query);
    const search = typeof query.q === 'string' ? query.q : undefined;

    const { items, total } = await customerRepository.search({
      agentId: requestingUser.role === UserRole.AGENT ? requestingUser.userId : undefined,
      search,
      page,
      limit
    });

    return {
      customers: items.map((c) => maskCustomer(c, requestingUser.role)),
      meta: buildMeta(page, limit, total)
    };
  }

  private assertOwnership(customer: ICustomer, requestingUser: RequestingUser): void {
    if (
      requestingUser.role === UserRole.AGENT &&
      customer.agentId.toString() !== requestingUser.userId
    ) {
      throw ApiError.forbidden(MESSAGES.CUSTOMER.OWNERSHIP_VIOLATION);
    }
  }
}

export const customerService = new CustomerService();
