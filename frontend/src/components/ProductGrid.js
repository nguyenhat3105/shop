import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProducts, searchProducts, getCategories } from '../services/api';
import './ProductGrid.css';

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
      // Handle both paged and plain array responses
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
    <section className="pgrid-section" id="products">
      {/* Section header */}
      <div className="pgrid-header">
        <div>
          <p className="pgrid-eyebrow">Tất Cả Sản Phẩm</p>
          <h2 className="pgrid-title">Bộ Sưu Tập</h2>
        </div>

        {/* Controls */}
        <div className="pgrid-controls">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={handleSearch}
            />
          </div>

          <div className="sort-wrap">
            <SlidersHorizontal size={15} />
            <select className="sort-select" value={sortDir} onChange={handleSort}>
              <option value="asc">Giá: Thấp → Cao</option>
              <option value="desc">Giá: Cao → Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="cat-filters">
          <button
            className={`cat-chip ${activeCat === null ? 'active' : ''}`}
            onClick={() => setActiveCat(null)}
          >Tất cả</button>
          {categories.map(c => (
            <button
              key={c.id}
              className={`cat-chip ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >{c.name}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="pgrid-loading">
          <Loader2 size={36} className="spin" />
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="pgrid-empty">
          <p>Không tìm thấy sản phẩm nào.</p>
        </div>
      ) : (
        <div className="pgrid">
          {displayed.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage(v => Math.max(0, v - 1))}
            disabled={page === 0}
          ><ChevronLeft size={18} /></button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i ? 'active' : ''}`}
              onClick={() => setPage(i)}
            >{i + 1}</button>
          ))}

          <button
            className="page-btn"
            onClick={() => setPage(v => Math.min(totalPages - 1, v + 1))}
            disabled={page === totalPages - 1}
          ><ChevronRight size={18} /></button>
        </div>
      )}
    </section>
  );
}
