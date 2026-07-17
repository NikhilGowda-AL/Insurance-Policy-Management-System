import { Document, Types } from 'mongoose';
import { PolicyStatus, PremiumFrequency, PolicyType } from '../constants/policy';

export interface IPolicy extends Document {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  agentId: Types.ObjectId;
  policyNumber: string;
  policyType: PolicyType;
  premium: number;
  premiumFrequency: PremiumFrequency;
  policyTerm: number;
  nomineeName: string;
  nomineeRelation: string;
  startDate: Date;
  status: PolicyStatus;
  createdAt: Date;
  updatedAt: Date;
}
