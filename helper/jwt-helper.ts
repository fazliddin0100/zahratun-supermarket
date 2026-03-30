// lib/jwt.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-default-secret-key-change-in-production';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '7d';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '30d';

// Token payload interfeysi
export interface TokenPayload {
  userId: string;
  phoneNumber: string;
  role: string;
  iat?: number;
  exp?: number;
}

// JWT Options
const jwtOptions = {
  issuer: 'your-app-name',
  audience: 'your-app-client',
};

// ACCESS TOKEN yaratish
export function generateAccessToken(
  payload: Omit<TokenPayload, 'iat' | 'exp'>
): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, JWT_SECRET as string, {
    ...jwtOptions,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as any);
}

// REFRESH TOKEN yaratish
export function generateRefreshToken(
  payload: Omit<TokenPayload, 'iat' | 'exp'>
): string {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not set');
  }

  return jwt.sign(
    payload,
    JWT_REFRESH_SECRET as string,
    {
      ...(jwtOptions as jwt.SignOptions),
      expiresIn: REFRESH_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );
}

// Access Token ni tekshirish
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(token, JWT_SECRET, jwtOptions) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
}

// Refresh Token ni tekshirish
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    if (!JWT_REFRESH_SECRET) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }

    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET,
      jwtOptions
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

// Token pair yaratish (access + refresh)
export function generateTokenPair(payload: Omit<TokenPayload, 'iat' | 'exp'>): {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Token muddatini hisoblash
  const expiresIn = parseJwtExpiry(ACCESS_TOKEN_EXPIRY);

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

// Token muddatini parse qilish (sekundlarda)
function parseJwtExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60; // Default 7 kun

  const [, value, unit] = match;
  const numValue = parseInt(value, 10);

  switch (unit) {
    case 's':
      return numValue; // sekund
    case 'm':
      return numValue * 60; // daqiqa
    case 'h':
      return numValue * 60 * 60; // soat
    case 'd':
      return numValue * 24 * 60 * 60; // kun
    default:
      return 7 * 24 * 60 * 60;
  }
}

// Token dan user ID olish
export function getUserIdFromToken(token: string): string | null {
  const payload = verifyAccessToken(token);
  return payload?.userId || null;
}

// Token dan user ma'lumotlarini olish
export function getUserFromToken(token: string): TokenPayload | null {
  return verifyAccessToken(token);
}

// Header dan tokenni olish
export function getTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // "Bearer " dan keyingi qism
}

// Password hash qilish
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Password ni tekshirish
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Token muddatini tekshirish
export function isTokenExpired(token: string): boolean {
  try {
    const payload = verifyAccessToken(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// Yangi access token yaratish refresh tokendan
export function refreshAccessToken(refreshToken: string): string | null {
  try {
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return null;

    // Yangi access token yaratish
    const { userId, phoneNumber, role } = payload;
    return generateAccessToken({ userId, phoneNumber, role });
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
}

// Token ma'lumotlarini dekod qilish (verify qilmasdan)
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    console.error('Token decoding failed:', error);
    return null;
  }
}

// Token middleware (Next.js API routes uchun)
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

// API route uchun middleware
export function withAuth(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = getTokenFromHeader(req.headers.authorization);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access token is required',
        });
      }

      const payload = verifyAccessToken(token);

      if (!payload) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
        });
      }

      // Request ga user ma'lumotlarini qo'shish
      (req as any).user = payload;

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
}

// App Router middleware (Next.js 13+)
export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader || undefined);

  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'Access token is required',
    };
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'Invalid or expired token',
    };
  }

  return {
    isAuthenticated: true,
    user: payload,
    error: null,
  };
}

// Role based access control
export function withRole(roles: string[]) {
  return (handler: Function) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const token = getTokenFromHeader(req.headers.authorization);

        if (!token) {
          return res.status(401).json({
            success: false,
            message: 'Access token is required',
          });
        }

        const payload = verifyAccessToken(token);

        if (!payload) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
          });
        }

        // Role tekshirish
        if (!roles.includes(payload.role)) {
          return res.status(403).json({
            success: false,
            message: 'Permission denied',
          });
        }

        // Request ga user ma'lumotlarini qo'shish
        (req as any).user = payload;

        return handler(req, res);
      } catch (error) {
        console.error('Role middleware error:', error);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    };
  };
}

// Cookie based authentication
export function setAuthCookies(
  res: NextApiResponse,
  accessToken: string,
  refreshToken?: string
) {
  // Access token cookie
  res.setHeader('Set-Cookie', [
    `access_token=${accessToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  ]);

  // Refresh token cookie (agar mavjud bo'lsa)
  if (refreshToken) {
    res.setHeader('Set-Cookie', [
      ...(res.getHeader('Set-Cookie') as string[]),
      `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    ]);
  }
}

// Cookie dan tokenni olish
export function getTokenFromCookies(cookies: {
  [key: string]: string;
}): string | null {
  return cookies.access_token || null;
}

// Cookie ni tozalash
export function clearAuthCookies(res: NextApiResponse) {
  res.setHeader('Set-Cookie', [
    'access_token=; HttpOnly; Path=/; Max-Age=0',
    'refresh_token=; HttpOnly; Path=/; Max-Age=0',
  ]);
}
