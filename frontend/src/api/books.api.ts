import { client } from './client';
import type { Book, CreateBookDto, UpdateBookDto } from '../types';

export const booksApi = {
  getAll: () =>
    client.get<Book[]>('/books'),

  getById: (id: string) =>
    client.get<Book>(`/books/${id}`),

  create: (dto: CreateBookDto) =>
    client.post<Book>('/books', dto),

  update: (id: string, dto: UpdateBookDto) =>
    client.patch<Book>(`/books/${id}`, dto),

  remove: (id: string) =>
    client.delete(`/books/${id}`),

  uploadCover: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post<Book>(`/books/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
