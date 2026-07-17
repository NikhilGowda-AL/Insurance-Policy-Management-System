import { Document, Types } from 'mongoose';
import { UserRole } from '../constants/roles';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}
