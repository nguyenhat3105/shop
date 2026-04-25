import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Gem, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, openModal }  = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [userMenu,  setUserMenu]  = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const userRef    = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location]);

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

  const links = [
    { to: '/',           label: 'Cửa Hàng'    },
    { to: '/categories', label: 'Danh Mục'    },
    { to: '/about',      label: 'Về Chúng Tôi'},
  ];

  return (
    <header className={`nb ${scrolled ? 'nb--solid' : ''}`}>
      <div className="nb__inner">

        {/* Logo */}
        <Link to="/" className="nb__logo">
          <div className="nb__logo-icon"><Gem size={14} /></div>
          <span className="nb__logo-text">
            <span className="nb__logo-serif">LUXE</span>
            <span className="nb__logo-sans">SHOP</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nb__nav">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nb__link ${location.pathname === l.to ||
                (l.to !== '/' && location.pathname.startsWith(l.to)) ? 'nb__link--active' : ''}`}>
              {l.label}
              <span className="nb__link-bar" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="nb__actions">

          {/* Cart */}
          <button className="nb__cart" onClick={openModal} aria-label="Giỏ hàng">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="nb__badge" key={cartCount}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User area */}
          {user ? (
            <div className="nb__user" ref={userRef}>
              <button className="nb__user-btn" onClick={() => setUserMenu(v => !v)}>
                <div className="nb__user-avatar">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="nb__user-name">{user.fullName?.split(' ').pop()}</span>
                <ChevronDown size={13} className={`nb__chevron ${userMenu ? 'open' : ''}`} />
              </button>

              {userMenu && (
                <div className="nb__user-dropdown">
                  <div className="nb__user-info">
                    <p className="nb__user-fullname">{user.fullName}</p>
                    <p className="nb__user-email">{user.email}</p>
                    {isAdmin && (
                      <span className="nb__user-role"><Shield size={10} /> Admin</span>
                    )}
                  </div>
                  <div className="nb__user-divider" />
                  <button className="nb__user-item nb__user-logout" onClick={handleLogout}>
                    <LogOut size={14} /> Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nb__login-btn">
              <User size={15} />
              <span>Đăng Nhập</span>
            </Link>
          )}

          {/* Hamburger */}
          <button className="nb__burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`nb__drawer ${menuOpen ? 'nb__drawer--open' : ''}`}>
        <div className="nb__drawer-inner">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nb__drawer-link ${location.pathname === l.to ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <button className="nb__drawer-cart" onClick={openModal}>
            <ShoppingBag size={16} />
            Giỏ Hàng
            {cartCount > 0 && <span className="nb__badge-m">{cartCount}</span>}
          </button>
          {user ? (
            <button className="nb__drawer-link nb__drawer-logout" onClick={handleLogout}>
              <LogOut size={15} /> Đăng Xuất
            </button>
          ) : (
            <Link to="/login" className="nb__drawer-link">
              <User size={15} /> Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
