import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import FlashSaleSection from '../components/FlashSaleSection';
import RecentlyViewed from '../components/RecentlyViewed';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FlashSaleSection />
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <RecentlyViewed title="Xem gần đây" />
      </div>
      <ProductGrid />
    </main>
  );
}
