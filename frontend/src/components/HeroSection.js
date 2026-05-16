import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-gray-50 pb-12">
      {/* ── Full-bleed banner ── */}
      <div className="relative h-[60vh] md:h-[75vh] min-h-[450px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90"
          alt="New Collection"
          className="absolute inset-0 w-full h-full object-cover animate-fadeUp origin-center"
        />
        <div className="absolute inset-0 bg-black/10" />

        {/* Text block */}
        <div className="absolute bottom-10 left-6 md:bottom-16 md:left-12 lg:left-24 text-white z-10 max-w-lg">
          <p className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.25em] uppercase text-white mb-4 after:content-[''] after:block after:w-8 after:h-px after:bg-white after:opacity-60">
            Bộ Sưu Tập Mới · 2025
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-8">
            Phong Cách<br /><em className="italic font-light">Tinh Tế</em>
          </h1>
          <Link to="/categories" className="btn bg-white text-gray-900 hover:bg-gray-100 hover:-translate-y-0.5 transition-transform shadow-lg">
            Khám Phá Ngay <ArrowRight size={15} />
          </Link>
        </div>

        {/* Side label */}
        <div className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 rotate-90 origin-right text-xs font-bold tracking-[0.3em] uppercase text-white opacity-80 mix-blend-overlay">
          NEW ARRIVAL 2025
        </div>
      </div>

      {/* ── Secondary banner row ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-[240px] md:h-[300px] overflow-hidden group rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
              alt="Electronics"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="block text-xl font-medium mb-2">Điện Tử & Công Nghệ</span>
              <Link to="/categories/3" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase opacity-80 hover:opacity-100 transition-opacity">
                Xem ngay <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="relative h-[240px] md:h-[300px] overflow-hidden group rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"
              alt="Beauty"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-6 left-6 text-white">
              <span className="block text-xl font-medium mb-2">Làm Đẹp & Chăm Sóc</span>
              <Link to="/categories/7" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase opacity-80 hover:opacity-100 transition-opacity">
                Xem ngay <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 px-8 bg-white border border-gray-100 rounded-xl shadow-sm gap-6 md:gap-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
              <Truck size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Miễn Phí Giao Hàng</p>
              <p className="text-xs text-gray-500 mt-0.5">Cho đơn hàng từ 299.000₫</p>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-gray-100" />
          
          <div className="flex items-center gap-4 flex-1 md:pl-8 lg:pl-12">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Hàng Chính Hãng 100%</p>
              <p className="text-xs text-gray-500 mt-0.5">Cam kết không hàng giả</p>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-gray-100" />
          
          <div className="flex items-center gap-4 flex-1 md:pl-8 lg:pl-12">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700">
              <RotateCcw size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Đổi Trả Trong 30 Ngày</p>
              <p className="text-xs text-gray-500 mt-0.5">Hoàn tiền nhanh chóng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
