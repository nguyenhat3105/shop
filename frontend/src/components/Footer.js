import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">

          {/* Brand column */}
          <div className="footer__brand-col">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon"><Gem size={14} /></div>
              <div>
                <span className="footer__logo-serif">LUXE</span>
                <span className="footer__logo-sans">SHOP</span>
              </div>
            </Link>
            <p className="footer__tagline">
              Nơi quy tụ những sản phẩm cao cấp, được tuyển chọn kỹ lưỡng từ khắp nơi trên thế giới.
            </p>
            <div className="footer__socials">
              <a href="#!" className="footer__social" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#!" className="footer__social" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="#!" className="footer__social" aria-label="Youtube"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4 className="footer__heading">Khám Phá</h4>
            <ul className="footer__links">
              <li><Link to="/"><ArrowRight size={12} /> Cửa Hàng</Link></li>
              <li><Link to="/categories"><ArrowRight size={12} /> Danh Mục</Link></li>
              <li><Link to="/about"><ArrowRight size={12} /> Về Chúng Tôi</Link></li>
              <li><Link to="/cart"><ArrowRight size={12} /> Giỏ Hàng</Link></li>
            </ul>
          </div>

          {/* Policy */}
          <div className="footer__col">
            <h4 className="footer__heading">Hỗ Trợ</h4>
            <ul className="footer__links">
              <li><a href="#!"><ArrowRight size={12} /> Chính sách đổi trả</a></li>
              <li><a href="#!"><ArrowRight size={12} /> Chính sách bảo hành</a></li>
              <li><a href="#!"><ArrowRight size={12} /> Hướng dẫn mua hàng</a></li>
              <li><a href="#!"><ArrowRight size={12} /> Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__heading">Liên Hệ</h4>
            <ul className="footer__contact">
              <li><MapPin size={14} /> 123 Nguyễn Huệ, Q.1, TP.HCM</li>
              <li><Phone size={14} /> 1800 1234 (Miễn phí)</li>
              <li><Mail size={14} /> hello@luxeshop.vn</li>
            </ul>
            <div className="footer__newsletter">
              <p className="footer__nl-label">Nhận ưu đãi mới nhất</p>
              <div className="footer__nl-form">
                <input placeholder="Email của bạn..." />
                <button><ArrowRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© 2025 LuxeShop. Bảo lưu mọi quyền.</p>
          <p>Thiết kế bởi <span className="footer__credit">LuxeShop Team</span></p>
        </div>
      </div>
    </footer>
  );
}
