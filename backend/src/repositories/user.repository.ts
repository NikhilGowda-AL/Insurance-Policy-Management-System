import { FilterQuery } from 'mongoose';
import { User } from '../models/User';
import { IUser } from '../interfaces/user.interface';
import { UserRole } from '../constants/roles';

export class UserRepository {
  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const query = User.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+password');
    return query.exec();
  }

  async findByEmailAndType(email: string, type: string, withPassword = false): Promise<IUser | null> {
    const query = User.findOne({
      email: email.toLowerCase(),
      role: type.toUpperCase()
    });

    if (withPassword) {
      query.select('+password');
    }

    return query.exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async create(data: Pick<IUser, 'name' | 'email' | 'password' | 'role'>): Promise<IUser> {
    return User.create(data);
  }

  async findAgents(filter: {
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    page: number;
    limit: number;
  }): Promise<{ items: IUser[]; total: number }> {
    const query: FilterQuery<IUser> = { role: UserRole.AGENT };
    
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } }
      ];
    }

    if (filter.status === 'active') {
      query.active = true;
    } else if (filter.status === 'inactive') {
      query.active = false;
    }

    const [items, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((filter.page - 1) * filter.limit)
        .limit(filter.limit)
        .exec(),
      User.countDocuments(query)
    ]);

    return { items, total };
  }

  async countByRoleAndStatus(role: UserRole, active: boolean): Promise<number> {
    return User.countDocuments({ role, active });
  }

  async setActiveStatus(id: string, active: boolean): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, { active }, { new: true }).exec();
  }
}

export const userRepository = new UserRepository();
