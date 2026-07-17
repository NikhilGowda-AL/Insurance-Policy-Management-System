import { FilterQuery, Types } from 'mongoose';
import { Customer } from '../models/Customer';
import { ICustomer } from '../interfaces/customer.interface';

export interface CustomerSearchFilter {
  agentId?: string;
  search?: string;
  page: number;
  limit: number;
}

export class CustomerRepository {
  async create(data: Partial<ICustomer>): Promise<ICustomer> {
    return Customer.create(data);
  }

  async findById(id: string): Promise<ICustomer | null> {
    return Customer.findById(id).exec();
  }

  async findByPan(pan: string): Promise<ICustomer | null> {
    return Customer.findOne({ pan: pan.toUpperCase() }).exec();
  }

  async findByAadhaar(aadhaar: string): Promise<ICustomer | null> {
    return Customer.findOne({ aadhaar }).exec();
  }

  async updateById(id: string, data: Partial<ICustomer>): Promise<ICustomer | null> {
    return Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  }

  async search(filter: CustomerSearchFilter): Promise<{ items: ICustomer[]; total: number }> {
    const query: FilterQuery<ICustomer> = {};

    if (filter.agentId) {
      query.agentId = new Types.ObjectId(filter.agentId);
    }

    if (filter.search) {
      query.$or = [
        { firstName: { $regex: filter.search, $options: 'i' } },
        { lastName: { $regex: filter.search, $options: 'i' } },
        { mobile: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip((filter.page - 1) * filter.limit)
        .limit(filter.limit)
        .exec(),
      Customer.countDocuments(query)
    ]);

    return { items, total };
  }
}

export const customerRepository = new CustomerRepository();
