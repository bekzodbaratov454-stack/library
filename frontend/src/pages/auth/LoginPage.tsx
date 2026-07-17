import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, BookCopy } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './AuthPages.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, fetchMe } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email kiritilishi shart';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email noto\'g\'ri';
    if (!form.password) e.password = 'Parol kiritilishi shart';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setToken(data.accessToken);
      await fetchMe();
      toast.success('Xush kelibsiz!');
      navigate('/books');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Kirish xato';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />

      <div className="auth-card slide-up">
        <div className="auth-card__header">
          <div className="auth-card__icon">
            <BookCopy size={28} />
          </div>
          <h1 className="auth-card__title">Xush kelibsiz</h1>
          <p className="auth-card__sub">Smart Library tizimiga kiring</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            leftIcon={<Mail size={16} />}
            autoComplete="email"
          />
          <Input
            label="Parol"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            leftIcon={<Lock size={16} />}
            autoComplete="current-password"
          />

          <Button type="submit" loading={loading} fullWidth size="lg">
            Kirish
          </Button>
        </form>

        <div className="auth-card__footer">
          <p>
            Akkaunt yo'qmi?{' '}
            <Link to="/register" className="auth-link">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
