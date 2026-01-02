'use client';

import { ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function ShoppingCartSheet() {
  return (
    <div
      className="relative ml-4 bg-white dark:bg-black rounded-full 
                 transition-transform duration-500 hover:scale-110">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="transition-transform duration-200 hover:scale-110 p-2">
            <ShoppingCart className="w-6 h-6 text-muted-foreground dark:text-zinc-300" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-75 sm:w-137.5 bg-white dark:bg-zinc-900 text-black dark:text-white">
          <SheetHeader>
            <SheetTitle>Savat</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <p>Bu yerda shopping cart itemlari bo‘ladi</p>
          </div>
        </SheetContent>
      </Sheet>

      {/* savatchadagi mahsulotlar soni */}
      <span className="absolute -top-1.5 -right-px bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
        3
      </span>
    </div>
  );
}
