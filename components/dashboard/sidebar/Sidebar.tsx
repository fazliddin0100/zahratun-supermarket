'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Home,
  Logs,
  ShoppingBag,
  ShoppingCart,
  ChevronDown,
  Users,
  Star,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';

interface SidebarProps {
  activeTab: string;
  onTabChange: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="h-screen sticky top-0 w-64 flex flex-col border-r bg-card text-card-foreground">
      <SidebarContent activeTab={activeTab} onTabChange={onTabChange} />
    </aside>
  );
}

function SidebarContent({ activeTab, onTabChange }: SidebarProps) {
  const [manualOpen, setManualOpen] = useState(false);

  // derived state (EFFECT YO‘Q!)
  const ordersOpen = manualOpen || activeTab.startsWith('orders');

  const activeStyle =
    'text-[#012d06] bg-[#cfedce] hover:bg-[#adf4aa] hover:text-black';

  return (
    <nav className="flex flex-col gap-2 p-4 w-full">
      {/* Logo */}
      <Link href="/" className="relative w-full h-32 mb-2">
        <Image
          src="/zahratun-logo.png"
          alt="Zahratun Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </Link>

      {/* Dashboard */}
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === 'dashboard' ? activeStyle : ''
        }`}
        onClick={() => onTabChange('dashboard')}>
        <Home className="mr-2 h-5 w-5" />
        Dashboard
      </Button>

      {/* Products */}
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === 'products' ? activeStyle : ''
        }`}
        onClick={() => onTabChange('products')}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Mahsulotlar
      </Button>

      {/* Categories */}
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === 'categories' ? activeStyle : ''
        }`}
        onClick={() => onTabChange('categories')}>
        <Logs className="mr-2 h-5 w-5" />
        Kategoriyalar
      </Button>

      {/* Orders */}
      <Collapsible open={ordersOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab.startsWith('orders') ? activeStyle : ''
            }`}
            onClick={() => setManualOpen((prev) => !prev)}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            Buyurtmalar
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                ordersOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="ml-6 flex flex-col gap-1">
          <Button
            variant="ghost"
            className={`justify-start text-sm ${
              activeTab === 'orders-list' ? activeStyle : ''
            }`}
            onClick={() => onTabChange('orders-list')}>
            Buyurtmalar ro‘yxati
          </Button>

          <Button
            variant="ghost"
            className={`justify-start text-sm ${
              activeTab === 'orders-single' ? activeStyle : ''
            }`}
            onClick={() => onTabChange('orders-single')}>
            Bitta buyurtma
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {/* mijozlar */}
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === 'customers' ? activeStyle : ''
        }`}
        onClick={() => onTabChange('customers')}>
        <Users className="mr-2 h-5 w-5" />
        Mijozlar
      </Button>

      {/* reviews */}
      <Button
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === 'reviews' ? activeStyle : ''
        }`}
        onClick={() => onTabChange('reviews')}>
        <Star className="mr-2 h-5 w-5" />
        Sharhlar
      </Button>
    </nav>
  );
}
