import React, { useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, LayoutDashboard, Gem, Warehouse, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLowStock } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [lowStockCount,   setLowStockCount]   = useState(0);
  const [newOrderBadge,   setNewOrderBadge]   = useState(0);

  useEffect(() => {
    getLowStock()
      .then(res => setLowStockCount(res.data?.length ?? 0))
      .catch(() => {});
  }, []);

  // WS: đếm đơn mới chưa xem
  const handleNewOrder = useCallback(() => {
    setNewOrderBadge(n => n + 1);
  }, []);
  useWebSocket('/topic/admin/orders', handleNewOrder, !!user && !!isAdmin);

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: '/admin',           icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/orders',    icon: <ShoppingCart size={18} />,    label: 'Đơn hàng' },
    { path: '/admin/products',  icon: <Package size={18} />,         label: 'Sản phẩm' },
    { path: '/admin/inventory', icon: <Warehouse size={18} />,       label: 'Tồn kho', badge: lowStockCount },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gray-900 text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Gem size={20} className="text-yellow-500" />
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-yellow-500">LUXESHOP</p>
                <p className="text-[0.65rem] text-white/40 tracking-wider">Admin Panel</p>
              </div>
            </div>
            {/* Bell icon with badge */}
            <button
              className="relative p-1.5 text-white/50 hover:text-white transition-colors"
              onClick={() => setNewOrderBadge(0)}
              title="Thông báo đơn mới"
            >
              <Bell size={18} />
              {newOrderBadge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {newOrderBadge > 9 ? '9+' : newOrderBadge}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-yellow-400' : 'text-white/40'}>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/40">Đăng nhập với</p>
          <p className="text-sm text-white font-semibold truncate mt-0.5">{user?.email}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
