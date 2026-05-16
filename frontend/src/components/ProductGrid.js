import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { getProducts, searchProducts, getCategories } from '../services/api';

export default function ProductGrid({ addToCart }) {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [keyword, setKeyword]       = useState('');
  const [debouncedKw, setDebouncedKw] = useState('');
  const [activeCat, setActiveCat]   = useState(null);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortDir, setSortDir]       = useState('asc');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKw(keyword), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  // Fetch categories once
  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [debouncedKw, page, sortDir]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (debouncedKw.trim()) {
        res = await searchProducts(debouncedKw, page);
      } else {
        res = await getProducts(page, 12, 'price', sortDir);
      }
      const data = res.data;
      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotalPages(1);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedKw, page, sortDir]);

  const handleSearch = (e) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  const handleSort = (e) => {
    setSortDir(e.target.value);
    setPage(0);
  };

  const displayed = activeCat
    ? products.filter(p => p.categoryId === activeCat)
    : products;

  return (
    <section className="py-16 md:py-24" id="products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <p className="inline-flex items-center gap-2.5 text-[10px] font-bold tracking-widest uppercase text-accent mb-3">
              <span className="block w-5 h-px bg-accent opacity-50"></span>
              Tất Cả Sản Phẩm
              <span className="block w-5 h-px bg-accent opacity-50"></span>
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-gray-900">Bộ Sưu Tập</h2>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-accent transition-colors" />
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-black/5 transition-all placeholder:text-gray-400 shadow-sm"
                placeholder="Tìm kiếm sản phẩm..."
                value={keyword}
                onChange={handleSearch}
              />
            </div>

            <div className="relative group w-full sm:w-48">
              <SlidersHorizontal size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-accent transition-colors" />
              <select 
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-black/5 transition-all cursor-pointer shadow-sm"
                value={sortDir} 
                onChange={handleSort}
              >
                <option value="asc">Giá: Thấp → Cao</option>
                <option value="desc">Giá: Cao → Thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-10">
            <button
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${activeCat === null ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'}`}
              onClick={() => setActiveCat(null)}
            >Tất cả</button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${activeCat === c.id ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'}`}
                onClick={() => setActiveCat(c.id)}
              >{c.name}</button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {displayed.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-gray-100">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              onClick={() => setPage(v => Math.max(0, v - 1))}
              disabled={page === 0}
            ><ChevronLeft size={18} /></button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${page === i ? 'bg-gray-900 text-white shadow-md' : 'border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}
                onClick={() => setPage(i)}
              >{i + 1}</button>
            ))}

            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              onClick={() => setPage(v => Math.min(totalPages - 1, v + 1))}
              disabled={page === totalPages - 1}
            ><ChevronRight size={18} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
