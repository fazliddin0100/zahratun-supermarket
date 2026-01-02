'use client';

import { ModeToggle } from '@/components/ui/modeToggle';
import { AvatarUser } from './avatar';
import LoveProducts from './love-product';
import Registration from '../auth/registration/registration';
import ShoppingCardPage from './shopping-card';
import Image from 'next/image';
import SearchProducts from './search';
import LocationUsers from './locationUser';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f0f3f2] dark:bg-[#1a1a1a] shadow-sm transition-colors border-b dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-4">
          {/* 1. Logo qismi */}
          <div className="shrink-0">
            <Image
              src="/logo-zahratun_width.png"
              alt="Zahratun Logo"
              width={200}
              height={50}
              priority
            />
          </div>

          {/* 2. Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl px-4">
            <SearchProducts />
          </div>

          {/* 3. Doimiy ko'rinadigan iconlar (Mobil + Desktop) */}
          <div className="flex items-center gap-1 md:gap-3 ml-auto md:ml-0">
            <LoveProducts />
            <ShoppingCardPage />

            {/* Faqat Desktop uchun qo'shimchalar (LG ekrandan boshlab) */}
            <div className="hidden lg:flex items-center gap-3 ml-2 border-l pl-4 dark:border-gray-700">
              <LocationUsers />
              <Registration />
              <ModeToggle />
              <AvatarUser />
            </div>

            {/* Mobil va Planshet uchun Hamburger (LG dan kichik ekranlarda) */}
            <button
              className="lg:hidden p-2 ml-1 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
              onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobil / Tablet ochiladigan menyu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-[#1a1a1a] border-t dark:border-gray-800 ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Mobil uchun qidiruv (faqat kichik ekranlarda) */}
          <div className="md:hidden">
            <SearchProducts />
          </div>

          {/* Menyu ichidagi boshqa elementlar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-sm font-medium dark:text-white">
                Manzil:
              </span>
              <LocationUsers />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-sm font-medium dark:text-white">Til:</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-sm font-medium dark:text-white">
                Mavzu:
              </span>
              <ModeToggle />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <span className="font-medium text-gray-700 dark:text-white">
              Ro`yxatdan o`tish / Tizimga kirish
            </span>
            <Registration />
            <div className="flex items-center gap-3 p-4 border dark:border-gray-700 rounded-xl">
              <AvatarUser />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Shaxsiy kabinet
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
