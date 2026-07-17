import React, { useState } from 'react';
import { User, Mail, Shield, Lock, Save, Send, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../../api/users.api';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const { user, fetchMe } = useAuthStore();
  const [form, setForm] = useState({ fullName: user?.fullName || '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT || 'SmartLibraryBot';

  const copyUserId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user._id);
    setCopied(true);
    toast.success('ID nusxalandi!');
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName || form.fullName.length < 3) e.fullName = 'Ism kamida 3 harf';
    if (form.password && form.password.length < 6) e.password = 'Parol kamida 6 belgi';
    if (form.password && form.password !== form.confirmPassword) e.confirmPassword = 'Parollar mos emas';
    return e;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const dto: { fullName?: string; password?: string } = {};
      if (form.fullName !== user?.fullName) dto.fullName = form.fullName;
      if (form.password) dto.password = form.password;

      if (!Object.keys(dto).length) {
        toast('Hech narsa o\'zgarmadi');
        setLoading(false);
        return;
      }

      await usersApi.updateMe(dto);
      await fetchMe();
      toast.success('Profil yangilandi!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-page__inner">
        <h1 className="profile-page__title">Profil</h1>

        <div className="profile-layout">
          {/* Card — user info */}
          <div className="profile-card">
            <div className="profile-card__avatar">
              {(user.fullName ?? '?').charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-card__name">{user.fullName ?? '—'}</h2>
            <p className="profile-card__email">{user.email ?? '—'}</p>
            <div className="profile-card__badges">
              <Badge variant={user.role === 'admin' ? 'ink' : 'gold'}>
                {user.role === 'admin' ? '👑 Admin' : '📚 Foydalanuvchi'}
              </Badge>
              <Badge variant={user.isActive ? 'green' : 'red'}>
                {user.isActive ? 'Faol' : 'Faolsiz'}
              </Badge>
            </div>

            <div className="profile-info-list">
              <div className="profile-info-item">
                <User size={15} />
                <span>{user.fullName}</span>
              </div>
              <div className="profile-info-item">
                <Mail size={15} />
                <span>{user.email}</span>
              </div>
              <div className="profile-info-item">
                <Shield size={15} />
                <span>{user.role}</span>
              </div>
            </div>

            {/* Telegram Bot */}
            <div className="profile-telegram">
              <div className="profile-telegram__header">
                <span className="profile-telegram__icon">✈️</span>
                <span className="profile-telegram__title">Telegram Bot</span>
              </div>
              <p className="profile-telegram__desc">
                Botda kitoblaringizni ko'rish uchun ID ingizni nusxalab yuboring
              </p>
              <div className="profile-telegram__id">
                <code>{user._id}</code>
                <button className="profile-telegram__copy" onClick={copyUserId}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <div className="profile-telegram__commands">
                <code>/mybooks {user._id}</code>
              </div>
              <a
                href={`https://t.me/${BOT_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-telegram__btn"
              >
                <Send size={15} />
                Botni ochish
              </a>
            </div>
          </div>

          {/* Edit form */}
          <div className="profile-form-wrap">
            <h3 className="profile-form-title">Ma'lumotlarni o'zgartirish</h3>
            <form className="profile-form" onSubmit={handleSave} noValidate>
              <Input
                label="To'liq ism"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                error={errors.fullName}
                leftIcon={<User size={16} />}
              />
              <div className="profile-form__divider">
                <Lock size={14} />
                <span>Parolni o'zgartirish (ixtiyoriy)</span>
              </div>
              <Input
                label="Yangi parol"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                leftIcon={<Lock size={16} />}
                hint="Bo'sh qoldirsa parol o'zgarmaydi"
              />
              <Input
                label="Parolni tasdiqlang"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                leftIcon={<Lock size={16} />}
              />
              <Button type="submit" loading={loading} icon={<Save size={16} />}>
                Saqlash
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
