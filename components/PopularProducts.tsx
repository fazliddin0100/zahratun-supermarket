'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, ArrowLeftRight, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import QuickViewModal from '@/components/QuickViewModal';

const products = [
  {
    id: 1,
    title: "Haldiram's Sev Bhujia",
    category: 'Snack & Munchies',
    price: 18,
    oldPrice: 24,
    rating: 4.5,
    reviews: 149,
    badge: 'Sotish',
    badgeVariant: 'destructive' as const,
    image: '/images/products/product-img-1.jpg',
  },
  {
    id: 2,
    title: 'NutriChoice Digestive',
    category: 'Bakery & Biscuits',
    price: 24,
    oldPrice: null,
    rating: 4.5,
    reviews: 25,
    badge: '14%',
    badgeVariant: 'default' as const,
    image: '/images/products/product-img-2.jpg',
  },
  {
    id: 3,
    title: 'Cadbury 5 Star Chocolate',
    category: 'Bakery & Biscuits',
    price: 32,
    oldPrice: 35,
    rating: 5,
    reviews: 469,
    badge: null,
    image: '/images/products/product-img-3.jpg',
  },
  {
    id: 4,
    title: 'Piyozli kartoshka',
    category: 'Snack & Munchies',
    price: 3,
    oldPrice: 5,
    rating: 3.5,
    reviews: 456,
    badge: 'Hot',
    badgeVariant: 'destructive' as const,
    image: '/images/products/product-img-4.jpg',
  },
  {
    id: 5,
    title: 'Tez tuzlangan popkorn',
    category: 'Tezkor taom',
    price: 13,
    oldPrice: 18,
    rating: 4.5,
    reviews: 39,
    badge: null,
    image: '/images/products/product-img-5.jpg',
  },
  {
    id: 6,
    title: 'Blueberry yunon yogurti',
    category: 'Sut, non va tuxum',
    price: 18,
    oldPrice: 24,
    rating: 4.5,
    reviews: 189,
    badge: 'Sotish',
    badgeVariant: 'destructive' as const,
    image: '/images/products/product-img-6.jpg',
  },
  {
    id: 7,
    title: 'Britannia Cheese Slices',
    category: 'Sut, non va tuxum',
    price: 24,
    oldPrice: null,
    rating: 5,
    reviews: 345,
    badge: null,
    image: '/images/products/product-img-7.jpg',
  },
  {
    id: 8,
    title: "Kellogg's Original Cereals",
    category: 'Tez tayyorlanadigan taomlar',
    price: 32,
    oldPrice: 35,
    rating: 4,
    reviews: 90,
    badge: null,
    image: '/images/products/product-img-8.jpg',
  },
  {
    id: 9,
    title: 'Shokolad',
    category: 'Snack & Munchies',
    price: 3,
    oldPrice: 5,
    rating: 4.5,
    reviews: 67,
    badge: null,
    image: '/images/products/product-img-9.jpg',
  },
  {
    id: 10,
    title: "Yog'i - 500 g",
    category: 'Sut, non va tuxum',
    price: 13,
    oldPrice: 18,
    rating: 3.5,
    reviews: 89,
    badge: null,
    image: '/images/products/product-img-10.jpg',
  },
];

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : i === Math.ceil(rating) && rating % 1 !== 0
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground">({reviews})</span>
    </div>
  );
}

export default function PopularProducts() {
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: (typeof products)[0]) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl sm:text-2xl font-bold mb-6 sm:mb-8">
            Ommabop mahsulotlar
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border hover:border-green-500 shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="relative aspect-square mb-3 sm:mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <Badge
                        variant={product.badgeVariant}
                        className="absolute top-2 left-2 text-xs sm:text-sm z-10">
                        {product.badge}
                      </Badge>
                    )}
                    {/* Hover tugmalari */}
                    <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 bg-white/90 hover:bg-green-500 hover:text-white"
                        onClick={() => openQuickView(product)}>
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 bg-white/90 hover:bg-green-500 hover:text-white">
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-10 w-10 bg-white/90 hover:bg-green-500 hover:text-white">
                        <ArrowLeftRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {product.category}
                    </p>
                    <h4 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
                      {product.title}
                    </h4>
                    <StarRating
                      rating={product.rating}
                      reviews={product.reviews}
                    />
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold text-primary">
                          ${product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="text-xs sm:text-sm px-3 sm:px-4 bg-green-500 hover:bg-green-600 text-white">
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Qoʻshish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        product={selectedProduct}
      />
    </>
  );
}
