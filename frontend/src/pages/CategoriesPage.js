import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Loader2 } from 'lucide-react';
import { getCategories } from '../services/api';
import { cn } from '../components/ui/Skeleton';

const CATEGORY_IMAGES = {
  'Thời Trang Nam':    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
  'Thời Trang Nữ':    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80',
  'Điện Tử':          'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  'Gia Dụng':         'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'Sách & Văn Phòng': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
  'Thể Thao':         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  'Làm Đẹp':          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  'Thực Phẩm':        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ── Hero banner ── */}
      <section className="relative min-h-[300px] flex items-end pb-14 bg-[#f5f3ef] border-b border-black/10 overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 animate-in slide-in-from-bottom-8 duration-700 ease-out fade-in">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Khám Phá</p>
          <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-[1.1] text-[#111] my-2.5">
            Danh Mục <em className="italic text-[#b8955a]">Sản Phẩm</em>
          </h1>
          <p className="text-[0.85rem] text-[#999] max-w-2xl">
            {categories.length} danh mục · hàng nghìn sản phẩm chất lượng cao được tuyển chọn kỹ lưỡng
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-[3.5rem] pb-[6rem]">
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden max-sm:grid-cols-1">
             {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="min-h-[300px] bg-[#f5f3ef] animate-pulse" />
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden max-sm:grid-cols-1">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="group relative overflow-hidden min-h-[300px] flex flex-col justify-end bg-[#f5f3ef] hover:z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/${cat.id}/600/400`}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-75 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7]/0 via-[#faf9f7]/50 to-[#faf9f7]/95" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6 bg-gradient-to-b from-transparent to-[#faf9f7]/95">
                  <div className="w-[30px] h-[30px] bg-[#b8955a]/10 border border-[#b8955a]/25 rounded-md flex items-center justify-center text-[#b8955a] mb-2">
                    <Tag size={16} />
                  </div>
                  <h3 className="font-serif text-[1.3rem] font-medium text-[#111] leading-[1.2]">{cat.name}</h3>
                  <p className="text-[0.76rem] text-[#999] leading-[1.5] mt-1 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/10">
                    <span className="text-[0.68rem] font-semibold tracking-[0.06em] text-[#b8955a] bg-[#b8955a]/10 px-2 py-0.5 rounded-full border border-[#b8955a]/20">
                      {cat.productCount} sản phẩm
                    </span>
                    <span className="flex items-center gap-[5px] text-[0.72rem] font-semibold text-[#555] transition-all duration-300 group-hover:text-[#b8955a] group-hover:gap-2">
                      Xem ngay <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
