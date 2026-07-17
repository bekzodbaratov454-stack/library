import React, { useState } from 'react';
import { LayoutDashboard, BookCopy, Users, BookMarked, BarChart2 } from 'lucide-react';
import { AdminBooks } from './tabs/AdminBooks';
import { AdminUsers } from './tabs/AdminUsers';
import { AdminBorrows } from './tabs/AdminBorrows';
import { AdminStats } from './tabs/AdminStats';
import './AdminPage.css';

type Tab = 'stats' | 'books' | 'users' | 'borrows';

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('stats');

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'stats',   label: 'Statistika',      icon: <BarChart2 size={17} /> },
    { key: 'books',   label: 'Kitoblar',         icon: <BookCopy size={17} /> },
    { key: 'users',   label: 'Foydalanuvchilar', icon: <Users size={17} /> },
    { key: 'borrows', label: 'Ijaralar',          icon: <BookMarked size={17} /> },
  ];

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__title-row">
            <div className="admin-header__icon">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="admin-header__title">Admin Panel</h1>
              <p className="admin-header__sub">Smart Library boshqaruv markazi</p>
            </div>
          </div>

          <div className="admin-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`admin-tab ${tab === t.key ? 'admin-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-content__inner">
          {tab === 'stats'   && <AdminStats />}
          {tab === 'books'   && <AdminBooks />}
          {tab === 'users'   && <AdminUsers />}
          {tab === 'borrows' && <AdminBorrows />}
        </div>
      </div>
    </div>
  );
};
