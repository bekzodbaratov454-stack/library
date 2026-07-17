import { client } from './client';
import type { Borrow, CreateBorrowDto, Paginated, Stats } from '../types';

export const borrowApi = {
  borrowBook: (dto: CreateBorrowDto) =>
    client.post<Borrow>('/borrow', dto),

  returnBook: (borrowId: string) =>
    client.patch<Borrow>(`/borrow/${borrowId}/return`),

  myBorrows: () =>
    client.get<Borrow[]>('/borrow/my'),

  // Admin only
  findAll: (page = 1, limit = 10) =>
    client.get<Paginated<Borrow>>('/borrow', { params: { page, limit } }),

  getStats: () =>
    client.get<Stats>('/borrow/stats'),

  findOverdue: () =>
    client.get<Borrow[]>('/borrow/overdue'),
};
