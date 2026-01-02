'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid, ChevronDown, Menu, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Maxsus komponentlar
import Registration from '../auth/registration/registration';
import LocationUsers from '../navbar/locationUser';
import { AvatarUser } from '../navbar/avatar';
import WishlistDrawer from '../wishlist/wishlist';
import { CartSidebar } from '../cart/card';
import { useLocationContext } from '@/context/LocationContext';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState<'uz' | 'ru'>('uz');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selected, nearest } = useLocationContext();

  const categories = [
    { name: 'Sut, non va tuxum', href: '/category/sut-non-va-tuxum' },
    { name: 'Meva va sabzavotlar', href: '/category/meva-va-sabzavotlar' },
    { name: 'Ichimliklar', href: '/category/ichimliklar' },
    { name: 'Go‘sht va baliq', href: '/category/gosht-va-baliq' },
  ];

  const renderFlag = (lang: 'uz' | 'ru') => (
    <span className="w-5 h-3.5 block rounded-sm shadow-sm relative overflow-hidden">
      {lang === 'uz' ? (
        <>
          <span className="absolute inset-x-0 top-0 h-1/3 bg-[#0099b5]"></span>
          <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white"></span>
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#1eb024]"></span>
        </>
      ) : (
        <>
          <span className="absolute inset-x-0 top-0 h-1/3 bg-white"></span>
          <span className="absolute inset-x-0 top-1/3 h-1/3 bg-[#0039A6]"></span>
          <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#D52B1E]"></span>
        </>
      )}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-zinc-950 border-b">
      {/* TOP BAR */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 py-1.5 border-b">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-xs font-medium">
                  {renderFlag(language)}
                  {language === 'uz' ? 'O‘zbekcha' : 'Русский'}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="text-xs">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setLanguage('uz')}>
                  {renderFlag('uz')} O‘zbekcha
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => setLanguage('ru')}>
                  {renderFlag('ru')} Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden sm:flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white text-[12px] font-semibold py-2 px-4 rounded-md shadow-md">
              Bepul yetkazib berish <span className="ml-1 font-bold">$50</span>{' '}
              dan yuqori mahsulot xarid qilinganda amal qiladi!
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AvatarUser />
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="md:py-5 container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobil Hamburger - FIXED */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-75 sm:w-87.5 p-0">
                <SheetHeader className="p-4 border-b text-left">
                  <SheetTitle className="text-green-600">Zahratun</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full overflow-y-auto p-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-none">
                      <AccordionTrigger className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Grid className="h-5 w-5" />
                          Kategoriyalar
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-0">
                        <div className="flex flex-col gap-1 ml-2 border-l-2 border-green-100">
                          {categories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="py-3 px-4 text-sm hover:bg-green-50 rounded-r-lg transition-colors">
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">
                      Asosiy
                    </p>
                    {[
                      { name: 'Biz haqimizda', href: '/about' },
                      { name: 'Do‘kon', href: '/shop' },
                      { name: 'Do‘konlar', href: '/stores' },
                      { name: 'Dashboard', href: '/dashboard' },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-zinc-100 transition-all">
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t pb-10">
                    <LocationUsers />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="shrink-0">
            <Image
              src="/zahratun-logo-ini.png"
              alt="Logo"
              width={180}
              height={40}
              className="w-32 md:w-44 h-auto"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                placeholder="Mahsulotlarni qidirish..."
                className="pr-12 h-11 rounded-xl focus-visible:ring-green-500"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-9 w-9 bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            <div className="hidden md:block">
              <LocationUsers />
            </div>
            <WishlistDrawer />
            <Registration />
            <CartSidebar />
          </div>
        </div>

        {/* Mobil Search */}
        {isSearchOpen && (
          <div className="lg:hidden pt-3 animate-in fade-in zoom-in duration-200">
            <Input
              autoFocus
              placeholder="Qidirish..."
              className="h-11 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden lg:block border-t py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 px-6 h-11 rounded-xl">
                  <Grid className="h-5 w-5" /> Barcha mahsulotlar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 rounded-xl">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.href} asChild>
                    <Link
                      href={cat.href}
                      className="py-3 px-4 rounded-lg cursor-pointer w-full">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-8 text-sm font-semibold text-zinc-600">
              <Link
                href="/about"
                className="hover:text-green-600 transition-all">
                Biz haqimizda
              </Link>
              <Link
                href="/shop"
                className="hover:text-green-600 transition-all">
                Do‘kon
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-green-600 transition-all">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center text-sm font-bold text-green-600">
            <MapPin className="h-4 w-4 mr-2" />
            {selected ?? nearest ?? 'bo‘ylab yetkazib berish'}
          </div>
        </div>
      </nav>
    </header>
  );
}
