import { Schema, model } from 'mongoose';
import { IPolicy } from '../interfaces/policy.interface';
import { PolicyStatus, PremiumFrequency, PolicyType, VALID_POLICY_TERMS } from '../constants/policy';

const policySchema = new Schema<IPolicy>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    policyNumber: { type: String, required: true, unique: true },
    policyType: { type: String, enum: Object.values(PolicyType), required: true },
    premium: { type: Number, required: true, min: 5000 },
    premiumFrequency: { type: String, enum: Object.values(PremiumFrequency), required: true },
    policyTerm: { type: Number, required: true, enum: VALID_POLICY_TERMS },
    nomineeName: { type: String, required: true, trim: true, maxlength: 120 },
    nomineeRelation: { type: String, required: true, trim: true, maxlength: 60 },
    startDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(PolicyStatus), default: PolicyStatus.ACTIVE }
  },
  { timestamps: true }
);

policySchema.index({ agentId: 1, createdAt: -1 });
policySchema.index({ customerId: 1, createdAt: -1 });

export const Policy = model<IPolicy>('Policy', policySchema);
