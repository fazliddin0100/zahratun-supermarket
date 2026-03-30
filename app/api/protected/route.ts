// app/api/protected/route.ts (Middlware bilan)
import { authenticateRequest } from '@/helper/jwt-helper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (!auth.isAuthenticated) {
    return NextResponse.json(
      {
        success: false,
        message: auth.error,
      },
      { status: 401 }
    );
  }

  // Auth qilingan user ma'lumotlari
  const user = auth.user;
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: 'User maʼlumotlari topilmadi.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Protected endpoint',
      user: {
        id: user.userId,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      data: 'This is protected data',
    },
    { status: 200 }
  );
}
