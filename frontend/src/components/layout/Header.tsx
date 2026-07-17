import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, BookMarked, Menu, X, BookCopy } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/books', label: 'Katalog', icon: <BookOpen size={16} /> },
    ...(user ? [{ to: '/my-borrows', label: 'Kitoblarim', icon: <BookMarked size={16} /> }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: <LayoutDashboard size={16} /> }] : []),
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <BookCopy size={20} />
          </div>
          <div className="header__logo-text">
            <span className="header__logo-name">Smart Library</span>
            <span className="header__logo-sub">Kutubxona tizimi</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__nav-link ${isActive(link.to) ? 'header__nav-link--active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="header__actions">
          {user ? (
            <>
              <Link to="/profile" className="header__user">
                <div className="header__avatar">
                  {(user.fullName ?? '?').charAt(0).toUpperCase()}
                </div>
                <span className="header__username">{(user.fullName ?? '').split(' ')[0]}</span>
              </Link>
              <button className="header__logout" onClick={handleLogout} title="Chiqish">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__auth-link">Kirish</Link>
              <Link to="/register" className="header__auth-btn">Ro'yxatdan o'tish</Link>
            </>
          )}

          {/* Mobile toggle */}
          <button className="header__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="header__mobile">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__mobile-link ${isActive(link.to) ? 'header__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="header__mobile-link header__mobile-link--logout" onClick={() => { handleLogout(); setMobileOpen(false); }}>
              <LogOut size={16} />
              Chiqish
            </button>
          ) : (
            <>
              <Link to="/login" className="header__mobile-link" onClick={() => setMobileOpen(false)}>Kirish</Link>
              <Link to="/register" className="header__mobile-link" onClick={() => setMobileOpen(false)}>Ro'yxatdan o'tish</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
