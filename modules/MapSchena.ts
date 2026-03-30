// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// Address interfeysi
interface Address {
  street?: string;
  city?: string;
  zipCode?: string;
}

// IUser interfeysi
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  lastLogin?: Date | null;
  loyaltyPoints: number;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  createVerificationCode(): string;
}

// Schema
const UserSchema = new Schema<IUser>(
  {
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.index({ createdAt: -1 });

// Verification code yaratish
UserSchema.methods.createVerificationCode = function (): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

// Model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
