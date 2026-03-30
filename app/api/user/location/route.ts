// app/api/user/location/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Agar authentication kerak bo'lsa
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';

// Database import qiling (masalan Prisma)
// import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 1. Request body ni o'qish
    const body = await request.json();
    const { latitude, longitude, address } = body;

    // 2. Validatsiya
    if (!latitude || !longitude) {
      return NextResponse.json(
        {
          success: false,
          error: 'Latitude va longitude majburiy',
        },
        { status: 400 }
      );
    }

    // Koordinatalar to'g'riligini tekshirish
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Noto'g'ri koordinatalar",
        },
        { status: 400 }
      );
    }

    // 3. Foydalanuvchini aniqlash (agar auth bor bo'lsa)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, error: 'Tizimga kiring' },
    //     { status: 401 }
    //   );
    // }

    // 4. Ma'lumotlarni saqlash
    // Prisma bilan misol:
    // const savedLocation = await prisma.userLocation.upsert({
    //   where: {
    //     userId: session.user.id,
    //   },
    //   update: {
    //     latitude,
    //     longitude,
    //     address: address || '',
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     userId: session.user.id,
    //     latitude,
    //     longitude,
    //     address: address || '',
    //   },
    // });

    // 5. Session/Cookie ga saqlash (agar database yo'q bo'lsa)
    const response = NextResponse.json(
      {
        success: true,
        message: 'Manzil muvaffaqiyatli saqlandi',
        data: {
          latitude,
          longitude,
          address,
        },
      },
      { status: 200 }
    );

    // Cookie ga yozish
    response.cookies.set(
      'user_location',
      JSON.stringify({
        latitude,
        longitude,
        address,
        timestamp: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 kun
      }
    );

    return response;
  } catch (error) {
    console.error('Location API xatosi:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Server xatosi yuz berdi',
      },
      { status: 500 }
    );
  }
}

// GET endpoint - Saqlangan manzilni olish
export async function GET(request: NextRequest) {
  try {
    // Cookie dan o'qish
    const locationCookie = request.cookies.get('user_location');

    if (locationCookie) {
      const location = JSON.parse(locationCookie.value);
      return NextResponse.json({
        success: true,
        data: location,
      });
    }

    // Yoki database dan:
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { success: false, error: 'Tizimga kiring' },
    //     { status: 401 }
    //   );
    // }

    // const location = await prisma.userLocation.findUnique({
    //   where: { userId: session.user.id },
    // });

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Manzil topilmadi',
    });
  } catch (error) {
    console.error('Location GET xatosi:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Server xatosi',
      },
      { status: 500 }
    );
  }
}
