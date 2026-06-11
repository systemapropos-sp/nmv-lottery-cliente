import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

export default function App() {
  const { isAuthenticated, isLoading, login } = useAuth();

  const handleLogin = useCallback(
    (username: string, password: string): boolean => {
      const result = login(username, password);
      return result !== null;
    },
    [login]
  );

  return (
    <HashRouter>
      <div className="h-[100dvh] overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  isAuthenticated={isAuthenticated}
                  onLogin={handleLogin}
                />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </AnimatePresence>
      </div>
    </HashRouter>
  );
}
