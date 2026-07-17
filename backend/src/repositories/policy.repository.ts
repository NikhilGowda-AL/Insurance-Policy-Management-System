import { FilterQuery, Types } from 'mongoose';
import { Policy } from '../models/Policy';
import { IPolicy } from '../interfaces/policy.interface';

export class PolicyRepository {
  async create(data: Partial<IPolicy>): Promise<IPolicy> {
    return Policy.create(data);
  }

  async findByPolicyNumber(policyNumber: string): Promise<IPolicy | null> {
    return Policy.findOne({ policyNumber }).exec();
  }

  async findById(id: string): Promise<IPolicy | null> {
    return Policy.findById(id).exec();
  }

  async findByCustomer(
    customerId: string,
    page: number,
    limit: number
  ): Promise<{ items: IPolicy[]; total: number }> {
    const query: FilterQuery<IPolicy> = { customerId: new Types.ObjectId(customerId) };
    const [items, total] = await Promise.all([
      Policy.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      Policy.countDocuments(query)
    ]);
    return { items, total };
  }

  async countByAgent(agentId: string): Promise<number> {
    return Policy.countDocuments({ agentId: new Types.ObjectId(agentId) });
  }
}

export const policyRepository = new PolicyRepository();
