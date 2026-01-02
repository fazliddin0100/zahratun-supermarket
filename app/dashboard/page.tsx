'use client';

import { useState, useEffect } from 'react';
import TopNavbar from '@/components/dashboard/navbar/TopNavbar';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import DashboardCards from '@/components/dashboard/cards/DashboardCards';
import RevenueChart from '@/components/dashboard/charts/RevenueChart';
import SalesChart from '@/components/dashboard/charts/SalesChart';
import ProductsPage from '@/components/dashboard/products/praductsPage';
import CategoriesPage from '@/components/dashboard/CategoriesPage/CategoriesPage';
import OrdersDropdown from '@/components/dashboard/orders/order-page';
import CustomersPage from '@/components/dashboard/customers/customers-page';
import ReviewsPage from '@/components/dashboard/Reviews/reviews.';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔒 Sidebar ochilganda body scroll bloklanadi
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
  }, [isSidebarOpen]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <DashboardCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6">
              <RevenueChart />
              <SalesChart />
            </div>
          </>
        );
      case 'products':
        return <ProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'orders-list':
        return <OrdersDropdown type="list" />;
      case 'orders-single':
        return <OrdersDropdown type="single" />;
      case 'customers':
        return <CustomersPage />;
      case 'reviews':
        return <ReviewsPage />;
      default:
        return <PageTitle title="Tez kunda..." />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden xl:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 xl:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function PageTitle({ title }: { title: string }) {
  return <div className="p-6 text-xl md:text-2xl font-bold">{title}</div>;
}
