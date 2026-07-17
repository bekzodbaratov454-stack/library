 import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, BookOpen, Globe, FileText, Copy, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { booksApi } from '../../api/books.api';
import { borrowApi } from '../../api/borrow.api';
import { useAuthStore } from '../../store/auth.store';
import { getImageUrl } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import type { Book } from '../../types';
import './BookDetailPage.css';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    if (!id) return;
    booksApi.getById(id)
      .then(({ data }) => setBook(data))
      .catch(() => { toast.error('Kitob topilmadi'); navigate('/books'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async () => {
    if (!token) { toast.error('Kitob olish uchun avval kiring'); return; }
    if (!book) return;
    setBorrowing(true);
    try {
      await borrowApi.borrowBook({ bookId: book._id });
      toast.success('Kitob muvaffaqiyatli olindi!');
      setBook(prev => prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : prev);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato yuz berdi');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <Spinner center size="lg" />;
  if (!book) return null;

  const cover = getImageUrl(book.coverImage);
  const available = book.availableCopies > 0;

  return (
    <div className="book-detail">
      <div className="book-detail__inner">
        <button className="book-detail__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Orqaga
        </button>

        <div className="book-detail__layout">
          {/* Cover */}
          <div className="book-detail__cover-col">
            <div className="book-detail__cover-wrap">
              {cover ? (
                <img src={cover} alt={book.title} className="book-detail__cover" />
              ) : (
                <div className="book-detail__cover-placeholder">
                  <BookOpen size={60} />
                  <span>{book.genre || 'Kitob'}</span>
                </div>
              )}
            </div>

            <div className={`book-detail__status ${available ? 'book-detail__status--ok' : 'book-detail__status--no'}`}>
              <Copy size={15} />
              <span>{book.availableCopies} nusxa mavjud</span>
            </div>

            <Button
              onClick={handleBorrow}
              disabled={!available}
              loading={borrowing}
              fullWidth
              size="lg"
              variant={available ? 'primary' : 'outline'}
            >
              {available ? 'Kitobni olish' : 'Mavjud emas'}
            </Button>
          </div>

          {/* Info */}
          <div className="book-detail__info">
            <div className="book-detail__badges">
              {book.genre && <Badge variant="gold">{book.genre}</Badge>}
              {book.language && <Badge variant="muted">{book.language}</Badge>}
            </div>

            <h1 className="book-detail__title">{book.title}</h1>

            <div className="book-detail__attrs">
              <div className="book-detail__attr">
                <User size={15} />
                <span className="book-detail__attr-label">Muallif</span>
                <span className="book-detail__attr-val">{book.author}</span>
              </div>
              <div className="book-detail__attr">
                <Calendar size={15} />
                <span className="book-detail__attr-label">Nashr yili</span>
                <span className="book-detail__attr-val">{book.publishedYear}</span>
              </div>
              {book.pages && (
                <div className="book-detail__attr">
                  <FileText size={15} />
                  <span className="book-detail__attr-label">Sahifalar</span>
                  <span className="book-detail__attr-val">{book.pages} sahifa</span>
                </div>
              )}
              {book.language && (
                <div className="book-detail__attr">
                  <Globe size={15} />
                  <span className="book-detail__attr-label">Til</span>
                  <span className="book-detail__attr-val">{book.language}</span>
                </div>
              )}
              {book.genre && (
                <div className="book-detail__attr">
                  <Tag size={15} />
                  <span className="book-detail__attr-label">Janr</span>
                  <span className="book-detail__attr-val">{book.genre}</span>
                </div>
              )}
            </div>

            {book.description && (
              <div className="book-detail__desc">
                <h3>Tavsif</h3>
                <p>{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
