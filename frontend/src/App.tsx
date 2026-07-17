import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuthStore } from './store/auth.store';
import { Spinner } from './components/ui/Spinner';

// Layout
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { HomePage }       from './pages/home/HomePage';
import { LoginPage }      from './pages/auth/LoginPage';
import { RegisterPage }   from './pages/auth/RegisterPage';
import { BooksPage }      from './pages/books/BooksPage';
import { BookDetailPage } from './pages/books/BookDetailPage';
import { MyBorrowsPage }  from './pages/borrows/MyBorrowsPage';
import { ProfilePage }    from './pages/profile/ProfilePage';
import { AdminPage }      from './pages/admin/AdminPage';

function App() {
  const { fetchMe, isInitialized } = useAuthStore();

  useEffect(() => {
    // Token bo'lsa user ma'lumotini olish, yo'q bo'lsa ham initialized qilamiz
    fetchMe();
  }, []);

  // Birinchi marta fetchMe tugaguncha — global spinner
  if (!isInitialized) {
    return <Spinner center size="lg" />;
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#FAF6EE',
            color: '#1B1410',
            border: '1px solid #ddd5be',
            borderRadius: '10px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 16px rgba(27,20,16,0.12)',
          },
          success: { iconTheme: { primary: '#3F5D4E', secondary: '#FAF6EE' } },
          error:   { iconTheme: { primary: '#7A2E2E', secondary: '#FAF6EE' } },
        }}
      />

      <Routes>
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/books"     element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />

          {/* Protected — any auth user */}
          <Route path="/my-borrows" element={
            <ProtectedRoute><MyBorrowsPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
