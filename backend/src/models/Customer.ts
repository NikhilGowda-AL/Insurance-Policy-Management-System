import { Schema, model } from 'mongoose';
import { ICustomer } from '../interfaces/customer.interface';

const customerSchema = new Schema<ICustomer>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    firstName: { type: String, required: true, trim: true, maxlength: 60 },
    lastName: { type: String, required: true, trim: true, maxlength: 60 },
    dob: { type: Date, required: true },
    age: { type: Number, required: true, min: 18, max: 65 },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    mobile: {
      type: String,
      required: true,
      match: [/^[6789]\d{9}$/, 'Mobile number must be 10 digits starting with 6, 7, 8 or 9']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, 'Aadhaar must be exactly 12 digits']
    },
    pan: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      uppercase: true,
      match: [/^[A-Z]{5}\d{4}[A-Z]$/, 'Invalid PAN format']
    },
    address: { type: String, required: true, maxlength: 250 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    state: { type: String, required: true, trim: true, maxlength: 60 },
    pinCode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'PIN code must be exactly 6 digits']
    }
  },
  { timestamps: true }
);

customerSchema.index({ firstName: 'text', lastName: 'text', mobile: 'text', email: 'text' });
customerSchema.index({ agentId: 1, createdAt: -1 });

export const Customer = model<ICustomer>('Customer', customerSchema);
