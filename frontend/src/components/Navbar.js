import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Gem, User, LogOut, ChevronDown, Shield, Search, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getLoyaltyBalance } from '../services/api';


export default function Navbar() {
  const { cartCount, openModal }  = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);
  const location   = useLocation();
  const navigate   = useNavigate();
  const userRef    = useRef(null);


  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

  // Load loyalty points when user logs in
  useEffect(() => {
    if (user) {
      getLoyaltyBalance().then(res => setLoyaltyPoints(res.data.points)).catch(() => {});
    } else {
      setLoyaltyPoints(null);
    }
  }, [user]);

  // Close user dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const links = [
    { to: '/',           label: 'Cửa Hàng'    },
    { to: '/categories', label: 'Danh Mục'    },
    { to: '/about',      label: 'Về Chúng Tôi'},
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-900 text-white transition-transform group-hover:-rotate-12">
            <Gem size={16} />
          </div>
          <span className="flex items-center text-xl tracking-wider">
            <span className="font-serif font-bold text-gray-900">LUXE</span>
            <span className="font-sans font-medium text-gray-500">SHOP</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => {
            const isActive = location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to));
            return (
              <Link key={l.to} to={l.to}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors ${isActive ? 'text-accent' : 'text-gray-600 hover:text-gray-900'}`}>
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Search */}
          <div className="relative flex items-center">
            <form 
              onSubmit={handleSearch} 
              className={`absolute right-full mr-2 transition-all duration-300 origin-right flex items-center ${showSearch ? 'scale-x-100 opacity-100 visible' : 'scale-x-0 opacity-0 invisible'}`}
            >
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm sản phẩm..." 
                  className="w-48 lg:w-64 pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </form>
            <button 
              className="text-gray-600 hover:text-accent transition-colors p-1" 
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Tìm kiếm"
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Cart */}
          <button className="relative text-gray-600 hover:text-accent transition-colors p-1" onClick={openModal} aria-label="Giỏ hàng">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white" key={cartCount}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User area */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setUserMenu(v => !v)}>
                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:block text-sm font-medium">{user.fullName?.split(' ').pop()}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${userMenu ? 'rotate-180' : ''}`} />
              </button>

              {userMenu && (
                <div className="absolute top-full right-0 mt-3 w-60 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden flex flex-col z-50 animate-fadeUp origin-top-right">
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    {loyaltyPoints !== null && (
                      <Link to="/loyalty" className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold rounded-full hover:bg-yellow-100 transition-colors" onClick={() => setUserMenu(false)}>
                        <Star size={11} className="fill-yellow-500 text-yellow-500" />
                        {loyaltyPoints.toLocaleString()} điểm
                      </Link>
                    )}
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-2 ml-1 px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold tracking-wider uppercase rounded">
                        <Shield size={10} /> Admin
                      </span>
                    )}
                  </div>
                  <div className="py-2">
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setUserMenu(false)}>
                        <Shield size={16} className="text-gray-400" /> Quản trị Hệ thống
                      </Link>
                    )}
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setUserMenu(false)}>
                      <ShoppingBag size={16} className="text-gray-400" /> Lịch sử mua hàng
                    </Link>
                    <Link to="/loyalty" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" onClick={() => setUserMenu(false)}>
                      <Star size={16} className="text-yellow-500" /> Điểm thưởng của tôi
                    </Link>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" onClick={handleLogout}>
                      <LogOut size={16} className="text-red-400" /> Đăng Xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-gray-600 hover:text-gray-900 transition-colors">
              <User size={18} />
              <span>Đăng Nhập</span>
            </Link>
          )}

          {/* Hamburger */}
          <button className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-1 ml-2" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-20 px-6 pb-6 overflow-y-auto">
          <nav className="flex flex-col gap-6 mb-8">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`text-lg font-medium tracking-wide uppercase transition-colors ${location.pathname === l.to ? 'text-accent' : 'text-gray-900'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          
          <div className="h-px w-full bg-gray-100 mb-8" />
          
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-3 text-base font-medium text-gray-900 py-2" onClick={openModal}>
              <ShoppingBag size={20} className="text-gray-400" />
              Giỏ Hàng
              {cartCount > 0 && <span className="ml-auto bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 text-base font-medium text-gray-900 py-2" onClick={() => setMenuOpen(false)}>
                    <Shield size={20} className="text-gray-400" /> Quản trị Hệ thống
                  </Link>
                )}
                <Link to="/orders" className="flex items-center gap-3 text-base font-medium text-gray-900 py-2" onClick={() => setMenuOpen(false)}>
                  <ShoppingBag size={20} className="text-gray-400" /> Lịch sử mua hàng
                </Link>
                <Link to="/loyalty" className="flex items-center gap-3 text-base font-medium text-gray-900 py-2" onClick={() => setMenuOpen(false)}>
                  <Star size={20} className="text-yellow-500" />
                  Điểm thưởng
                  {loyaltyPoints !== null && (
                    <span className="ml-auto text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">{loyaltyPoints.toLocaleString()}</span>
                  )}
                </Link>
                <button className="flex items-center gap-3 text-base font-medium text-red-600 py-2 mt-2" onClick={handleLogout}>
                  <LogOut size={20} className="text-red-400" /> Đăng Xuất
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-3 text-base font-medium text-gray-900 py-2">
                <User size={20} className="text-gray-400" /> Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  );
}
