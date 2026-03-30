// app/page.tsx
'use client';

import BestSellersSection from '@/components/BestSellersSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PopularProducts from '@/components/PopularProducts';
import Header from './main/page';

export default function Home() {
  return (
    <div className="container mx-auto font-sans p-3">
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
