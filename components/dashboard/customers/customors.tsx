'use client';

import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MoreVertical,
  Pencil,
  Trash2,
  Search,
  UserPlus,
  Phone,
  Mail,
  Save,
  ArrowLeft,
  Upload,
  X,
  User,
} from 'lucide-react';
import Link from 'next/link';

// --- INTERFEYS VA MA'LUMOTLAR ---
interface Customer {
  id: number;
  name: string;
  email: string;
  date: string;
  phone: string;
  spent: string;
  status: string;
  avatar: string;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Bonnie Howe',
    email: 'bonniehowe@gmail.com',
    date: '17-May, 2023 15:18',
    phone: '+998 90 123 45 67',
    spent: '$49.00',
    status: 'Aktiv',
    avatar: '/images/avatar/avatar-1.jpg',
  },
  {
    id: 2,
    name: 'Judy Nelson',
    email: 'judynelson@gmail.com',
    date: '27-Aprel, 2023 14:47',
    phone: '435-239-6436',
    spent: '$490.00',
    status: 'Aktiv',
    avatar: '/images/avatar/avatar-2.jpg',
  },
];

// --- ASOSIY KOMPONENT ---
export default function CustomersPage() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Yangi qo'shilgan: tahrir rejimi uchun joriy mijozni saqlash
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Tanlangan rasm fayli va preview URL uchun holat
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Yashirin inputga murojaat qilish uchun Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tugma bosilganda yashirin inputni chertish
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Fayl tanlanganda ishlaydigan funksiya
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Fayl hajmini tekshirish (1MB)
      if (file.size > 1024 * 1024) {
        alert('Rasm hajmi 1MB dan oshmasligi kerak!');
        return;
      }

      // Rasmni vaqtincha ko'rish uchun URL yaratish
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // Rasmni o'chirish
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Inputni tozalash
    }
  };

  // Yangi mijoz qo'shish tugmasi uchun
  const handleAddNew = () => {
    setCurrentCustomer(null);
    setSelectedImage(null); // yangi forma bo'sh bo'lsin
    setView('form');
  };

  // Tahrirlash tugmasi uchun
  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setSelectedImage(customer.avatar); // mavjud rasmni ko'rsatish
    setView('form');
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {view === 'list' ? (
        <div className="animate-in fade-in duration-500">
          {/* Header Qismi */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Mijozlar
              </h2>
              <nav className="flex mt-1 text-sm text-muted-foreground">
                <Link
                  href="/dashboard"
                  className="hover:text-primary transition-colors">
                  Boshqaruv paneli
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground font-medium">
                  Mijozlar ro&apos;yxati
                </span>
              </nav>
            </div>
            <Button
              onClick={handleAddNew}
              className="w-full sm:w-auto gap-2 shadow-sm bg-green-600 hover:bg-green-700 text-white transition-all active:scale-95">
              <UserPlus className="h-4 w-4" />
              Yangi mijoz qo&apos;shish
            </Button>
          </div>

          {/* Jadval Kartochkasi */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-4 bg-white">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Mijozlarni qidirish..."
                  className="pl-10 bg-muted/30 border-none focus-visible:ring-green-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-12 pl-4">
                        <Checkbox id="checkAll" />
                      </TableHead>
                      <TableHead className="font-semibold">Mijoz</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">
                        Xarid sanasi
                      </TableHead>
                      <TableHead className="hidden sm:table-cell font-semibold">
                        Telefon
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Jami sarf
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="group hover:bg-slate-50/80 transition-colors">
                        <TableCell className="pl-4">
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <Sheet>
                            <SheetTrigger asChild>
                              <button className="flex items-center gap-3 text-left outline-none group">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                  <AvatarImage src={customer.avatar} />
                                  <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                                    {customer.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700 group-hover:text-green-600 transition-colors">
                                    {customer.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground md:hidden">
                                    {customer.email}
                                  </span>
                                </div>
                              </button>
                            </SheetTrigger>
                            <CustomerDetailSheet customer={customer} />
                          </Sheet>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-slate-600">
                          {customer.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-slate-500">
                          {customer.date}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-medium text-slate-600">
                          {customer.phone}
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {customer.spent}
                        </TableCell>
                        <TableCell className="pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-slate-200">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => handleEdit(customer)}>
                                <Pencil className="mr-2 h-4 w-4 text-blue-500" />{' '}
                                Tahrirlash
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />{' '}
                                O&apos;chirish
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
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4 border-t bg-slate-50/30">
                <span className="text-sm text-muted-foreground">
                  Jami {customers.length} tadan 1-2 ko&apos;rsatilyapti
                </span>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right fade-in duration-1000 max-w-4xl mx-auto">
          {/* Form Header – yangi yoki tahrir rejimiga qarab o'zgaradi */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('list')}
              className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">
                {currentCustomer
                  ? 'Mijozni tahrirlash'
                  : 'Yangi mijoz qo&apos;shish'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentCustomer
                  ? "Mijoz ma'lumotlarini o'zgartiring va saqlang."
                  : "Ma'lumotlarni to'ldirib mijozni bazaga qo'shing."}
              </p>
            </div>
          </div>

          <Card className="border-none shadow-xl">
            <CardContent className="p-8 space-y-8">
              {/* Rasm Yuklash Section */}
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  {/* Rasm Preview qismi */}
                  <div className="relative group">
                    <Avatar className="h-28 w-28 border-4 border-slate-50 shadow-inner overflow-hidden">
                      {selectedImage ? (
                        <AvatarImage
                          src={selectedImage}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-slate-100">
                          <User className="h-10 w-10 text-slate-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* Agar rasm bo'lsa, ustida o'chirish tugmasi chiqadi */}
                    {selectedImage && (
                      <Button
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="text-center md:text-left space-y-2">
                    <div className="flex gap-2 justify-center md:justify-start">
                      <Input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                      />

                      <Button
                        type="button"
                        size="sm"
                        className="bg-slate-900"
                        onClick={handleButtonClick}>
                        <Upload className="h-4 w-4 mr-2" />
                        Rasmni tanlash
                      </Button>

                      {selectedImage && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleRemoveImage}
                          className="text-destructive border-destructive/20 hover:bg-destructive/10">
                          O&apos;chirish
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Tavsiya etiladi: JPG, PNG (Max: 1MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Maydonlari – defaultValue bilan to'ldiriladi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    F.I.SH <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Mijoz to'liq ism-sharifi"
                    defaultValue={currentCustomer?.name || ''}
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Email Manzili <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
                    defaultValue={currentCustomer?.email || ''}
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Telefon Raqami
                  </label>
                  <Input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    defaultValue={currentCustomer?.phone || ''}
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tug&apos;ilgan Sana
                  </label>
                  <Input
                    type="date"
                    defaultValue={currentCustomer?.date || ''} // agar kerak bo'lsa boshqa field qo'shishingiz mumkin
                    className="h-11 focus-visible:ring-green-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setView('list')}
                  className="h-11 px-8">
                  Bekor qilish
                </Button>
                <Button className="h-11 px-8 bg-green-600 hover:bg-green-700 shadow-md shadow-green-200 gap-2">
                  <Save className="h-4 w-4" />
                  {currentCustomer
                    ? "O'zgartirishlarni saqlash"
                    : 'Mijozni saqlash'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- DETALLAR PANELI (SHEET) ---
function CustomerDetailSheet({ customer }: { customer: Customer }) {
  return (
    <SheetContent className="w-full sm:max-w-lg overflow-y-auto border-l-0 shadow-2xl p-4 sm:p-6">
      <SheetHeader className="border-b pb-4 mb-6">
        <SheetTitle className="text-2xl font-bold text-slate-800">
          Mijoz Tafsilotlari
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-slate-100">
            <AvatarImage src={customer.avatar} />
            <AvatarFallback className="text-2xl font-bold bg-green-50 text-green-600">
              {customer.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {customer.name}
              </h3>
              <Badge className="bg-green-100 text-green-700 border-none px-3">
                Aktiv
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              ID: #CU-2024-{customer.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <Mail className="h-4 w-4 text-green-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Email
            </p>
            <p className="text-sm font-semibold truncate text-slate-800">
              {customer.email}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
            <Phone className="h-4 w-4 text-green-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Telefon
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {customer.phone}
            </p>
          </div>
        </div>

        <Card className="border-none bg-green-600 text-white shadow-lg shadow-green-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-80 mb-1">
                  Xaridlar
                </p>
                <p className="text-xl font-bold">12 ta</p>
              </div>
              <div className="border-x border-white/20">
                <p className="text-[10px] uppercase font-bold opacity-80 mb-1">
                  Sarflandi
                </p>
                <p className="text-xl font-bold">{customer.spent}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-80 mb-1">
                  Reyting
                </p>
                <p className="text-xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 pt-4">
          <h4 className="font-bold text-slate-800 border-b pb-2">
            So&apos;nggi buyurtmalar
          </h4>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
                  #
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Order #ORD-202{i}
                  </p>
                  <p className="text-xs text-muted-foreground">12-Iyul, 2025</p>
                </div>
              </div>
              <p className="font-bold text-green-600">$45.00</p>
            </div>
          ))}
          <Button variant="link" className="w-full text-green-600 font-bold">
            Barchasini ko&apos;rish
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
