import React from 'react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';

/* Props addToCart không cần nữa vì ProductCard tự lấy từ context */
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ProductGrid />
    </main>
  );
}
