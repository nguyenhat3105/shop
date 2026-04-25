import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'Quản lý Đơn hàng' },
    { path: '/admin/products', icon: <Package size={18} />, label: 'Quản lý Sản phẩm' }
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
