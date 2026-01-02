'use client';

import { useState } from 'react';
import { ChevronLeft, Plus, Upload, X } from 'lucide-react';
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
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

type AddCategoryPageProps = {
  onBack: () => void;
};

export default function AddCategoryPage({ onBack }: AddCategoryPageProps) {
  const [categoryName, setCategoryName] = useState('');
  const [slug, setSlug] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>(
    '/icons/default-category.svg'
  ); // default icon
  const [parentCategory, setParentCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'disabled'>('active');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Slug avto-generatsiya (Category Name o'zgarganda)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    );
  };

  // Ikona yuklash
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Faqat rasm fayllari qabul qilinadi');
      return;
    }

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    toast.success('Ikona muvaffaqiyatli yuklandi');
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview('/icons/default-category.svg');
    toast.info('Ikona o‘chirildi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validatsiya (oddiy misol)
    if (!categoryName.trim()) {
      toast.error('Kategoriya nomi kiritilishi shart');
      return;
    }

    toast.success('Yangi kategoriya muvaffaqiyatli yaratildi!');

    // Bu yerda API chaqiruvi bo'ladi:
    // await fetch('/api/categories', { method: 'POST', body: JSON.stringify(formData) })

    console.log({
      categoryName,
      slug,
      iconFile,
      parentCategory,
      date,
      description,
      status,
      metaTitle,
      metaDescription,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Yangi Kategoriya Qo‘shish</h1>
          </div>
          <Button
            className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
            variant="outline"
            onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Kategoriyalarga qaytish
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/dashboard" className="hover:text-gray-900">
                Dashboard
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/dashboard" className="hover:text-gray-900">
                Kategoriyalar
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Yangi Kategoriya</li>
          </ol>
        </nav>

        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            {/* Kategoriya Ikonasi */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-6">Kategoriya Ikonasi</h2>
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="h-32 w-32 bg-gray-50 rounded-2xl overflow-hidden shadow-sm border-2 border-dashed border-gray-200 flex items-center justify-center group hover:border-blue-400 transition-colors cursor-pointer relative">
                    {iconPreview ? (
                      // Agarda rasm tanlangan bo'lsa, preview ko'rsatiladi
                      <Image
                        src={iconPreview}
                        alt="Category icon"
                        width={100}
                        height={100}
                        className="object-contain p-2"
                      />
                    ) : (
                      // Rasm yo'q paytda ko'rinadigan qism (Placeholder)
                      <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-blue-500">
                        <Plus className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Ikona o'zgartirish tugmasi */}
                  <label
                    htmlFor="icon-upload"
                    className="absolute -bottom-3 -right-3 cursor-pointer bg-white rounded-full shadow-xl p-3 hover:bg-gray-50 transition">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <Input
                      id="icon-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="hidden"
                    />
                  </label>

                  {/* Ikona o‘chirish tugmasi (faqat yuklanganda) */}
                  {iconFile && (
                    <Button
                      type="button"
                      onClick={removeIcon}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <p>Tavsiya etilgan o‘lcham: 128x128 px</p>
                  <p>Formatlar: SVG, PNG, JPG</p>
                </div>
              </div>
            </div>

            {/* Kategoriya Ma'lumotlari */}
            <h2 className="text-xl font-semibold mb-6">
              Kategoriya Ma&apos;lumotlari
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="categoryName">Kategoriya Nomi *</Label>
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={handleNameChange}
                  placeholder="Masalan: Snack & Munchies"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="snack-munchies"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="parent">Ota Kategoriya</Label>
                <Select
                  value={parentCategory}
                  onValueChange={setParentCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Tanlang (ixtiyoriy)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Yo‘q</SelectItem>
                    <SelectItem value="dairy">Sut mahsulotlari</SelectItem>
                    <SelectItem value="snacks">Snack & Munchies</SelectItem>
                    <SelectItem value="fruits">Meva-sabzavotlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Yaratilgan Sana</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Tavsif */}
            <div className="mt-8">
              <Label htmlFor="description">Tavsif</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kategoriya haqida qisqacha ma'lumot..."
                rows={6}
                className="mt-2 resize-none"
              />
            </div>

            {/* Status */}
            <div className="mt-8">
              <Label>Status</Label>
              <div className="flex items-center gap-8 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="radio radio-success"
                  />
                  <span className="text-lg">Faol</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="disabled"
                    checked={status === 'disabled'}
                    onChange={() => setStatus('disabled')}
                    className="radio radio-error"
                  />
                  <span className="text-lg">Nofaol</span>
                </label>
              </div>
            </div>

            {/* Meta Data (SEO) */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-6">
                Meta Ma&apos;lumotlar (SEO)
              </h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="metaTitle">Meta Sarlavha</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Sahifa sarlavhasi (60-70 belgi)"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDesc">Meta Tavsif</Label>
                  <Textarea
                    id="metaDesc"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Qisqa tavsif (150-160 belgi)"
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex items-center gap-4 mt-10 pt-6 border-t">
              <Button type="submit" size="lg">
                Kategoriya Yaratish
              </Button>
              <Button type="button" variant="secondary" size="lg">
                Saqlash
              </Button>
            </div>
          </Card>
        </form>
      </main>
    </div>
  );
}
