import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, LayoutGrid } from 'lucide-react';
import { getCategoryById } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setLoading(true);
    getCategoryById(id)
      .then(r => setCategory(r.data))
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col pt-12">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <SkeletonGrid count={8} />
      </div>
    </div>
  );

  if (!category) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-[#999]">
      <p>Không tìm thấy danh mục.</p>
      <Link to="/categories" className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-black/10 rounded-md text-[0.8rem] text-[#555] font-semibold transition-all hover:bg-[#111] hover:text-white hover:border-[#111]">
        ← Quay lại
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ── Header ── */}
      <div className="pt-10 pb-8 bg-[#f5f3ef] border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/categories" className="inline-flex items-center gap-1.5 text-[0.73rem] text-[#999] mb-5 transition-colors hover:text-[#111]">
            <ArrowLeft size={15} /> Tất cả danh mục
          </Link>
          <div className="flex items-center gap-5 flex-wrap animate-in slide-in-from-bottom-4 duration-700">
            <div className="w-12 h-12 bg-[#b8955a]/10 border border-[#b8955a]/25 rounded-xl flex items-center justify-center text-[#b8955a] shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-1">Danh Mục</p>
              <h1 className="font-serif text-[clamp(1.7rem,3vw,2.5rem)] font-medium text-[#111] leading-[1.2] mb-1.5">{category.name}</h1>
              <p className="text-[0.83rem] text-[#999] max-w-[480px]">{category.description}</p>
            </div>
            <div className="ml-auto flex items-baseline gap-1.5 px-[1.1rem] py-[0.65rem] bg-white border border-black/10 rounded-xl text-[#b8955a] max-sm:ml-0">
              <LayoutGrid size={18} className="translate-y-1" />
              <span className="font-serif text-[1.8rem] font-semibold">{category.productCount}</span>
              <span className="text-[0.72rem] text-[#999]">sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 pb-20">
        {(!category.products || category.products.length === 0) ? (
          <div className="flex flex-col items-center gap-5 py-20 text-[#999] text-center">
            <p>Danh mục này chưa có sản phẩm.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-black/10 rounded-md text-[0.8rem] text-[#555] font-semibold transition-all hover:bg-[#111] hover:text-white hover:border-[#111]">
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 max-sm:grid-cols-2 max-sm:gap-3">
            {category.products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
