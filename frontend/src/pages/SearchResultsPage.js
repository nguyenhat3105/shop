import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Loader2, Frown, ArrowLeft } from 'lucide-react';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchProducts(query, 0, 50)
        .then(res => {
          setProducts(res.data.content);
          setTotal(res.data.totalElements);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f7] p-8">
        <div className="flex flex-col items-center text-center gap-5 max-w-[400px]">
          <p className="text-[1.1rem] text-[#666]">Vui lòng nhập từ khóa để tìm kiếm.</p>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-[#111] border-[1.5px] border-black/10 rounded-md text-[0.8rem] font-bold tracking-[0.08em] uppercase transition-all hover:border-black/20 hover:bg-[#f5f3ef]">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-[#999] mb-8 transition-colors hover:text-[#111]">
          <ArrowLeft size={14} /> Quay lại cửa hàng
        </Link>
        
        <div className="flex items-center gap-6 mb-12 pb-6 border-b border-black/10 max-md:flex-col max-md:text-center max-md:gap-4">
          <div className="w-[60px] h-[60px] rounded-2xl bg-[#b8955a]/10 border border-[#b8955a]/25 flex items-center justify-center text-[#b8955a] shrink-0">
            <Search size={24} />
          </div>
          <div>
            <h1 className="font-serif text-[clamp(2rem,3vw,2.6rem)] font-normal text-[#111] mb-1">Kết quả tìm kiếm</h1>
            <p className="text-[0.9rem] text-[#666]">
              Tìm thấy <strong className="text-[#111] font-semibold">{total}</strong> sản phẩm cho từ khóa "<strong className="text-[#111] font-semibold">{query}</strong>"
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#999] gap-4">
            <Loader2 className="animate-spin text-[#b8955a]" size={32} />
            <p className="text-[0.9rem]">Đang tìm kiếm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[100px] text-center bg-white border border-black/5 rounded-[1.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <Frown size={48} color="#ccc" className="mb-4" />
            <h3 className="text-[1.2rem] font-medium text-[#111] mb-2">Rất tiếc, không tìm thấy sản phẩm nào</h3>
            <p className="text-[0.9rem] text-[#666]">Hãy thử lại với từ khóa khác hoặc kiểm tra lại chính tả.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6 max-sm:grid-cols-2 max-sm:gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
