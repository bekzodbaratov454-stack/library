import React, { useEffect, useState } from 'react';
import { BookMarked, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { borrowApi } from '../../../api/borrow.api';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import type { Borrow, Book, User } from '../../../types';

const LIMIT = 10;

export const AdminBorrows: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);

  const totalPages = Math.ceil(total / LIMIT);

  const load = (p: number) => {
    setLoading(true);
    borrowApi.findAll(p, LIMIT)
      .then(({ data }) => {
        setBorrows(data.data);
        setTotal(data.total);
        setActive(data.data.filter(b => !b.returnedAt).length);
      })
      .catch(() => toast.error('Yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });

  const isOverdue = (b: Borrow) =>
    !b.returnedAt && new Date(b.dueDate) < new Date();

  if (loading) return <Spinner center />;

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Ijaralar ({total})</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="admin-stat-pill admin-stat-pill--gold">Faol: {active}</div>
          <div className="admin-stat-pill admin-stat-pill--green">Jami: {total}</div>
        </div>
      </div>

      {borrows.length === 0 ? (
        <div className="admin-empty"><BookMarked size={40} /><p>Ijaralar yo'q</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Kitob</th>
                  <th>Olingan</th>
                  <th>Muddat</th>
                  <th>Qaytarilgan</th>
                  <th>Holat</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map(b => {
                  const user = b.userId as User | null;
                  const book = b.bookId as Book | null;
                  const overdue = isOverdue(b);
                  return (
                    <tr key={b._id}>
                      <td>
                        <div className="admin-user-row">
                          <div className="admin-user-avatar admin-user-avatar--sm">
                            {user && typeof user === 'object' ? user.fullName?.charAt(0) ?? '?' : '?'}
                          </div>
                          <div>
                            <div>{user && typeof user === 'object' ? user.fullName : '—'}</div>
                            <div className="mono" style={{ fontSize: 11 }}>
                              {user && typeof user === 'object' ? user.email : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-book-title">
                          {book && typeof book === 'object' ? book.title : '—'}
                        </div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {book && typeof book === 'object' ? book.author : ''}
                        </div>
                      </td>
                      <td className="mono">{fmt(b.borrowedAt)}</td>
                      <td>
                        <span className={`mono ${overdue ? 'text-overdue' : ''}`}
                              style={{ color: overdue ? 'var(--crimson)' : undefined, fontWeight: overdue ? 600 : undefined }}>
                          {b.dueDate ? fmt(b.dueDate) : '—'}
                          {overdue && <AlertTriangle size={12} style={{ marginLeft: 4, display: 'inline' }} />}
                        </span>
                      </td>
                      <td className="mono">{b.returnedAt ? fmt(b.returnedAt) : '—'}</td>
                      <td>
                        {overdue ? (
                          <Badge variant="red" size="sm">Kechikkan</Badge>
                        ) : (
                          <Badge variant={b.returnedAt ? 'green' : 'gold'} size="sm">
                            {b.returnedAt ? 'Qaytarilgan' : 'Jarayonda'}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-pagination__btn" disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              <span className="admin-pagination__info">{page} / {totalPages}</span>
              <button className="admin-pagination__btn" disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
