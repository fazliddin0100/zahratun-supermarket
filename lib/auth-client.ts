// lib/auth-client.ts (Client side)
export class AuthClient {
  // Tokenlarni localStorage ga saqlash
  static setTokens(accessToken: string, refreshToken?: string) {
    if (typeof window === 'undefined') return;

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }

    // Token muddatini saqlash
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 kun
    localStorage.setItem('token_expires_at', expiresAt.toISOString());
  }

  // Tokenlarni olish
  static getTokens() {
    if (typeof window === 'undefined') return null;

    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    return { accessToken, refreshToken };
  }

  // Tokenlarni tozalash
  static clearTokens() {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user');
  }

  // User ma'lumotlarini saqlash
  static setUser(user: any) {
    if (typeof window === 'undefined') return;

    localStorage.setItem('user', JSON.stringify(user));
  }

  // User ma'lumotlarini olish
  static getUser() {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Auth header yaratish
  static getAuthHeader() {
    const tokens = this.getTokens();
    if (!tokens?.accessToken) return null;

    return `Bearer ${tokens.accessToken}`;
  }

  // Token muddati tugaganligini tekshirish
  static isTokenExpired() {
    if (typeof window === 'undefined') return true;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;

    return new Date(expiresAt) < new Date();
  }

  // API request uchun config yaratish
  static getRequestConfig() {
    const authHeader = this.getAuthHeader();

    return {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    };
  }
}
