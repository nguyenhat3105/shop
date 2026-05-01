import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gem, Shield, Truck, RotateCcw, Star, Users, Package, Award,
  ArrowRight, CheckCircle, Quote
} from 'lucide-react';
import { cn } from '../components/ui/Skeleton';

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
    <div className="min-h-screen bg-[#faf9f7]">

      {/* ════════════ HERO ════════════ */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-black/10 bg-[#f5f3ef] max-md:min-h-auto max-md:py-8">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80')] bg-center bg-cover bg-no-repeat opacity-[0.06] pointer-events-none"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-2 gap-20 items-center py-12 max-md:grid-cols-1 max-md:gap-10">
          <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Về Chúng Tôi</p>
            <h1 className="font-serif text-[clamp(2.6rem,4.5vw,4.2rem)] font-normal leading-[1.1] text-[#111] my-3">
              Câu Chuyện <br />
              <em className="italic text-[#b8955a]">Đằng Sau</em> LuxeShop
            </h1>
            <p className="text-[0.92rem] text-[#555] leading-[1.8] max-w-[440px] mb-8">
              Thành lập năm 2020, LuxeShop ra đời từ niềm đam mê với những sản phẩm chất lượng cao
              và mong muốn mang đến trải nghiệm mua sắm sang trọng cho mọi người Việt Nam.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/categories" className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#b8955a] text-white rounded-md text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#a6844b] hover:-translate-y-px hover:shadow-lg">
                Khám Phá Sản Phẩm <ArrowRight size={15} />
              </Link>
              <a href="#story" className="inline-flex items-center gap-1.5 px-6 py-3 bg-transparent border border-black/10 rounded-md text-[#555] text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-all hover:border-black/20 hover:text-[#111]">
                Đọc Câu Chuyện
              </a>
            </div>
          </div>

          <div className="relative h-[500px] animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in max-md:hidden">
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Store" className="w-full h-full rounded-[2rem] object-cover border border-black/10"
              />
              <img
                src="https://images.unsplash.com/photo-1555529771-7888783a18d3?w=300&q=80"
                alt="Products" className="absolute -bottom-8 -left-8 w-[170px] h-[190px] rounded-[1rem] border-[3px] border-white shadow-[0_16px_40px_rgba(0,0,0,0.12)] object-cover animate-[floatY_5s_ease-in-out_infinite]"
              />
              <div className="absolute top-6 -right-3 flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-[#b8955a] text-[0.75rem] font-semibold tracking-[0.06em] animate-[floatY_4s_1s_ease-in-out_infinite]">
                <Gem size={16} />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ STATS ════════════ */}
      <section className="py-12 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-2">
          {STATS.map((s, i) => (
            <div key={i} className={cn(
              "flex flex-col items-center text-center p-[2rem_1rem] border-black/10 animate-in slide-in-from-bottom-8 duration-500 fade-in",
              "border-r last:border-r-0 max-lg:border-b max-lg:nth-[1]:border-b max-lg:nth-[2]:border-b max-lg:nth-[3]:border-b-0 max-lg:nth-[4]:border-b-0 max-sm:nth-[even]:border-r-0"
            )} style={{ animationDelay: `${(i+1)*100}ms` }}>
              <div className="w-[42px] h-[42px] bg-[#b8955a]/10 border border-[#b8955a]/20 rounded-xl flex items-center justify-center text-[#b8955a] mb-2.5">
                <s.icon size={20} />
              </div>
              <span className="font-serif text-[2rem] font-semibold text-[#111] leading-none mb-1">{s.value}</span>
              <span className="text-[0.75rem] text-[#999]">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ STORY ════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-2 gap-20 items-center max-md:grid-cols-1 max-md:gap-10" id="story">
        <div className="relative animate-in slide-in-from-bottom-8 duration-700 fade-in max-md:hidden">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80" alt="Our story" className="w-full rounded-[1.5rem] border border-black/10 object-cover aspect-[4/5] relative z-10" />
            <div className="absolute -inset-2.5 border border-[#b8955a]/20 rounded-[24px] pointer-events-none" />
          </div>
        </div>
        <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200 fade-in">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Hành Trình Của Chúng Tôi</p>
          <h2 className="font-serif text-[clamp(2rem,3vw,2.6rem)] font-normal leading-[1.2] text-[#111] mt-3 mb-6">
            Từ Một Ý Tưởng<br /><em className="italic text-[#b8955a]">Đến Thực Tế</em>
          </h2>
          <p className="text-[0.88rem] text-[#555] leading-[1.8] mb-4">
            Năm 2020, trong thời điểm đại dịch khiến mọi người phải ở nhà, ba người bạn nhận ra rằng
            mua sắm trực tuyến tại Việt Nam còn thiếu đi sự tinh tế và trải nghiệm cao cấp.
          </p>
          <p className="text-[0.88rem] text-[#555] leading-[1.8] mb-4">
            Từ căn phòng nhỏ ở Sài Gòn, LuxeShop ra đời với chỉ 50 sản phẩm đầu tiên. Ngày nay,
            chúng tôi tự hào phục vụ hơn 50.000 khách hàng trên khắp Việt Nam với hơn 1.200 sản phẩm.
          </p>
          <ul className="flex flex-col gap-2.5 mt-6">
            {['Sản phẩm 100% chính hãng', 'Kiểm định chất lượng nghiêm ngặt', 'Đối tác từ 50+ thương hiệu uy tín'].map(t => (
              <li key={t} className="flex items-center gap-2.5 text-[0.83rem] text-[#555]">
                <CheckCircle size={15} className="text-[#3a7d52] shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ════════════ VALUES ════════════ */}
      <section className="py-20 bg-[#f5f3ef] border-y border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Cam Kết Của Chúng Tôi</p>
            <h2 className="font-serif text-[clamp(2rem,3vw,2.6rem)] font-normal leading-[1.2] text-[#111] mt-3">Giá Trị Cốt Lõi</h2>
          </div>
          <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {VALUES.map((v, i) => (
              <div key={i} className="p-7 bg-white border border-black/10 rounded-[1.2rem] transition-all duration-300 hover:border-[#b8955a]/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom-8 duration-500 fade-in" style={{ animationDelay: `${(i+1)*100}ms` }}>
                <div className="w-[44px] h-[44px] bg-[#b8955a]/10 border border-[#b8955a]/20 rounded-xl flex items-center justify-center text-[#b8955a] mb-4">
                  <v.icon size={22} />
                </div>
                <h3 className="text-[0.95rem] font-semibold text-[#111] mb-2">{v.title}</h3>
                <p className="text-[0.8rem] text-[#999] leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TEAM ════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Con Người</p>
          <h2 className="font-serif text-[clamp(2rem,3vw,2.6rem)] font-normal leading-[1.2] text-[#111] mt-3">Đội Ngũ Sáng Lập</h2>
        </div>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {TEAM.map((m, i) => (
            <div key={i} className="bg-white border border-black/10 rounded-[1.5rem] p-8 text-center transition-all duration-300 hover:border-black/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] animate-in slide-in-from-bottom-8 duration-500 fade-in" style={{ animationDelay: `${(i+1)*100}ms` }}>
              <div className="relative w-[90px] h-[90px] mx-auto mb-4">
                <img src={m.img} alt={m.name} className="w-[90px] h-[90px] rounded-full object-cover border-2 border-black/10 relative z-10" />
                <div className="absolute -inset-1 rounded-full border border-[#b8955a]/25 pointer-events-none" />
              </div>
              <h3 className="text-[0.95rem] font-semibold text-[#111] mb-1">{m.name}</h3>
              <p className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-[#b8955a] mb-3">{m.role}</p>
              <div className="flex gap-2 bg-[#f5f3ef] border border-black/10 rounded-lg p-3 text-left">
                <Quote size={14} className="text-[#b8955a] shrink-0 mt-0.5" />
                <p className="text-[0.76rem] text-[#999] leading-[1.6] italic">{m.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section className="py-20 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#b8955a] mb-2">Đánh Giá</p>
            <h2 className="font-serif text-[clamp(2rem,3vw,2.6rem)] font-normal leading-[1.2] text-[#111] mt-3">Khách Hàng Nói Gì?</h2>
          </div>
          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-[1.2rem] p-7 flex flex-col gap-3.5 transition-all duration-300 hover:border-black/20 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom-8 duration-500 fade-in" style={{ animationDelay: `${(i+1)*100}ms` }}>
                <div className="flex gap-[3px] text-[#d4a843]">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[0.85rem] text-[#555] leading-[1.7] flex-1">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-black/10 mt-auto">
                  <img src={t.img} alt={t.name} className="w-[38px] h-[38px] rounded-full object-cover border border-black/10" />
                  <div>
                    <p className="text-[0.82rem] font-semibold text-[#111]">{t.name}</p>
                    <p className="text-[0.7rem] text-[#999]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20 pb-24">
        <div className="relative flex flex-col items-center text-center gap-4 py-16 px-8 bg-[#111] rounded-[1.5rem] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(184,149,90,0.15)_0%,transparent_70%)] pointer-events-none" />
          <Gem size={32} className="text-[#e2c186] relative z-10" />
          <h2 className="font-serif text-[clamp(1.7rem,3vw,2.8rem)] font-normal text-white relative z-10">Sẵn Sàng Trải Nghiệm LuxeShop?</h2>
          <p className="text-[0.88rem] text-white/55 max-w-[380px] relative z-10">Khám phá hàng nghìn sản phẩm cao cấp được tuyển chọn kỹ lưỡng.</p>
          <Link to="/categories" className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#b8955a] text-white rounded-md text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-all hover:bg-[#a6844b] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] relative z-10 mt-2">
            Mua Sắm Ngay <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
