import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts } from '../services/api';
import { SkeletonGrid } from '../components/SkeletonCard';
import { Search } from 'lucide-react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data.content || res.data);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return fetchProducts();
    try {
      setLoading(true);
      const res = await searchProducts(keyword);
      setProducts(res.data.content || res.data);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search bar */}
      <form className="flex gap-2 mb-8" onSubmit={handleSearch}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none transition-all focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 placeholder:text-gray-400 bg-white"
          />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold transition-all hover:bg-gray-800 active:scale-95">
          Tìm
        </button>
      </form>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x400'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-base font-bold text-red-500">{product.price?.toLocaleString('vi-VN')}₫</p>
                <p className="text-xs text-gray-400 mt-0.5">Còn: {product.stock} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
