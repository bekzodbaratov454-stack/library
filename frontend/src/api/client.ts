import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 – clear token and redirect to login (only for protected resource endpoints)
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url || '';
    const status: number = error.response?.status;

    // /auth/ va /users/me so'rovlarda redirect qilmaymiz
    // — ularning xatosini o'sha joy o'zi handle qiladi
    const skipRedirect =
      url.includes('/auth/') ||
      url.includes('/users/me');

    if (status === 401 && !skipRedirect) {
      localStorage.removeItem('access_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};
