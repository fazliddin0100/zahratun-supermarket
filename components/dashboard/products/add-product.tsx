'use client';

import { useState } from 'react';
import { ChevronLeft, Link, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AddProductPage() {
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');

  // Oddiy file input orqali rasm tanlash
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (newFiles.length !== files.length) {
      toast.error('Faqat rasm fayllari qabul qilinadi');
    }

    setImages((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} ta rasm qo‘shildi`);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.info('Rasm o‘chirildi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mahsulot muvaffaqiyatli yaratildi!');
    // Bu yerda formani API ga jo‘natish mumkin
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h3 className="text-2xl font-bold">Yangi Mahsulot Qo‘shish</h3>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex items-center gap-2">
            <li>Dashboard</li>
            <li className="text-gray-400">/</li>
            <li>Mahsulotlar</li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Yangi Mahsulot</li>
          </ol>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chap qism - Asosiy ma'lumotlar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Mahsulot Ma‘lumotlari
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Nomi</Label>
                    <Input
                      id="title"
                      placeholder="Mahsulot nomi"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategoriya</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dairy">
                          Sut mahsulotlari, non va tuxum
                        </SelectItem>
                        <SelectItem value="snacks">Snack & Munchies</SelectItem>
                        <SelectItem value="fruits">
                          Meva va sabzavotlar
                        </SelectItem>
                        <SelectItem value="chocolates">Shokoladlar</SelectItem>
                        <SelectItem value="beverages">Ichimliklar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weight">Og‘irligi</Label>
                    <Input
                      id="weight"
                      placeholder="Masalan: 500g, 1kg"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="units">Birliklar soni</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Birlikni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rasm yuklash - react-dropzone'siz */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Mahsulot Rasmlari
                  </h3>

                  <label
                    htmlFor="image-upload"
                    className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-gray-400 transition">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Rasm yuklash uchun bosing</p>
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG, WEBP • Maksimal 5MB
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Yuklangan rasmlar preview */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 mb-3">
                        {images.length} ta rasm tanlandi
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {images.map((file, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`Rasm ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-32 object-cover rounded-lg shadow-sm"
                            />
                            <Button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition">
                              <X className="h-4 w-4" />
                            </Button>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {file.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Oddiy textarea tavsif uchun */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Mahsulot Tavsifi</h3>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mahsulot haqida batafsil ma'lumot kiriting..."
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </Card>
            </div>

            {/* O‘ng qism - Qo‘shimcha sozlamalar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">Holati</h3>

                <div className="flex items-center justify-between mb-6">
                  <Label htmlFor="inStock" className="cursor-pointer">
                    Omborda mavjud
                  </Label>
                  <Switch id="inStock" defaultChecked />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">Mahsulot Kodi</Label>
                    <Input
                      id="code"
                      placeholder="Masalan: PROD-001"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Masalan: SKU123456"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Status</Label>
                    <div className="flex gap-6 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          defaultChecked
                          className="radio radio-success"
                        />
                        <span>Faol</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="disabled"
                          className="radio radio-error"
                        />
                        <span>Nofaol</span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">Narxlar</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="regularPrice">Oddiy narx</Label>
                    <Input
                      id="regularPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Aksiya narxi</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">
                  Meta Ma‘lumotlar (SEO)
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Sarlavha</Label>
                    <Input
                      id="metaTitle"
                      placeholder="Sahifa sarlavhasi"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDesc">Meta Tavsif</Label>
                    <Textarea
                      id="metaDesc"
                      placeholder="Qisqa tavsif (160 belgigacha)"
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              <Button type="submit" size="lg" className="w-full">
                Mahsulot Yaratish
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
