import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Loader2 } from 'lucide-react';
import { getCategories } from '../services/api';
import './CategoriesPage.css';

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

const CATEGORY_COLORS = [
  'linear-gradient(135deg,#1a1200,#3d2e00)',
  'linear-gradient(135deg,#0f1a0f,#1a3320)',
  'linear-gradient(135deg,#0a0f1a,#0f2040)',
  'linear-gradient(135deg,#1a0a0a,#3d1515)',
  'linear-gradient(135deg,#0f0a1a,#251540)',
  'linear-gradient(135deg,#001a14,#003328)',
  'linear-gradient(135deg,#1a0f14,#3d1528)',
  'linear-gradient(135deg,#121a04,#253300)',
];

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
    <div className="page">
      {/* ── Hero banner ── */}
      <section className="cat-hero">
        <div className="cat-hero__noise" />
        <div className="container cat-hero__content anim-up">
          <p className="section-eyebrow">Khám Phá</p>
          <h1 className="cat-hero__title serif">
            Danh Mục <em>Sản Phẩm</em>
          </h1>
          <p className="cat-hero__sub">
            {categories.length} danh mục · hàng nghìn sản phẩm chất lượng cao được tuyển chọn kỹ lưỡng
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="container cat-section">
        {loading ? (
          <div className="cat-loading">
            <Loader2 size={36} className="spin" />
            <p>Đang tải danh mục...</p>
          </div>
        ) : (
          <div className="cat-grid">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                className="cat-card anim-up"
                style={{
                  animationDelay: `${i * 0.07}s`,
                  '--cat-bg': CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                }}
              >
                {/* Background image */}
                <div className="cat-card__img-wrap">
                  <img
                    src={CATEGORY_IMAGES[cat.name] || `https://picsum.photos/seed/${cat.id}/600/400`}
                    alt={cat.name}
                    className="cat-card__img"
                  />
                  <div className="cat-card__overlay" />
                </div>

                {/* Content */}
                <div className="cat-card__body">
                  <div className="cat-card__icon"><Tag size={16} /></div>
                  <h3 className="cat-card__name serif">{cat.name}</h3>
                  <p className="cat-card__desc">{cat.description}</p>
                  <div className="cat-card__meta">
                    <span className="cat-card__count">{cat.productCount} sản phẩm</span>
                    <span className="cat-card__arrow">
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
