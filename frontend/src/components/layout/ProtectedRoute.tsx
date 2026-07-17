import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { token, user } = useAuthStore();

  // Token yo'q — login ga yuboramiz
  if (!token) return <Navigate to="/login" replace />;

  // Role tekshiruvi — user loaded bo'lgandan keyin
  if (role && user && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};
