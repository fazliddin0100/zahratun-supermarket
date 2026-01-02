'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Types
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight: string;
  img: string;
  oldPrice: number | null;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Haldiram's Sev Bhujia",
    weight: '.98 / kg',
    price: 5.0,
    oldPrice: null,
    img: '/images/products/product-img-1.jpg',
    quantity: 1,
  },
  {
    id: 2,
    name: 'NutriChoice hazim qilish',
    weight: '250g',
    price: 20.0,
    oldPrice: 26.0,
    img: '/images/products/product-img-2.jpg',
    quantity: 1,
  },
  {
    id: 3,
    name: 'Cadbury 5 yulduzli',
    weight: '1 kg',
    price: 15.0,
    oldPrice: 20.0,
    img: '/images/products/product-img-3.jpg',
    quantity: 1,
  },
  {
    id: 4,
    name: 'Piyozli kartoshka',
    weight: '250g',
    price: 15.0,
    oldPrice: 20.0,
    img: '/images/products/product-img-4.jpg',
    quantity: 1,
  },
  {
    id: 5,
    name: 'Tuzlangan pokkorm',
    weight: '100g',
    price: 15.0,
    oldPrice: 25.0,
    img: '/images/products/product-img-5.jpg',
    quantity: 1,
  },
];

export function CartSidebar() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const increaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative dark:text-white">
          <ShoppingBag className="w-5 h-5 mr-2 dark:text-white" />
          Savat
          <Badge className="ml-2 bg-primary">{cartItems.length}</Badge>
        </Button>
      </SheetTrigger>

      {/* Asosiy konteyner: flex column va h-full */}
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full dark:text-white">
        {/* Header */}
        <SheetHeader className="p-6 border-b flex-none">
          <SheetTitle className="text-xl font-bold">Savatcha</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Manzil: Toshkent, 382480
          </p>
        </SheetHeader>

        {/* Alert */}
        <div className="px-6 pt-4 flex-none">
          <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 py-3">
            <AlertDescription className="text-sm flex items-center justify-between">
              <span>
                Sizda <strong>BEPUL YETKAZIB BERISH</strong> bor!
              </span>
              <Button
                variant="link"
                className="p-0 h-auto text-red-800 font-bold underline">
                To‘lovga 👈🏻
              </Button>
            </AlertDescription>
          </Alert>
        </div>

        {/* Scrollable items */}
        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-6 pb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 items-start border-b pb-6 last:border-0">
                <div className="relative w-20 h-20 rounded-lg border bg-background shrink-0 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3 mb-1">
                    <h4 className="text-sm font-semibold line-clamp-2">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {item.weight}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => decreaseQty(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => increaseQty(item.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer - har doim pastda ko‘rinadi */}
        <div className="flex-none border-t bg-background p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Jami:</span>
            <span className="text-2xl font-bold text-primary">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-12">
              Yangilash
            </Button>
            <Button
              size="lg"
              className="h-12 bg-green-600 hover:bg-green-700 text-white">
              Xarid qilish
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
