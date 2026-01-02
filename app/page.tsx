// app/page.tsx
'use client';

import Hero from '@/components/Hero';
import Header from './main/page';
import PopularProducts from '@/components/PopularProducts';
import BestSellersSection from '@/components/BestSellersSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="container mx-auto font-sans">
      <Header />
      <Hero />
      <PopularProducts />
      <div>
        <BestSellersSection />
        <FeaturesSection />
      </div>
      <Footer />
    </div>
  );
}
