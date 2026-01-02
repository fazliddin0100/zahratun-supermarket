'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Review {
  id: number;
  product: string;
  name: string;
  comment: string;
  rating: number;
  date: string;
}

const reviewsData: Review[] = [
  {
    id: 1,
    product: "Haldiram's Sev Bhujia",
    name: 'Barry McKenzie',
    comment: 'Nice & fresh oranges with value for money..',
    rating: 4,
    date: '23 Nov, 2022',
  },
  {
    id: 2,
    product: 'NutriChoice Digestive',
    name: 'Dale Jenkins',
    comment: 'Nice product 👌 quality 👌...',
    rating: 4,
    date: '23 Nov, 2022',
  },
  {
    id: 3,
    product: 'Cadbury 5 Star Chocolate',
    name: 'Michael Phillips',
    comment: 'Good quality product delivered...',
    rating: 5,
    date: '23 Nov, 2022',
  },
  {
    id: 4,
    product: 'Onion Flavour Potato',
    name: 'James Parker',
    comment: 'Excellent Quality by an Indian company..',
    rating: 5,
    date: '23 Nov, 2022',
  },
  {
    id: 5,
    product: 'Salted Instant Popcorn',
    name: 'William Hansen',
    comment: 'Very expensive. Cheaper at local stores...',
    rating: 4,
    date: '23 Nov, 2022',
  },
  {
    id: 6,
    product: 'Blueberry Greek Yogurt',
    name: 'Helen Speller',
    comment: 'Etiam in felis eget eros dictum',
    rating: 5,
    date: '23 Nov, 2022',
  },
  {
    id: 7,
    product: 'Britannia Cheese Slices',
    name: 'Larry Anderson',
    comment: 'is good but had to wait for a late delivery.',
    rating: 4,
    date: '23 Nov, 2022',
  },
  {
    id: 8,
    product: "Kellogg's Original Cereals",
    name: 'William McCulloch',
    comment: 'Very expensive. Cheaper at local stores',
    rating: 5,
    date: '23 Nov, 2022',
  },
  {
    id: 9,
    product: 'Slurrp Millet Chocolate',
    name: 'Louise Brown',
    comment: 'My toddler loved the flavor and enjoys...',
    rating: 2,
    date: '23 Nov, 2022',
  },
  {
    id: 10,
    product: 'Amul Butter - 500 g',
    name: 'John Meyer',
    comment: 'Good Product but packaging needs...',
    rating: 3,
    date: '23 Nov, 2022',
  },
];

// YANGI: InteractiveStarRating komponenti tashqariga chiqarildi
function InteractiveStarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-2 sm:p-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          type="button"
          size="sm"
          onClick={() => onChange(star)}
          className="p-1 sm:p-2 transition-transform hover:scale-110 hover:bg-gray-100 bg-transparent h-auto w-auto">
          <svg
            className={`w-5 h-5 sm:w-6 sm:h-6 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        </Button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');

  // YANGI: Tahrirlash uchun state'lar
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Filtrlash
  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch =
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      selectedRating === 'all' || review.rating === parseInt(selectedRating);
    return matchesSearch && matchesRating;
  });

  // Star rating komponenti (jadval uchun)
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        ))}
      </div>
    );
  };

  // YANGI: Tahrirlash tugmasi bosilganda
  const handleEdit = (review: Review) => {
    setEditingReview({ ...review }); // nusxa olish muhim
    setIsEditSheetOpen(true);
  };

  // YANGI: Saqlash tugmasi
  const handleSave = () => {
    if (editingReview) {
      console.log('Yangilangan sharh:', editingReview);
      // Bu yerda API ga PUT so'rov yuborishingiz mumkin
    }
    setIsEditSheetOpen(false);
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Sharhlar
        </h2>
        <nav className="flex mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors">
            Boshqaruv paneli
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-foreground font-medium">Sharhlar</span>
        </nav>
      </div>

      {/* Main Card */}
      <Card className="border-none shadow-sm sm:shadow-lg">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="relative w-full max-w-sm">
              <Input
                type="search"
                placeholder="Sharhlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-10 text-sm"
              />
              <svg
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                />
              </svg>
            </div>

            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full lg:w-56 h-10 text-sm">
                <SelectValue placeholder="Reyting bo'yicha filtr" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha reytinglar</SelectItem>
                <SelectItem value="5">5 yulduz</SelectItem>
                <SelectItem value="4">4 yulduz</SelectItem>
                <SelectItem value="3">3 yulduz</SelectItem>
                <SelectItem value="2">2 yulduz</SelectItem>
                <SelectItem value="1">1 yulduz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* MOBIL: Kartochka ko'rinishi */}
          <div className="md:hidden space-y-3 p-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <Checkbox className="mt-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        O&apos;chirish
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(review)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Tahrirlash
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <Link
                    href="#"
                    className="text-primary hover:underline font-semibold text-sm block">
                    {review.product}
                  </Link>
                  <p className="text-sm font-medium text-slate-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {review.comment}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP: Jadval ko'rinishi */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm">Mahsulot</TableHead>
                  <TableHead className="text-xs sm:text-sm">Ism</TableHead>
                  <TableHead className="text-xs sm:text-sm">Sharh</TableHead>
                  <TableHead className="text-xs sm:text-sm">Reyting</TableHead>
                  <TableHead className="text-xs sm:text-sm">Sana</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link
                        href="#"
                        className="text-primary hover:underline text-sm">
                        {review.product}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{review.name}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-xs sm:text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground">
                      {review.date}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="p-2 rounded-full hover:bg-slate-200 bg-transparent text-black transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            O&apos;chirish
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(review)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col xs:flex-row justify-between items-center p-4 sm:p-6 border-t gap-3 sm:gap-4 bg-slate-50/50">
            <span className="text-xs sm:text-sm text-muted-foreground text-center xs:text-left">
              Jami {filteredReviews.length} tadan 1-10 ko&apos;rsatilmoqda
            </span>
            <Pagination className="w-full xs:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="h-8 w-24 text-xs" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="h-8 w-8 text-xs">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="h-8 w-8 text-xs">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="h-8 w-24 text-xs" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Chapdan ochiladigan tahrirlash Sheet - MOBIL uchun full height */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent
          side="right"
          className="w-[95vw] sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-none overflow-y-auto p-4 sm:p-6">
          <SheetHeader className="border-b pb-4 mb-6">
            <SheetTitle className="text-lg sm:text-xl sm:text-2xl">
              Sharhni tahrirlash
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm">
              Sharh matni va reytingini o&apos;zgartirishingiz mumkin.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Mahsulot nomi</Label>
              <Input
                value={editingReview?.product || ''}
                disabled
                className="h-10 text-sm bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Mijoz ismi</Label>
              <Input
                value={editingReview?.name || ''}
                disabled
                className="h-10 text-sm bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Sharh matni</Label>
              <Textarea
                value={editingReview?.comment || ''}
                onChange={(e) =>
                  setEditingReview((prev) =>
                    prev ? { ...prev, comment: e.target.value } : null
                  )
                }
                rows={4}
                className="h-28 sm:h-auto resize-none text-sm"
                placeholder="Sharh matnini kiriting..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Reyting</Label>
              {editingReview && (
                <InteractiveStarRating
                  rating={editingReview.rating}
                  onChange={(value) =>
                    setEditingReview((prev) =>
                      prev ? { ...prev, rating: value } : null
                    )
                  }
                />
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Yozilgan sana</Label>
              <Input
                value={editingReview?.date || ''}
                disabled
                className="h-10 text-sm bg-muted"
              />
            </div>
          </div>

          <SheetFooter className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsEditSheetOpen(false)}
              className="h-10 px-6 text-xs sm:text-sm w-full sm:w-auto">
              Bekor qilish
            </Button>
            <Button
              onClick={handleSave}
              className="h-10 px-6 text-xs sm:text-sm w-full sm:w-auto bg-green-600 hover:bg-green-700">
              Saqlash
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
