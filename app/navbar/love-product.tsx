'use client';

import { Badge, Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const LoveProducts = () => {
  const t = useTranslations('IndexPage');

  return (
    <div className="relative ml-4 bg-white dark:bg-black rounded-full transition-transform duration-500 hover:scale-110">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="transition-transform duration-200 hover:scale-110">
            <Heart className="text-muted-foreground dark:text-muted-foreground w-7 h-7" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-75 sm:w-137.5 bg-white dark:bg-zinc-900 text-black dark:text-white">
          <SheetHeader>
            <SheetTitle>Sevimlilar</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <p>Bu yerda sevimli mahsulotlar bo‘ladi</p>
          </div>
        </SheetContent>
      </Sheet>

      {/* sevimli mahsulotlar soni */}
      <Badge className="absolute -top-2 -right-2 bg-green-500 h-5 w-5 flex items-center justify-center p-0">
        5
      </Badge>
    </div>
  );
};

export default LoveProducts;
