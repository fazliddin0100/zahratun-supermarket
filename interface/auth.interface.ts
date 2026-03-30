// interface/auth.interface.ts
export interface AuthType {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  loyaltyPoints?: number;
  isVerified?: boolean;
  phoneVerified?: boolean;
  lastLogin?: Date | string;
  createdAt?: Date | string;
}
