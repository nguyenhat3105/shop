import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gem, Shield, Truck, RotateCcw, Star, Users, Package, Award,
  ArrowRight, CheckCircle, Quote
} from 'lucide-react';

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
    <div className="w-full">

      {/* ════════════ HERO ════════════ */}
      <section className="relative min-h-[auto] md:min-h-[88vh] flex items-center overflow-hidden border-b border-border bg-bg-2 py-8 md:py-0">
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none bg-center bg-cover bg-no-repeat" 
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80')"}} 
        />
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-8 md:py-12">
          <div className="animate-fadeUp">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Về Chúng Tôi</p>
            <h1 className="font-serif text-[clamp(2.6rem,4.5vw,4.2rem)] font-normal leading-[1.1] text-text my-3 md:my-5">
              Câu Chuyện <br />
              <em className="italic text-accent">Đằng Sau</em> LuxeShop
            </h1>
            <p className="text-[0.92rem] text-text-2 leading-[1.8] max-w-[440px] mb-8">
              Thành lập năm 2020, LuxeShop ra đời từ niềm đam mê với những sản phẩm chất lượng cao
              và mong muốn mang đến trải nghiệm mua sắm sang trọng cho mọi người Việt Nam.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/categories" className="btn bg-accent text-white hover:bg-accent-light">
                Khám Phá Sản Phẩm <ArrowRight size={15} />
              </Link>
              <a href="#story" className="btn btn-outline">Đọc Câu Chuyện</a>
            </div>
          </div>

          <div className="hidden md:block relative h-[500px] animate-fadeUp delay-200">
            <div className="relative h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Store" className="w-full h-full border border-border rounded-xl object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1555529771-7888783a18d3?w=300&q=80"
                alt="Products" className="absolute -bottom-8 -left-8 w-[170px] h-[190px] border-[3px] border-surface rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.12)] animate-floatY object-cover"
              />
              <div className="absolute top-6 -right-3 flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-accent text-[0.75rem] font-semibold tracking-[0.06em] animate-[floatY_4s_1s_ease-in-out_infinite]">
                <Gem size={16} />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section className="py-12 bg-surface border-b border-border">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-8 border-b md:border-b-0 border-r-0 sm:even:border-r-0 md:even:border-r border-border sm:border-r ${i === STATS.length - 1 ? 'md:border-r-0' : ''} animate-fadeUp`}>
              <div className="w-[42px] h-[42px] bg-accent/10 border border-accent/20 rounded-[10px] flex items-center justify-center text-accent mb-2.5"><s.icon size={20} /></div>
              <span className="font-serif text-3xl font-semibold text-text leading-none mb-1">{s.value}</span>
              <span className="text-[0.75rem] text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ STORY ════════════ */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center py-24" id="story">
        <div className="hidden md:block animate-fadeUp">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80" alt="Our story" className="w-full rounded-xl border border-border object-cover aspect-[4/5]" />
            <div className="absolute -inset-2.5 border border-accent/20 rounded-[24px] pointer-events-none" />
          </div>
        </div>
        <div className="animate-fadeUp delay-200">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Hành Trình Của Chúng Tôi</p>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-text mb-6 mt-3">
            Từ Một Ý Tưởng<br /><em className="serif italic text-accent">Đến Thực Tế</em>
          </h2>
          <p className="text-[0.88rem] text-text-2 leading-[1.8] mb-4">
            Năm 2020, trong thời điểm đại dịch khiến mọi người phải ở nhà, ba người bạn nhận ra rằng
            mua sắm trực tuyến tại Việt Nam còn thiếu đi sự tinh tế và trải nghiệm cao cấp.
          </p>
          <p className="text-[0.88rem] text-text-2 leading-[1.8] mb-4">
            Từ căn phòng nhỏ ở Sài Gòn, LuxeShop ra đời với chỉ 50 sản phẩm đầu tiên. Ngày nay,
            chúng tôi tự hào phục vụ hơn 50.000 khách hàng trên khắp Việt Nam với hơn 1.200 sản phẩm.
          </p>
          <ul className="list-none flex flex-col gap-2.5 mt-6">
            {['Sản phẩm 100% chính hãng', 'Kiểm định chất lượng nghiêm ngặt', 'Đối tác từ 50+ thương hiệu uy tín'].map(t => (
              <li key={t} className="flex items-center gap-2.5 text-[0.83rem] text-text-2"><CheckCircle size={15} className="text-success shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════════════ VALUES ════════════ */}
      <section className="py-20 bg-bg-2 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Cam Kết Của Chúng Tôi</p>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-text mt-3">Giá Trị Cốt Lõi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="p-7 bg-surface border border-border rounded-lg transition-all hover:border-accent/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-fadeUp">
                <div className="w-[44px] h-[44px] bg-accent/10 border border-accent/20 rounded-[10px] flex items-center justify-center text-accent mb-4"><v.icon size={22} /></div>
                <h3 className="text-[0.95rem] font-semibold text-text mb-2">{v.title}</h3>
                <p className="text-[0.8rem] text-text-muted leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TEAM ════════════ */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Con Người</p>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-text">Đội Ngũ Sáng Lập</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-8 text-center transition-all hover:border-border-2 hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] animate-fadeUp">
              <div className="relative w-[90px] h-[90px] mx-auto mb-4">
                <img src={m.img} alt={m.name} className="w-[90px] h-[90px] rounded-full object-cover border-2 border-border" />
                <div className="absolute -inset-1 rounded-full border border-accent/25" />
              </div>
              <h3 className="text-[0.95rem] font-semibold text-text mb-1">{m.name}</h3>
              <p className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-accent mb-3.5">{m.role}</p>
              <div className="flex gap-2 bg-bg-2 border border-border rounded p-3 text-left">
                <Quote size={14} className="text-accent shrink-0 mt-[2px]" />
                <p className="text-[0.76rem] text-text-muted leading-[1.6] italic">{m.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">Đánh Giá</p>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-medium text-text">Khách Hàng Nói Gì?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-7 flex flex-col gap-3.5 transition-all hover:border-border-2 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] animate-fadeUp">
                <div className="flex gap-[3px] text-[#d4a843]">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[0.85rem] text-text-2 leading-[1.7] flex-1">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-border">
                  <img src={t.img} alt={t.name} className="w-[38px] h-[38px] rounded-full object-cover border border-border" />
                  <div>
                    <p className="text-[0.82rem] font-semibold text-text">{t.name}</p>
                    <p className="text-[0.7rem] text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="py-20 pb-24 container mx-auto px-4">
        <div className="relative flex flex-col items-center text-center gap-4 px-8 py-16 bg-brand rounded-xl overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse,rgba(184,149,90,0.15)_0%,transparent_70%)]" />
          <Gem size={32} className="text-accent-light relative z-10" />
          <h2 className="font-serif text-[clamp(1.7rem,3vw,2.8rem)] font-normal text-white relative z-10">Sẵn Sàng Trải Nghiệm LuxeShop?</h2>
          <p className="text-[0.88rem] text-white/55 max-w-[380px] relative z-10">Khám phá hàng nghìn sản phẩm cao cấp được tuyển chọn kỹ lưỡng.</p>
          <Link to="/categories" className="btn bg-accent text-white hover:bg-accent-light relative z-10">
            Mua Sắm Ngay <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
