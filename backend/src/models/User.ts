import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/user.interface';
import { UserRole } from '../constants/roles';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

userSchema.index({ role: 1, active: 1 });

export const User = model<IUser>('User', userSchema);
