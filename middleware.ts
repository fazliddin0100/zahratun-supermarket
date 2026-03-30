// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Hozircha faqat shu ikkita sahifani himoya qilamiz (agar kerak bo'lsa)
const protectedRoutes = ['/profile', '/orders'];
// const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('Middleware:', pathname); // Test uchun log

  // Auth sahifalari (login/register)
  // if (authRoutes.some((route) => pathname.startsWith(route))) {
  //   return NextResponse.next();
  // }

  // Protected sahifalar (dashboardni himoyadan chiqardik)
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtected) {
    // Token tekshirish kerak emas (hozircha)
    return NextResponse.next();
  }

  // Barcha boshqa sahifalar ochiq
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
