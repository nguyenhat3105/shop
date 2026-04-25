import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Loader2, LayoutGrid } from 'lucide-react';
import { getCategoryById } from '../services/api';
import ProductCard from '../components/ProductCard';
import './CategoryDetailPage.css';

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
    <div className="page cdp-loading">
      <Loader2 size={36} className="spin" />
      <p>Đang tải danh mục...</p>
    </div>
  );

  if (!category) return (
    <div className="page cdp-loading">
      <p>Không tìm thấy danh mục.</p>
      <Link to="/categories" className="btn btn-outline">← Quay lại</Link>
    </div>
  );

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="cdp-header">
        <div className="container">
          <Link to="/categories" className="cdp-back">
            <ArrowLeft size={15} /> Tất cả danh mục
          </Link>
          <div className="cdp-hero anim-up">
            <div className="cdp-hero__icon"><Tag size={20} /></div>
            <div>
              <p className="section-eyebrow">Danh Mục</p>
              <h1 className="cdp-title serif">{category.name}</h1>
              <p className="cdp-desc">{category.description}</p>
            </div>
            <div className="cdp-stat">
              <LayoutGrid size={18} />
              <span>{category.productCount}</span>
              <span className="cdp-stat-label">sản phẩm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="container cdp-body">
        {(!category.products || category.products.length === 0) ? (
          <div className="cdp-empty">
            <p>Danh mục này chưa có sản phẩm.</p>
            <Link to="/" className="btn btn-outline">Xem tất cả sản phẩm</Link>
          </div>
        ) : (
          <div className="cdp-grid">
            {category.products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
