'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Heart, ArrowLeftRight, Plus, Star } from 'lucide-react';

// Swiper kutubxonasi va modullari
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper stillari
import 'swiper/css';
import 'swiper/css/pagination';
import QuickViewModal from './QuickViewModal';

// QuickViewModal da kutayotgan Product tipiga moslashtirilgan interface
interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice: number;
  rating: number;
  image: string;
  reviews: number; // QuickViewModal uchun majburiy maydon
  description?: string; // agar modalda ishlatilsa
  images?: string[]; // agar bir nechta rasm bo'lsa
}

interface DealCountdownProps {
  targetDate: string;
}

// 1. Countdown Komponenti
function DealCountdown({ targetDate }: DealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(targetDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 mt-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div
          key={unit}
          className="bg-white/20 backdrop-blur-md rounded-lg p-2 w-14 text-center text-white border border-white/10">
          <div className="text-lg font-bold">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase opacity-70">{unit}</div>
        </div>
      ))}
    </div>
  );
}

// 2. Asosiy Komponent
export default function BestSellersSection() {
  const products: Product[] = [
    {
      id: 1,
      title: 'Qovurilgan maydalangan qahva',
      category: 'Choy, qahva va ichimliklar',
      price: 13,
      oldPrice: 18,
      rating: 5,
      image: '/images/products/product-img-11.jpg',
      reviews: 128,
      description: 'Yuqori sifatli 100% arabika qahva loviyalari.',
    },
    {
      id: 2,
      title: 'Ezilgan pomidorlar bankada',
      category: 'Meva va sabzavotlar',
      price: 13,
      oldPrice: 18,
      rating: 4,
      image: '/images/products/product-img-12.jpg',
      reviews: 85,
      description: 'Tabiiy va yangi pomidorlardan tayyorlangan.',
    },
    {
      id: 3,
      title: 'Oltin ananas (Premium)',
      category: 'Meva va sabzavotlar',
      price: 13,
      oldPrice: 18,
      rating: 5,
      image: '/images/products/product-img-13.jpg',
      reviews: 212,
      description: 'Eng shirin va sara oltin ananas.',
    },
    {
      id: 4,
      title: 'Yangi uzilgan ko‘katlar',
      category: 'Sabzavotlar',
      price: 10,
      oldPrice: 15,
      rating: 4,
      image: '/images/products/product-img-15.jpg',
      reviews: 67,
      description: 'Har kuni yangi yig‘ilgan ko‘katlar to‘plami.',
    },
    {
      id: 5,
      title: 'Tabiiy olma sharbati',
      category: 'Ichimliklar',
      price: 20,
      oldPrice: 25,
      rating: 5,
      image: '/images/products/product-img-15.jpg',
      reviews: 145,
      description: 'Qadoqlangan, tabiiy va shakarsiz olma sharbati.',
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <section className="py-12 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kundalik eng yaxshi sotuvlar
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== Banner ===== */}
          <div
            className="shrink-0 w-full lg:w-[320px] h-100 lg:h-auto min-h-112.5 rounded-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-lg group"
            style={{
              backgroundImage: "url('/images/banner/banner-deal.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold leading-tight">
                100% organik qahva loviyalari
              </h3>
              <p className="mt-2 text-gray-100 opacity-90">
                Eng sara mahsulotlar faqat bizda
              </p>
              <Button className="mt-6 bg-green-500 hover:bg-green-600 border-none px-6">
                Hozir xarid qilish
              </Button>
            </div>
            <div className="relative z-10">
              <p className="text-sm mb-2 font-medium">Tugashiga qoldi:</p>
              <DealCountdown targetDate="2025-12-31T23:59:59" />
            </div>
          </div>

          {/* ===== Product Slider ===== */}
          <div className="flex-1 min-w-0">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
              className="pb-14">
              {products.map((p) => (
                <SwiperSlide key={p.id} className="h-full">
                  <Card className="group h-full border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-green-500 transition-all duration-300">
                    <CardContent className="p-5 flex flex-col h-full">
                      {/* Image Area */}
                      <div className="relative overflow-hidden rounded-xl bg-gray-50 dark:bg-zinc-900 mb-4 h-52 flex items-center justify-center">
                        <Image
                          src={p.image}
                          alt={p.title}
                          width={350}
                          height={50}
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Action Buttons */}
                        <div
                          className="
                            absolute bottom-3 left-0 right-0 
                            flex items-center justify-center gap-2
                            transition-all duration-300
                            opacity-100 translate-y-0
                            lg:opacity-0 lg:translate-y-8 
                            lg:group-hover:opacity-100 lg:group-hover:translate-y-0
                          ">
                          <Button
                            size="icon"
                            variant="secondary"
                            // hidden klassi mobil uchun, lg:flex esa kompyuter ekrani uchun
                            className="hidden lg:flex h-9 w-9 shadow-md bg-white hover:bg-green-500 hover:text-white"
                            onClick={() => openQuickView(p)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 shadow-md bg-white hover:bg-green-500 hover:text-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 shadow-md bg-white hover:bg-green-500 hover:text-white">
                            <ArrowLeftRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Info Area */}
                      <div className="flex-1">
                        <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider mb-1">
                          {p.category}
                        </p>
                        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 h-10 italic lg:not-italic">
                          {p.title}
                        </h2>

                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < p.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-[10px] ml-2 text-gray-400">
                            ({p.reviews})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg font-bold text-green-600">
                            ${p.price}
                          </span>
                          <span className="text-sm line-through text-gray-400">
                            ${p.oldPrice}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors">
                        <Plus className="w-4 h-4 mr-2" /> Savatchaga
                      </Button>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        product={selectedProduct}
      />
    </section>
  );
}
