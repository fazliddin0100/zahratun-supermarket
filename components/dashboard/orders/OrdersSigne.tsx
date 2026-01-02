'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const orderData = {
  id: 'FC001',
  status: 'Pending' as 'Success' | 'Pending' | 'Cancel',
  date: 'October 22, 2023',
  total: 90.0,
  customer: {
    name: 'John Alex',
    email: 'anderalex@example.com',
    phone: '+998 99 22123456',
  },
  shipping: {
    name: 'Gerg Harvell',
    address: '568, Suite Ave.',
    city: 'Austrlia, 235153',
    phone: '+91 99999 12345',
  },
  payment: 'Cash on Delivery',
  items: [
    {
      name: "Haldiram's Sev Bhujia",
      price: 18.0,
      quantity: 1,
      image: '/images/products/product-img-1.jpg',
    },
    {
      name: 'NutriChoice Digestive',
      price: 24.0,
      quantity: 1,
      image: '/images/products/product-img-2.jpg',
    },
    {
      name: 'Cadbury 5 Star Chocolate',
      price: 32.0,
      quantity: 1,
      image: '/images/products/product-img-3.jpg',
    },
    {
      name: 'Onion Flavour Potato',
      price: 3.0,
      quantity: 2,
      image: '/images/products/product-img-4.jpg',
    },
  ],
  subtotal: 80.0,
  shippingCost: 10.0,
};

const handleDownload = async () => {
  const toastId = toast.loading('Chek tayyorlanmoqda...');

  try {
    const res = await fetch(`/api/orders/${orderData.id}/invoice`);

    if (!res.ok) {
      throw new Error('Server xatosi');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chek-${orderData.id}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);

    toast.success('Chek muvaffaqiyatli yuklab olindi', {
      id: toastId,
    });
  } catch (error) {
    toast.error('Chekni yuklab bo‘lmadi', {
      id: toastId,
    });
  }
};

export default function OrderSinglePage() {
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotal = subtotal + orderData.shippingCost;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="container py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Buyurtma</h2>
              <nav className="flex items-center text-sm text-slate-600 mt-2">
                <Link href="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-slate-900">Buyurtma</span>
              </nav>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Order Header */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <h3 className="text-xl font-semibold">
                    Buyurtma ID: #{orderData.id}
                  </h3>
                  <Badge
                    variant={
                      orderData.status === 'Success'
                        ? 'default'
                        : orderData.status === 'Pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={
                      orderData.status === 'Success'
                        ? 'bg-green-100 text-green-700'
                        : orderData.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }>
                    {orderData.status}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Select defaultValue={orderData.status}>
                    <SelectTrigger className="w-full sm:w-44">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Success">Muvofaqqiyatli</SelectItem>
                      <SelectItem value="Pending">Kutilmoqda</SelectItem>
                      <SelectItem value="Cancel">Bekor qilindi</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-700">
                      Saqlash
                    </Button>
                    <Button variant="secondary" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Yuklab olish
                    </Button>
                  </div>
                </div>
              </div>

              {/* Customer, Shipping, Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <div>
                  <h6 className="font-semibold mb-3">Mijozlar tafsilotlari</h6>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {orderData.customer.name}
                    <br />
                    {orderData.customer.email}
                    <br />
                    {orderData.customer.phone}
                  </p>
                  <Link
                    href="#"
                    className="text-sm mt-2 inline-block text-green-600 hover:underline">
                    Profilni ko‘rish →
                  </Link>
                </div>

                <div>
                  <h6 className="font-semibold mb-3">
                    Yetkazib berish manzili
                  </h6>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {orderData.shipping.name}
                    <br />
                    {orderData.shipping.address}
                    <br />
                    {orderData.shipping.city}
                    <br />
                    {orderData.shipping.phone}
                  </p>
                </div>

                <div>
                  <h6 className="font-semibold mb-3">Buyurtma tafsilotlari</h6>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Buyurtma ID:{' '}
                    <span className="text-slate-900 font-medium">
                      #{orderData.id}
                    </span>
                    <br />
                    Buyurtma sanasi:{' '}
                    <span className="text-slate-900 font-medium">
                      {orderData.date}
                    </span>
                    <br />
                    Buyurtma jami:{' '}
                    <span className="text-slate-900 font-medium">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products - Mobil uchun card format, Desktop uchun jadval */}
            <div className="p-6">
              {/* Mobil versiya: Card format */}
              <div className="block lg:hidden space-y-4">
                {orderData.items.map((item, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-base">{item.name}</h5>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>Narxi: ${item.price.toFixed(2)}</span>
                          <span>Miqdori: {item.quantity}</span>
                        </div>
                        <div className="mt-2 text-right font-semibold">
                          Jami: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Mobil uchun jami hisob */}
                <Card className="p-4 bg-slate-50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sub Total:</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yetkazib berish:</span>
                      <span className="font-medium">
                        ${orderData.shippingCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span>Grand Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Desktop versiya: Jadval */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                      <TableHead>Mahsulotlar</TableHead>
                      <TableHead>Narxi</TableHead>
                      <TableHead>Miqdori</TableHead>
                      <TableHead className="text-right">Jami</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.items.map((item, i) => (
                      <TableRow key={i} className="hover:bg-gray-100">
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <h5 className="font-medium">{item.name}</h5>
                          </div>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Totals */}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Umumiy narxi:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${subtotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Yetkazib berish narxi:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${orderData.shippingCost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-right text-lg font-semibold">
                        Jami:
                      </TableCell>
                      <TableCell className="text-right text-lg font-semibold">
                        ${grandTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Payment & Notes */}
            <div className="p-6 border-t bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h6 className="font-semibold mb-2">
                    To&apos;lov ma&apos;lumotlari
                  </h6>
                  <p className="text-slate-700">{orderData.payment}</p>
                </div>

                <div>
                  <h6 className="font-semibold mb-3">Izohlar</h6>
                  <Textarea
                    placeholder="Write note for order"
                    rows={4}
                    className="mb-3"
                  />
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                    Izohlarni saqlash
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
