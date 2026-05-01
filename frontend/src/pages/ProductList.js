import React, { useEffect, useState } from 'react';
import { getProducts, searchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import { Search, Loader2 } from 'lucide-react';

export default function ProductList() {
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
    <div className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <form className="flex gap-2 mb-8 max-w-xl" onSubmit={handleSearch}>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all text-[0.95rem]"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-[#111] text-white rounded-xl font-semibold transition-all hover:bg-[#222] active:scale-95 whitespace-nowrap"
          >
            Tìm kiếm
          </button>
        </form>

        {loading ? (
          <div className="py-12">
            <SkeletonGrid count={8} />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-500">
            <Search size={40} className="opacity-20" />
            <p>Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
