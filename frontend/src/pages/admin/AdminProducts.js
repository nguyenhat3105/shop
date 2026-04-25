import React, { useState, useEffect } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { getProducts } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts(0, 100); // Get up to 100 for admin view
      setProducts(data.content);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading && products.length === 0) {
    return <div style={{display:'flex', justifyContent:'center'}}><Loader2 className="spin" /></div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý Sản phẩm</h1>
        <button className="admin-btn" style={{display:'flex', alignItems:'center', gap:'8px'}} onClick={() => toast('Chức năng thêm mới đang được phát triển')}>
          <Plus size={16} /> Thêm Sản Phẩm
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình Ảnh</th>
              <th>Tên Sản Phẩm</th>
              <th>Danh Mục</th>
              <th>Giá Bán</th>
              <th>Tồn Kho</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}} />
                </td>
                <td style={{fontWeight:500}}>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                    background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                    color: product.stock > 0 ? '#15803d' : '#b91c1c'
                  }}>
                    {product.stock > 0 ? product.stock : 'Hết hàng'}
                  </span>
                </td>
                <td>
                  <button className="admin-btn" style={{padding:'6px 12px', fontSize:'13px', background:'#f1f5f9', color:'#334155'}} onClick={() => toast('Chức năng sửa đang được phát triển')}>Sửa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
