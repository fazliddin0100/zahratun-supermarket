// app/api/auth/login/route.ts
import { generateTokenPair } from '@/helper/jwt-helper'; // Avval yaratgan JWT helper
import dbConnect from '@/lib/mongodb';
import User from '@/modules/Account';
import { NextRequest, NextResponse } from 'next/server';

// IP cheklash uchun
import rateLimit from '@/lib/rate-limit';

// Types and Interfaces
interface LoginRequest {
  phoneNumber: string;
}

interface VerificationRequest {
  userId: string;
  code: string;
  deviceId?: string;
}

interface ResendCodeRequest {
  userId: string;
}

interface DeleteDeviceRequest {
  userId: string;
  deviceId: string;
}

interface TrustedDevice {
  deviceId: string;
  userAgent?: string;
  ip?: string;
}

interface TokenPayload {
  userId: string;
  phoneNumber: string;
  role: string;
}

interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  loyaltyPoints: number;
  isVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface LoginHistory {
  ip: string;
  userAgent: string;
  success: boolean;
  note?: string;
}

// Rate limiter (1 daqiqada 5 ta request)
const limiter = rateLimit({
  interval: 60 * 1000, // 1 daqiqa
  uniqueTokenPerInterval: 500,
});

// Device ID yaratish
function generateDeviceId(req: NextRequest): string {
  const userAgent = req.headers.get('user-agent') || '';
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // Simple hash for device identification
  return Buffer.from(`${userAgent}-${ip}`).toString('base64').slice(0, 32);
}

// Login uchun POST request
export async function POST(request: NextRequest) {
  try {
    // Rate limit tekshirish
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await limiter.check(10, ip); // 1 daqiqada 10 ta urinish

    await dbConnect();
    const body = await request.json();
    const { phoneNumber } = body;

    // Validatsiya
    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: 'Telefon raqamini kiriting',
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
          message: "Noto'g'ri telefon raqam formati. Format: +998XXXXXXXXX",
        },
        { status: 400 }
      );
    }

    // User ni topish
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      // Mavjud bo'lmagan user uchun ham delay qo'yish (timing attackdan himoya)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return NextResponse.json(
        {
          success: false,
          message: "Bu telefon raqam bilan ro'yxatdan o'tilmagan",
        },
        { status: 404 }
      );
    }

    // Account bloklanganligini tekshirish
    if ((user as any).isAccountLocked()) {
      const lockTime = (user as any).lockUntil;
      const remainingMinutes =
        lockTime ?
          Math.ceil((lockTime.getTime() - Date.now()) / (1000 * 60))
        : 0;

      return NextResponse.json(
        {
          success: false,
          message: `Hisobingiz bloklangan. Iltimos, ${remainingMinutes} daqiqadan keyin urinib ko'ring.`,
          locked: true,
          remainingMinutes,
        },
        { status: 423 } // Locked status
      );
    }

    // Device ma'lumotlari
    const deviceId = generateDeviceId(request);
    const userAgent = request.headers.get('user-agent') || '';
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Agar trusted device bo'lsa, SMS jo'natmasdan token berish
    const isTrustedDevice = (user as any).isTrustedDevice(deviceId);

    if (isTrustedDevice) {
      // Trusted device uchun bevosita token berish
      user.lastLogin = new Date();
      await (user as any).resetLoginAttempts();
      await (user as any).addLoginHistory({
        ip: clientIp,
        userAgent,
        success: true,
      });

      // Trusted device ni yangilash
      await (user as any).addTrustedDevice({
        deviceId,
        userAgent,
        ip: clientIp,
      });

      // JWT token yaratish
      const tokenPayload = {
        userId: user._id.toString(),
        phoneNumber: user.phoneNumber,
        role: user.role,
      };

      const tokens = generateTokenPair(tokenPayload);

      // User ma'lumotlarini tayyorlash
      const userProfile = {
        id: user._id.toString(),
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        isVerified: user.isVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
      };

      console.log('✅ TRUSTED DEVICE KIRISH:', {
        userId: user._id,
        phone: user.phoneNumber,
        deviceId: deviceId.slice(0, 10) + '...',
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Kirish muvaffaqiyatli!',
          user: userProfile,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
          trustedDevice: true,
        },
        { status: 200 }
      );
    }

    // Trusted device bo'lmasa, HAR DOIM SMS verification
    const verificationCode = user.createVerificationCode();
    await user.save();

    // Login urinishlarini qayd qilish
    await (user as any).addLoginHistory({
      ip: clientIp,
      userAgent,
      success: false,
      note: 'SMS verification kutilyapti',
    });

    console.log('==========================================');
    console.log('🔐 LOGIN SMS TASDIQLASH KODI:');
    console.log('💻 Device ID:', deviceId.slice(0, 10) + '...');
    console.log('🌐 IP:', clientIp);
    console.log('🔐 SMS tasdiqlash kodi:', verificationCode);
    console.log('==========================================');

    return NextResponse.json(
      {
        success: false,
        needsVerification: true,
        message: 'Telefon raqamingizga SMS tasdiqlash kodi yuborildi.',
        userId: user._id.toString(),
        phoneNumber: user.phoneNumber,
        expiresIn: 150,
        deviceId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login xatosi:', error);

    // Rate limit xatosi
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        {
          success: false,
          message:
            "Juda ko'p urinish. Iltimos, biroz kutib qayta urinib ko'ring.",
        },
        { status: 429 }
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

// Verification API (SMS kodni tekshirish)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, code, deviceId } = body;

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

    // Account bloklanganligini tekshirish
    if ((user as any).isAccountLocked()) {
      return NextResponse.json(
        {
          success: false,
          message: "Hisobingiz bloklangan. Iltimos, keyinroq urinib ko'ring.",
          locked: true,
        },
        { status: 423 }
      );
    }

    // Code ni tekshirish
    const isValid = user.verifyCode(code);
    await user.save();

    if (!isValid) {
      // Noto'g'ri kod kiritilganida login urinishlarini oshirish
      await (user as any).incrementLoginAttempts();

      // Login tarixiga qo'shish
      const userAgent = request.headers.get('user-agent') || '';
      const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

      await (user as any).addLoginHistory({
        ip: clientIp,
        userAgent,
        success: false,
        note: "Noto'g'ri SMS kodi",
      });

      // Code muddati tugaganmi?
      if (user.isVerificationCodeExpired()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Tasdiqlash kodi muddati tugagan. Iltimos, yangi kod so'rang",
            isExpired: true,
            attemptsLeft: 3 - user.verificationAttempts,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Noto'g'ri tasdiqlash kodi",
          attemptsLeft: 3 - user.verificationAttempts,
          locked: (user as any).isAccountLocked(),
        },
        { status: 400 }
      );
    }

    // Muvaffaqiyatli verification
    user.phoneVerified = true;
    user.isVerified = true;
    user.lastLogin = new Date();
    await (user as any).resetLoginAttempts();

    // Device ma'lumotlari
    const userAgent = request.headers.get('user-agent') || '';
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Login tarixiga qo'shish
    await (user as any).addLoginHistory({
      ip: clientIp,
      userAgent,
      success: true,
    });

    // Trusted device sifatida qo'shish (agar kerak bo'lsa)
    let trustedDeviceAdded = false;
    if (deviceId) {
      await (user as any).addTrustedDevice({
        deviceId,
        userAgent,
        ip: clientIp,
      });
      trustedDeviceAdded = true;
    }

    await user.save();

    // JWT token yaratish
    const tokenPayload = {
      userId: user._id.toString(),
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    const tokens = generateTokenPair(tokenPayload);

    console.log('✅ SMS VERIFICATION MUVAFFAQIYATLI:', {
      userId: user._id,
      phone: user.phoneNumber,
      deviceTrusted: trustedDeviceAdded,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Kirish muvaffaqiyatli!',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        trustedDevice: trustedDeviceAdded,
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
export async function PATCH(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    await limiter.check(3, ip);

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

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi topilmadi',
        },
        { status: 404 }
      );
    }

    // Account bloklanganligini tekshirish
    if ((user as any).isAccountLocked()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Hisobingiz bloklangan',
          locked: true,
        },
        { status: 423 }
      );
    }

    // Oldingi code yuborilganidan 30 soniya o'tganmi?
    const lastSent = user.verificationCodeSentAt;
    if (lastSent && Date.now() - lastSent.getTime() < 30000) {
      const waitTime = Math.ceil(
        (30000 - (Date.now() - lastSent.getTime())) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          message: `Yangi kod so'rash uchun ${waitTime} soniya kutishingiz kerak`,
          retryAfter: waitTime,
        },
        { status: 429 }
      );
    }

    // Yangi code yaratish
    const newCode = user.createVerificationCode();
    await user.save();

    console.log('==========================================');
    console.log('🔄 YANGI SMS KOD YUBORILDI:');
    console.log('🔐 Yangi SMS tasdiqlash kodi:', newCode);
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

    // Rate limit xatosi
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        {
          success: false,
          message:
            "Juda ko'p urinish. Iltimos, biroz kutib qayta urinib ko'ring.",
        },
        { status: 429 }
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

// Trusted device ni o'chirish
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, deviceId } = body;

    if (!userId || !deviceId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi ID va Device ID kerak',
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Foydalanuvchi topilmadi',
        },
        { status: 404 }
      );
    }

    // Trusted device ni o'chirish
    (user as any).trustedDevices = (user as any).trustedDevices.filter(
      (device: any) => device.deviceId !== deviceId
    );

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Trusted device o'chirildi",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Device removal error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Server xatosi',
      },
      { status: 500 }
    );
  }
}
