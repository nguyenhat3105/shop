import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Eye, X, Clock } from 'lucide-react';
import { getProductsByIds } from '../services/api';

const formatVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STORAGE_KEY = 'luxeshop_recently_viewed';
const MAX_ITEMS = 10;

/** Ghi một product ID vào danh sách xem gần đây */
export function trackProductView(productId) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = existing.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

/** Lấy danh sách ID đã xem */
export function getRecentlyViewedIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Component hiển thị section "Xem gần đây" */
export default function RecentlyViewed({ excludeId = null, title = 'Xem gần đây' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const ids = getRecentlyViewedIds().filter((id) => id !== excludeId);
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    getProductsByIds(ids.slice(0, 6))
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [excludeId]);

  useEffect(() => {
    load();
  }, [load]);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts([]);
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Clock size={18} className="text-gray-400" />
          <h2 className="font-serif text-2xl font-medium text-gray-900">{title}</h2>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={12} />
          Xóa lịch sử
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {products.map((p) => (
          <Link
            to={`/products/${p.id}`}
            key={p.id}
            className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="aspect-square bg-gray-50 overflow-hidden">
              <img
                src={p.imageUrl || `https://picsum.photos/seed/${p.id}/200/200`}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-medium text-gray-800 line-clamp-1 group-hover:text-yellow-700 transition-colors">
                {p.name}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                {p.onSale
                  ? <span className="text-red-600">{formatVND(p.salePrice)}</span>
                  : formatVND(p.price)
                }
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
