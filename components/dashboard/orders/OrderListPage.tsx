'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, ChevronRight, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

/* ================= TYPES ================= */

type OrderStatus = 'Success' | 'Pending' | 'Cancel';

interface Order {
  id: string;
  customer: string;
  date: string;
  payment: string;
  status: OrderStatus;
  amount: string;
  image: string;
}

/* ================= MOCK BACKEND ================= */

async function fetchOrders(): Promise<Order[]> {
  return [
    {
      id: 'FC#1007',
      customer: 'Jennifer Sullivan',
      date: '01 May 2023',
      payment: 'Paypal',
      status: 'Success',
      amount: '$12.99',
      image: '/images/products/product-img-1.jpg',
    },
    {
      id: 'FC#1006',
      customer: 'Willie Hanson',
      date: '20 April 2023',
      payment: 'COD',
      status: 'Success',
      amount: '$8.19',
      image: '/images/products/product-img-2.jpg',
    },
    {
      id: 'FC#1005',
      customer: 'Dori Stewart',
      date: '11 March 2023',
      payment: 'Paypal',
      status: 'Pending',
      amount: '$8.19',
      image: '/images/products/product-img-3.jpg',
    },
    {
      id: 'FC#1004',
      customer: 'Ezekiel Rogerson',
      date: '09 March 2023',
      payment: 'Stripe',
      status: 'Success',
      amount: '$23.11',
      image: '/images/products/product-img-4.jpg',
    },
    {
      id: 'FC#1002',
      customer: 'Robert Donald',
      date: '12 Feb 2022',
      payment: 'Paypal',
      status: 'Cancel',
      amount: '$56.00',
      image: '/images/products/product-img-6.jpg',
    },
  ];
}

/* ================= PAGE ================= */

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | OrderStatus>('all');
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === 'all' ? true : order.status === status;

      return matchSearch && matchStatus;
    });
  }, [orders, search, status]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page]);

  // O'chirish funksiyasi (demo uchun)
  const handleDelete = (id: string) => {
    // Avval o'chirilishi kerak bo'lgan elementni topib olamiz (qaytarish uchun)
    const orderToDelete = orders.find((o) => o.id === id);

    if (!orderToDelete) return;

    // 1. Ro'yxatdan o'chiramiz
    setOrders((prev) => prev.filter((order) => order.id !== id));

    // 2. Toast chiqaramiz
    toast.error("Buyurtma o'chirildi", {
      description: `${orderToDelete.id} raqamli buyurtma o'chirib tashlandi.`,
      action: {
        label: 'Qaytarish',
        onClick: () => {
          // Agar "Qaytarish" bosilsa, ro'yxatga qayta qo'shamiz
          setOrders((prev) => [...prev, orderToDelete]);
          toast.success('Buyurtma qayta tiklandi');
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <div className="flex-1 flex flex-col">
        <main className="p-4 sm:p-6 lg:p-8">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">
              Buyurtmalar Ro‘yxati
            </h1>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <Link href="/dashboard">Dashboard</Link>
              <ChevronRight size={14} className="mx-2" />
              <span>Orders</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-md">
                  <Input
                    placeholder="Buyurtmani izlash..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />

                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as 'all' | OrderStatus)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barchasi</SelectItem>
                      <SelectItem value="Success">Success</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cancel">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Rasm
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Mijoz
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Sana
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">
                        Summa
                      </TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>

                        {/* Mobil va planshetda rasmni mijoz nomi yonida ko'rsatamiz */}
                        <TableCell className="sm:hidden">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={order.image}
                                alt="product"
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-slate-600">
                                {order.customer}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Desktop uchun alohida ustunlar */}
                        <TableCell className="hidden sm:table-cell">
                          <div className="relative w-10 h-10 rounded overflow-hidden">
                            <Image
                              src={order.image}
                              alt="product"
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        </TableCell>

                        <TableCell className="font-medium hidden sm:table-cell">
                          {order.id}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {order.customer}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {order.date}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              order.status === 'Success'
                                ? 'bg-green-100 text-green-700'
                                : order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }>
                            {order.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-semibold hidden sm:table-cell">
                          {order.amount}
                        </TableCell>

                        {/* Mobil uchun qo'shimcha ma'lumotlar */}
                        <TableCell className="sm:hidden text-right">
                          <div className="text-sm">
                            <div className="font-semibold">{order.amount}</div>
                            <div className="text-slate-500 text-xs">
                              {order.date}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="end">
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start"
                                  onClick={() =>
                                    // Alert o'rniga Sonner toast
                                    toast.success(
                                      `Buyurtma o'zgartirishga tanlandi: ${order.id}`
                                    )
                                  }>
                                  <Edit className="mr-2 h-4 w-4" />
                                  O&apos;zgartirish
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="justify-start text-destructive hover:text-destructive"
                                  onClick={() => {
                                    handleDelete(order.id);
                                    // O'chirish muvaffaqiyatli bo'lganda toast chiqarish
                                    toast.error("Buyurtma o'chirildi");
                                  }}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  O&apos;chirish
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                <p className="text-sm text-slate-500">
                  {filteredOrders.length} ta buyurtma
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}>
                    Oldingi
                  </Button>

                  <Button size="sm" variant="default">
                    {page} / {totalPages || 1}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}>
                    Keyingi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
