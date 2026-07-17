import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, BookOpen, Copy } from 'lucide-react';
import type { Book } from '../../types';
import { getImageUrl } from '../../api/client';
import { Badge } from '../ui/Badge';
import './BookCard.css';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  borrowing?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onBorrow, borrowing }) => {
  const cover = getImageUrl(book.coverImage);
  const available = book.availableCopies > 0;

  return (
    <article className="book-card">
      {/* Stamp */}
      <div className={`book-card__stamp ${available ? 'book-card__stamp--available' : 'book-card__stamp--taken'}`}>
        {available ? 'Mavjud' : 'Band'}
      </div>

      {/* Cover */}
      <Link to={`/books/${book._id}`} className="book-card__cover-wrap">
        {cover ? (
          <img src={cover} alt={book.title} className="book-card__cover" />
        ) : (
          <div className="book-card__cover-placeholder">
            <BookOpen size={36} />
            <span>{book.genre || 'Kitob'}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="book-card__body">
        {book.genre && (
          <Badge variant="gold" size="sm">{book.genre}</Badge>
        )}

        <Link to={`/books/${book._id}`} className="book-card__title">
          {book.title}
        </Link>

        <div className="book-card__meta">
          <span className="book-card__meta-item">
            <User size={13} />
            {book.author}
          </span>
          <span className="book-card__meta-item">
            <Calendar size={13} />
            {book.publishedYear}
          </span>
        </div>

        <div className="book-card__footer">
          <div className="book-card__copies">
            <Copy size={13} />
            <span className={available ? 'book-card__copies--ok' : 'book-card__copies--zero'}>
              {book.availableCopies} nusxa
            </span>
          </div>

          {onBorrow && (
            <button
              className={`book-card__borrow-btn ${!available ? 'book-card__borrow-btn--disabled' : ''}`}
              onClick={() => available && onBorrow(book._id)}
              disabled={!available || borrowing}
            >
              {borrowing ? (
                <span className="book-card__btn-spinner" />
              ) : available ? 'Olish' : 'Band'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
