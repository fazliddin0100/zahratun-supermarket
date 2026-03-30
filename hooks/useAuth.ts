// hooks/useAuth.ts
'use client';

import { AuthClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = AuthClient.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (
    userData: any,
    tokens: { accessToken: string; refreshToken?: string }
  ) => {
    AuthClient.setUser(userData);
    AuthClient.setTokens(tokens.accessToken, tokens.refreshToken);
    setUser(userData);
  };

  const logout = () => {
    AuthClient.clearTokens();
    setUser(null);
    router.push('/');
  };

  const isAuthenticated = () => {
    return !!user && !AuthClient.isTokenExpired();
  };

  const getAuthHeader = () => {
    return AuthClient.getAuthHeader();
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    getAuthHeader,
  };
}
