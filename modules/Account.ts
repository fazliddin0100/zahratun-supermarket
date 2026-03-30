// models/User.ts
import mongoose, {
  Document,
  Model,
  SaveOptions,
  Schema,
  Types,
} from 'mongoose';

// ==================== INTERFACES ====================

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginHistory {
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  success: boolean;
  note?: string;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface TrustedDevice {
  deviceId: string;
  deviceName?: string;
  deviceType?: string;
  userAgent: string;
  ip: string;
  lastUsed: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface VerificationAttempt {
  timestamp: Date;
  code: string;
  success: boolean;
  ip?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}

// ==================== MAIN USER INTERFACE ====================

export interface IUser extends Document {
  // Basic Information
  _id: Types.ObjectId;
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  profileImage?: string;

  // Authentication
  provider: 'credentials' | 'google' | 'facebook';
  passwordHash?: string;
  refreshToken?: string;
  lastPasswordChange?: Date;

  // Verification & Status
  phoneVerified: boolean;
  emailVerified: boolean;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deactivatedAt?: Date;
  verificationReason?: string;

  // Role & Permissions
  role: 'customer' | 'cashier' | 'manager' | 'admin' | 'super_admin';
  permissions: string[];
  accessLevel: number;

  // Business Data
  loyaltyPoints: number;
  totalSpent: number;
  purchases: Types.ObjectId[];
  favoriteProducts: Types.ObjectId[];
  cartItems: Types.ObjectId[];

  // Contact Information
  address?: Address;
  secondaryPhone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Verification System
  verificationCode?: string;
  verificationCodeExpires?: Date;
  verificationAttempts: number;
  verificationCodeSentAt?: Date;
  verificationHistory: VerificationAttempt[];
  maxVerificationAttempts: number;

  // Security System
  loginAttempts: number;
  maxLoginAttempts: number;
  lockUntil?: Date;
  lastFailedLogin?: Date;
  loginHistory: LoginHistory[];
  passwordHistory: string[];

  // Two-Factor Authentication
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'sms' | 'email' | 'authenticator';
  twoFactorSecret?: string;
  backupCodes?: string[];

  // Trusted Devices
  trustedDevices: TrustedDevice[];
  maxTrustedDevices: number;

  // Session Management
  currentSessions: Array<{
    sessionId: string;
    deviceId: string;
    ip: string;
    userAgent: string;
    createdAt: Date;
    lastActivity: Date;
  }>;

  // Preferences
  preferences: UserPreferences;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActivity?: Date;

  // Analytics
  totalLogins: number;
  totalPurchases: number;
  averageOrderValue: number;

  // ==================== INSTANCE METHODS ====================

  // Account Methods
  isAccountLocked(): boolean;
  isAccountActive(): boolean;
  getAccountStatus(): 'active' | 'locked' | 'inactive' | 'suspended';

  // Security Methods
  incrementLoginAttempts(options?: SaveOptions): Promise<void>;
  resetLoginAttempts(options?: SaveOptions): Promise<void>;
  validatePassword(password: string): Promise<boolean>;
  changePassword(newPassword: string, options?: SaveOptions): Promise<void>;
  addPasswordToHistory(passwordHash: string): void;

  // Login History Methods
  addLoginHistory(
    entry: Omit<LoginHistory, 'timestamp'>,
    options?: SaveOptions
  ): Promise<void>;
  getRecentLogins(limit?: number): LoginHistory[];
  clearOldLoginHistory(keepLast?: number): void;

  // Device Management
  addTrustedDevice(
    deviceInfo: Omit<TrustedDevice, 'lastUsed' | 'createdAt' | 'isActive'>,
    options?: SaveOptions
  ): Promise<void>;
  removeTrustedDevice(deviceId: string, options?: SaveOptions): Promise<void>;
  isTrustedDevice(deviceId: string): boolean;
  updateDeviceLastUsed(deviceId: string): void;
  getActiveDevices(): TrustedDevice[];

  // Verification Methods
  createVerificationCode(length?: number, expiresInMinutes?: number): string;
  verifyCode(code: string, ip?: string): boolean;
  isVerificationCodeExpired(): boolean;
  resetVerificationCode(): void;
  incrementVerificationAttempts(
    code: string,
    success: boolean,
    ip?: string
  ): void;
  canRequestNewCode(): boolean;

  // Two-Factor Methods
  enableTwoFactor(
    method: 'sms' | 'email' | 'authenticator',
    secret?: string
  ): void;
  disableTwoFactor(): void;
  generateBackupCodes(count?: number): string[];
  verifyBackupCode(code: string): boolean;

  // Profile Methods
  getProfileInfo(): UserProfile;
  updateProfile(
    data: Partial<UserProfile>,
    options?: SaveOptions
  ): Promise<this>;
  getPublicProfile(): PublicUserProfile;

  // Session Management
  addSession(sessionData: {
    sessionId: string;
    deviceId: string;
    ip: string;
    userAgent: string;
  }): void;
  removeSession(sessionId: string): void;
  validateSession(sessionId: string): boolean;
  cleanupExpiredSessions(maxAgeMinutes?: number): void;

  // Business Methods
  addLoyaltyPoints(
    points: number,
    reason: string,
    options?: SaveOptions
  ): Promise<void>;
  deductLoyaltyPoints(
    points: number,
    reason: string,
    options?: SaveOptions
  ): Promise<void>;
  calculateLoyaltyTier(): 'bronze' | 'silver' | 'gold' | 'platinum';
  getLoyaltyBenefits(): string[];

  // Utility Methods
  toJSON(): any;
  toObject(): any;
  markPhoneVerified(options?: SaveOptions): Promise<this>;
  markEmailVerified(options?: SaveOptions): Promise<this>;
  deactivateAccount(reason: string, options?: SaveOptions): Promise<this>;
  reactivateAccount(options?: SaveOptions): Promise<this>;
}

// ==================== TYPE ALIASES ====================

export type UserProfile = {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  profileImage?: string;
  role: string;
  loyaltyPoints: number;
  totalSpent: number;
  isVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  preferences: UserPreferences;
  address?: Address;
};

export type PublicUserProfile = {
  id: string;
  name: string;
  profileImage?: string;
  role: string;
  loyaltyPoints: number;
  createdAt: Date;
};

export type UserDocument = Document<unknown, any, IUser> & IUser;

// ==================== USER MODEL INTERFACE ====================

export interface UserModel extends Model<IUser> {
  // CRUD Operations
  findByPhone(phoneNumber: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByIdWithSecurity(id: string | Types.ObjectId): Promise<IUser | null>;
  findBySessionId(sessionId: string): Promise<IUser | null>;

  // Security Queries
  findByPhoneWithCode(phoneNumber: string): Promise<IUser | null>;
  findByPhoneWithSecurity(phoneNumber: string): Promise<IUser | null>;
  findLockedAccounts(): Promise<IUser[]>;
  findInactiveAccounts(days?: number): Promise<IUser[]>;
  findAccountsNeedingVerification(): Promise<IUser[]>;

  // Bulk Operations
  bulkUpdateLoyaltyPoints(
    userIds: (string | Types.ObjectId)[],
    points: number,
    reason: string
  ): Promise<{ matched: number; modified: number }>;

  // Analytics Queries
  getTopCustomers(limit?: number): Promise<IUser[]>;
  getLoyaltyStatistics(): Promise<{
    totalCustomers: number;
    averagePoints: number;
    distribution: Record<string, number>;
  }>;

  // Authentication Methods
  loginWithPhone(phoneNumber: string, password?: string): Promise<IUser>;
  loginWithEmail(email: string, password?: string): Promise<IUser>;
  verifyAndLogin(phoneNumber: string, code: string): Promise<IUser>;

  // Utility Methods
  generateUniqueUsername(name: string): Promise<string>;
  validatePhoneNumber(phoneNumber: string): boolean;
  normalizePhoneNumber(phoneNumber: string): string;

  // Admin Methods
  suspendUser(userId: string | Types.ObjectId, reason: string): Promise<IUser>;
  unsuspendUser(userId: string | Types.ObjectId): Promise<IUser>;
  deleteInactiveAccounts(days?: number): Promise<{ deleted: number }>;

  // Search Methods
  searchUsers(query: string, filters?: UserSearchFilters): Promise<IUser[]>;
  findByRole(
    role: string,
    page?: number,
    limit?: number
  ): Promise<{
    users: IUser[];
    total: number;
    page: number;
    pages: number;
  }>;
}

// ==================== SUPPORTING TYPES ====================

export interface UserSearchFilters {
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  minLoyaltyPoints?: number;
  maxLoyaltyPoints?: number;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  lastLoginFrom?: Date;
  lastLoginTo?: Date;
}

// ==================== SCHEMA DEFINITION ====================

const AddressSchema = new Schema<Address>({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true, default: 'Uzbekistan' },
});

const LoginHistorySchema = new Schema<LoginHistory>({
  timestamp: { type: Date, default: Date.now, required: true },
  ip: { type: String },
  userAgent: { type: String },
  success: { type: Boolean, required: true },
  note: { type: String },
  location: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number,
  },
});

const TrustedDeviceSchema = new Schema<TrustedDevice>({
  deviceId: { type: String, required: true },
  deviceName: { type: String },
  deviceType: { type: String },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  lastUsed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const VerificationAttemptSchema = new Schema<VerificationAttempt>({
  timestamp: { type: Date, default: Date.now },
  code: { type: String, required: true },
  success: { type: Boolean, required: true },
  ip: { type: String },
});

const UserPreferencesSchema = new Schema<UserPreferences>({
  language: { type: String, default: 'uz' },
  currency: { type: String, default: 'UZS' },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
  },
  theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
});

const SessionSchema = new Schema({
  sessionId: { type: String, required: true },
  deviceId: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser, UserModel>(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Ism kiritish majburiy'],
      trim: true,
      minlength: [2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"],
      maxlength: [100, 'Ism 100 ta belgidan oshmasligi kerak'],
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Noto'g'ri email formati",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, 'Telefon raqam kiritish majburiy'],
      unique: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v: string) {
          return /^\+998[0-9]{9}$/.test(v);
        },
        message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak",
      },
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return !v || v < new Date();
        },
        message: "Tug'ilgan sana kelajakda bo'lishi mumkin emas",
      },
    },
    profileImage: {
      type: String,
      default: 'default-avatar.png',
    },

    // Authentication
    provider: {
      type: String,
      enum: ['credentials', 'google', 'facebook'],
      default: 'credentials',
    },
    passwordHash: {
      type: String,
      select: false,
      minlength: [6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"],
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },

    // Verification & Status
    phoneVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deactivatedAt: {
      type: Date,
    },
    verificationReason: {
      type: String,
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ['customer', 'cashier', 'manager', 'admin', 'super_admin'],
      default: 'customer',
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    accessLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    // Business Data
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, "Loyalty ballar manfiy bo'lishi mumkin emas"],
      index: true,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    purchases: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    favoriteProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CartItem',
      },
    ],

    // Contact Information
    address: AddressSchema,
    secondaryPhone: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^\+998[0-9]{9}$/.test(v);
        },
        message: "Yordamchi telefon raqam noto'g'ri formatda",
      },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },

    // Verification System
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeExpires: {
      type: Date,
      select: false,
    },
    verificationAttempts: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
    verificationCodeSentAt: {
      type: Date,
      select: false,
    },
    verificationHistory: {
      type: [VerificationAttemptSchema],
      select: false,
      default: [],
    },
    maxVerificationAttempts: {
      type: Number,
      default: 5,
    },

    // Security System
    loginAttempts: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
    },
    lockUntil: {
      type: Date,
      select: false,
    },
    lastFailedLogin: {
      type: Date,
      select: false,
    },
    loginHistory: {
      type: [LoginHistorySchema],
      select: false,
      default: [],
    },
    passwordHistory: {
      type: [String],
      select: false,
      default: [],
    },

    // Two-Factor Authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorMethod: {
      type: String,
      enum: ['sms', 'email', 'authenticator'],
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    backupCodes: {
      type: [String],
      select: false,
    },

    // Trusted Devices
    trustedDevices: {
      type: [TrustedDeviceSchema],
      select: false,
      default: [],
    },
    maxTrustedDevices: {
      type: Number,
      default: 5,
    },

    // Session Management
    currentSessions: {
      type: [SessionSchema],
      select: false,
      default: [],
    },

    // Preferences
    preferences: {
      type: UserPreferencesSchema,
      default: () => ({}),
    },

    // Analytics
    totalLogins: {
      type: Number,
      default: 0,
    },
    totalPurchases: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();

        // Remove sensitive data
        const sensitiveFields = [
          'passwordHash',
          'refreshToken',
          'verificationCode',
          'verificationCodeExpires',
          'verificationCodeSentAt',
          'twoFactorSecret',
          'backupCodes',
          'passwordHistory',
          'loginAttempts',
          'lockUntil',
          'lastFailedLogin',
          'currentSessions',
        ];

        sensitiveFields.forEach((field) => {
          if (ret[field] !== undefined) {
            delete ret[field];
          }
        });

        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// ==================== INDEXES ====================

UserSchema.index({ phoneNumber: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { sparse: true });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ updatedAt: -1 });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ loyaltyPoints: -1 });
UserSchema.index({ phoneVerified: 1, emailVerified: 1 });
UserSchema.index({ lockUntil: 1 });
UserSchema.index({ isActive: 1, isDeleted: 1 });
UserSchema.index({ 'trustedDevices.deviceId': 1 });
UserSchema.index({ lastLogin: -1 });
UserSchema.index({ name: 'text', email: 'text', phoneNumber: 'text' });
UserSchema.index({ 'currentSessions.sessionId': 1 });

// ==================== VIRTUAL FIELDS ====================

UserSchema.virtual('fullName').get(function (this: IUser) {
  return this.name.trim();
});

UserSchema.virtual('age').get(function (this: IUser) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

UserSchema.virtual('accountStatus').get(function (this: IUser) {
  if (this.isDeleted) return 'deleted';
  if (!this.isActive) return 'inactive';
  if (this.isAccountLocked()) return 'locked';
  if (!this.phoneVerified) return 'unverified';
  if (this.loginAttempts > 0) return 'warning';
  return 'active';
});

UserSchema.virtual('lockRemainingMinutes').get(function (this: IUser) {
  if (!this.lockUntil) return 0;
  const remaining = this.lockUntil.getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / (1000 * 60)));
});

UserSchema.virtual('loyaltyTier').get(function (this: IUser) {
  if (this.loyaltyPoints >= 10000) return 'platinum';
  if (this.loyaltyPoints >= 5000) return 'gold';
  if (this.loyaltyPoints >= 1000) return 'silver';
  return 'bronze';
});

UserSchema.virtual('hasTwoFactor').get(function (this: IUser) {
  return this.twoFactorEnabled && this.twoFactorMethod;
});

UserSchema.virtual('formattedAddress').get(function (this: IUser) {
  if (!this.address) return '';
  const { street, city, state, zipCode, country } = this.address;
  const parts = [];
  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zipCode) parts.push(zipCode);
  if (country) parts.push(country);
  return parts.join(', ');
});

// ==================== INSTANCE METHODS ====================

// Account Methods
UserSchema.methods.isAccountLocked = function (): boolean {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
};

UserSchema.methods.isAccountActive = function (): boolean {
  return this.isActive && !this.isDeleted && !this.isAccountLocked();
};

UserSchema.methods.getAccountStatus = function ():
  | 'active'
  | 'locked'
  | 'inactive'
  | 'suspended' {
  if (this.isDeleted) return 'inactive';
  if (!this.isActive) return 'inactive';
  if (this.isAccountLocked()) return 'locked';
  if (this.lockUntil) return 'suspended';
  return 'active';
};

// Security Methods
UserSchema.methods.incrementLoginAttempts = async function (
  options?: SaveOptions
): Promise<void> {
  this.loginAttempts += 1;
  this.lastFailedLogin = new Date();

  if (this.loginAttempts >= this.maxLoginAttempts) {
    // Lock account for 30 minutes
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  await this.save(options);
};

UserSchema.methods.resetLoginAttempts = async function (
  options?: SaveOptions
): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save(options);
};

UserSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  // This should be implemented with your password hashing logic
  // For example, using bcrypt:
  // return await bcrypt.compare(password, this.passwordHash);
  return true; // Placeholder
};

UserSchema.methods.changePassword = async function (
  newPassword: string,
  options?: SaveOptions
): Promise<void> {
  // Hash the new password
  // const salt = await bcrypt.genSalt(10);
  // this.passwordHash = await bcrypt.hash(newPassword, salt);

  this.addPasswordToHistory(this.passwordHash!);
  this.lastPasswordChange = new Date();
  this.refreshToken = undefined; // Invalidate all refresh tokens

  await this.save(options);
};

UserSchema.methods.addPasswordToHistory = function (
  passwordHash: string
): void {
  this.passwordHistory.push(passwordHash);

  // Keep only last 5 passwords
  if (this.passwordHistory.length > 5) {
    this.passwordHistory.shift();
  }
};

// Login History Methods
UserSchema.methods.addLoginHistory = async function (
  entry: Omit<LoginHistory, 'timestamp'>,
  options?: SaveOptions
): Promise<void> {
  this.loginHistory.push({
    timestamp: new Date(),
    ...entry,
  });

  this.totalLogins += 1;

  // Keep only last 50 login attempts
  if (this.loginHistory.length > 50) {
    this.loginHistory.shift();
  }

  if (entry.success) {
    this.lastLogin = new Date();
    this.loginAttempts = 0;
    this.lockUntil = null;
  }

  await this.save(options);
};

UserSchema.methods.getRecentLogins = function (
  limit: number = 10
): LoginHistory[] {
  return this.loginHistory
    .slice()
    .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

UserSchema.methods.clearOldLoginHistory = function (
  keepLast: number = 20
): void {
  if (this.loginHistory.length > keepLast) {
    this.loginHistory = this.loginHistory
      .slice()
      .sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, keepLast);
  }
};

// Device Management
UserSchema.methods.addTrustedDevice = async function (
  deviceInfo: Omit<TrustedDevice, 'lastUsed' | 'createdAt' | 'isActive'>,
  options?: SaveOptions
): Promise<void> {
  const existingDevice = this.trustedDevices.find(
    (device: any) => device.deviceId === deviceInfo.deviceId
  );

  if (existingDevice) {
    existingDevice.lastUsed = new Date();
    existingDevice.isActive = true;
  } else {
    // Remove oldest device if limit reached
    if (this.trustedDevices.length >= this.maxTrustedDevices) {
      const oldestDevice = this.trustedDevices.reduce(
        (oldest: any, current: any) =>
          current.lastUsed < oldest.lastUsed ? current : oldest
      );
      this.trustedDevices = this.trustedDevices.filter(
        (device: any) => device.deviceId !== oldestDevice.deviceId
      );
    }

    this.trustedDevices.push({
      ...deviceInfo,
      lastUsed: new Date(),
      createdAt: new Date(),
      isActive: true,
    });
  }

  await this.save(options);
};

UserSchema.methods.removeTrustedDevice = async function (
  deviceId: string,
  options?: SaveOptions
): Promise<void> {
  this.trustedDevices = this.trustedDevices.filter(
    (device: any) => device.deviceId !== deviceId
  );
  await this.save(options);
};

UserSchema.methods.isTrustedDevice = function (deviceId: string): boolean {
  const device = this.trustedDevices.find((d: any) => d.deviceId === deviceId);
  return !!device && device.isActive;
};

UserSchema.methods.updateDeviceLastUsed = function (deviceId: string): void {
  const device = this.trustedDevices.find((d: any) => d.deviceId === deviceId);
  if (device) {
    device.lastUsed = new Date();
  }
};

UserSchema.methods.getActiveDevices = function (): TrustedDevice[] {
  return this.trustedDevices.filter((device: any) => device.isActive);
};

// Verification Methods
UserSchema.methods.createVerificationCode = function (
  length: number = 6,
  expiresInMinutes: number = 10
): string {
  const code = Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
  ).toString();

  this.verificationCode = code;
  this.verificationCodeExpires = new Date(
    Date.now() + expiresInMinutes * 60 * 1000
  );
  this.verificationCodeSentAt = new Date();
  this.verificationAttempts = 0;

  return code;
};

UserSchema.methods.verifyCode = function (code: string, ip?: string): boolean {
  if (!this.verificationCode || !this.verificationCodeExpires) {
    this.incrementVerificationAttempts(code, false, ip);
    return false;
  }

  const isCodeValid = this.verificationCode === code;
  const isCodeExpired = new Date() > this.verificationCodeExpires;

  this.incrementVerificationAttempts(code, isCodeValid && !isCodeExpired, ip);

  if (isCodeValid && !isCodeExpired) {
    this.phoneVerified = true;
    this.isVerified = true;
    this.resetVerificationCode();
    return true;
  }

  return false;
};

UserSchema.methods.isVerificationCodeExpired = function (): boolean {
  if (!this.verificationCodeExpires) return true;
  return new Date() > this.verificationCodeExpires;
};

UserSchema.methods.resetVerificationCode = function (): void {
  this.verificationCode = undefined;
  this.verificationCodeExpires = undefined;
  this.verificationAttempts = 0;
  this.verificationCodeSentAt = undefined;
};

UserSchema.methods.incrementVerificationAttempts = function (
  code: string,
  success: boolean,
  ip?: string
): void {
  this.verificationHistory.push({
    timestamp: new Date(),
    code,
    success,
    ip,
  });

  if (!success) {
    this.verificationAttempts += 1;
  }

  // Keep only last 20 verification attempts
  if (this.verificationHistory.length > 20) {
    this.verificationHistory.shift();
  }
};

UserSchema.methods.canRequestNewCode = function (): boolean {
  if (!this.verificationCodeSentAt) return true;

  const timeSinceLastCode = Date.now() - this.verificationCodeSentAt.getTime();
  const minWaitTime = 60 * 1000; // 1 minute

  return timeSinceLastCode > minWaitTime;
};

// Two-Factor Methods
UserSchema.methods.enableTwoFactor = function (
  method: 'sms' | 'email' | 'authenticator',
  secret?: string
): void {
  this.twoFactorEnabled = true;
  this.twoFactorMethod = method;

  if (secret) {
    this.twoFactorSecret = secret;
  }

  if (method === 'authenticator') {
    this.backupCodes = this.generateBackupCodes();
  }
};

UserSchema.methods.disableTwoFactor = function (): void {
  this.twoFactorEnabled = false;
  this.twoFactorMethod = undefined;
  this.twoFactorSecret = undefined;
  this.backupCodes = undefined;
};

UserSchema.methods.generateBackupCodes = function (
  count: number = 10
): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(
      Math.random().toString(36).substring(2, 10).toUpperCase() +
        Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }
  return codes;
};

UserSchema.methods.verifyBackupCode = function (code: string): boolean {
  if (!this.backupCodes) return false;

  const index = this.backupCodes.indexOf(code);
  if (index !== -1) {
    this.backupCodes.splice(index, 1);
    return true;
  }

  return false;
};

// Profile Methods
UserSchema.methods.getProfileInfo = function (): UserProfile {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phoneNumber: this.phoneNumber,
    dateOfBirth: this.dateOfBirth,
    profileImage: this.profileImage,
    role: this.role,
    loyaltyPoints: this.loyaltyPoints,
    totalSpent: this.totalSpent,
    isVerified: this.isVerified,
    phoneVerified: this.phoneVerified,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
    preferences: this.preferences,
    address: this.address,
  };
};

UserSchema.methods.updateProfile = async function (
  data: Partial<UserProfile>,
  options?: SaveOptions
): Promise<any> {
  Object.assign(this, data);
  return await this.save(options);
};

UserSchema.methods.getPublicProfile = function (): PublicUserProfile {
  return {
    id: this._id.toString(),
    name: this.name,
    profileImage: this.profileImage,
    role: this.role,
    loyaltyPoints: this.loyaltyPoints,
    createdAt: this.createdAt,
  };
};

// Session Management
UserSchema.methods.addSession = function (sessionData: {
  sessionId: string;
  deviceId: string;
  ip: string;
  userAgent: string;
}): void {
  // Remove existing session with same deviceId
  this.currentSessions = this.currentSessions.filter(
    (session: any) => session.deviceId !== sessionData.deviceId
  );

  this.currentSessions.push({
    ...sessionData,
    createdAt: new Date(),
    lastActivity: new Date(),
  });

  // Keep only last 5 sessions per device
  const deviceSessions = this.currentSessions.filter(
    (session: any) => session.deviceId === sessionData.deviceId
  );

  if (deviceSessions.length > 5) {
    const oldestSession = deviceSessions.reduce((oldest: any, current: any) =>
      current.createdAt < oldest.createdAt ? current : oldest
    );
    this.currentSessions = this.currentSessions.filter(
      (session: any) => session.sessionId !== oldestSession.sessionId
    );
  }
};

UserSchema.methods.removeSession = function (sessionId: string): void {
  this.currentSessions = this.currentSessions.filter(
    (session: any) => session.sessionId !== sessionId
  );
};

UserSchema.methods.validateSession = function (sessionId: string): boolean {
  const session = this.currentSessions.find(
    (s: any) => s.sessionId === sessionId
  );
  if (!session) return false;

  // Check if session is expired (7 days)
  const sessionAge = Date.now() - session.lastActivity.getTime();
  const maxSessionAge = 7 * 24 * 60 * 60 * 1000;

  if (sessionAge > maxSessionAge) {
    this.removeSession(sessionId);
    return false;
  }

  // Update last activity
  session.lastActivity = new Date();
  return true;
};

UserSchema.methods.cleanupExpiredSessions = function (
  maxAgeMinutes: number = 30
): void {
  const cutoffTime = Date.now() - maxAgeMinutes * 60 * 1000;

  this.currentSessions = this.currentSessions.filter((session: any) => {
    if (session.lastActivity.getTime() < cutoffTime) {
      return false;
    }
    return true;
  });
};

// Business Methods
UserSchema.methods.addLoyaltyPoints = async function (
  points: number,
  reason: string,
  options?: SaveOptions
): Promise<void> {
  if (points <= 0) {
    throw new Error("Loyalty ballari musbat bo'lishi kerak");
  }

  this.loyaltyPoints += points;
  await this.save(options);
};

UserSchema.methods.deductLoyaltyPoints = async function (
  points: number,
  reason: string,
  options?: SaveOptions
): Promise<void> {
  if (points <= 0) {
    throw new Error("Loyalty ballari musbat bo'lishi kerak");
  }

  if (this.loyaltyPoints < points) {
    throw new Error('Yetarli loyalty ballari mavjud emas');
  }

  this.loyaltyPoints -= points;
  await this.save(options);
};

UserSchema.methods.calculateLoyaltyTier = function ():
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum' {
  if (this.loyaltyPoints >= 10000) return 'platinum';
  if (this.loyaltyPoints >= 5000) return 'gold';
  if (this.loyaltyPoints >= 1000) return 'silver';
  return 'bronze';
};

UserSchema.methods.getLoyaltyBenefits = function (): string[] {
  const tier = this.calculateLoyaltyTier();
  const benefits: Record<string, string[]> = {
    bronze: ['10% chegirma', 'Bepik yetkazib berish'],
    silver: ['15% chegirma', 'Bepik yetkazib berish', 'Maxsus takliflar'],
    gold: [
      '20% chegirma',
      'Bepik yetkazib berish',
      'Maxsus takliflar',
      "VIP qo'llab-quvvatlash",
    ],
    platinum: [
      '30% chegirma',
      'Bepik yetkazib berish',
      'Maxsus takliflar',
      "VIP qo'llab-quvvatlash",
      'Shaxsiy menejer',
    ],
  };

  return benefits[tier] || [];
};

// Utility Methods
UserSchema.methods.markPhoneVerified = async function (
  options?: SaveOptions
): Promise<any> {
  this.phoneVerified = true;
  this.isVerified = true;
  this.resetVerificationCode();
  return await this.save(options);
};

UserSchema.methods.markEmailVerified = async function (
  options?: SaveOptions
): Promise<any> {
  this.emailVerified = true;
  this.isVerified = true;
  return await this.save(options);
};

UserSchema.methods.deactivateAccount = async function (
  reason: string,
  options?: SaveOptions
): Promise<any> {
  this.isActive = false;
  this.deactivatedAt = new Date();
  this.verificationReason = reason;

  // Clear all sessions
  this.currentSessions = [];
  this.refreshToken = undefined;

  return await this.save(options);
};

UserSchema.methods.reactivateAccount = async function (
  options?: SaveOptions
): Promise<any> {
  this.isActive = true;
  this.deactivatedAt = undefined;
  this.verificationReason = undefined;
  return await this.save(options);
};

// ==================== STATIC METHODS ====================

// CRUD Operations
UserSchema.statics.findByPhone = function (phoneNumber: string) {
  return this.findOne({ phoneNumber, isDeleted: false });
};

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email, isDeleted: false });
};

UserSchema.statics.findByIdWithSecurity = function (
  id: string | Types.ObjectId
) {
  return this.findOne({
    _id: id,
    isDeleted: false,
  }).select(
    '+loginAttempts +lockUntil +verificationCode +verificationCodeExpires'
  );
};

UserSchema.statics.findBySessionId = function (sessionId: string) {
  return this.findOne({
    'currentSessions.sessionId': sessionId,
    isActive: true,
    isDeleted: false,
  });
};

// Security Queries
UserSchema.statics.findByPhoneWithCode = function (phoneNumber: string) {
  return this.findOne({ phoneNumber, isDeleted: false }).select(
    '+verificationCode +verificationCodeExpires +verificationAttempts +verificationCodeSentAt'
  );
};

UserSchema.statics.findByPhoneWithSecurity = function (phoneNumber: string) {
  return this.findOne({ phoneNumber, isDeleted: false }).select(
    '+verificationCode +verificationCodeExpires +verificationAttempts ' +
      '+loginAttempts +lockUntil +lastFailedLogin +passwordHash'
  );
};

UserSchema.statics.findLockedAccounts = function () {
  return this.find({
    lockUntil: { $gt: new Date() },
    isActive: true,
    isDeleted: false,
  });
};

UserSchema.statics.findInactiveAccounts = function (days: number = 90) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return this.find({
    lastLogin: { $lt: cutoffDate },
    isActive: true,
    isDeleted: false,
    role: 'customer',
  });
};

UserSchema.statics.findAccountsNeedingVerification = function () {
  return this.find({
    phoneVerified: false,
    isActive: true,
    isDeleted: false,
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
};

// Bulk Operations
UserSchema.statics.bulkUpdateLoyaltyPoints = async function (
  userIds: (string | Types.ObjectId)[],
  points: number,
  reason: string
) {
  const result = await this.updateMany(
    {
      _id: { $in: userIds },
      isActive: true,
      isDeleted: false,
    },
    {
      $inc: { loyaltyPoints: points },
      $set: { updatedAt: new Date() },
    }
  );

  return {
    matched: result.matchedCount,
    modified: result.modifiedCount,
  };
};

// Analytics Queries
UserSchema.statics.getTopCustomers = async function (limit: number = 10) {
  return this.find({
    isActive: true,
    isDeleted: false,
    role: 'customer',
  })
    .sort({ loyaltyPoints: -1, totalSpent: -1 })
    .limit(limit)
    .select('name phoneNumber loyaltyPoints totalSpent lastLogin');
};

UserSchema.statics.getLoyaltyStatistics = async function () {
  const stats = await this.aggregate([
    {
      $match: {
        isActive: true,
        isDeleted: false,
        role: 'customer',
      },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        averagePoints: { $avg: '$loyaltyPoints' },
        totalPoints: { $sum: '$loyaltyPoints' },
        minPoints: { $min: '$loyaltyPoints' },
        maxPoints: { $max: '$loyaltyPoints' },
      },
    },
    {
      $project: {
        _id: 0,
        totalCustomers: 1,
        averagePoints: { $round: ['$averagePoints', 2] },
        totalPoints: 1,
        minPoints: 1,
        maxPoints: 1,
      },
    },
  ]);

  const distribution = await this.aggregate([
    {
      $match: {
        isActive: true,
        isDeleted: false,
        role: 'customer',
      },
    },
    {
      $bucket: {
        groupBy: '$loyaltyPoints',
        boundaries: [0, 100, 500, 1000, 5000, 10000, Infinity],
        default: 'other',
        output: {
          count: { $sum: 1 },
        },
      },
    },
  ]);

  return {
    ...(stats[0] || {
      totalCustomers: 0,
      averagePoints: 0,
      totalPoints: 0,
      minPoints: 0,
      maxPoints: 0,
    }),
    distribution: distribution.reduce(
      (acc, bucket) => {
        const range = `${bucket._id}`;
        acc[range] = bucket.count;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
};

// Authentication Methods
UserSchema.statics.loginWithPhone = async function (
  phoneNumber: string,
  password?: string
) {
  const user = await this.findByPhoneWithSecurity(phoneNumber);

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi');
  }

  if (user.isAccountLocked()) {
    throw new Error(
      "Hisob vaqtincha bloklangan. Iltimos, keyinroq urinib ko'ring"
    );
  }

  if (!user.isActive) {
    throw new Error('Hisob faol emas');
  }

  if (user.isDeleted) {
    throw new Error("Hisob o'chirilgan");
  }

  if (password && user.passwordHash) {
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      throw new Error("Noto'g'ri parol");
    }
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Update last login
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  await user.save();

  return user;
};

UserSchema.statics.loginWithEmail = async function (
  email: string,
  password?: string
) {
  const user = await this.findOne({ email, isDeleted: false }).select(
    '+passwordHash +loginAttempts +lockUntil'
  );

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi');
  }

  if (user.isAccountLocked()) {
    throw new Error('Hisob vaqtincha bloklangan');
  }

  if (!user.isActive) {
    throw new Error('Hisob faol emas');
  }

  if (password && user.passwordHash) {
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      throw new Error("Noto'g'ri parol");
    }
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  await user.save();

  return user;
};

UserSchema.statics.verifyAndLogin = async function (
  phoneNumber: string,
  code: string
) {
  const user = await this.findByPhoneWithCode(phoneNumber);

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi');
  }

  if (user.isAccountLocked()) {
    throw new Error('Hisob vaqtincha bloklangan');
  }

  if (!user.isActive) {
    throw new Error('Hisob faol emas');
  }

  const isValid = user.verifyCode(code);
  if (!isValid) {
    throw new Error("Noto'g'ri yoki muddati o'tgan kod");
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  await user.save();

  return user;
};

// Utility Methods
UserSchema.statics.generateUniqueUsername = async function (name: string) {
  const baseUsername = name
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');

  let username = baseUsername;
  let counter = 1;

  while (await this.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

UserSchema.statics.validatePhoneNumber = function (
  phoneNumber: string
): boolean {
  const regex = /^\+998[0-9]{9}$/;
  return regex.test(phoneNumber);
};

UserSchema.statics.normalizePhoneNumber = function (
  phoneNumber: string
): string {
  // Remove all non-digit characters
  let normalized = phoneNumber.replace(/\D/g, '');

  // If it starts with 0, replace with +998
  if (normalized.startsWith('0')) {
    normalized = '+998' + normalized.substring(1);
  }

  // If it starts with 998, add +
  if (normalized.startsWith('998') && normalized.length === 12) {
    normalized = '+' + normalized;
  }

  // Ensure it's exactly 13 characters (+998XXXXXXXXX)
  if (normalized.length === 12 && !normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }

  return normalized;
};

// Admin Methods
UserSchema.statics.suspendUser = async function (
  userId: string | Types.ObjectId,
  reason: string
) {
  const user = await this.findById(userId);

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi');
  }

  user.isActive = false;
  user.deactivatedAt = new Date();
  user.verificationReason = reason;

  // Clear all sessions
  user.currentSessions = [];
  user.refreshToken = undefined;

  return await user.save();
};

UserSchema.statics.unsuspendUser = async function (
  userId: string | Types.ObjectId
) {
  const user = await this.findById(userId);

  if (!user) {
    throw new Error('Foydalanuvchi topilmadi');
  }

  user.isActive = true;
  user.deactivatedAt = undefined;
  user.verificationReason = undefined;

  return await user.save();
};

UserSchema.statics.deleteInactiveAccounts = async function (
  days: number = 365
) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const result = await this.updateMany(
    {
      lastLogin: { $lt: cutoffDate },
      isActive: false,
      isDeleted: false,
      role: 'customer',
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    }
  );

  return { deleted: result.modifiedCount };
};

// Search Methods
UserSchema.statics.searchUsers = async function (
  query: string,
  filters?: UserSearchFilters
) {
  const searchQuery: any = { isDeleted: false };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Apply filters
  if (filters) {
    if (filters.role) searchQuery.role = filters.role;
    if (filters.isVerified !== undefined)
      searchQuery.isVerified = filters.isVerified;
    if (filters.isActive !== undefined) searchQuery.isActive = filters.isActive;
    if (filters.minLoyaltyPoints !== undefined) {
      searchQuery.loyaltyPoints = { $gte: filters.minLoyaltyPoints };
    }
    if (filters.maxLoyaltyPoints !== undefined) {
      searchQuery.loyaltyPoints = {
        ...searchQuery.loyaltyPoints,
        $lte: filters.maxLoyaltyPoints,
      };
    }
    if (filters.createdAtFrom) {
      searchQuery.createdAt = { $gte: filters.createdAtFrom };
    }
    if (filters.createdAtTo) {
      searchQuery.createdAt = {
        ...searchQuery.createdAt,
        $lte: filters.createdAtTo,
      };
    }
    if (filters.lastLoginFrom) {
      searchQuery.lastLogin = { $gte: filters.lastLoginFrom };
    }
    if (filters.lastLoginTo) {
      searchQuery.lastLogin = {
        ...searchQuery.lastLogin,
        $lte: filters.lastLoginTo,
      };
    }
  }

  return this.find(searchQuery).sort({ createdAt: -1 }).limit(50);
};

UserSchema.statics.findByRole = async function (
  role: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    this.find({ role, isDeleted: false, isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    this.countDocuments({ role, isDeleted: false, isActive: true }),
  ]);

  return {
    users,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

// ==================== MIDDLEWARE ====================

// Pre-save middleware
UserSchema.pre('save', function (next) {
  // Trim string fields
  if (this.isModified('name')) {
    this.name = this.name.trim();
  }

  if (this.isModified('email') && this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  if (this.isModified('phoneNumber')) {
    this.phoneNumber = this.constructor.normalizePhoneNumber(this.phoneNumber);
  }

  // Validate phone number format
  if (
    this.isModified('phoneNumber') &&
    !this.constructor.validatePhoneNumber(this.phoneNumber)
  ) {
    const error = new Error(
      "Telefon raqam noto'g'ri formatda. Format: +998XXXXXXXXX"
    );
    return next(error);
  }

  // Set verification status
  if (this.phoneVerified && this.emailVerified) {
    this.isVerified = true;
  }

  // Update last activity
  this.lastActivity = new Date();

  next();
});

// Post-save middleware
UserSchema.post('save', function (error: any, doc: IUser, next: Function) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    let message = '';

    switch (field) {
      case 'phoneNumber':
        message = "Bu telefon raqam allaqachon ro'yxatdan o'tgan";
        break;
      case 'email':
        message = "Bu email allaqachon ro'yxatdan o'tgan";
        break;
      default:
        message = 'Takroriy qiymat';
    }

    next(new Error(message));
  } else {
    next(error);
  }
});

// ==================== MODEL CREATION ====================

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;
