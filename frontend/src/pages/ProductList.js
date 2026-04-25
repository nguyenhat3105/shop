import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts } from '../services/api';
import './ProductList.css';

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
    <div className="product-list-page">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">Tìm</button>
      </form>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id} className="product-card">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={product.name}
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">
                  {product.price?.toLocaleString('vi-VN')}₫
                </p>
                <p className="stock">Còn: {product.stock} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
