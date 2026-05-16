import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand text-white/75 mt-0">
      <div className="pt-16 pb-12">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.5fr] gap-8 lg:gap-12">

          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-white/10 rounded-md flex items-center justify-center text-white">
                <Gem size={14} />
              </div>
              <div>
                <span className="font-serif font-bold text-lg tracking-[0.1em] text-white">LUXE</span>
                <span className="text-[0.62rem] font-light tracking-[0.3em] text-white/40 ml-[3px]">SHOP</span>
              </div>
            </Link>
            <p className="text-[0.8rem] text-white/50 leading-relaxed mb-5 max-w-[260px]">
              Nơi quy tụ những sản phẩm cao cấp, được tuyển chọn kỹ lưỡng từ khắp nơi trên thế giới.
            </p>
            <div className="flex gap-2">
              <a href="#!" className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center text-white/50 transition-colors hover:border-white/40 hover:text-white" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#!" className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center text-white/50 transition-colors hover:border-white/40 hover:text-white" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="#!" className="w-8 h-8 border border-white/10 rounded-md flex items-center justify-center text-white/50 transition-colors hover:border-white/40 hover:text-white" aria-label="Youtube"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/90 mb-4">Khám Phá</h4>
            <ul className="list-none flex flex-col gap-2">
              <li><Link to="/" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Cửa Hàng</Link></li>
              <li><Link to="/categories" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Danh Mục</Link></li>
              <li><Link to="/about" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Về Chúng Tôi</Link></li>
              <li><Link to="/cart" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Giỏ Hàng</Link></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/90 mb-4">Hỗ Trợ</h4>
            <ul className="list-none flex flex-col gap-2">
              <li><a href="#!" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Chính sách đổi trả</a></li>
              <li><a href="#!" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Chính sách bảo hành</a></li>
              <li><a href="#!" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Hướng dẫn mua hàng</a></li>
              <li><a href="#!" className="flex items-center gap-1.5 text-[0.8rem] text-white/50 transition-colors hover:text-white/90"><ArrowRight size={12} className="text-white/25 shrink-0" /> Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/90 mb-4">Liên Hệ</h4>
            <ul className="list-none flex flex-col gap-2.5 mb-5">
              <li className="flex items-start gap-2 text-[0.8rem] text-white/50 leading-relaxed"><MapPin size={14} className="text-accent-light shrink-0 mt-[3px]" /> 123 Nguyễn Huệ, Q.1, TP.HCM</li>
              <li className="flex items-start gap-2 text-[0.8rem] text-white/50 leading-relaxed"><Phone size={14} className="text-accent-light shrink-0 mt-[3px]" /> 1800 1234 (Miễn phí)</li>
              <li className="flex items-start gap-2 text-[0.8rem] text-white/50 leading-relaxed"><Mail size={14} className="text-accent-light shrink-0 mt-[3px]" /> hello@luxeshop.vn</li>
            </ul>
            <div>
              <p className="text-[0.7rem] font-semibold tracking-[0.08em] text-white/70 mb-2">Nhận ưu đãi mới nhất</p>
              <div className="flex border border-white/15 rounded-md overflow-hidden transition-colors focus-within:border-white/35">
                <input placeholder="Email của bạn..." className="flex-1 bg-transparent border-none py-2 px-3 text-white text-[0.78rem] outline-none placeholder:text-white/30" />
                <button className="w-8 bg-white/10 text-white/70 flex items-center justify-center transition-colors hover:bg-accent hover:text-white"><ArrowRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[0.73rem] text-white/35 text-center sm:text-left">
          <p>© 2025 LuxeShop. Bảo lưu mọi quyền.</p>
          <p>Thiết kế bởi <span className="text-accent-light">LuxeShop Team</span></p>
        </div>
      </div>
    </footer>
  );
}
