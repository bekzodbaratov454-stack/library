import { client } from './client';
import type { User, Paginated } from '../types';

export const usersApi = {
  getMe: () =>
    client.get<User>('/users/me'),

  updateMe: (dto: { fullName?: string; password?: string }) =>
    client.patch<User>('/users/me', dto),

  findAll: (page = 1, limit = 20) =>
    client.get<Paginated<User>>('/users', { params: { page, limit } }),

  updateRole: (id: string, role: 'admin' | 'user') =>
    client.patch<User>(`/users/${id}/role`, { role }),

  block: (id: string) =>
    client.patch<User>(`/users/${id}/block`),

  unblock: (id: string) =>
    client.patch<User>(`/users/${id}/unblock`),

  remove: (id: string) =>
    client.delete(`/users/${id}`),
};
