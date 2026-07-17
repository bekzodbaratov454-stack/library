// ── User ────────────────────────────────────────────
export type UserRole = 'admin' | 'user';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Auth ─────────────────────────────────────────────
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

// ── Book ─────────────────────────────────────────────
export interface Book {
  _id: string;
  title: string;
  author: string;
  publishedYear: number;
  description?: string;
  genre?: string;
  pages?: number;
  language?: string;
  availableCopies: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  publishedYear: number;
  description?: string;
  genre?: string;
  pages?: number;
  language?: string;
  availableCopies: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  publishedYear?: number;
  description?: string;
  genre?: string;
  pages?: number;
  language?: string;
  availableCopies?: number;
}

// ── Borrow ───────────────────────────────────────────
export interface Borrow {
  _id: string;
  userId: string | User;
  bookId: string | Book;
  borrowedAt: string;
  returnedAt: string | null;
  dueDate: string;
  isOverdue: boolean;
  createdAt: string;
}

export interface CreateBorrowDto {
  bookId: string;
}

// ── Pagination ───────────────────────────────────────
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Stats ────────────────────────────────────────────
export interface Stats {
  totalBooks: number;
  totalUsers: number;
  totalBorrows: number;
  activeBorrows: number;
  overdueBorrows: number;
  availableCopies: number;
}
