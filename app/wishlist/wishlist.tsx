'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart, MessageCircle, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialWishlist = [
  {
    id: 1,
    name: 'Banan',
    price: '$35.00',
    weight: '$.98 / lb',
    status: 'in-stock',
    image: '/images/products/product-img-18.jpg',
  },
  {
    id: 2,
    name: 'Kiwi',
    price: '$20.97',
    weight: '4 no',
    status: 'out-of-stock',
    image: '/images/products/product-img-17.jpg',
  },
  {
    id: 3,
    name: 'Ananas',
    price: '$35.00',
    weight: '2 no',
    status: 'in-stock',
    image: '/images/products/product-img-16.jpg',
  },
  {
    id: 4,
    name: 'BeatRoot',
    price: '$29.00',
    weight: '1 kg',
    status: 'in-stock',
    image: '/images/products/product-img-19.jpg',
  },
  {
    id: 5,
    name: 'Apelsin',
    price: '$70.00',
    weight: '2 kg',
    status: 'in-stock',
    image: '/images/products/product-img-15.jpg',
  },
  {
    id: 6,
    name: 'Olma',
    price: '$12.00',
    weight: '1 kg',
    status: 'in-stock',
    image: '/images/products/product-img-14.jpg',
  }, // Ko'proq mahsulot test uchun
];

const WishlistDrawer = () => {
  const [items, setItems] = useState(initialWishlist);
  const [isOpen, setIsOpen] = useState(false);

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative cursor-pointer group p-2">
          <Heart className="h-6 w-6 text-gray-600 dark:text-white group-hover:text-green-600 transition-colors" />
          {items.length > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-green-500 h-5 w-5 flex items-center justify-center p-0 text-[10px] text-white font-bold border-2 border-white dark:border-gray-900 rounded-full">
              {items.length}
            </Badge>
          )}
        </div>
      </SheetTrigger>

      {/* h-full va flex-col scroll ishlashi uchun muhim */}
      <SheetContent
        side="left"
        className="w-full sm:max-w-md h-full flex flex-col p-0 gap-0 border-r shadow-2xl [&>button]:hidden">
        {/* HEADER - Balandligi aniq va qat'iy */}
        <SheetHeader className="p-5 border-b bg-white dark:bg-zinc-950 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600 fill-green-600" />
            <SheetTitle className="text-lg font-bold">
              Istaklar ro‘yxati{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({items.length})
              </span>
            </SheetTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full">
            <X className="h-5 w-5 text-zinc-500" />
          </Button>
        </SheetHeader>

        {/* SCROLLAREA - flex-1 uni barcha bo'sh joyni egallashga majbur qiladi */}
        <ScrollArea className="flex-1 w-full overflow-hidden">
          <div className="p-5">
            {items.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-5 first:pt-0 items-start">
                    <div className="relative h-20 w-20 shrink-0 rounded-xl border bg-zinc-50 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold truncate pr-2">
                          {item.name}
                        </h4>
                        <p className="text-sm font-black">{item.price}</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 mb-3">
                        {item.weight}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-8 bg-green-600 text-[11px]">
                          Savatchaga
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-zinc-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart className="h-12 w-12 text-zinc-200 mb-4" />
                <p className="text-zinc-500">Ro‘yxat bo‘sh</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* FOOTER - shrink-0 pastda qotib turishini ta'minlaydi */}
        {items.length > 0 && (
          <div className="p-5 border-t bg-white dark:bg-zinc-950 shrink-0">
            <Button className="w-full bg-zinc-900 py-6 font-bold rounded-xl shadow-lg">
              Barcha sevimlilarni ko‘rish
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
