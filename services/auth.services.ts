// services/auth.services.ts
import {
  generateTokenPair,
  getTokenFromHeader,
  refreshAccessToken,
  TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/helper/jwt-helper';
import dbConnect from '@/lib/mongodb';
import User from '@/modules/Account';

export class AuthService {
  // ==================== YANGI METOD ====================
  static async getAllAuths() {
    await dbConnect();

    const users = await User.find({})
      .select(
        'name phoneNumber role loyaltyPoints isVerified phoneVerified lastLogin createdAt'
      )
      .sort({ createdAt: -1 });

    return users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      isVerified: user.isVerified,
      phoneVerified: user.phoneVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    }));
  }

  // Login
  static async login(phoneNumber: string) {
    await dbConnect();

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    if (!user.phoneVerified) {
      throw new Error('Telefon raqam tasdiqlanmagan');
    }

    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        isVerified: user.isVerified,
      },
      tokens,
    };
  }

  // Register
  static async register(name: string, phoneNumber: string) {
    await dbConnect();

    const user = await User.create({
      name,
      phoneNumber,
    });

    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    return {
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      tokens,
    };
  }

  // Verify token
  static async verifyToken(token: string) {
    const payload = verifyAccessToken(token);
    if (!payload) throw new Error('Invalid token');

    await dbConnect();
    const user = await User.findById(payload.userId);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    return {
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        isVerified: user.isVerified,
      },
      tokenPayload: payload,
    };
  }

  // Refresh token
  static async refreshTokens(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');

    const newAccessToken = refreshAccessToken(refreshToken);
    if (!newAccessToken) throw new Error('Failed to refresh token');

    return {
      accessToken: newAccessToken,
      userId: payload.userId,
    };
  }

  // Logout
  static async logout(userId: string) {
    return { success: true };
  }

  // Get user from token
  static async getUserFromToken(authHeader: string | undefined) {
    const token = getTokenFromHeader(authHeader);
    if (!token) return null;
    return this.verifyToken(token);
  }
}
