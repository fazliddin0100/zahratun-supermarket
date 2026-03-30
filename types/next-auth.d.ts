// types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';
// types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: string;
    phoneNumber?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phoneNumber?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    phoneNumber?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
      phoneNumber?: string;
      loyaltyPoints?: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
    phoneNumber?: string;
    emailVerified?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    phoneNumber?: string;
    loyaltyPoints?: number;
  }
}

// types/models.ts
// Database model types
import { Types } from 'mongoose';

export interface UserType {
  _id: Types.ObjectId;
  name: string;
  email?: string;
  emailVerified?: Date | null;
  phoneNumber?: string;
  phoneVerified: boolean;
  password?: string;
  provider: 'credentials' | 'google';
  googleId?: string;
  image?: string;
  role: 'customer' | 'cashier' | 'manager' | 'admin';
  isVerified: boolean;
  lastLogin?: Date;
  loyaltyPoints: number;
  purchases: Types.ObjectId[];
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountType {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionType {
  _id: Types.ObjectId;
  sessionToken: string;
  userId: Types.ObjectId;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationTokenType {
  _id: Types.ObjectId;
  identifier: string;
  token: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}
