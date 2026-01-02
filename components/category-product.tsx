import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const categories = [
  {
    name: 'Sut, non va tuxum',
    img: '/images/category/category-dairy-bread-eggs.jpg',
  },
  {
    name: 'Snack & Munchies',
    img: '/images/category/category-snack-munchies.jpg',
  },
  {
    name: 'Non va pechene',
    img: '/images/category/category-bakery-biscuits.jpg',
  },
  {
    name: 'Tezkor taom',
    img: '/images/category/category-instant-food.jpg',
  },
  {
    name: 'Ichimliklar',
    img: '/images/category/category-tea-coffee-drinks.jpg',
  },
  {
    name: 'Guruch va dukkaklilar',
    img: '/images/category/category-atta-rice-dal.jpg',
  },
  {
    name: 'Chaqaloqlar uchun',
    img: '/images/category/category-baby-care.jpg',
  },
  {
    name: "Go'sht va baliq",
    img: '/images/category/category-chicken-meat-fish.jpg',
  },
  {
    name: 'Tozalash vositalari',
    img: '/images/category/category-cleaning-essentials.jpg',
  },
  {
    name: 'Uy hayvonlari',
    img: '/images/category/category-pet-care.jpg',
  },
];

export default function CategorySlider() {
  return (
    <section className="py-12 bg-gray-50/50 dark:bg-zinc-950">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              Tavsiya etilgan toifalar
            </h3>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Sifatli mahsulotlarni tanlangan toifalar bo‘yicha ko‘ring
            </p>
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 ">
                <Link href="/shop-grid" className="group">
                  <Card className="overflow-hidden transition-all duration-300 border-none shadow-sm hover:shadow-md bg-white  group-hover:-translate-y-1 dark:bg-white/10">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={category.img}
                          alt={category.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-center transition-colors text-zinc-700 dark:text-zinc-300 group-hover:text-primary">
                        {category.name}
                      </h4>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-4 bg-white dark:bg-zinc-600" />
            <CarouselNext className="-right-4 bg-white dark:bg-zinc-600" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
