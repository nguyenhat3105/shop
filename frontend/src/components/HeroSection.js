import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero">
      {/* ── Full-bleed banner (CIU style: big image + minimal text overlay) ── */}
      <div className="hero__banner">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=90"
          alt="New Collection"
          className="hero__banner-img"
        />
        <div className="hero__banner-overlay" />

        {/* Text block — bottom left, white on dark */}
        <div className="hero__banner-text">
          <p className="hero__banner-eyebrow">Bộ Sưu Tập Mới · 2025</p>
          <h1 className="hero__banner-title serif">
            Phong Cách<br /><em>Tinh Tế</em>
          </h1>
          <Link to="/categories" className="hero__banner-cta btn btn-dark">
            Khám Phá Ngay <ArrowRight size={15} />
          </Link>
        </div>

        {/* Side label (CIU style vertical text) */}
        <div className="hero__side-label">NEW ARRIVAL 2025</div>
      </div>

      {/* ── Secondary banner row (2 smaller banners) ── */}
      <div className="hero__sub-banners">
        <div className="hero__sub-banner">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
            alt="Electronics"
          />
          <div className="hero__sub-overlay" />
          <div className="hero__sub-text">
            <span className="hero__sub-cat">Điện Tử & Công Nghệ</span>
            <Link to="/categories/3" className="hero__sub-link">
              Xem ngay <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="hero__sub-banner">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80"
            alt="Beauty"
          />
          <div className="hero__sub-overlay" />
          <div className="hero__sub-text">
            <span className="hero__sub-cat">Làm Đẹp & Chăm Sóc</span>
            <Link to="/categories/7" className="hero__sub-link">
              Xem ngay <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="hero__trust-bar">
        <div className="trust-item">
          <Truck size={16} />
          <div>
            <p className="trust-title">Miễn Phí Giao Hàng</p>
            <p className="trust-sub">Cho đơn hàng từ 299.000₫</p>
          </div>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <Shield size={16} />
          <div>
            <p className="trust-title">Hàng Chính Hãng 100%</p>
            <p className="trust-sub">Cam kết không hàng giả</p>
          </div>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <RotateCcw size={16} />
          <div>
            <p className="trust-title">Đổi Trả Trong 30 Ngày</p>
            <p className="trust-sub">Hoàn tiền nhanh chóng</p>
          </div>
        </div>
      </div>
    </section>
  );
}
