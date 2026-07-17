import React, { useEffect, useState } from 'react';
import { BookOpen, Users, BookMarked, AlertTriangle, CheckCircle, Library } from 'lucide-react';
import toast from 'react-hot-toast';
import { borrowApi } from '../../../api/borrow.api';
import { Spinner } from '../../../components/ui/Spinner';
import type { Stats } from '../../../types';
import './AdminStats.css';

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    borrowApi.getStats()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Statistikani yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner center />;
  if (!stats) return null;

  const cards = [
    {
      label: 'Jami kitoblar',
      value: stats.totalBooks,
      icon: <BookOpen size={24} />,
      color: 'gold',
    },
    {
      label: 'Mavjud nusxalar',
      value: stats.availableCopies,
      icon: <Library size={24} />,
      color: 'green',
    },
    {
      label: 'Foydalanuvchilar',
      value: stats.totalUsers,
      icon: <Users size={24} />,
      color: 'ink',
    },
    {
      label: 'Jami ijaralar',
      value: stats.totalBorrows,
      icon: <BookMarked size={24} />,
      color: 'muted',
    },
    {
      label: 'Faol ijaralar',
      value: stats.activeBorrows,
      icon: <CheckCircle size={24} />,
      color: 'gold',
    },
    {
      label: 'Kechikkan ijaralar',
      value: stats.overdueBorrows,
      icon: <AlertTriangle size={24} />,
      color: stats.overdueBorrows > 0 ? 'red' : 'green',
    },
  ];

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Statistika</h2>
      </div>

      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className={`stats-card stats-card--${card.color}`}>
            <div className="stats-card__icon">{card.icon}</div>
            <div className="stats-card__body">
              <span className="stats-card__value">{card.value}</span>
              <span className="stats-card__label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="stats-section">
        <h3 className="stats-section__title">Ko'rsatkichlar</h3>

        <div className="stats-bars">
          <div className="stats-bar-item">
            <div className="stats-bar-item__head">
              <span>Faol ijaralar</span>
              <span className="mono">{stats.activeBorrows} / {stats.totalBorrows}</span>
            </div>
            <div className="stats-bar">
              <div className="stats-bar__fill stats-bar__fill--gold"
                style={{ width: stats.totalBorrows ? `${(stats.activeBorrows / stats.totalBorrows) * 100}%` : '0%' }} />
            </div>
          </div>

          <div className="stats-bar-item">
            <div className="stats-bar-item__head">
              <span>Kechikkan ijaralar</span>
              <span className="mono">{stats.overdueBorrows} / {stats.activeBorrows}</span>
            </div>
            <div className="stats-bar">
              <div className="stats-bar__fill stats-bar__fill--red"
                style={{ width: stats.activeBorrows ? `${(stats.overdueBorrows / stats.activeBorrows) * 100}%` : '0%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
