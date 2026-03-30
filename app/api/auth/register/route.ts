// app/api/auth/register/route.ts
import dbConnect from '@/lib/mongodb';
import User from '@/modules/Account';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { phoneNumber, name } = body;

    console.log('Register request:', { phoneNumber, name });

    // Validatsiya
    if (!phoneNumber || !name) {
      return NextResponse.json(
        {
          success: false,
          message: 'Iltimos, ism va telefon raqamingizni kiriting',
        },
        { status: 400 }
      );
    }

    // Telefon raqamini validatsiya qilish
    const phoneRegex = /^\+998[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Noto'g'ri telefon raqam formati. Iltimos, +998XXXXXXXXX formatida kiriting",
        },
        { status: 400 }
      );
    }

    // Telefon raqam borligini tekshirish
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Ushbu telefon raqam allaqachon ro'yxatdan o'tgan",
        },
        { status: 409 }
      );
    }

    // Yangi user yaratish
    const user = await User.create({
      phoneNumber: phoneNumber,
      name: name.trim(),
      provider: 'credentials',
    });

    // Verification code yaratish
    const verificationCode = user.createVerificationCode();
    await user.save();

    console.log('==========================================');
    console.log('🔐 SMS kod:', verificationCode);
    console.log('==========================================');

    return NextResponse.json(
      {
        success: true,
        message: 'SMS tasdiqlash kodi yuborildi',
        needsVerification: true,
        userId: user._id,
        phoneNumber: user.phoneNumber,
        expiresIn: 150,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Registratsiya xatosi:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Ushbu telefon raqam allaqachon ro'yxatdan o'tgan",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server xatosi',
      },
      { status: 500 }
    );
  }
}
