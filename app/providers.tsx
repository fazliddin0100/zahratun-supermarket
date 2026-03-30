// app/providers.tsx
'use client'; // Bu fayl brauzerda ishlaydi

import { LocationProvider } from '@/context/LocationContext';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <SessionProvider>{children}</SessionProvider>
    </LocationProvider>
  );
}
