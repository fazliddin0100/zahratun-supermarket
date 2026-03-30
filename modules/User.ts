import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface Address {
  street?: string;
  city?: string;
  zipCode?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  password: string;
  role: 'customer' | 'cashier' | 'manager' | 'admin';
  isVerified: boolean;
  lastLogin?: Date | null;
  loyaltyPoints: number;
  purchases: mongoose.Types.ObjectId[];
  address?: Address;
  createdAt: Date;
  updatedAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\+998[0-9]{9}$/, 'Telefon +998XXXXXXXXX bo‘lishi kerak'],
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ['customer', 'cashier', 'manager', 'admin'],
      default: 'customer',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    purchases: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

    address: {
      street: String,
      city: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

// Indexlar
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ createdAt: -1 });

// Parolni hash qilish
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Parolni tekshirish
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
