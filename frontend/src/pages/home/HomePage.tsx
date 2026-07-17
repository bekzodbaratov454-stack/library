import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, BookMarked, Users, Star } from 'lucide-react';
import { booksApi } from '../../api/books.api';
import { BookCard } from '../../components/books/BookCard';
import { Spinner } from '../../components/ui/Spinner';
import type { Book } from '../../types';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booksApi.getAll()
      .then(({ data }) => {
        const arr = Array.isArray(data) ? data : [];
        setBooks(arr.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAvailable = books.filter(b => b.availableCopies > 0).length;

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__bg" />
        <div className="home-hero__inner">
          <div className="home-hero__content slide-up">
            <div className="home-hero__tag">
              <Star size={12} fill="currentColor" />
              Smart Library — Raqamli kutubxona
            </div>
            <h1 className="home-hero__title">
              Kitoblar olamiga<br />
              <span className="home-hero__title-accent">xush kelibsiz</span>
            </h1>
            <p className="home-hero__desc">
              Yuzlab kitoblar siz uchun. Istalgan kitobni toping,
              online band qiling va kutubxonadan oling.
            </p>
            <div className="home-hero__actions">
              <Link to="/books" className="home-hero__btn-primary">
                Katalogni ko'rish
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="home-hero__btn-secondary">
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>

          <div className="home-hero__stats">
            <div className="home-hero__stat">
              <BookOpen size={22} />
              <span className="home-hero__stat-val">{books.length}+</span>
              <span>Kitob</span>
            </div>
            <div className="home-hero__stat-divider" />
            <div className="home-hero__stat">
              <BookMarked size={22} />
              <span className="home-hero__stat-val">{totalAvailable}</span>
              <span>Mavjud</span>
            </div>
            <div className="home-hero__stat-divider" />
            <div className="home-hero__stat">
              <Users size={22} />
              <span className="home-hero__stat-val">∞</span>
              <span>O'quvchi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured books */}
      <section className="home-featured">
        <div className="home-featured__inner">
          <div className="home-featured__header">
            <div>
              <p className="home-featured__label">Katalog</p>
              <h2 className="home-featured__title">So'nggi kitoblar</h2>
            </div>
            <Link to="/books" className="home-featured__all">
              Barchasini ko'rish <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Spinner center />
          ) : (
            <div className="home-books-grid">
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <h2 className="home-cta__title">Bugundan boshlang</h2>
          <p className="home-cta__desc">
            Ro'yxatdan o'ting va yuzlab kitoblarga ega bo'ling
          </p>
          <Link to="/register" className="home-hero__btn-primary">
            Bepul ro'yxatdan o'tish <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};
