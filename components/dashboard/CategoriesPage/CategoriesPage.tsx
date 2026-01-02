'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Filter,
  Package,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { IndeterminateCheckbox } from '@/components/dashboard/products/indeterminate-checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

// Agar AddCategoryPage alohida faylda bo'lsa, uni import qiling
import AddCategoryPage from './add-category';

const mockCategories = [
  {
    id: 1,
    name: 'Snack & Munchies',
    icon: '/images/icons/snacks.svg',
    productCount: 12,
    status: 'published',
  },
  {
    id: 2,
    name: 'Bakery & Biscuits',
    icon: '/images/icons/bakery.svg',
    productCount: 8,
    status: 'published',
  },
  {
    id: 3,
    name: 'Baby Care',
    icon: '/images/icons/baby-food.svg',
    productCount: 32,
    status: 'published',
  },
  {
    id: 4,
    name: 'Cold Drinks',
    icon: '/images/icons/wine.svg',
    productCount: 34,
    status: 'published',
  },
  {
    id: 5,
    name: 'Toiletries',
    icon: '/images/icons/toiletries.svg',
    productCount: 23,
    status: 'unpublished',
  },
];

type StatusFilter = 'all' | 'published' | 'unpublished';

export default function CategoriesPage() {
  // 1. Sahifalararo o'tish holati
  const [showAddPage, setShowAddPage] = useState(false);

  const [categories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const itemsPerPage = 6;

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || cat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage]);

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
    );
  };

  const isAllSelected =
    paginatedCategories.length > 0 &&
    paginatedCategories.every((c) => selectedIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        {!showAddPage ? (
          // --- KATEGORIYALAR RO'YXATI ---
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="pb-12">
            {/* Sticky Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-4 py-4 lg:px-8">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                  </Link>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                      Kategoriyalar
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      Barcha turlarni boshqarish
                    </p>
                  </div>
                </div>

                {/* TUGMA: showAddPage ni true qiladi */}
                <Button
                  onClick={() => setShowAddPage(true)}
                  className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 rounded-xl py-6 sm:py-2">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">
                    Yangi Kategoriya
                  </span>
                </Button>
              </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
              {/* Filters */}
              <Card className="p-4 border-none shadow-sm bg-white rounded-2xl">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Qidiruv..."
                      className="pl-10 h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <Select
                      value={statusFilter}
                      onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                      <SelectTrigger className="w-[140px] h-11 rounded-xl border-gray-100 bg-gray-50/50">
                        <Filter className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                        <SelectItem value="all">Barchasi</SelectItem>
                        <SelectItem value="published">Faol</SelectItem>
                        <SelectItem value="unpublished">Nofaol</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* List */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="p-4 w-12 text-center">
                          <IndeterminateCheckbox
                            checked={isAllSelected}
                            onCheckedChange={() => {}}
                          />
                        </th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                          Kategoriya
                        </th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                          Mahsulotlar
                        </th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="p-4 w-20"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedCategories.map((cat, idx) => (
                        <motion.tr
                          key={cat.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group hover:bg-blue-50/30 transition-colors">
                          <td className="p-4 text-center">
                            <Checkbox
                              checked={selectedIds.includes(cat.id)}
                              onCheckedChange={(c) =>
                                handleSelectOne(cat.id, !!c)
                              }
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                                <Image
                                  src={cat.icon}
                                  alt=""
                                  width={32}
                                  height={32}
                                />
                              </div>
                              <span className="font-semibold text-gray-700">
                                {cat.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Package className="h-4 w-4 text-blue-400" />
                              <span>{cat.productCount} ta</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`rounded-lg px-3 py-1 ${
                                cat.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-rose-50 text-rose-600 border-rose-100'
                              }`}
                              variant="outline">
                              {cat.status === 'published' ? 'Faol' : 'Nofaol'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <ActionMenu id={cat.id} />
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                  {paginatedCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-4 flex items-center gap-4 active:bg-gray-50">
                      <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center p-2">
                        <Image src={cat.icon} alt="" width={40} height={40} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Package className="h-3 w-3" /> {cat.productCount}
                          </span>
                        </div>
                      </div>
                      <ActionMenu id={cat.id} />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </motion.div>
        ) : (
          // --- QO'SHISH SAHIFASI ---
          <motion.div
            key="add"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}>
            <AddCategoryPage onBack={() => setShowAddPage(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionMenu({ id }: { id: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-2xl p-2 border-gray-100 shadow-2xl">
        <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer">
          <Edit className="h-4 w-4 mr-3 text-blue-500" /> Tahrirlash
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-red-600">
          <Trash2 className="h-4 w-4 mr-3" /> O&apos;chirish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
