import { client } from './client';
import type { RegisterDto, LoginDto, AuthResponse } from '../types';

export const authApi = {
  register: (dto: RegisterDto) =>
    client.post<{ message: string }>('/auth/register', dto),

  login: (dto: LoginDto) =>
    client.post<AuthResponse>('/auth/login', dto),
};
