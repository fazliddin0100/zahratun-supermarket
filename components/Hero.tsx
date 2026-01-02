'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import CategorySlider from './category-product';

const Hero = () => {
  return (
    <section className="py-6 sm:py-8">
      {/* Slider */}
      <div className="w-full">
        <Carousel
          className="w-full rounded-xl overflow-hidden group"
          plugins={[Autoplay({ delay: 3000, stopOnMouseEnter: true })]}>
          <CarouselContent>
            {/* Slide 1 */}
            <CarouselItem>
              <div
                className="w-full h-80 sm:h-112.5 relative bg-cover bg-center flex items-center px-4 sm:px-8 md:px-16"
                style={{
                  backgroundImage: "url('/images/slider/slide-1.jpg')",
                }}>
                <div className="max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
                  <span className="bg-yellow-400 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase">
                    Eksklyuziv taklif -30%
                  </span>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Sizning dasturxoningiz uchun{' '}
                    <span className="text-green-600">Sariq mevalar</span>
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    Bugun buyurtma bering va bepul yetkazib berishga ega
                    bo`ling.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg">
                    Hozir xarid qilish
                  </Button>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2 */}
            <CarouselItem>
              <div
                className="w-full h-75 sm:h-112.5 relative bg-cover bg-center flex items-center px-4 sm:px-8 md:px-16"
                style={{
                  backgroundImage: "url('/images/slider/slider-2.jpg')",
                }}>
                <div className="max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
                  <span className="bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase">
                    Yangi mahsulotlar
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Eng sarxil <br /> Sabzavotlar
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-lg">
                    100% Tabiiy va sifatli mahsulotlar.
                  </p>
                  <Button className="bg-gray-900 hover:bg-black text-white px-4 sm:px-8 py-3 sm:py-6 text-sm sm:text-lg">
                    Katalogni ko`rish
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>

      {/* ostidagi Kichik Bannerlar */}
      <div className="flex mt-4 flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Banner 1 */}
        <div className="relative flex-1 rounded-xl overflow-hidden min-h-45 sm:min-h-55 bg-gray-100 group">
          <Image
            src="/images/banner/grocery-banner.png"
            alt="Ad 1"
            width={400}
            height={200}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative p-4 sm:p-8 space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Meva va sharbatlar
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Hozir buyurtma bering va <br /> 15% chegirma oling.
            </p>
            <Link
              href="/shop"
              className="inline-block text-xs sm:text-sm font-bold text-green-600 hover:underline mt-1 sm:mt-2">
              Hozir xarid qilish →
            </Link>
          </div>
        </div>

        {/* Banner 2 */}
        <div className="relative flex-1 rounded-xl overflow-hidden min-h-45 sm:min-h-55 bg-gray-100 group">
          <Image
            src="/images/banner/grocery-banner-2.jpg"
            alt="Ad 2"
            width={400}
            height={200}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative p-4 sm:p-8 space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Yangi nonlar
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Har kuni ertalab <br /> issiq nonlar.
            </p>
            <Link
              href="/shop"
              className="inline-block text-xs sm:text-sm font-bold text-green-600 hover:underline mt-1 sm:mt-2">
              Hozir xarid qilish →
            </Link>
          </div>
        </div>
      </div>

      {/* mahsulotlar cartuseli */}
      <CategorySlider />
    </section>
  );
};

export default Hero;
