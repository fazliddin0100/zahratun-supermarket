// components/AuthModal.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FormData {
  phone: string;
  name: string;
  verificationCode: string;
}

export default function AuthModal() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login'); // Birinchi login ko'rsatiladi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    name: '',
    verificationCode: '',
  });
  const [open, setOpen] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [userId, setUserId] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Timer useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedPhone = `+998${formData.phone.replace(/\D/g, '')}`;
      setPhoneNumber(formattedPhone);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ro'yxatdan o'tishda xatolik");
      }

      if (data.success) {
        if (data.needsVerification) {
          // Verification mode ga o'tish
          setUserId(data.userId);
          setVerificationMode(true);
          setTimer(data.expiresIn || 150);
          setCanResend(false);

          toast.info('SMS tasdiqlash kodi yuborildi', {
            description: 'Iltimos, telefonizga kelgan 6 xonali kodni kiriting',
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Xatolik yuz berdi';
      setError(errorMessage);
      toast.error("Ro'yxatdan o'tishda xatolik", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Tasdiqlashda xatolik');
      }

      if (data.success) {
        toast.success("Tabriklaymiz! Ro'yxatdan o'tish muvaffaqiyatli", {
          description: 'Endi tizimga kirishingiz mumkin',
        });

        // User ma'lumotlarini saqlash
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Dialogni yopish
        setOpen(false);

        // Sahifani yangilash va bosh sahifaga o'tish
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Tasdiqlashda xatolik';
      setError(errorMessage);
      toast.error('Tasdiqlashda xatolik', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      // Agar verificationMode 'login' bo'lsa, login uchun resend API ni chaqiramiz
      if (mode === 'login' && verificationMode) {
        const response = await fetch('/api/auth/login', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.retryAfter) {
            setTimer(data.retryAfter);
            setCanResend(false);
            throw new Error(
              `Yangi kod so'rash uchun ${data.retryAfter} soniya kutishingiz kerak`
            );
          }
          throw new Error(data.message || 'Yangi kod yuborishda xatolik');
        }

        if (data.success) {
          setTimer(data.expiresIn || 150);
          setCanResend(false);
          setFormData({ ...formData, verificationCode: '' });

          toast.info('Yangi SMS kodi yuborildi', {
            description: 'Iltimos, yangi 6 xonali kodni kiriting',
          });
        }
      } else {
        // Ro'yxatdan o'tish uchun verify API ni chaqiramiz
        const response = await fetch('/api/auth/verify', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.retryAfter) {
            setTimer(data.retryAfter);
            setCanResend(false);
            throw new Error(
              `Yangi kod so'rash uchun ${data.retryAfter} soniya kutishingiz kerak`
            );
          }
          throw new Error(data.message || 'Yangi kod yuborishda xatolik');
        }

        if (data.success) {
          setTimer(data.expiresIn || 150);
          setCanResend(false);
          setFormData({ ...formData, verificationCode: '' });

          toast.info('Yangi SMS kodi yuborildi', {
            description: 'Iltimos, yangi 6 xonali kodni kiriting',
          });
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Xatolik yuz berdi';
      setError(errorMessage);
      toast.error('Yangi kod yuborishda xatolik', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedPhone = `+998${formData.phone.replace(/\D/g, '')}`;
      setPhoneNumber(formattedPhone);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kirishda xatolik');
      }

      if (data.success) {
        // Muvaffaqiyatli kirish
        toast.success('Kirish muvaffaqiyatli!', {
          description: `Xush kelibsiz, ${data.user?.name || 'foydalanuvchi'}!`,
        });

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        setOpen(false);
        router.refresh();
        router.push('/');
      } else if (data.needsVerification) {
        // Verification kerak bo'lsa
        setUserId(data.userId);
        setVerificationMode(true);
        setTimer(data.expiresIn || 150);
        setCanResend(false);

        toast.info('SMS tasdiqlash kodi yuborildi', {
          description: 'Telefon raqamingizni tasdiqlashingiz kerak',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kirish xatosi';
      setError(errorMessage);
      toast.error('Kirishda xatolik', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="cursor-pointer bg-white dark:bg-black rounded-full">
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            // Reset everything when closing
            setMode('login');
            setError('');
            setFormData({ phone: '', name: '', verificationCode: '' });
            setVerificationMode(false);
            setUserId('');
            setTimer(0);
            setCanResend(false);
            setPhoneNumber('');
          }
          setOpen(isOpen);
        }}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <User className="text-gray-600 size-7 dark:text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {verificationMode ?
                '📱 Telefon raqamini tasdiqlash'
              : mode === 'register' ?
                'Roʻyxatdan oʻtish'
              : 'Tizimga kirish'}
            </DialogTitle>

            {/* DialogDescription ichida faqat text content bo'lsin, p taglarsiz */}
            {verificationMode ?
              <DialogDescription asChild>
                <div className="space-y-2">
                  <p className="text-sm">
                    {phoneNumber} raqamiga SMS tasdiqlash kodi yuborildi
                  </p>
                  <p className="text-xs text-amber-600">
                    🔍 Konsolga qarang! SMS kod: console.log da ko'rsatilgan
                  </p>
                </div>
              </DialogDescription>
            : mode === 'register' ?
              <DialogDescription>
                Quyidagi formani toʻldirib roʻyxatdan oʻting.
              </DialogDescription>
            : <DialogDescription>
                Hisobingizga kirish uchun telefon raqamingizni kiriting.
              </DialogDescription>
            }
          </DialogHeader>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* VERIFICATION MODE */}
          {verificationMode ?
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">SMS Tasdiqlash kodi *</Label>
                <Input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="6 xonali kodni kiriting"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="text-center text-2xl tracking-widest bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
                />
                <p className="text-xs text-gray-500">
                  6 xonali raqamdan iborat bo'lgan SMS kodni kiriting
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div
                  className={`px-3 py-2 rounded-lg ${timer > 0 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                  {timer > 0 ?
                    <>
                      <span className="font-mono font-bold">
                        {formatTime(timer)}
                      </span>
                      <span className="ml-2">kod amal qiladi</span>
                    </>
                  : 'Kod muddati tugadi'}
                </div>

                <Button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || loading}
                  variant="outline"
                  size="sm"
                  className={!canResend ? 'opacity-50 cursor-not-allowed' : ''}>
                  {loading ? 'Yuborilmoqda...' : 'Yangi kod yuborish'}
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleVerifyCode}
                disabled={loading || formData.verificationCode.length !== 6}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationMode(false);
                    setError('');
                    setFormData((prev) => ({ ...prev, verificationCode: '' }));
                  }}
                  disabled={loading}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                  ← Orqaga qaytish
                </button>
              </div>
            </div>
          : /* LOGIN/REGISTER FORM */
            <form
              onSubmit={mode === 'register' ? handleRegister : handleLogin}
              className="space-y-4">
              {/* Ism faqat ro'yxatdan o'tishda */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Ism *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ismingizni kiriting"
                    required
                    minLength={2}
                    maxLength={50}
                    className="bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
                  />
                  <p className="text-xs text-gray-500">
                    Ism kamida 2 ta belgidan iborat bo'lishi kerak
                  </p>
                </div>
              )}

              {/* Telefon raqami */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqami *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                    +998
                  </span>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" (90) 123-45-67"
                    required
                    pattern="[0-9]{9}"
                    maxLength={9}
                    className="pl-12 bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Faqat raqamlar, masalan: 901234567
                </p>
              </div>

              {mode === 'register' && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Roʻyxatdan oʻtish orqali siz bizning{' '}
                  <a href="#" className="text-[#0aab0a] underline">
                    Xizmat shartlarimizga
                  </a>{' '}
                  rozilik bildirasiz.
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ?
                  'Yuklanmoqda...'
                : mode === 'register' ?
                  'Roʻyxatdan oʻtish'
                : 'Kirish'}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {mode === 'register' ?
                    'Hisobingiz bormi?'
                  : 'Hisobingiz yoʻqmi?'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'register' ? 'login' : 'register');
                    setError('');
                    // Formani reset qilish
                    setFormData({
                      phone: formData.phone, // Telefon raqam saqlanib qolsin
                      name: '',
                      verificationCode: '',
                    });
                  }}
                  disabled={loading}
                  className="inline-block mt-2 text-green-600 font-bold hover:text-green-700 transition-colors disabled:opacity-50">
                  {mode === 'register' ? 'Tizimga kirish' : 'Roʻyxatdan oʻtish'}
                </button>
              </div>
            </form>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}
