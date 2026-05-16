import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Frown, ArrowLeft } from 'lucide-react';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 text-gray-400 bg-gray-50">
        <p className="text-lg">Vui lòng nhập từ khóa để tìm kiếm.</p>
        <Link to="/" className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft size={14} /> Quay lại cửa hàng
        </Link>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 animate-fadeUp">
          <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center shrink-0">
            <Search size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kết quả tìm kiếm</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Tìm thấy <strong className="text-gray-900">{total}</strong> sản phẩm cho từ khóa "<strong className="text-gray-900">{query}</strong>"
            </p>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-gray-400 animate-fadeUp">
            <Frown size={52} className="text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700">Rất tiếc, không tìm thấy sản phẩm nào</h3>
            <p className="text-sm text-gray-500">Hãy thử lại với từ khóa khác hoặc kiểm tra lại chính tả.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
