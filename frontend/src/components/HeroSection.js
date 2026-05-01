import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Tag } from 'lucide-react';
import { getCategories } from '../services/api';

const BANNER_IMGS = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=90',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=90',
];

const TRUST_ITEMS = [
  { icon: <Truck size={18} />,       title: 'Miễn Phí Giao Hàng',   sub: 'Đơn từ 299.000₫'       },
  { icon: <Shield size={18} />,      title: 'Hàng Chính Hãng 100%', sub: 'Cam kết không hàng giả' },
  { icon: <RotateCcw size={18} />,   title: 'Đổi Trả 30 Ngày',      sub: 'Hoàn tiền nhanh chóng' },
  { icon: <Headphones size={18} />,  title: 'Hỗ Trợ 24/7',          sub: 'Tư vấn nhiệt tình'      },
];

const CAT_IMAGES = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80',
  'https://images.unsplash.com/photo-1560472355-109703aa3edc?w=400&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
];

export default function HeroSection() {
  const [slide,      setSlide]      = useState(0);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  /* Auto-slideshow */
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % BANNER_IMGS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Fetch categories */
  useEffect(() => {
    getCategories()
      .then(r => setCategories((r.data || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  return (
    <section className="pt-[68px]">

      {/* ════════════════════════════════════════
          MAIN BANNER — slideshow
      ════════════════════════════════════════ */}
      <div className="relative h-[70vh] min-h-[420px] md:h-[88vh] md:min-h-[560px] md:max-h-[820px] overflow-hidden">
        {BANNER_IMGS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Banner ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${slide === i ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/5 z-10" />

        {/* Text */}
        <div className="absolute bottom-[15%] left-[5%] md:bottom-[12%] md:left-[8%] z-20 max-w-[520px]">
          <p className="text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-white/70 mb-4 flex items-center gap-2.5 before:content-[''] before:block before:w-6 before:h-px before:bg-white/50">
            Bộ Sưu Tập Mới · 2025
          </p>
          <h1 className="text-[2.2rem] md:text-[clamp(2.8rem,5.5vw,5rem)] font-light text-white leading-[1.08] mb-4 tracking-[-0.01em] serif">
            Phong Cách<br /><em className="italic text-[#d4b07a]">Tinh Tế</em>
          </h1>
          <p className="text-sm text-white/75 mb-8 leading-[1.6]">
            Hàng nghìn sản phẩm chính hãng, giao hàng toàn quốc
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <Link to="/categories" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-7 py-3 rounded-md text-[0.78rem] font-semibold tracking-[0.1em] uppercase transition-all hover:bg-[#2d2d2d] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] whitespace-nowrap">
              Khám Phá Ngay <ArrowRight size={15} />
            </Link>
            <Link to="#products" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/30 backdrop-blur-sm px-7 py-3 rounded-md text-[0.78rem] font-semibold tracking-[0.1em] uppercase transition-all hover:bg-white/20 hover:border-white/60 whitespace-nowrap">
              Xem Sản Phẩm
            </Link>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {BANNER_IMGS.map((_, i) => (
            <button
              key={i}
              className={`h-[7px] rounded-full border-none cursor-pointer transition-all duration-300 ${slide === i ? 'bg-white w-[22px]' : 'bg-white/40 w-[7px]'}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Side label */}
        <div className="hidden md:block absolute right-10 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[0.55rem] font-semibold tracking-[0.35em] uppercase text-white/40 z-20 whitespace-nowrap">
          NEW ARRIVAL 2025
        </div>
      </div>

      {/* ════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════ */}
      <div className="flex items-center justify-start md:justify-center bg-white border-b border-black/10 flex-wrap">
        {TRUST_ITEMS.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="hidden md:block w-px h-10 bg-black/10 shrink-0" />}
            <div className="flex items-center gap-3 p-4 md:py-5 md:px-10 flex-1 min-w-[180px]">
              <div className="w-10 h-10 rounded-full bg-[#b8955a]/10 flex items-center justify-center text-[#b8955a] shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-[0.82rem] font-semibold text-[#111] mb-0.5">{item.title}</p>
                <p className="text-[0.72rem] text-[#999]">{item.sub}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ════════════════════════════════════════
          CATEGORIES SHOWCASE
      ════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.25em] uppercase text-[#b8955a] mb-1.5 flex items-center gap-2 before:content-[''] before:block before:w-5 before:h-px before:bg-[#b8955a]/50">
              Danh Mục
            </p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.2rem)] font-medium text-[#111] leading-[1.15] serif">Mua Sắm Theo Ngành</h2>
          </div>
          <Link to="/categories" className="flex items-center gap-1.5 text-[0.78rem] font-semibold tracking-[0.05em] text-[#555] border-b border-black/15 pb-0.5 whitespace-nowrap transition-colors hover:text-[#111] hover:border-[#111]">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {catLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl skeleton" />
              ))
            : categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="group relative rounded-xl overflow-hidden aspect-[3/4] block cursor-pointer bg-[#f5f3ef]"
                >
                  <img
                    src={CAT_IMAGES[i % CAT_IMAGES.length]}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-[0.85rem] flex items-end justify-between">
                    <span className="text-[0.78rem] font-semibold text-white tracking-[0.03em] leading-snug">
                      {cat.name}
                    </span>
                    <span className="w-[26px] h-[26px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 -translate-x-1 transition-all duration-250 ease-out shrink-0 group-hover:opacity-100 group-hover:translate-x-0">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>

      {/* ════════════════════════════════════════
          PROMO BANNER ROW
      ════════════════════════════════════════ */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 mt-8 pb-12 md:mt-12 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-6 rounded-xl border border-[#1a1a1a] bg-[#1a1a1a] text-white">
          <Tag size={20} className="shrink-0" />
          <div>
            <p className="text-[0.95rem] font-bold mb-[3px] text-white">Flash Sale Hôm Nay</p>
            <p className="text-[0.78rem] opacity-70">Giảm đến 50% — Chỉ hôm nay!</p>
          </div>
          <Link to="#products" className="ml-auto flex items-center gap-1.5 text-[0.78rem] font-bold whitespace-nowrap px-4 py-2 rounded-md border border-white/30 text-white transition-colors hover:bg-white/10 shrink-0">
            Mua ngay <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex items-center gap-4 p-6 rounded-xl border border-[#b8955a]/20 bg-[#b8955a]/10">
          <Truck size={20} className="shrink-0" />
          <div>
            <p className="text-[0.95rem] font-bold mb-[3px] text-[#111]">Giao Hàng Nhanh 2H</p>
            <p className="text-[0.78rem] text-[#555]">Nội thành TP.HCM & Hà Nội</p>
          </div>
          <Link to="#products" className="ml-auto flex items-center gap-1.5 text-[0.78rem] font-bold whitespace-nowrap px-4 py-2 rounded-md border border-[#b8955a] text-[#b8955a] transition-colors hover:bg-[#b8955a] hover:text-white shrink-0">
            Tìm hiểu <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </section>
  );
}
