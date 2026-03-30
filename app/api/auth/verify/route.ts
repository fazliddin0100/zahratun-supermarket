// app/api/auth/verify/route.ts
import dbConnect from '@/lib/mongodb';
import User from '@/modules/Account';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, code } = body;

    // Validatsiya
    if (!userId || !code) {
      return NextResponse.json(
        {
          success: false,
          message: 'Iltimos, tasdiqlash kodini kiriting',
        },
        { status: 400 }
      );
    }

    // User ni topish (verification code bilan)
    const user = await User.findById(userId).select(
      '+verificationCode +verificationCodeExpires +verificationAttempts'
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi topilmadi',
        },
        { status: 404 }
      );
    }

    // Code ni tekshirish
    const isValid = user.verifyCode(code);
    await user.save();

    if (!isValid) {
      // Code muddati tugaganmi?
      if (user.isVerificationCodeExpired()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Tasdiqlash kodi muddati tugagan. Iltimos, yangi kod so'rang",
            isExpired: true,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Noto'g'ri tasdiqlash kodi",
          attemptsLeft: 3 - user.verificationAttempts,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Telefon raqamingiz muvaffaqiyatli tasdiqlandi!',
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified,
          phoneVerified: user.phoneVerified,
        },
        token: 'demo-auth-token',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verification xatosi:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server xatosi',
      },
      { status: 500 }
    );
  }
}

// Yangi verification code so'rash
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi ID si kerak',
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select(
      '+verificationCode +verificationCodeSentAt'
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi topilmadi',
        },
        { status: 404 }
      );
    }

    // Oldingi code yuborilganidan 30 soniya o'tganmi?
    const lastSent = user.verificationCodeSentAt;
    if (lastSent && Date.now() - lastSent.getTime() < 30000) {
      return NextResponse.json(
        {
          success: false,
          message: "Yangi kod so'rash uchun 30 soniya kutishingiz kerak",
          retryAfter: Math.ceil(
            (30000 - (Date.now() - lastSent.getTime())) / 1000
          ),
        },
        { status: 429 }
      );
    }

    // Yangi code yaratish
    const newCode = user.createVerificationCode();
    await user.save();

    console.log('==========================================');
    console.log('🔐 Yangi SMS kod:', newCode);
    console.log('==========================================');

    return NextResponse.json(
      {
        success: true,
        message: 'Yangi SMS tasdiqlash kodi yuborildi',
        expiresIn: 150,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resend code xatosi:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server xatosi',
      },
      { status: 500 }
    );
  }
}
