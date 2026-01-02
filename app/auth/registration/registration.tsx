'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  return (
    <div className="ml-4 cursor-pointer bg-white dark:bg-black rounded-full">
      <Dialog
        onOpenChange={(open) => {
          if (!open) setMode('register');
        }}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="text-gray-600 size-7 dark:text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 text-black dark:text-white">
          <DialogHeader>
            <DialogTitle>
              {mode === 'register' ? 'Roʻyxatdan oʻtish' : 'Tizimga kirish'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'register'
                ? 'Quyidagi formani toʻldirib roʻyxatdan oʻting.'
                : 'Hisobingizga kirish uchun maʼlumotlarni kiriting.'}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            {/* Ism - Faqat Registerda */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name">Ism</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ismingizni kiriting"
                  className="bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
                />
              </div>
            )}

            {/* Telefon raqami - Faqat Registerda */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqami</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">
                    +998
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder=" (90) 123-45-67"
                    className="pl-12 bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email kiriting"
                className="bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="Parol kiriting"
                className="bg-white dark:bg-zinc-800 focus:border-[#0aab0a] focus:ring-[#0aab0a]"
              />
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6">
              {mode === 'register' ? 'Roʻyxatdan oʻtish' : 'Kirish'}
            </Button>

            <div className="text-center mt-4 border-t pt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {mode === 'register'
                  ? 'Hisobingiz bormi?'
                  : 'Hisobingiz yoʻqmi?'}
              </p>
              <button
                type="button"
                onClick={() =>
                  setMode(mode === 'register' ? 'login' : 'register')
                }
                className="inline-block mt-2 text-green-600 font-bold hover:text-green-700 transition-colors">
                {mode === 'register' ? 'Tizimga kirish' : 'Roʻyxatdan oʻtish'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
