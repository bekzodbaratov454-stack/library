import React, { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { booksApi } from '../../api/books.api';
import { borrowApi } from '../../api/borrow.api';
import { useAuthStore } from '../../store/auth.store';
import { BookCard } from '../../components/books/BookCard';
import { Spinner } from '../../components/ui/Spinner';
import type { Book } from '../../types';
import './BooksPage.css';

export const BooksPage: React.FC = () => {
  const { token } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterAvail, setFilterAvail] = useState(false);

  useEffect(() => {
    booksApi.getAll()
      .then(({ data }) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Kitoblarni yuklashda xato'))
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(() => {
    const set = new Set(books.map(b => b.genre).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchGenre  = !filterGenre || b.genre === filterGenre;
      const matchAvail  = !filterAvail || b.availableCopies > 0;
      return matchSearch && matchGenre && matchAvail;
    });
  }, [books, search, filterGenre, filterAvail]);

  const handleBorrow = async (bookId: string) => {
    if (!token) { toast.error('Kitob olish uchun kiring'); return; }
    setBorrowingId(bookId);
    try {
      await borrowApi.borrowBook({ bookId });
      toast.success('Kitob muvaffaqiyatli olindi!');
      setBooks(prev => prev.map(b =>
        b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
      ));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kitob olishda xato');
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="books-page">
      {/* Hero */}
      <div className="books-hero">
        <div className="books-hero__inner">
          <p className="books-hero__label">Smart Library</p>
          <h1 className="books-hero__title">Kitoblar Katalogi</h1>
          <p className="books-hero__sub">
            {books.length} ta kitob mavjud — qiziqadiganini toping va oling
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="books-filters">
        <div className="books-filters__inner">
          <div className="books-search">
            <Search size={16} className="books-search__icon" />
            <input
              className="books-search__input"
              placeholder="Kitob nomi yoki muallif..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="books-filter-row">
            <SlidersHorizontal size={15} className="books-filter-icon" />
            <select
              className="books-select"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Barcha janrlar</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <label className="books-check">
              <input
                type="checkbox"
                checked={filterAvail}
                onChange={(e) => setFilterAvail(e.target.checked)}
              />
              <span>Faqat mavjudlar</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="books-content">
        <div className="books-content__inner">
          {loading ? (
            <Spinner center size="lg" />
          ) : filtered.length === 0 ? (
            <div className="books-empty">
              <BookOpen size={48} />
              <h3>Kitob topilmadi</h3>
              <p>Qidiruv shartlarini o'zgartiring</p>
            </div>
          ) : (
            <>
              <p className="books-count">{filtered.length} ta kitob topildi</p>
              <div className="books-grid">
                {filtered.map(book => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onBorrow={handleBorrow}
                    borrowing={borrowingId === book._id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
