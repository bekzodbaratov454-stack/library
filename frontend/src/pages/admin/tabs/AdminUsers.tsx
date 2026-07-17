import React, { useEffect, useState } from 'react';
import { Ban, Trash2, Users, ShieldCheck, ChevronLeft, ChevronRight, Crown, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../../api/users.api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import type { User } from '../../../types';
import { useAuthStore } from '../../../store/auth.store';

const LIMIT = 10;

export const AdminUsers: React.FC = () => {
  const { user: me } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [blockingId, setBlockingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [roleChangingId, setRoleChangingId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / LIMIT);

  const load = (p: number) => {
    setLoading(true);
    usersApi.findAll(p, LIMIT)
      .then(({ data }) => {
        setUsers(data.data);
        setTotal(data.total);
      })
      .catch(() => toast.error('Yuklab bo\'lmadi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleBlock = async (id: string) => {
    setBlockingId(id);
    try {
      const { data } = await usersApi.block(id);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success('Foydalanuvchi bloklandi');
    } catch {
      toast.error('Bloklashda xato');
    } finally {
      setBlockingId(null);
    }
  };

  const handleUnblock = async (id: string) => {
    setBlockingId(id);
    try {
      const { data } = await usersApi.unblock(id);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success('Foydalanuvchi blokdan chiqarildi');
    } catch {
      toast.error('Xato yuz berdi');
    } finally {
      setBlockingId(null);
    }
  };

  const handleRoleChange = async (id: string, role: 'admin' | 'user') => {
    setRoleChangingId(id);
    try {
      const { data } = await usersApi.updateRole(id, role);
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success(role === 'admin' ? 'Admin qilindi' : 'Oddiy foydalanuvchi qilindi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rolni o\'zgartirishda xato');
    } finally {
      setRoleChangingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Foydalanuvchini o\'chirish?')) return;
    setDeletingId(id);
    try {
      await usersApi.remove(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      setTotal(t => t - 1);
      toast.success('O\'chirildi');
    } catch {
      toast.error('O\'chirishda xato');
    } finally {
      setDeletingId(null);
    }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('uz-UZ');

  if (loading) return <Spinner center />;

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Foydalanuvchilar ({total})</h2>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty"><Users size={40} /><p>Foydalanuvchilar yo'q</p></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Status</th>
                  <th>Ro'yxatdan</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-user-row">
                        <div className="admin-user-avatar">
                          {(u.fullName ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <span>{u.fullName ?? '—'}</span>
                      </div>
                    </td>
                    <td className="mono">{u.email}</td>
                    <td>
                      <Badge variant={u.role === 'admin' ? 'ink' : 'muted'} size="sm">
                        {u.role === 'admin' ? '👑 Admin' : 'User'}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={u.isActive ? 'green' : 'red'} size="sm">
                        {u.isActive ? 'Faol' : 'Bloklangan'}
                      </Badge>
                    </td>
                    <td className="mono">{u.createdAt ? fmt(u.createdAt) : '—'}</td>
                    <td>
                      {me?._id !== u._id && (
                        <div className="admin-actions">
                          {u.role === 'admin' ? (
                            <Button
                              size="sm" variant="outline"
                              icon={<UserMinus size={14} />}
                              loading={roleChangingId === u._id}
                              onClick={() => handleRoleChange(u._id, 'user')}
                            >
                              Admindan olish
                            </Button>
                          ) : (
                            <Button
                              size="sm" variant="secondary"
                              icon={<Crown size={14} />}
                              loading={roleChangingId === u._id}
                              onClick={() => handleRoleChange(u._id, 'admin')}
                            >
                              Admin qilish
                            </Button>
                          )}

                          {u.role !== 'admin' && (
                            <>
                              {u.isActive ? (
                                <Button
                                  size="sm" variant="outline"
                                  icon={<Ban size={14} />}
                                  loading={blockingId === u._id}
                                  onClick={() => handleBlock(u._id)}
                                >
                                  Bloklash
                                </Button>
                              ) : (
                                <Button
                                  size="sm" variant="secondary"
                                  icon={<ShieldCheck size={14} />}
                                  loading={blockingId === u._id}
                                  onClick={() => handleUnblock(u._id)}
                                >
                                  Blokdan chiqarish
                                </Button>
                              )}
                              <Button
                                size="sm" variant="danger"
                                icon={<Trash2 size={14} />}
                                loading={deletingId === u._id}
                                onClick={() => handleDelete(u._id)}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <Button size="sm" variant="outline" icon={<ChevronLeft size={15} />}
                disabled={page === 1} onClick={() => setPage(p => p - 1)} />
              <span className="admin-pagination__info">
                {page} / {totalPages}
              </span>
              <Button size="sm" variant="outline" icon={<ChevronRight size={15} />}
                disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
