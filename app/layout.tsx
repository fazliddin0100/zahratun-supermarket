// src/app/layout.tsx
import { Toaster } from '@/components/ui/sonner';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Yangi provider-ni import qilamiz

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zahratun Supermarket',
  description: 'Zahratun supermarketiga xush kelibsiz!',
  icons: {
    icon: '/Supermarket logo.png',
  },
};

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
