import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gem, Shield, Truck, RotateCcw, Star, Users, Package, Award,
  ArrowRight, CheckCircle, Quote
} from 'lucide-react';
import './AboutPage.css';

const STATS = [
  { icon: Users,   value: '50K+',  label: 'Khách hàng tin tưởng' },
  { icon: Package, value: '1,200+',label: 'Sản phẩm đa dạng'     },
  { icon: Star,    value: '4.9',   label: 'Điểm đánh giá trung bình' },
  { icon: Award,   value: '5+',    label: 'Năm kinh nghiệm'      },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Chất Lượng Đảm Bảo',
    desc: 'Mỗi sản phẩm đều được kiểm định nghiêm ngặt trước khi đến tay khách hàng. Chúng tôi chỉ hợp tác với các nhà cung cấp uy tín.',
  },
  {
    icon: Truck,
    title: 'Giao Hàng Nhanh Chóng',
    desc: 'Hệ thống logistics thông minh giúp đơn hàng của bạn đến đúng giờ. Miễn phí giao hàng cho đơn từ 299.000₫.',
  },
  {
    icon: RotateCcw,
    title: 'Đổi Trả Dễ Dàng',
    desc: 'Chính sách 30 ngày đổi trả miễn phí, không cần lý do. Chúng tôi cam kết trải nghiệm mua sắm không rủi ro.',
  },
  {
    icon: Star,
    title: 'Dịch Vụ Xuất Sắc',
    desc: 'Đội ngũ chăm sóc khách hàng 7/7, luôn sẵn sàng hỗ trợ bạn trong mọi vấn đề từ trước đến sau khi mua hàng.',
  },
];

const TEAM = [
  {
    name: 'Nguyễn Minh Khôi',
    role: 'CEO & Co-founder',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    quote: 'Chúng tôi xây dựng LuxeShop với niềm tin rằng mua sắm chất lượng cao không cần phải phức tạp.',
  },
  {
    name: 'Trần Thị Lan Anh',
    role: 'Head of Product',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b9e33e5d?w=300&q=80',
    quote: 'Mỗi sản phẩm là một câu chuyện — chúng tôi tìm kiếm những câu chuyện hay nhất để kể cho bạn.',
  },
  {
    name: 'Lê Hoàng Phúc',
    role: 'CTO',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    quote: 'Công nghệ là xương sống giúp trải nghiệm mua sắm của bạn trở nên mượt mà và thú vị.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Hương Giang',
    role: 'Khách hàng thân thiết',
    text: 'Đã mua sắm tại LuxeShop được 2 năm. Sản phẩm luôn đúng mô tả, giao hàng nhanh và dịch vụ sau bán hàng rất tốt.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
  {
    name: 'Minh Tuấn',
    role: 'Reviewer',
    text: 'Tôi cực kỳ ấn tượng với chất lượng đóng gói và tốc độ xử lý đơn hàng. Chắc chắn sẽ quay lại.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  {
    name: 'Thu Thảo',
    role: 'Beauty Blogger',
    text: 'Các sản phẩm làm đẹp tại đây đều chính hãng 100%. Mình đã giới thiệu cho cả group hàng nghìn người.',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="page about">

      {/* ════════════ HERO ════════════ */}
      <section className="ab-hero">
        <div className="ab-hero__bg" />
        <div className="container ab-hero__content">
          <div className="ab-hero__left anim-up">
            <p className="section-eyebrow">Về Chúng Tôi</p>
            <h1 className="ab-hero__title serif">
              Câu Chuyện <br />
              <em>Đằng Sau</em> LuxeShop
            </h1>
            <p className="ab-hero__desc">
              Thành lập năm 2020, LuxeShop ra đời từ niềm đam mê với những sản phẩm chất lượng cao
              và mong muốn mang đến trải nghiệm mua sắm sang trọng cho mọi người Việt Nam.
            </p>
            <div className="ab-hero__ctas">
              <Link to="/categories" className="btn btn-gold">
                Khám Phá Sản Phẩm <ArrowRight size={15} />
              </Link>
              <a href="#story" className="btn btn-outline">Đọc Câu Chuyện</a>
            </div>
          </div>

          <div className="ab-hero__right anim-up delay-2">
            <div className="ab-hero__img-stack">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Store" className="ab-hero__img ab-hero__img--main"
              />
              <img
                src="https://images.unsplash.com/photo-1555529771-7888783a18d3?w=300&q=80"
                alt="Products" className="ab-hero__img ab-hero__img--float"
              />
              <div className="ab-hero__badge">
                <Gem size={16} />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section className="ab-stats">
        <div className="container ab-stats__grid">
          {STATS.map((s, i) => (
            <div key={i} className={`ab-stat anim-up delay-${i + 1}`}>
              <div className="ab-stat__icon"><s.icon size={20} /></div>
              <span className="ab-stat__value serif">{s.value}</span>
              <span className="ab-stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ STORY ════════════ */}
      <section className="ab-story container" id="story">
        <div className="ab-story__left anim-up">
          <div className="ab-story__img-wrap">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80" alt="Our story" />
            <div className="ab-story__img-border" />
          </div>
        </div>
        <div className="ab-story__right anim-up delay-2">
          <p className="section-eyebrow">Hành Trình Của Chúng Tôi</p>
          <h2 className="section-title" style={{marginTop:'0.75rem',marginBottom:'1.5rem'}}>
            Từ Một Ý Tưởng<br /><em className="serif" style={{fontStyle:'italic',color:'var(--gold)'}}>Đến Thực Tế</em>
          </h2>
          <p className="ab-story__text">
            Năm 2020, trong thời điểm đại dịch khiến mọi người phải ở nhà, ba người bạn nhận ra rằng
            mua sắm trực tuyến tại Việt Nam còn thiếu đi sự tinh tế và trải nghiệm cao cấp.
          </p>
          <p className="ab-story__text">
            Từ căn phòng nhỏ ở Sài Gòn, LuxeShop ra đời với chỉ 50 sản phẩm đầu tiên. Ngày nay,
            chúng tôi tự hào phục vụ hơn 50.000 khách hàng trên khắp Việt Nam với hơn 1.200 sản phẩm.
          </p>
          <ul className="ab-story__checks">
            {['Sản phẩm 100% chính hãng', 'Kiểm định chất lượng nghiêm ngặt', 'Đối tác từ 50+ thương hiệu uy tín'].map(t => (
              <li key={t}><CheckCircle size={15} /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════════════ VALUES ════════════ */}
      <section className="ab-values">
        <div className="container">
          <div className="ab-values__head">
            <p className="section-eyebrow">Cam Kết Của Chúng Tôi</p>
            <h2 className="section-title ab-values__title">Giá Trị Cốt Lõi</h2>
          </div>
          <div className="ab-values__grid">
            {VALUES.map((v, i) => (
              <div key={i} className={`ab-val anim-up delay-${i + 1}`}>
                <div className="ab-val__icon"><v.icon size={22} /></div>
                <h3 className="ab-val__title">{v.title}</h3>
                <p className="ab-val__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TEAM ════════════ */}
      <section className="ab-team container">
        <div className="ab-team__head">
          <p className="section-eyebrow">Con Người</p>
          <h2 className="section-title">Đội Ngũ Sáng Lập</h2>
        </div>
        <div className="ab-team__grid">
          {TEAM.map((m, i) => (
            <div key={i} className={`ab-member anim-up delay-${i + 1}`}>
              <div className="ab-member__img-wrap">
                <img src={m.img} alt={m.name} className="ab-member__img" />
                <div className="ab-member__img-ring" />
              </div>
              <h3 className="ab-member__name">{m.name}</h3>
              <p className="ab-member__role">{m.role}</p>
              <div className="ab-member__quote">
                <Quote size={14} className="ab-member__quote-icon" />
                <p>{m.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="ab-reviews">
        <div className="container">
          <div className="ab-reviews__head">
            <p className="section-eyebrow">Đánh Giá</p>
            <h2 className="section-title">Khách Hàng Nói Gì?</h2>
          </div>
          <div className="ab-reviews__grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`ab-review anim-up delay-${i + 1}`}>
                <div className="ab-review__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="ab-review__text">"{t.text}"</p>
                <div className="ab-review__author">
                  <img src={t.img} alt={t.name} className="ab-review__avatar" />
                  <div>
                    <p className="ab-review__name">{t.name}</p>
                    <p className="ab-review__role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="ab-cta container">
        <div className="ab-cta__box">
          <div className="ab-cta__glow" />
          <Gem size={32} className="ab-cta__icon" />
          <h2 className="serif ab-cta__title">Sẵn Sàng Trải Nghiệm LuxeShop?</h2>
          <p className="ab-cta__desc">Khám phá hàng nghìn sản phẩm cao cấp được tuyển chọn kỹ lưỡng.</p>
          <Link to="/categories" className="btn btn-gold">
            Mua Sắm Ngay <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
