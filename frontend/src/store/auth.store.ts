import { create } from 'zustand';
import type { User } from '../types';
import { usersApi } from '../api/users.api';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;   // fetchMe birinchi marta tugadimi
  setToken: (token: string) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('access_token'),
  user: null,
  isLoading: false,
  isInitialized: false,

  setToken: (token) => {
    localStorage.setItem('access_token', token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, user: null, isInitialized: true });
  },

  fetchMe: async () => {
    const { token } = get();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    set({ isLoading: true });
    try {
      const { data } = await usersApi.getMe();
      set({ user: data, isInitialized: true });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        localStorage.removeItem('access_token');
        set({ token: null, user: null });
      }
      set({ isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
