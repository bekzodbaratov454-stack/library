import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookCopy } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './AuthPages.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName || form.fullName.length < 3) e.fullName = 'Ism kamida 3 harf bo\'lishi kerak';
    if (!form.email) e.email = 'Email kiritilishi shart';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email noto\'g\'ri';
    if (!form.password || form.password.length < 6) e.password = 'Parol kamida 6 ta belgi bo\'lishi kerak';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authApi.register(form);
      setLoading(false);
      toast.success('Ro\'yxatdan o\'tdingiz! Endi kiring.', { duration: 4000 });
      navigate('/login', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Xato yuz berdi';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
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
          <h1 className="auth-card__title">Ro'yxatdan o'tish</h1>
          <p className="auth-card__sub">Smart Library ga qo'shiling</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="To'liq ism"
            type="text"
            placeholder="Ism Familiya"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            leftIcon={<User size={16} />}
            autoComplete="name"
          />
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
            hint="Kamida 6 ta belgi"
            autoComplete="new-password"
          />

          <Button type="submit" loading={loading} fullWidth size="lg">
            Ro'yxatdan o'tish
          </Button>
        </form>

        <div className="auth-card__footer">
          <p>
            Akkaunt bormi?{' '}
            <Link to="/login" className="auth-link">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
