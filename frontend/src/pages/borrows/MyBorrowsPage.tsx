import React, { useEffect, useState } from 'react';
import { BookMarked, Clock, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { borrowApi } from '../../api/borrow.api';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { Borrow, Book } from '../../types';
import './MyBorrowsPage.css';

export const MyBorrowsPage: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const load = () => {
    borrowApi.myBorrows()
      .then(({ data }) => setBorrows(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleReturn = async (borrowId: string) => {
    setReturningId(borrowId);
    try {
      await borrowApi.returnBook(borrowId);
      toast.success('Kitob qaytarildi!');
      setBorrows(prev => prev.map(b =>
        b._id === borrowId ? { ...b, returnedAt: new Date().toISOString() } : b
      ));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato yuz berdi');
    } finally {
      setReturningId(null);
    }
  };

  const active   = borrows.filter(b => !b.returnedAt);
  const returned = borrows.filter(b => b.returnedAt);

  if (loading) return <Spinner center size="lg" />;

  return (
    <div className="my-borrows">
      <div className="my-borrows__inner">
        {/* Header */}
        <div className="my-borrows__header">
          <div>
            <h1 className="my-borrows__title">Mening Kitoblarim</h1>
            <p className="my-borrows__sub">Olingan va qaytarilgan kitoblar tarixi</p>
          </div>
          <div className="my-borrows__stats">
            <div className="my-borrows__stat">
              <span className="my-borrows__stat-val">{active.length}</span>
              <span className="my-borrows__stat-label">Jarayonda</span>
            </div>
            <div className="my-borrows__stat">
              <span className="my-borrows__stat-val">{returned.length}</span>
              <span className="my-borrows__stat-label">Qaytarilgan</span>
            </div>
          </div>
        </div>

        {borrows.length === 0 ? (
          <div className="my-borrows__empty">
            <BookMarked size={56} />
            <h3>Hali kitob olmadingiz</h3>
            <p>Katalogdan kitob tanlang va oling</p>
          </div>
        ) : (
          <>
            {/* Active */}
            {active.length > 0 && (
              <section className="my-borrows__section">
                <h2 className="my-borrows__section-title">
                  <Clock size={18} />
                  Jarayondagi kitoblar ({active.length})
                </h2>
                <div className="borrows-list">
                  {active.map(b => (
                    <BorrowRow
                      key={b._id}
                      borrow={b}
                      onReturn={handleReturn}
                      returning={returningId === b._id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Returned */}
            {returned.length > 0 && (
              <section className="my-borrows__section">
                <h2 className="my-borrows__section-title my-borrows__section-title--muted">
                  <CheckCircle size={18} />
                  Qaytarilgan kitoblar ({returned.length})
                </h2>
                <div className="borrows-list">
                  {returned.map(b => (
                    <BorrowRow key={b._id} borrow={b} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface BorrowRowProps {
  borrow: Borrow;
  onReturn?: (id: string) => void;
  returning?: boolean;
}

const BorrowRow: React.FC<BorrowRowProps> = ({ borrow, onReturn, returning }) => {
  const book = borrow.bookId as Book | null;
  const isReturned = !!borrow.returnedAt;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={`borrow-row ${isReturned ? 'borrow-row--returned' : 'borrow-row--active'}`}>
      <div className="borrow-row__icon">
        {isReturned ? <CheckCircle size={20} /> : <BookMarked size={20} />}
      </div>

      <div className="borrow-row__info">
        <p className="borrow-row__title">
          {book && typeof book === 'object' ? book.title : 'Kitob'}
        </p>
        <p className="borrow-row__author">
          {book && typeof book === 'object' ? book.author : ''}
        </p>
        <div className="borrow-row__dates">
          <span>Olingan: {fmt(borrow.borrowedAt)}</span>
          {!isReturned && borrow.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {(borrow.isOverdue || new Date(borrow.dueDate) < new Date()) && (
                <AlertTriangle size={13} color="#dc2626" />
              )}
              Muddat: {fmt(borrow.dueDate)}
            </span>
          )}
          {isReturned && borrow.returnedAt && (
            <span>Qaytarilgan: {fmt(borrow.returnedAt)}</span>
          )}
        </div>
      </div>

      <div className="borrow-row__right">
        {isReturned ? (
          <Badge variant="green">Qaytarilgan</Badge>
        ) : (borrow.isOverdue || (borrow.dueDate && new Date(borrow.dueDate) < new Date())) ? (
          <Badge variant="red">Muddati o'tgan</Badge>
        ) : (
          <Badge variant="gold">Jarayonda</Badge>
        )}

        {!isReturned && onReturn && (
          <Button
            size="sm"
            variant="outline"
            loading={returning}
            onClick={() => onReturn(borrow._id)}
            icon={<RotateCcw size={14} />}
          >
            Qaytarish
          </Button>
        )}
      </div>
    </div>
  );
};
