import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Gem, User, LogOut, ChevronDown, Shield, Search, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { cn } from './ui/Skeleton';

export default function Navbar() {
  const { cartCount, openModal }  = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const userRef    = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

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
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg shadow-slate-200">
            <Gem size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-tighter font-bold text-slate-900">LUXE</span>
            <span className="text-[10px] tracking-[0.3em] font-bold text-slate-400">SHOP</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link 
              key={l.to} 
              to={l.to}
              className={cn(
                "relative text-sm font-semibold transition-all hover:text-slate-900 py-1",
                location.pathname === l.to ? "text-slate-900" : "text-slate-500"
              )}
            >
              {l.label}
              {location.pathname === l.to && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-3">
          
          {/* Search (Desktop) */}
          <div className="hidden lg:flex items-center relative group mr-2">
            <form onSubmit={handleSearch} className="flex items-center bg-slate-100/80 rounded-full px-4 py-2 border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm sản phẩm..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-36 focus:w-56 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <button className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all lg:hidden" onClick={() => setShowSearch(!showSearch)}>
             <Search size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all relative">
            <Heart size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </Link>

          {/* Cart */}
          <button onClick={openModal} className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User Area */}
          <div className="relative ml-2" ref={userRef}>
            {user ? (
              <button 
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-700">{user.fullName?.split(' ').pop()}</span>
                  <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-300", userMenu && "rotate-180")} />
                </div>
              </button>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                <User size={16} />
                <span>Đăng Nhập</span>
              </Link>
            )}

            {/* User Dropdown */}
            {user && userMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 overflow-hidden z-[60] origin-top-right transition-all">
                 <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                 </div>
                 <div className="py-2">
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Shield size={16} />
                        </div>
                        Quản trị Hệ thống
                      </Link>
                    )}
                    <Link to="/orders" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <ShoppingBag size={16} />
                      </div>
                      Lịch sử mua hàng
                    </Link>
                    <div className="h-px bg-slate-50 my-1 mx-4" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      Đăng Xuất
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl py-6 px-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} className="px-5 py-4 text-lg font-bold text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" className="flex items-center gap-4 px-5 py-4 text-lg font-bold text-slate-900 hover:bg-slate-50 rounded-2xl transition-all">
                <User size={22} /> Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile Search Bar Overlay */}
      {showSearch && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 animate-in fade-in duration-200">
          <form onSubmit={handleSearch} className="flex items-center bg-slate-100 rounded-xl px-4 py-3">
             <Search size={18} className="text-slate-400 mr-2" />
             <input 
               type="text" 
               placeholder="Tìm kiếm sản phẩm..." 
               className="bg-transparent border-none focus:ring-0 text-base w-full"
               autoFocus
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <button type="button" onClick={() => setShowSearch(false)}>
               <X size={18} className="text-slate-400" />
             </button>
          </form>
        </div>
      )}
    </header>
  );
}
