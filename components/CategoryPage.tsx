'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, Heart, ArrowLeftRight, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import QuickViewModal from '@/components/QuickViewModal';
import Header from '@/app/main/page';

// IXCHAM MAHSULOTLAR + KATEGORIYA MAPPING
const PRODUCTS_DATA = [
  {
    id: 1,
    title: 'Xaldiramning Sev Bhujia',
    category: 'Snack & Munchies',
    price: 18,
    oldPrice: 24,
    rating: 4.5,
    reviews: 149,
    image: '/images/products/product-img-1.jpg',
    badge: 'Sotuvda',
  },
  {
    id: 2,
    title: 'NutriChoice',
    category: 'Non va pechene',
    price: 24,
    rating: 4.5,
    reviews: 25,
    image: '/images/products/product-img-2.jpg',
    discount: '14%',
  },
  {
    id: 3,
    title: 'Cadbury 5 yulduzli shokolad',
    category: 'Bakery & Biscuits',
    price: 32,
    oldPrice: 35,
    rating: 5,
    reviews: 469,
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
    image: '/images/products/product-img-4.jpg',
    badge: 'Sotuvda',
  },
  {
    id: 5,
    title: 'Tez tuzlangan popkorn',
    category: 'Tezkor taom',
    price: 13,
    oldPrice: 18,
    rating: 4.5,
    reviews: 39,
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
    image: '/images/products/product-img-6.jpg',
    badge: 'Sotuvda',
  },
  {
    id: 7,
    title: "Britannia pishloq bo'laklari",
    category: 'Sut, non va tuxum',
    price: 24,
    rating: 5,
    reviews: 345,
    image: '/images/products/product-img-7.jpg',
  },
  {
    id: 8,
    title: 'Kelloggning original donlari',
    category: 'Instant Food',
    price: 32,
    oldPrice: 35,
    rating: 4.5,
    reviews: 90,
    image: '/images/products/product-img-8.jpg',
  },
  {
    id: 9,
    title: 'Slurrp tariq shokoladi',
    category: 'Snack & Munchies',
    price: 3,
    oldPrice: 5,
    rating: 4.5,
    reviews: 67,
    image: '/images/products/product-img-9.jpg',
  },
  {
    id: 10,
    title: "Amul yog'i - 500 g",
    category: 'Sut, non va tuxum',
    price: 13,
    oldPrice: 18,
    rating: 3.5,
    reviews: 89,
    image: '/images/products/product-img-10.jpg',
  },
];

const CATEGORY_FILTERS: Record<string, string[]> = {
  'sut-non-va-tuxum': ['Sut, non va tuxum'],
  'aperatiflar-va-munchies': [
    'Snack & Munchies',
    'Tezkor taom',
    'Bakery & Biscuits',
  ],
  'meva-va-sabzavotlar': ['Meva va sabzavotlar'],
  ichimliklar: ['Ichimliklar'],
  'gosht-va-baliq': ['Go‘sht va baliq'],
};

const STORES = ['Oziq-ovqat', 'DealShare', 'DMart', 'Blinkit', 'BigBasket'];
const RATINGS = [5, 4, 3];

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  discount?: string;
}

interface Props {
  categoryTitle: string;
  categorySlug: string;
}

// Stars component
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : i < rating
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function CategoryPage({ categoryTitle, categorySlug }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // FILTRLAR UCHUN STATE
  const [selectedStores, setSelectedStores] = useState<string[]>([
    'Oziq-ovqat',
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([4]);

  // Kategoriya bo'yicha asosiy filtr
  const categoryFiltered = useMemo(() => {
    const filters = CATEGORY_FILTERS[categorySlug] || ['Sut, non va tuxum'];
    return PRODUCTS_DATA.filter((p) => filters.includes(p.category));
  }, [categorySlug]);

  // TO‘LIQ FILTRLANGAN MAHSULOTLAR
  const products = useMemo(() => {
    return categoryFiltered.filter((product) => {
      // Do‘kon filtri (hozircha barcha mahsulotlar bitta do‘konga tegishli deb hisoblaymiz)
      const storeMatch =
        selectedStores.length === 0 || selectedStores.includes('Oziq-ovqat');

      // Narx diapazoni filtri
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Reyting filtri
      const ratingMatch =
        selectedRatings.length === 0 ||
        selectedRatings.some((minRating) => product.rating >= minRating);

      return storeMatch && priceMatch && ratingMatch;
    });
  }, [categoryFiltered, selectedStores, priceRange, selectedRatings]);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Header />

          {/* Breadcrumb */}
          <nav className="text-sm mb-8">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-green-600">
                  Uy
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-500 hover:text-green-600">
                  Do`kon
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium">{categoryTitle}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block">
              <SidebarContent
                category={categoryTitle}
                stores={STORES}
                ratings={RATINGS}
                selectedStores={selectedStores}
                setSelectedStores={setSelectedStores}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
              />
            </aside>

            {/* Main */}
            <section className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h1 className="text-3xl font-bold text-gray-900">
                  {categoryTitle}
                </h1>
              </div>

              {/* Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-700">
                  <span className="font-bold text-2xl text-black">
                    {products.length}
                  </span>{' '}
                  ta mahsulot topildi
                </p>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrlar
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SheetHeader className="p-6 border-b">
                        <SheetTitle className="text-xl">Filtrlar</SheetTitle>
                      </SheetHeader>
                      <SidebarContent
                        category={categoryTitle}
                        stores={STORES}
                        ratings={RATINGS}
                        selectedStores={selectedStores}
                        setSelectedStores={setSelectedStores}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                      />
                    </SheetContent>
                  </Sheet>

                  <Select defaultValue="50">
                    <SelectTrigger className="w-35">
                      <SelectValue />
                      Ko`rsatish
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 50].map((n) => (
                        <SelectItem key={n} value={n + ''}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-56">
                      <SelectValue />
                      Saralash
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">
                        Tavsiya etilgan
                      </SelectItem>
                      <SelectItem value="low">Narxi: pastdan</SelectItem>
                      <SelectItem value="high">Narxi: yuqoridan</SelectItem>
                      <SelectItem value="rating">Reyting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.length ? (
                  products.map((p) => (
                    <Card
                      key={p.id}
                      className="group overflow-hidden hover:shadow-xl transition-all border-0 bg-white">
                      <CardContent className="p-4 relative">
                        <div className="relative mb-4 h-48">
                          {p.badge && (
                            <Badge className="absolute top-2 left-2 z-20 bg-red-500 text-xs">
                              {p.badge}
                            </Badge>
                          )}
                          {p.discount && (
                            <Badge className="absolute top-2 right-2 z-20 bg-green-500 text-xs">
                              {p.discount}
                            </Badge>
                          )}

                          <Image
                            src={p.image}
                            alt={p.title}
                            width={300}
                            height={250}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />

                          <div className="absolute inset-0 opacity-0 lg:group-hover:opacity-100 bg-black/40 backdrop-blur-sm rounded-xl flex lg:items-center lg:justify-center gap-2 p-2 lg:p-0 transition-all duration-300 lg:translate-y-full lg:group-hover:translate-y-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg"
                              onClick={() => openQuickView(p)}>
                              <Eye className="w-5 h-5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg">
                              <Heart className="w-5 h-5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 bg-white/90 hover:bg-white shadow-lg">
                              <ArrowLeftRight className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-green-600 font-bold uppercase tracking-wide mb-1">
                          {p.category}
                        </p>
                        <h3 className="font-bold text-sm mb-3 line-clamp-2 leading-tight">
                          {p.title}
                        </h3>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Stars rating={p.rating} />
                            <span className="text-xs text-gray-500">
                              ({p.reviews})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-green-600 block">
                              ${p.price}
                            </span>
                            {p.oldPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ${p.oldPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg h-11 rounded-xl">
                          <Plus className="w-5 h-5 mr-2" /> Savatga
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-xl text-gray-500 mb-4">
                      Bu kategoriyada mahsulotlar yoʻq 😔
                    </p>
                    <Link href="/category/aperatiflar-va-munchies">
                      <Button>Boshqa kategoriyalarga oʻtish</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center">
                <div className="flex bg-white rounded-full shadow-lg p-1">
                  {[
                    { icon: '←', disabled: true },
                    { label: '1', active: true },
                    { label: '2' },
                    { label: '...' },
                    { label: '12' },
                    { icon: '→' },
                  ].map((item, i) => (
                    <Button
                      key={i}
                      variant={item.active ? 'default' : 'ghost'}
                      className="mx-1 h-12 w-12 rounded-full"
                      disabled={item.disabled}>
                      {item.icon || item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <QuickViewModal
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        product={selectedProduct}
      />
    </>
  );
}

// SIDEBAR CONTENT - ENDI FILTRLAR ISHLAYDI
function SidebarContent({
  category,
  stores,
  ratings,
  selectedStores,
  setSelectedStores,
  priceRange,
  setPriceRange,
  selectedRatings,
  setSelectedRatings,
}: {
  category: string;
  stores: string[];
  ratings: number[];
  selectedStores: string[];
  setSelectedStores: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedRatings: number[];
  setSelectedRatings: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const handleStoreChange = (store: string, checked: boolean) => {
    if (checked) {
      setSelectedStores((prev) => [...prev, store]);
    } else {
      setSelectedStores((prev) => prev.filter((s) => s !== store));
    }
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setSelectedRatings((prev) => [...prev, rating]);
    } else {
      setSelectedRatings((prev) => prev.filter((r) => r !== rating));
    }
  };

  return (
    <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Kategoriyalar</h3>
        <div className="text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl">
          {category} (aktiv)
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Do‘konlar</h3>
        <div className="space-y-3">
          {stores.map((store) => (
            <div
              key={store}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
              <Checkbox
                id={store}
                checked={selectedStores.includes(store)}
                onCheckedChange={(checked) =>
                  handleStoreChange(store, checked as boolean)
                }
              />
              <label
                htmlFor={store}
                className="text-sm font-medium cursor-pointer">
                {store}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Narx diapazoni</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
          <div className="flex justify-between text-sm text-gray-700 mb-3">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer accent-green-600"
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer accent-green-600 mt-3"
          />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Reyting</h3>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <div
              key={rating}
              className="flex items-center space-x-3 p-3 hover:bg-yellow-50 rounded-xl cursor-pointer">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) =>
                  handleRatingChange(rating, checked as boolean)
                }
              />
              <label
                htmlFor={`rating-${rating}`}
                className="flex items-center gap-1 text-sm font-medium cursor-pointer">
                <Stars rating={rating} />
                <span>& yuqori</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src="/images/banner/assortment-citrus-fruits.png"
          alt="Banner"
          width={320}
          height={240}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
          <h4 className="text-xl font-bold mb-2">Yangi uzilgan mevalar</h4>
          <p className="text-sm mb-4 opacity-90">25% gacha chegirma!</p>
          <Button className="w-full lg:w-auto bg-green-500 hover:bg-green-600 rounded-xl font-semibold">
            Hozir xarid →
          </Button>
        </div>
      </div>
    </div>
  );
}
