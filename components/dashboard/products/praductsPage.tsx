// components/dashboard/products/page.tsx
'use client'; 

import ProductsTable from './ProductsTable';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react'; 
import { useState } from 'react';
import AddProductPage from './add-product';

export default function ProductsPage() {
  const [showAddPage, setShowAddPage] = useState(false);

  // 1. Agar showAddPage true bo'lsa, faqat AddProductPage ni ko'rsatamiz
  if (showAddPage) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => setShowAddPage(false)}
          className="mb-4">
          <ArrowLeft className="mr-2 size-4" /> Orqaga qaytish
        </Button>
        <AddProductPage />
      </div>
    );
  }

  // 2. Aks holda asosiy jadval va filtrlarni ko'rsatamiz
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">Dashboard / Products</p>
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowAddPage(true)}>
          <Plus className="mr-2 size-4" />
          Mahsulot qo&apos;shish
        </Button>
      </div>
      {/* Table */}
      <ProductsTable />
    </div>
  );
}
