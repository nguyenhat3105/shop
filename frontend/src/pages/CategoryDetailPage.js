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
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton header */}
      <div className="bg-gray-900 text-white px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-32 bg-white/10 rounded mb-6 animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <SkeletonGrid count={8} />
      </div>
    </div>
  );

  if (!category) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-gray-500">
      <p className="text-lg">Không tìm thấy danh mục.</p>
      <Link to="/categories" className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">← Quay lại</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/categories" className="inline-flex items-center gap-1.5 text-white/60 text-sm hover:text-white transition-colors mb-6">
            <ArrowLeft size={15} /> Tất cả danh mục
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-5 animate-fadeUp">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Tag size={20} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-[0.62rem] font-bold tracking-[0.28em] uppercase text-yellow-600 mb-1.5">Danh Mục</p>
              <h1 className="text-4xl font-normal text-white font-serif leading-tight mb-1">{category.name}</h1>
              <p className="text-white/50 text-sm">{category.description}</p>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-xl px-5 py-3 shrink-0">
              <LayoutGrid size={18} className="text-yellow-400" />
              <span className="text-2xl font-bold text-white">{category.productCount}</span>
              <span className="text-white/50 text-sm">sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {(!category.products || category.products.length === 0) ? (
          <div className="flex flex-col items-center gap-5 py-24 text-gray-400">
            <p className="text-lg">Danh mục này chưa có sản phẩm.</p>
            <Link to="/" className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Xem tất cả sản phẩm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {category.products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
