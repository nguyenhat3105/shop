import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Loader2 } from 'lucide-react';
import { getCategories } from '../services/api';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <section className="bg-gray-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#b8955a_0%,_transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center animate-fadeUp">
          <p className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-600 mb-4">Khám Phá</p>
          <h1 className="text-5xl md:text-6xl font-normal leading-tight font-serif mb-4">
            Danh Mục <em className="text-yellow-600 not-italic">Sản Phẩm</em>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            {categories.length} danh mục · hàng nghìn sản phẩm chất lượng cao được tuyển chọn kỹ lưỡng
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24 text-gray-500">
            <Loader2 size={36} className="animate-spin" />
            <p>Đang tải danh mục...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] block transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {/* Background image */}
                <img
                  src={CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/${cat.id}/600/400`}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                    <Tag size={14} className="text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg leading-tight font-serif mb-1">{cat.name}</h3>
                  <p className="text-white/50 text-xs line-clamp-2 mb-3">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">{cat.productCount} sản phẩm</span>
                    <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Xem ngay <ArrowRight size={12} />
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
