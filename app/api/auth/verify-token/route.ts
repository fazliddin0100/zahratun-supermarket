// app/api/auth/verify-token/route.ts
import { AuthService } from '@/services/auth.services';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const result = await AuthService.getUserFromToken(authHeader || undefined);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: result.user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Token verification error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Token tekshirishda xatolik',
      },
      { status: 401 }
    );
  }
}
