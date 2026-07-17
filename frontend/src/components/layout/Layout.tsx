import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import './Layout.css';

export const Layout: React.FC = () => (
  <div className="app-layout">
    <Header />
    <main className="app-main">
      <Outlet />
    </main>
    <footer className="app-footer">
      <div className="app-footer__inner">
        <span>© 2026 Smart Library</span>
        <span className="app-footer__dot">·</span>
        <span>Barcha huquqlar himoyalangan</span>
      </div>
    </footer>
  </div>
);
