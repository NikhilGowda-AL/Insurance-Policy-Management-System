import { Document, Types } from 'mongoose';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  agentId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dob: Date;
  age: number;
  gender: Gender;
  mobile: string;
  email: string;
  aadhaar: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  createdAt: Date;
  updatedAt: Date;
}
