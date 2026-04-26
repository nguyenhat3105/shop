import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Loader2, Frown, ArrowLeft } from 'lucide-react';
import { searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './SearchResultsPage.css';

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
      <div className="search-page search-page--empty">
        <div className="container">
          <p>Vui lòng nhập từ khóa để tìm kiếm.</p>
          <Link to="/" className="btn btn-outline">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="container">
        <Link to="/" className="search-back">
          <ArrowLeft size={14} /> Quay lại cửa hàng
        </Link>
        
        <div className="search-header">
          <div className="search-icon-wrap">
            <Search size={24} />
          </div>
          <div>
            <h1 className="search-title">Kết quả tìm kiếm</h1>
            <p className="search-subtitle">
              Tìm thấy <strong>{total}</strong> sản phẩm cho từ khóa "<strong>{query}</strong>"
            </p>
          </div>
        </div>

        {loading ? (
          <div className="search-loading">
            <Loader2 className="spin" size={32} />
            <p>Đang tìm kiếm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="search-empty">
            <Frown size={48} color="#ccc" />
            <h3>Rất tiếc, không tìm thấy sản phẩm nào</h3>
            <p>Hãy thử lại với từ khóa khác hoặc kiểm tra lại chính tả.</p>
          </div>
        ) : (
          <div className="search-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
