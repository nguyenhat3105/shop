import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, ChevronLeft, ChevronRight,
  LayoutGrid, LayoutList, X, ChevronDown, Filter, RotateCcw
} from 'lucide-react';
import ProductCard from './ProductCard';
import { SkeletonCard } from './SkeletonCard';
import { getProducts, searchProducts, getCategories } from '../services/api';
import { cn } from './ui/Skeleton';

const PRICE_RANGES = [
  { label: 'Tất cả',            min: 0,         max: Infinity },
  { label: 'Dưới 200.000₫',    min: 0,         max: 200000  },
  { label: '200.000 – 500.000₫', min: 200000,   max: 500000  },
  { label: '500.000 – 1.000.000₫', min: 500000, max: 1000000 },
  { label: 'Trên 1.000.000₫',  min: 1000000,   max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'id:desc',    label: 'Mới nhất'         },
  { value: 'price:asc',  label: 'Giá: Thấp → Cao' },
  { value: 'price:desc', label: 'Giá: Cao → Thấp' },
  { value: 'name:asc',   label: 'Tên A → Z'        },
];

export default function ProductGrid() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [keyword,    setKeyword]    = useState('');
  const [debouncedKw, setDebouncedKw] = useState('');
  const [activeCat,  setActiveCat]  = useState(null);
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey,    setSortKey]    = useState('id:desc');
  const [priceRange, setPriceRange] = useState(0);
  const [layout,     setLayout]     = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedKw(keyword); setPage(0); }, 500);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    getCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [debouncedKw, page, sortKey, activeCat]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, direction] = sortKey.split(':');
      let res;
      if (debouncedKw.trim()) {
        res = await searchProducts(debouncedKw, page, 12);
      } else {
        res = await getProducts(page, 12, sortBy, direction);
      }
      const data = res.data;
      if (data?.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
      } else {
        const arr = Array.isArray(data) ? data : [];
        setProducts(arr);
        setTotalPages(1);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedKw, page, sortKey]);

  const range = PRICE_RANGES[priceRange];
  const displayed = products.filter(p => {
    const inPrice = p.price >= range.min && p.price <= range.max;
    const inCat   = activeCat === null || p.categoryId === activeCat;
    return inPrice && inCat;
  });

  const resetFilters = () => {
    setKeyword('');
    setActiveCat(null);
    setPriceRange(0);
    setSortKey('id:desc');
    setPage(0);
  };

  const hasActiveFilters = keyword || activeCat !== null || priceRange !== 0 || sortKey !== 'id:desc';

  const pageButtons = () => {
    const total = totalPages;
    if (total <= 7) return [...Array(total)].map((_, i) => i);
    const left  = Math.max(0, page - 2);
    const right = Math.min(total - 1, page + 2);
    const pages = [];
    if (left > 0)       pages.push(0, left > 1 ? '…' : null);
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push(right < total - 2 ? '…' : null, total - 1);
    return pages.filter(p => p !== null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8" id="products">
      
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">Khám Phá</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">Bộ Sưu Tập Mới</h2>
          <p className="text-slate-500 text-sm max-w-md">Những thiết kế sang trọng, hiện đại nhất đã sẵn sàng dành cho bạn.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative group flex-1 md:flex-initial min-w-[240px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-10 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            {keyword && (
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                onClick={() => setKeyword('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle (Mobile) */}
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "p-3 rounded-2xl flex items-center gap-2 text-sm font-bold border transition-all",
              filterOpen 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Lọc</span>
            {hasActiveFilters && <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
        
        {/* Desktop Sidebar / Mobile Panel */}
        <aside className={cn(
          "space-y-8 lg:block",
          filterOpen ? "block" : "hidden"
        )}>
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Danh Mục</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { setActiveCat(null); setPage(0); }}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left",
                  activeCat === null ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                Tất cả sản phẩm
                {activeCat === null && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setActiveCat(c.id); setPage(0); }}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left",
                    activeCat === c.id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {c.name}
                  {activeCat === c.id && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Khoảng giá</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {PRICE_RANGES.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { setPriceRange(i); setPage(0); }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-left",
                    priceRange === i 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset All */}
          {hasActiveFilters && (
            <button 
              onClick={resetFilters}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 text-rose-600 text-xs font-black tracking-widest uppercase hover:bg-rose-50 transition-all"
            >
              <RotateCcw size={14} /> Xóa tất cả lọc
            </button>
          )}
        </aside>

        {/* Product Area */}
        <div className="space-y-6">
          {/* Sub-controls */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-4 px-4 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">Sắp xếp:</span>
              <div className="relative group">
                <select
                  className="bg-transparent border-none focus:ring-0 text-slate-900 font-black cursor-pointer pr-8 py-1 appearance-none"
                  value={sortKey}
                  onChange={e => { setSortKey(e.target.value); setPage(0); }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>

            <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-200/50">
              <button
                className={cn("p-2 rounded-xl transition-all", layout === 'grid' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-900")}
                onClick={() => setLayout('grid')}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={cn("p-2 rounded-xl transition-all", layout === 'list' ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "text-slate-400 hover:text-slate-900")}
                onClick={() => setLayout('list')}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>

          {/* Result Info */}
          {!loading && (
             <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {displayed.length} KẾT QUẢ
                </span>
                {hasActiveFilters && (
                   <div className="flex flex-wrap gap-2">
                      {activeCat !== null && (
                         <button 
                           onClick={() => setActiveCat(null)}
                           className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
                         >
                            DANH MỤC <X size={10} />
                         </button>
                      )}
                      {priceRange !== 0 && (
                         <button 
                           onClick={() => setPriceRange(0)}
                           className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
                         >
                            KHOẢNG GIÁ <X size={10} />
                         </button>
                      )}
                      {keyword && (
                         <button 
                           onClick={() => setKeyword('')}
                           className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                         >
                            "{keyword}" <X size={10} />
                         </button>
                      )}
                   </div>
                )}
             </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className={cn(
              "grid gap-6 md:gap-8 transition-all duration-500",
              layout === 'grid' ? "grid-cols-2 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="bg-slate-50 rounded-[3rem] py-32 text-center border-2 border-dashed border-slate-200">
               <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 flex items-center justify-center mx-auto mb-8">
                 <Search size={40} className="text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Không tìm thấy sản phẩm</h3>
               <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Chúng tôi đã tìm kỹ rồi nhưng không thấy sản phẩm nào phù hợp với các tiêu chí bạn chọn.</p>
               <button 
                 onClick={resetFilters}
                 className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-300 transition-all active:scale-95"
               >
                 XÓA BỘ LỌC & THỬ LẠI
               </button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-6 md:gap-8 transition-all duration-500",
              layout === 'grid' ? "grid-cols-2 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {displayed.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-3 pt-16">
              <button
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => { setPage(v => Math.max(0, v - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === 0}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-2">
                {pageButtons().map((p, i) =>
                  p === '…' ? (
                    <span key={`ellipsis-${i}`} className="w-14 h-14 flex items-center justify-center text-slate-400 font-bold">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={cn(
                        "w-14 h-14 rounded-2xl text-sm font-black transition-all",
                        page === p 
                          ? "bg-slate-900 text-white shadow-2xl shadow-slate-300 scale-110 z-10" 
                          : "bg-white text-slate-600 border border-slate-100 hover:border-slate-300"
                      )}
                    >
                      {p + 1}
                    </button>
                  )
                )}
              </div>

              <button
                className="w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                onClick={() => { setPage(v => Math.min(totalPages - 1, v + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={page === totalPages - 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
